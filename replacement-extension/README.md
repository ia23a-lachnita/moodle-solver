# Moodle Quiz Solver — Replacement Extension

AI-powered Chrome extension for solving Moodle quiz questions. Fully reverse-engineered replacement for "Quiz Solver for Moodle" (v3.0.2, id `fgcgcmflgkdgpecgdgjkgpehncicidkj`).

## Overview

This extension injects into Moodle quiz attempt pages (`/mod/quiz/attempt.php`) and provides one-click answer solving for supported question types via an external AI backend.

**Architecture (4 components):**

| Component | File | World | Run at | Responsibility |
|---|---|---|---|---|
| **Bridge** | `content/bridge.js` | MAIN | `document_start` | Intercepts Moodle's secure-window init; handles drag-drop, marker, ordering, and essay editor interactions via `postMessage` |
| **Solver** | `content/solver.js` | MAIN | `document_end` | Detects questions, extracts content, calls backend API, validates and applies answers |
| **Background SW** | `background/background.js` | — | event-driven | Proxies API calls to backend; manages `chrome.storage.local` config |
| **Popup UI** | `popup/popup.html` + `popup.js` | — | — | API key entry, model selection, reasoning level, context string, credits display |

**Communication flow:**

1. Solver detects `.que` elements via `MutationObserver`
2. Solver extracts question content (text, math, images) into a JSON snapshot
3. Solver sends snapshot + config (API key, model, reasoning) to `https://quizsolverformoodle.com/api/v2/answer` via background SW
4. Backend returns structured answer with field-level values
5. Solver validates answer against question schema, applies via DOM manipulation or bridge `postMessage` commands
6. If application fails mid-way, solver restores previous values automatically

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
5. Click the extension icon, enter your API key from `quizsolverformoodle.com`, select a model and reasoning level
6. Navigate to a Moodle quiz attempt page and click on any question to auto-solve

## Configuration

Stored in `chrome.storage.local` under key `quizSolver`:

| Field | Type | Default | Description |
|---|---|---|---|
| `apiKey` | string | — | API key for quizsolverformoodle.com |
| `model` | string | — | Backend LLM model ID (e.g. `gpt-4.1-mini`, `o1`) |
| `reasoning` | string | `low` | Reasoning level: `low`, `medium`, `high` |
| `context` | string | `''` | Optional user-provided context prepended to prompts |
| `cursor` | boolean | `true` | Show pointer cursor on questions |
| `fillOnClick` | boolean | `false` | Defer answer fill until click (vs auto-apply) |
| `credits` | number | — | Remaining API credits (updated after each answer) |

## Backend API

Endpoint: `https://quizsolverformoodle.com/api/v2/`

| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/capabilities` | GET | Bearer token | Returns supported schema versions, question types, limits |
| `/models` | GET | Bearer token | Returns available LLM models with metadata |
| `/answer` | POST | Bearer token | Submits question snapshot, returns structured answer |

The LLM provider is selected server-side — the extension passes the `model` and `reasoning` parameters through the API; the backend routes these to the appropriate provider (OpenAI, Anthropic, etc.) based on the model ID. API key management is handled by the backend.

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
