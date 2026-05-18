# Agent SOP: SetManager Operations

## Operational Mandates
- **Zero Dependencies:** Never introduce external NPM packages or libraries. Maintain the pure vanilla JS/CSS/HTML architecture.
- **Offline Integrity:** Every new feature must work 100% offline.
- **LocalStorage Schema:** Any change to the data model must include a migration or auto-recovery path in `app.js`.
- **Cross-Browser Compatibility:** Ensure features work across modern mobile and desktop browsers (Event delegation is key).

## Core Workflows
1. **Song Database Updates:**
   - Modify `src/js/songs.js`.
   - Ensure the `id` is unique and metadata adheres to the established schema.
   - Run the validation script in `tests/validation-script.js`.
2. **Algorithm Refinement:**
   - Update the 3-pass energy/effort logic in `src/js/app.js`.
   - Verify performance impact (<100ms generation).
3. **i18n Support:**
   - Update translations in `src/js/i18n.js`.
   - Add new language buttons to `src/index.html` as needed.

## Documentation SOP
- Update `CHANGELOG.md` for release milestones.
- Keep `docs/wiki/FMG_Setlist_Builder_Docs.md` (Technical Reference) updated with architectural changes.
- Maintain `docs/MEMORY.md` with current project health and tasks.

## Related Docs
- [Project Identity](./IDENTITY.md)
- [Project Soul](./SOUL.md)
- [Wiki Index](./wiki/INDEX.md)
- [Testing Guide](../../tests/TESTING_GUIDE.md)