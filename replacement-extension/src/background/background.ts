/**
 * Background Service Worker
 * BYOK - Direct AI provider calls (OpenAI, Anthropic, OpenRouter, Ollama, Custom)
 */

import { ProviderConfig, AnswerRequest, AnswerResponse, ExtensionConfig, STORAGE_KEYS, AIProvider, PROVIDER_PRESETS } from '../shared/types.js';

// Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, payload } = message;

  switch (type) {
    case 'CHECK_API_KEY':
      checkApiKey(payload.config)
        .then(result => sendResponse({ success: true, result }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;

    case 'GET_MODELS':
      getModels(payload.config)
        .then(result => sendResponse({ success: true, result }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;

    case 'GET_ANSWER':
      getAnswer(payload.request, payload.config)
        .then(result => sendResponse({ success: true, result }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;

    case 'GET_CONFIG':
      getConfig()
        .then(config => sendResponse({ success: true, config }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;

    case 'SET_CONFIG':
      setConfig(payload.config)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;

    default:
      sendResponse({ success: false, error: 'Unknown message type' });
      return false;
  }
});

function getProviderHeaders(config: ProviderConfig): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (config.apiKey) {
    if (config.provider === 'anthropic') {
      headers['x-api-key'] = config.apiKey;
      headers['anthropic-version'] = '2023-06-01';
    } else {
      headers['Authorization'] = `Bearer ${config.apiKey}`;
    }
  }

  // OpenRouter specific headers
  if (config.provider === 'openrouter') {
    headers['HTTP-Referer'] = 'chrome-extension://moodle-quiz-solver';
    headers['X-Title'] = 'Moodle Quiz Solver';
  }

  // Custom extra headers
  if (config.extraHeaders) {
    Object.assign(headers, config.extraHeaders);
  }

  return headers;
}

function buildMessages(request: AnswerRequest, config: ProviderConfig): Array<{ role: string; content: string }> {
  const systemPrompt = `You are an AI assistant that solves Moodle quiz questions. You must output a JSON object with answers for each field in the question.

CRITICAL: Output ONLY valid JSON matching this schema:
{
  "answer": { "field_id": "value" },
  "explanation": "brief explanation",
  "confidence": 0.95
}

Field types and expected value formats:
- text: string
- numeric: { "value": "123", "unit_option_id": "optional_unit_id" }
- single_choice: { "option_id": "option_id" }
- multiple_choice: { "option_ids": ["id1", "id2"] }
- ordering: { "item_ids": ["id1", "id2", ...] }
- markers: { "points": [{ "x": 100, "y": 200 }] }
- essay: { "value": "HTML or plain text response" }

Rules:
1. Answer ALL fields present in the question
2. Use exact field_ids and option_ids from the question
3. For multiple_choice, select ALL correct options
4. For ordering, provide ALL items in correct order
5. Confidence: 0.0-1.0
6. No extra commentary, ONLY the JSON`;

  const userPrompt = `${request.context ? `Context: ${request.context}\n\n` : ''}Question (${request.question.qtype}):\n${JSON.stringify(request.question, null, 2)}\n\nProvide answers as JSON.`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];
}

async function callProvider(config: ProviderConfig, messages: Array<{ role: string; content: string }>, signal?: AbortSignal): Promise<{ content: string; usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number } }> {
  const url = `${config.baseUrl.replace(/\/$/, '')}/chat/completions`;
  const headers = getProviderHeaders(config);

  const body: Record<string, unknown> = {
    model: config.model,
    messages,
    temperature: config.temperature ?? 0.1,
    max_tokens: config.maxTokens ?? 4000,
    response_format: { type: 'json_object' },
  };

  // OpenRouter specific: reasoning
  if (config.provider === 'openrouter' && config.reasoning) {
    body.reasoning = { effort: config.reasoning };
  }

  // Anthropic doesn't support response_format, use tools instead
  if (config.provider === 'anthropic') {
    delete body.response_format;
    body.tools = [{
      name: 'submit_answer',
      description: 'Submit the structured answer',
      input_schema: {
        type: 'object',
        properties: {
          answer: { type: 'object' },
          explanation: { type: 'string' },
          confidence: { type: 'number', minimum: 0, maximum: 1 },
        },
        required: ['answer', 'explanation', 'confidence'],
      },
    }];
    body.tool_choice = { type: 'tool', name: 'submit_answer' };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    let errorMsg = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const err = await response.json();
      errorMsg = err.error?.message || err.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  const data = await response.json();

  // Parse response based on provider
  let content: string;
  let usage = data.usage;

  if (config.provider === 'anthropic') {
    // Anthropic returns tool use
    const toolUse = data.content?.find((c: any) => c.type === 'tool_use');
    if (toolUse?.name === 'submit_answer') {
      content = JSON.stringify(toolUse.input);
    } else {
      content = data.content?.[0]?.text || '{}';
    }
  } else {
    // OpenAI-compatible
    content = data.choices?.[0]?.message?.content || '{}';
  }

  return { content, usage };
}

async function checkApiKey(config: ProviderConfig): Promise<{ valid: boolean; models?: string[] }> {
  try {
    const url = `${config.baseUrl.replace(/\/$/, '')}/models`;
    const headers = getProviderHeaders(config);
    const response = await fetch(url, { headers });
    if (!response.ok) return { valid: false };
    const data = await response.json();
    const models = data.data?.map((m: any) => m.id) || data.models?.map((m: any) => m.id) || [];
    return { valid: true, models };
  } catch {
    return { valid: false };
  }
}

async function getModels(config: ProviderConfig): Promise<{ models: Array<{ id: string; name?: string; is_default?: boolean }> }> {
  const url = `${config.baseUrl.replace(/\/$/, '')}/models`;
  const headers = getProviderHeaders(config);
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`Failed to fetch models: ${response.status}`);
  const data = await response.json();
  const models = (data.data || data.models || []).map((m: any) => ({
    id: m.id,
    name: m.name || m.id,
    is_default: m.id === config.model,
  }));
  return { models };
}

async function getAnswer(request: AnswerRequest, config: ProviderConfig): Promise<AnswerResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const messages = buildMessages(request, config);
    const { content, usage } = await callProvider(config, messages, controller.signal);

    let parsed: AnswerResponse;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error('AI returned invalid JSON. Try a different model or adjust temperature.');
    }

    // Validate required fields
    if (!parsed.answer || typeof parsed.answer !== 'object') {
      throw new Error('AI response missing "answer" object');
    }

    return {
      answer: parsed.answer,
      explanation: parsed.explanation,
      confidence: parsed.confidence,
      usage,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function getConfig(): Promise<ExtensionConfig | null> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.CONFIG);
  return result[STORAGE_KEYS.CONFIG] || null;
}

async function setConfig(config: ExtensionConfig): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEYS.CONFIG]: config });
}

// Clean up on service worker shutdown
chrome.runtime.onSuspend?.addListener(() => {
  // No persistent state to clean up
});