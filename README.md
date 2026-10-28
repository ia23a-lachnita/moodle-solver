# moodle-solver (Quiz Solver for Moodle — reverse-engineered clone)

Chrome extension that reverse-engineers the installed "Quiz Solver for Moodle" (v3.0.2, id fgcgcmflgkdgpecgdgjkgpehncicidkj) to build our own Moodle quiz/exam solver plugin with **BYOK (Bring Your Own Key)** — works with any AI provider (OpenRouter, OpenAI, Anthropic, Ollama, Custom).

## Reused patterns (from recent github activity)
- Project docs style: reels-guard / vid-gain (README + PROJECT_INSTRUCTIONS.md + PROGRESS.md + AGENTS.md)
- GitHub CLI (gh) workflow — auth active, account ia23a-lachnita
- Extension setup: manifest v3, content scripts (document_start / document_end), storage permission, host_permissions *://*/*
- **BYOK architecture**: Direct AI provider calls (no intermediary backend)

## Reverse-engineered reference
`reverse-engineered-extension/quiz-solver-moodle-v3.0.2/` — full copy of installed extension from Chrome profile (fgcgcmflgkdgpecgdgjkgpehncicidkj / 3.0.2_0). Source maps (QuizSolver.js.map, MoodleBridge.js.map) included for logic recovery.

## Replacement extension
`replacement-extension/` — fully functional MV3 Chrome extension built from reverse-engineered sources using esbuild. See [replacement-extension/README.md](replacement-extension/README.md) for architecture, question-type support, build, and install instructions.

Key differences from the original:
- TypeScript sources compiled with esbuild (IIFE for content scripts, ESM for service worker)
- Essay editor support (TinyMCE + Atto) added to the bridge
- **BYOK**: Direct calls to any AI provider (OpenRouter, OpenAI, Anthropic, Ollama, Custom)

## Skill
`software-development/reverse-engineering-chrome-extensions` — created for this project.
