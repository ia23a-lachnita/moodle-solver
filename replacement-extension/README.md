# Moodle Quiz Solver — Replacement Extension

AI-powered Chrome extension for solving Moodle quiz questions. **BYOK (Bring Your Own Key)** - works with any AI provider (OpenRouter, OpenAI, Anthropic, Ollama, Custom OpenAI-compatible). Fully reverse-engineered replacement for "Quiz Solver for Moodle" (v3.0.2, id `fgcgcmflgkdgpecgdgjkgpehncicidkj`).

## Overview

This extension injects into Moodle quiz attempt pages (`/mod/quiz/attempt.php`) and provides one-click answer solving for supported question types via your configured AI provider.

**Architecture (4 components):**

| Component | File | World | Run at | Responsibility |
|---|---|---|---|---|
| **Bridge** | `content/bridge.js` | MAIN | `document_start` | Intercepts Moodle's secure-window init; handles drag-drop, marker, ordering, and essay editor interactions via `postMessage` |
| **Solver** | `content/solver.js` | MAIN | `document_end` | Detects questions, extracts content, calls AI provider, validates and applies answers |
| **Background SW** | `background/background.js` | — | event-driven | Calls AI provider APIs directly; manages `chrome.storage.local` config |
| **Popup UI** | `popup/popup.html` + `popup.js` | — | — | Provider selection, API key, model, reasoning, context, temperature, max tokens |

**Communication flow:**

1. Solver detects `.que` elements via `MutationObserver`
2. Solver extracts question content (text, math, images) into a JSON snapshot
3. Solver sends snapshot + config to background SW via `chrome.runtime.sendMessage`
4. Background SW calls your AI provider directly (OpenAI, Anthropic, OpenRouter, Ollama, etc.)
5. AI returns structured answer with field-level values
6. Solver validates answer against question schema, applies via DOM manipulation or bridge `postMessage` commands
7. If application fails mid-way, solver restores previous values automatically

**Bridge message protocol** (`postMessage` between solver and bridge):
- Request: `{ source: 'moodle-quiz-solver-v2', direction: 'request', id, root_id, command, args }`
- Response: `{ source: 'moodle-quiz-solver-v2', direction: 'response', id, ok, result | error }`
- Cancel: `{ source: 'moodle-quiz-solver-v2', direction: 'cancel', id, root_id }`

## Supported Question Types

| QType | Extraction | Answer Application | Bridge Command |
|---|---|---|---|
| multichoice | `extractStandard` (radio/checkbox) | Direct DOM | — |
| truefalse | `extractStandard` | Direct DOM | — |
| shortanswer | `extractStandard` (text input) | Direct DOM | — |
| numerical | `extractStandard` (numeric + unit) | Direct DOM | — |
| calculated | `extractStandard` (numeric + unit) | Direct DOM | — |
| calculatedsimple | `extractStandard` (numeric + unit) | Direct DOM | — |
| calculatedmulti | `extractStandard` (radio/checkbox) | Direct DOM | — |
| match | `extractStandard` (select) | Direct DOM | — |
| randomsamatch | `extractStandard` (select) | Direct DOM | — |
| multianswer (Cloze) | `extractStandard` (mixed) | Direct DOM | — |
| gapselect | `extractComposite` → `gapselect()` | Direct DOM | — |
| ddwtos | `extractComposite` → `slots()` | Bridge | `composite.clear` / `composite.set` |
| ddimageortext | `extractComposite` → `slots()` | Bridge | `composite.clear` / `composite.set` |
| ddmarker | `extractComposite` → `markers()` | Bridge | `marker.set` |
| ordering | `extractComposite` → `ordering()` | Bridge | `ordering.set` |
| essay | `extractEssay()` | Bridge (TinyMCE/Atto) | `essay.ready` / `essay.write` / `essay.restore` |

## Essay Editor Support

Essay questions support both TinyMCE and Atto rich-text editors, plus plain textareas:

- **Surface detection** (`essay.ready`): Detects editor type by polling for TinyMCE instances, Atto content elements, or plain textarea readiness (checks `M.util.pending_js`)
- **Reading** (`editorHTML`): Extracts current HTML from TinyMCE iframe (`contentDocument.body`), Atto content element, or textarea value
- **Writing** (`essay.write`): Converts plain text to HTML — `tinyTextHTML` for TinyMCE (pre-formatted for code), `paragraphHTML` for Atto (paragraph-wrapped)
- **Restoring** (`essay.restore`): Restores previous HTML snapshot
- **Integrity**: `editorContentSignature` strips HTML to text content for comparison; `expected_html` parameter prevents race conditions
- **Editor readiness**: Uses keyboard event injection to trigger Atto's polling; 10s deadline for surface detection
- **Cancellation**: AbortSignal-based; resumes polling after blur events

## BYOK Configuration

