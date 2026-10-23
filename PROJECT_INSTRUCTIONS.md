# Project Instructions — moodle-solver

Goal: Reverse engineer Quiz Solver for Moodle extension and build replacement Chrome plugin.

Source extension (installed): id fgcgcmflgkdgpecgdgjkgpehncicidkj, version 3.0.2.
Location on disk: Chrome User Data/Default/Extensions/fgcgcmflgkdgpecgdgjkgpehncicidkj/3.0.2_0/
Copied to: reverse-engineered-extension/quiz-solver-moodle-v3.0.2/

Key files to analyze:
- manifest.json (matches mod/quiz/attempt.php, world MAIN, storage)
- MoodleBridge.js (document_start, MAIN)
- QuizSolver.js (document_end)
- popup/index.html
- assets/
- vendor/
