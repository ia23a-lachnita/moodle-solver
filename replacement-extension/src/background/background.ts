/**
 * Background Service Worker
 * Handles API proxying and storage management
 */

const BACKEND_URL = 'http://localhost:3000';

// Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, payload } = message;

  switch (type) {
    case 'CHECK_API_KEY':
      checkApiKey(payload.apiKey)
        .then(result => sendResponse({ success: true, result }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true; // Will respond asynchronously

    case 'GET_MODELS':
      getModels(payload.apiKey, payload.signal)
        .then(result => sendResponse({ success: true, result }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;

    case 'GET_CAPABILITIES':
      getCapabilities(payload.apiKey)
        .then(result => sendResponse({ success: true, result }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;

    case 'GET_ANSWER':
      getAnswer(payload, payload.signal)
        .then(result => sendResponse({ success: true, result }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;

    case 'DECREMENT_CREDITS':
      decrementCredits()
        .then(() => sendResponse({ success: true }))
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

async function checkApiKey(apiKey) {
  const response = await fetch(`${BACKEND_URL}/api/v2/capabilities`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (response.status === 401) return { valid: false, error: 'Invalid API key' };
  if (!response.ok) return { valid: false, error: `Server error: ${response.status}` };
  const data = await response.json();
  return { valid: true, caps: data };
}

async function getModels(apiKey) {
  const response = await fetch(`${BACKEND_URL}/api/v2/models`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to fetch models: ${response.status} - ${err}`);
  }
  return await response.json();
}

async function getCapabilities(apiKey) {
  const response = await fetch(`${BACKEND_URL}/api/v2/capabilities`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to fetch capabilities: ${response.status} - ${err}`);
  }
  return await response.json();
}

async function getAnswer(payload) {
  const { apiKey, model, reasoning, context, question } = payload;

  const response = await fetch(`${BACKEND_URL}/api/v2/answer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      schema_version: '2.0',
      request_id: crypto.randomUUID(),
      snapshot_id: `s${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      model,
      reasoning,
      context: context || '',
      question,
    }),
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    if (response.status === 401) throw new Error('Invalid API key');
    if (response.status === 402) throw new Error('No credits remaining');
    if (response.status === 429) throw new Error('Too many requests. Please wait.');
    if (response.status >= 500) throw new Error('Server error. Please try again later.');
    throw new Error(errorData?.error?.message || 'Answer request failed');
  }

  const data = await response.json();

  // Update credits in storage
  const current = await chrome.storage.local.get('quizSolver');
  if (current.quizSolver?.apiKey === apiKey && typeof data.credits_remaining === 'number') {
    await chrome.storage.local.set({
      quizSolver: { ...current.quizSolver, credits: data.credits_remaining }
    });
  }

  return data;
}

async function decrementCredits() {
  const current = await chrome.storage.local.get('quizSolver');
  if (!current.quizSolver || typeof current.quizSolver.credits !== 'number') return;
  const newCredits = Math.max(0, current.quizSolver.credits - 1);
  await chrome.storage.local.set({
    quizSolver: { ...current.quizSolver, credits: newCredits }
  });
}

async function getConfig() {
  const result = await chrome.storage.local.get('quizSolver');
  return result.quizSolver || null;
}

async function setConfig(config) {
  await chrome.storage.local.set({ quizSolver: config });
}

// Clean up on service worker shutdown
chrome.runtime.onSuspend?.addListener(() => {
  // No persistent state to clean up
});