The extension supports any AI provider with an OpenAI-compatible API:

| Provider | Base URL | Notes |
|---|---|---|
| **OpenRouter** | `https://openrouter.ai/api/v1` | Supports 300+ models, reasoning levels (low/medium/high) |
| **OpenAI** | `https://api.openai.com/v1` | Direct OpenAI API |
| **Anthropic** | `https://api.anthropic.com/v1` | Uses tool calling for structured output |
| **Ollama (Local)** | `http://localhost:11434/v1` | Local models, no API key needed |
| **Custom** | Your endpoint | Any OpenAI-compatible API (LM Studio, vLLM, etc.) |

**Configuration fields:**
- **Provider**: Select from presets or Custom
- **Base URL**: API endpoint (leave empty for provider default)
- **API Key**: Your API key (optional for Ollama/local)
- **Model**: Model ID (e.g., `openai/gpt-4o-mini`, `claude-3-5-sonnet`, `llama3.1`)
- **Reasoning**: OpenRouter only — low/medium/high
- **Temperature**: 0-2 (default 0.1)
- **Max Tokens**: 100-128000 (default 4000)
- **Context**: Optional user-provided context prepended to prompts

## Build

```bash
cd replacement-extension
npm install       # installs esbuild
npm run build     # one-shot production build (minified + sourcemaps)
npm run watch     # development build (unminified, watches src/)
```

Build outputs:
- `content/bridge.js` — IIFE format, browser target
- `content/solver.js` — IIFE format, browser target 
- `background/background.js` — ESM format (MV3 service worker)
- `popup/popup.js` — IIFE format, browser target
- `popup/popup.html` — copied from src
- `popup/theme.js` — copied from src
- Sourcemaps emitted alongside each JS file

## Installation

1. Run `npm run build`
2. Open `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `replacement-extension/` directory
5. Click the extension icon, select your AI provider, enter API key, choose model
6. Navigate to a Moodle quiz attempt page and click on any question to auto-solve

## Configuration

Stored in `chrome.storage.local` under key `quiz_solver_config`:

| Field | Type | Default | Description |
|---|---|---|---|
| `provider.provider` | string | — | `openai` \| `anthropic` \| `openrouter` \| `ollama` \| `custom` |
| `provider.baseUrl` | string | — | API base URL (e.g., `https://openrouter.ai/api/v1`) |
| `provider.apiKey` | string | — | Your API key |
| `provider.model` | string | — | Model ID |
| `provider.reasoning` | string | `low` | OpenRouter only: `low`, `medium`, `high` |
| `provider.temperature` | number | `0.1` | Sampling temperature |
| `provider.maxTokens` | number | `4000` | Max completion tokens |
| `fillOnClick` | boolean | `false` | Defer answer fill until click |
| `cursor` | boolean | `true` | Show pointer cursor on questions |
| `context` | string | `''` | Optional user context |

## AI Provider API Formats

**OpenAI / OpenRouter / Ollama / Custom (OpenAI-compatible):**
- Uses `/chat/completions` endpoint
- `response_format: { type: 'json_object' }` for structured output
- OpenRouter: adds `reasoning: { effort: 'low|medium|high' }`

**Anthropic:**
- Uses `/chat/completions` with `x-api-key` header
- Uses tool calling (`submit_answer` function) for structured output
- `anthropic-version: 2023-06-01` header

## File Structure

```
replacement-extension/
├── manifest.json          # MV3 manifest
├── build.js               # esbuild build configuration
├── package.json           # dependencies (esbuild only)
├── assets/                # logo icons (copied from original)
├── vendor/                # Bootstrap + Font Awesome CSS
├── src/                   # TypeScript sources
│   ├── content/
│   │   ├── bridge.ts      # Bridge content script (document_start, MAIN)
│   │   └── solver.ts      # Solver content script (document_end, MAIN)
│   ├── background/
│   │   └── background.ts  # Service worker (MV3)
│   ├── popup/
│   │   ├── popup.ts       # Popup UI controller
│   │   ├── popup.html     # Popup markup
│   │   └── theme.js       # Dark/light theme toggle
│   └── shared/
│       ├── types.ts       # Shared TypeScript interfaces
│       └── utils.ts       # Shared utility functions
├── content/               # Built JS output (IIFE)
├── background/            # Built JS output (ESM)
└── popup/                 # Built JS + HTML output
```

## Testing Note

**This extension has not been tested against a live Moodle exam/exercise.** It was developed by reverse-engineering the original extension's source maps and JavaScript bundles. The question extraction and answer application logic matches the original v3.0.2 behavior, but real-world Moodle installations may have variations in HTML structure, custom question types, or theme modifications that could affect compatibility.

For testing, you would need:
1. A Moodle instance with quiz activity
2. The extension loaded in Chrome
3. An AI provider configured (OpenRouter free tier works for testing)
