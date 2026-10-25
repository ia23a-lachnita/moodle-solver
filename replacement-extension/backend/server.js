/**
 * Moodle Quiz Solver - Backend API Server
 * 
 * Implements the v2 API contract expected by the extension.
 * Proxies question-answering to OpenRouter using free models.
 *
 * API Key Source: reads OPENROUTER_API_KEY from:
 *   1. Environment variable (preferred)
 *   2. Windows registry HKCU\Environment (fallback)
 *
 * Usage:
 *   node backend/server.js            # defaults to port 3000
 *   PORT=8080 node backend/server.js
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

// --- Configuration ---

// Read OpenRouter API key from env, .env file, or Windows registry
function getOpenRouterKey() {
  if (process.env.OPENROUTER_API_KEY) return process.env.OPENROUTER_API_KEY;
  
  // Fallback 1: read from .env file in backend directory
  try {
    const fs = require('fs');
    const envPath = __dirname + '/.env';
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/^OPENROUTER_API_KEY=(.+)$/m);
      if (match) return match[1].trim();
    }
  } catch (e) {
    // .env not found or not readable
  }
  
  // Fallback 2: read from Windows registry via reg command
  try {
    const { execSync } = require('child_process');
    const output = execSync('reg query HKCU\\Environment /v OPENROUTER_API_KEY', {
      encoding: 'utf16le',
      windowsHide: true
    }).toString();
    const match = output.match(/OPENROUTER_API_KEY\s+REG_SZ\s+(\S+)/);
    if (match) return match[1];
  } catch (e) {
    // Not on Windows or key not found
  }
  
  return null;
}

const OPENROUTER_API_KEY = getOpenRouterKey();
const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';
const DEFAULT_MODEL = 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free';
const PORT = process.env.PORT || 3000;
const MAX_REQUEST_BYTES = 100000; // 100KB

// --- Model Catalog ---

const MODELS = [
  {
    id: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
    name: 'NVIDIA Nemotron 3 Nano Omni (free)',
    is_default: true,
    structured_outputs: true,
    input_modalities: ['text', 'image'],
    reasoning_levels: [
      { key: 'low', name: 'Low' },
      { key: 'medium', name: 'Medium' },
      { key: 'high', name: 'High' }
    ]
  },
  {
    id: 'google/gemma-4-31b-it:free',
    name: 'Google Gemma 4 31B (free)',
    is_default: false,
    structured_outputs: true,
    input_modalities: ['text', 'image'],
    reasoning_levels: [
      { key: 'low', name: 'Low' },
      { key: 'medium', name: 'Medium' },
      { key: 'high', name: 'High' }
    ]
  }
];

const QUESTION_TYPES = [
  'multichoice', 'truefalse', 'shortanswer', 'numerical', 'calculated',
  'calculatedsimple', 'calculatedmulti', 'match', 'randomsamatch', 'multianswer',
  'gapselect', 'ddwtos', 'ddimageortext', 'ddmarker', 'ordering', 'essay'
];

// --- Prompt Construction ---

function buildAnswerPrompt(question) {
  const parts = [];
  parts.push('You are an expert quiz solver. Analyze the Moodle question below and provide the correct answer.');
  parts.push('');
  parts.push('--- QUESTION ---');
  parts.push(`Question type: ${question.qtype}`);
  parts.push('');

  // Build question content from content blocks
  for (const block of question.content) {
    if (block.kind === 'text') {
      parts.push(block.text);
    } else if (block.kind === 'math') {
      parts.push(`[Math - ${block.format}]: ${block.source}`);
    } else if (block.kind === 'image') {
      const asset = question.assets && question.assets[block.asset_id];
      if (asset) {
        parts.push(`[Image - ${asset.mime_type}]`);
      }
    } else if (block.kind === 'field') {
      parts.push(`[Field reference: ${block.field_id}]`);
    }
  }

  parts.push('');
  parts.push('--- ANSWER FIELDS ---');
  
  // Describe each field
  for (const [fieldId, field] of Object.entries(question.fields)) {
    parts.push(`${fieldId}: ${field.kind}`);
    if (field.kind === 'single_choice' || field.kind === 'multiple_choice') {
      for (const [optId, opt] of Object.entries(field.options || {})) {
        parts.push(`  ${optId}: ${opt.label}`);
      }
    } else if (field.kind === 'numeric') {
      parts.push(`  Units: ${Object.keys(field.unit_options || {}).join(', ') || 'none'}`);
    } else if (field.kind === 'ordering') {
      parts.push(`  Items: ${Object.keys(field.items || {}).join(', ')}`);
    }
  }

  parts.push('');
  parts.push('--- INSTRUCTIONS ---');
  parts.push('Provide your answer in the following JSON format:');
  parts.push(JSON.stringify({
    fields: Object.fromEntries(Object.entries(question.fields).map(([id, f]) => [id, getExpectedFormat(f)]))
  }, null, 2));
  parts.push('Do NOT include any additional text outside the JSON.');

  return parts.join('\n');
}

function getExpectedFormat(field) {
  switch (field.kind) {
    case 'single_choice': return { kind: 'single_choice', option_id: 'OPTION_ID' };
    case 'multiple_choice': return { kind: 'multiple_choice', option_ids: ['OPTION_ID'] };
    case 'numeric': return { kind: 'numeric', value: '42', unit_option_id: 'UNIT_ID' };
    case 'ordering': return { kind: 'ordering', item_ids: ['ITEM_ID'] };
    case 'markers': return { kind: 'markers', points: [{ x: 10, y: 20 }] };
    case 'text': return { kind: 'text', value: 'answer text' };
    case 'essay': return { kind: 'essay', value: 'essay text' };
    default: return { kind: field.kind, value: 'answer' };
  }
}

// --- OpenRouter API Proxy ---

function callOpenRouter(question, config) {
  const prompt = buildAnswerPrompt(question);
  const model = config.model || DEFAULT_MODEL;
  const reasoningMap = { low: 0, medium: 1, high: 2 };
  const reasoningEfforts = reasoningMap[config.reasoning || 'low'] || 0;

  const body = JSON.stringify({
    model: model,
    messages: [
      { role: 'system', content: 'You are an expert quiz solver. Always respond with valid JSON only.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 4000,
    temperature: reasoningEfforts === 0 ? 0.3 : 0.7,
    top_p: 0.9
  });

  return new Promise((resolve, reject) => {
    const req = https.request(OPENROUTER_BASE + '/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://moodle-solver.local',
        'X-Title': 'Moodle Quiz Solver Backend'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`OpenRouter error ${res.statusCode}: ${data.substring(0, 200)}`));
          return;
        }
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.message?.content || '';
          resolve({ content, model: parsed.model });
        } catch (e) {
          reject(new Error(`Failed to parse OpenRouter response: ${e.message}`));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// --- Answer Parsing ---

function parseAnswer(llmResponse, question, questionType) {
  // Try to extract JSON from the response
  let jsonStr = llmResponse.trim();
  
  // Handle cases where LLM wraps response in markdown
  const jsonMatch = jsonStr.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
  if (jsonMatch) jsonStr = jsonMatch[1];
  
  // Also try to find JSON object in the response
  const braceMatch = jsonStr.match(/\{[\s\S]*"fields"[\s\S]*\}/);
  if (!jsonStr.startsWith('{') && braceMatch) jsonStr = braceMatch[0];

  let parsed;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (e) {
    throw new Error(`Failed to parse LLM response as JSON: ${llmResponse.substring(0, 100)}`);
  }

  if (!parsed.fields) {
    throw new Error('LLM response missing "fields" key');
  }

  // Validate each field matches the expected kind
  const answer = { fields: {} };
  for (const [fieldId, field] of Object.entries(question.fields)) {
    const result = parsed.fields[fieldId];
    if (!result || typeof result !== 'object') {
      throw new Error(`LLM response missing answer for field ${fieldId}`);
    }
    if (result.kind !== field.kind) {
      throw new Error(`Field ${fieldId}: expected kind ${field.kind}, got ${result.kind}`);
    }
    answer.fields[fieldId] = result;
  }

  return answer;
}

// --- HTTP Request Handler ---

async function handleRequest(method, urlPath, headers, body) {
  // Parse auth
  const authHeader = headers.authorization || headers.Authorization || '';
  let apiKey = '';
  if (authHeader.startsWith('Bearer ')) {
    apiKey = authHeader.slice(7).trim();
    if (apiKey.startsWith('*** ' )) apiKey = ''; // Handle redacted format
  }

  // Validate API key (accept any non-empty key for now, or the OpenRouter key)
  const isValid = apiKey && (apiKey === OPENROUTER_API_KEY || apiKey.length > 0);
  if (!isValid) {
    return { status: 401, body: { error: { code: 'invalid_api_key', message: 'Invalid or missing API key' } } };
  }

  // Route: GET /api/v2/capabilities
  if (method === 'GET' && urlPath === '/api/v2/capabilities') {
    return {
      status: 200,
      body: {
        schema_versions: ['2.0'],
        question_types: QUESTION_TYPES,
        limits: { max_request_bytes: MAX_REQUEST_BYTES }
      }
    };
  }

  // Route: GET /api/v2/models
  if (method === 'GET' && urlPath === '/api/v2/models') {
    return { status: 200, body: { models: MODELS } };
  }

  // Route: POST /api/v2/answer
  if (method === 'POST' && urlPath === '/api/v2/answer') {
    if (!OPENROUTER_API_KEY) {
      return { status: 503, body: { error: { code: 'backend_unavailable', message: 'OpenRouter API key not configured' } } };
    }

    try {
      const payload = JSON.parse(body);
      const question = payload.question;

      // Validate request
      if (!payload.schema_version || !payload.request_id || !payload.snapshot_id || !payload.model || !payload.question) {
        return { status: 400, body: { error: { code: 'invalid_request', message: 'Missing required fields' } } };
      }

      // Check request size
      const serialized = JSON.stringify(payload);
      if (new TextEncoder().encode(serialized).length > MAX_REQUEST_BYTES) {
        return { status: 413, body: { error: { code: 'request_too_large', message: 'Question exceeds request limit' } } };
      }

      // Call OpenRouter
      const llmResult = await callOpenRouter(question, {
        model: payload.model,
        reasoning: payload.reasoning
      });

      // Parse answer
      const answer = parseAnswer(llmResult.content, question, question.qtype);

      return {
        status: 200,
        body: {
          answer,
          answer_metadata: { model_used: llmResult.model, reasoning: payload.reasoning },
          request_id: payload.request_id,
          snapshot_id: payload.snapshot_id,
          question_type: question.qtype,
          credits_remaining: 999999
        }
      };
    } catch (e) {
      console.error('Answer error:', e.message);
      return {
        status: 500,
        body: { error: { code: 'answer_generation_failed', message: e.message } }
      };
    }
  }

  // Route: POST /api/v1/chat (custom prompt)
  if (method === 'POST' && urlPath === '/api/v1/chat') {
    if (!OPENROUTER_API_KEY) {
      return { status: 503, body: { error: { code: 'backend_unavailable', message: 'OpenRouter API key not configured' } } };
    }

    try {
      const payload = JSON.parse(body);
      const reasoningMap = { low: 0, medium: 1, high: 2 };
      const reasoningEfforts = reasoningMap[payload.reasoning || 'low'] || 0;

      const orBody = JSON.stringify({
        model: payload.model || DEFAULT_MODEL,
        messages: [
          { role: payload.context ? 'system' : 'system', content: payload.context || 'You are a helpful assistant.' },
          { role: 'user', content: payload.prompt }
        ],
        max_tokens: 4000,
        temperature: reasoningEfforts === 0 ? 0.3 : 0.7,
        top_p: 0.9
      });

      const result = await new Promise((resolve, reject) => {
        const req = https.request(OPENROUTER_BASE + '/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://moodle-solver.local',
            'X-Title': 'Moodle Quiz Solver Backend'
          }
        }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            if (res.statusCode !== 200) {
              reject(new Error(`OpenRouter error ${res.statusCode}: ${data.substring(0, 200)}`));
              return;
            }
            resolve(JSON.parse(data));
          });
        });
        req.on('error', reject);
        req.write(orBody);
        req.end();
      });

      const content = result.choices?.[0]?.message?.content || '';
      return { status: 200, body: { response: content, credits_remaining: 999999 } };
    } catch (e) {
      console.error('Chat error:', e.message);
      return { status: 500, body: { error: { code: 'chat_failed', message: e.message } } };
    }
  }

  return { status: 404, body: { error: { code: 'not_found', message: 'Endpoint not found' } } };
}

// --- Server ---

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const urlPath = url.pathname;

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', async () => {
    try {
      const result = await handleRequest(req.method, urlPath, req.headers, body);
      res.writeHead(result.status, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      });
      res.end(JSON.stringify(result.body));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: { code: 'internal_error', message: e.message } }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Moodle Quiz Solver Backend listening on port ${PORT}`);
  console.log(`OpenRouter API key: ${OPENROUTER_API_KEY ? 'SET (length=' + OPENROUTER_API_KEY.length + ')' : 'NOT SET'}`);
  console.log(`Default model: ${DEFAULT_MODEL}`);
  console.log('');
  console.log('Endpoints:');
  console.log(`  GET  /api/v2/capabilities`);
  console.log(`  GET  /api/v2/models`);
  console.log(`  POST /api/v2/answer`);
  console.log(`  POST /api/v1/chat`);
});
