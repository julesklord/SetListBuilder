# FMG Setlist Builder v2.3

Setlist generator for live musicians — AI-powered, multi-language, no backend required.

## Project structure

```
setlistbuilder/
├── index.html        ← Main app shell (HTML structure only)
├── style.css         ← All styles (dark/light theme, layout, components)
└── js/
    ├── songs.js      ← Song pool: 90 songs, edit here to add/fix songs
    ├── i18n.js       ← Translations: EN, ES, PT, RU — add new languages here
    └── app.js        ← All application logic (generate, AI, export, etc.)
```

## Making changes

**Add or edit a song** → `js/songs.js`  
**Fix a translation** → `js/i18n.js`  
**Change layout or colors** → `style.css`  
**Add a feature** → `js/app.js`  

## Deploying to GitHub Pages

1. Push all files to a public GitHub repository (maintain the folder structure)
2. Settings → Pages → Source: `main` branch → `/ (root)`
3. Live at `yourusername.github.io/repo-name`

## AI features

Requires an API key from Anthropic, Google, or OpenAI.  
Keys are stored only in the user's browser localStorage — never sent to any third-party server.

## Adding a new language

1. In `js/i18n.js`, copy the `en:{...}` block and change the key to your language code (e.g. `fr`)
2. In `index.html`, add a lang button: `<button class="lang-btn" data-lang="fr" onclick="setLang('fr')">FR</button>`
3. That's it.
