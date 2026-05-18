# Project Memory: SetManager

## Status: v1.0.0 (Production Stable)
- **Current Goal:** Refine UX for mobile users and expand the "Doctor" diagnostic features.
- **Last Milestone:** Completed the v1.0.0 official release with full PWA support and song database validation.

## Persistent Context
- **Stack:** Vanilla JS (ES6+), CSS3 (Flex/Grid), HTML5 (PWA), localStorage.
- **Core Files:** `src/js/app.js` (Logic), `src/js/songs.js` (Data), `src/index.html` (UI).

## Active Tasks
- [ ] Implement an undo/redo system for setlist manual edits.
- [ ] Add vocal range filtering for singers in the generation settings.
- [ ] Refine the drag-and-drop animation for better 60fps performance on mobile.

## Technical Debt
- Some legacy CSS classes in `style.css` need cleanup.
- Manual setlist reordering logic in `app.js` could be further modularized.

## Notes
- *2026-05-18:* Jules Dev Standard v1.0 applied. All technical and user documentation migrated to `docs/wiki/`. Root directory cleaned.
- Project adheres to a strict "No NPM" policy.
- SEO and PWA features are critical for the public-facing version.