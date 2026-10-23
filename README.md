# moodle-solver (Quiz Solver for Moodle — reverse-engineered clone)

Chrome extension that reverse-engineers the installed "Quiz Solver for Moodle" (v3.0.2, id fgcgcmflgkdgpecgdgjkgpehncicidkj) to build our own Moodle quiz/exam solver plugin.

## Reused patterns (from recent github activity)
- Project docs style: reels-guard / vid-gain (README + PROJECT_INSTRUCTIONS.md + PROGRESS.md + AGENTS.md)
- GitHub CLI (gh) workflow — auth active, account ia23a-lachnita
- Extension setup: manifest v3, content scripts (document_start / document_end), storage permission, host_permissions *://*/*

## Reverse-engineered reference
`reverse-engineered-extension/quiz-solver-moodle-v3.0.2/` — full copy of installed extension from Chrome profile (fgcgcmflgkdgpecgdgjkgpehncicidkj / 3.0.2_0). Source maps (QuizSolver.js.map, MoodleBridge.js.map) included for logic recovery.

## Skill
`software-development/reverse-engineering-chrome-extensions` — created for this project.
