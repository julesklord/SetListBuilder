# Gemini CLI Rules

Specific instructions for the **Gemini CLI** agent in the SetManager repository.

## Working Context
- Project follows the Jules Dev Standard.
- Strict "No External Dependencies" rule (Vanilla JS/CSS/HTML only).
- Data persistence is 100% via `localStorage`.
- Mobile-first, offline-ready (PWA).

## Workflow
1. Research -> 2. Strategy -> 3. Execution (Plan-Act-Validate).
2. Validate any JS changes by running the app in a local server (`python -m http.server`).
3. Run `tests/validation-script.js` for any changes to the song database.

## Constraints
- Never introduce NPM packages, even for development (maintain the lightweight footprint).
- Ensure all UI updates respect the "Machined Brutalist" aesthetic of FMG tools.
- Update `docs/MEMORY.md` after every significant algorithm or feature update.
- Consult `docs/AGENT.md` for specific operational SOPs.
- Adhere to the i18n patterns in `js/i18n.js` for any new UI text.
- Do not modify files in `Previous Versions/`.