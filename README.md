# 🎼 FMG Setlist Builder v1.0 - Band Edition

**Fearlessly Media Group**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=flat-square)](https://github.com/julesklord/SetListBuilder)  [![License](https://img.shields.io/badge/license-FOSS-green.svg?style=flat-square)](LICENSE)  [![Status](https://img.shields.io/badge/status-production%20ready-success.svg?style=flat-square)]()  [![JavaScript](https://img.shields.io/badge/javascript-vanilla-yellow.svg?style=flat-square)]()  [![No Dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen.svg?style=flat-square)]()

**Intelligent setlist generator for live musicians**

Balance energy curves with physical effort • No backend • 100% offline • Multi-language

[Quick Start](docs/QUICK_START.md) · [Full Guide](docs/GUIDE.md) · [Docs](docs/GUIDE.md) · [Roadmap](docs/IMPROVEMENTS.md)

---

## Key Features

- **335 curated songs** — 24 genres with verified BPM, key, chord progressions (Example purposes)
- **11 band instruments** — guitar, bass, drums, keys, winds, vocals, percussion + configurable effort weights
- **Intelligent algorithm** — 50/50 balance: energy curve + physical effort distribution
- **Must Play locking** — guarantee songs in every setlist
- **Multi-format export** — PDF, HTML, JSON, plain text
- **Multi-language** — Spanish 🇪🇸, English 🇬🇧, Português 🇧🇷, Русский 🇷🇺
- **Fully responsive** — desktop, tablet, mobile with native bottom nav
- **100% offline** — all data in localStorage, no server needed
- **Private & secure** — no account, no tracking, no cloud
- **AI-ready** — infrastructure included (disabled in FOSS)

---

## Table of Contents

- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Algorithm](#-the-algorithm)
- [Features](#keystrokes)
- [Data & Persistence](#-data--persistence)
- [Customization](#-customization)
- [Documentation](#-documentation)
- [Troubleshooting](#-troubleshooting)
- [Performance](#-performance)

---

## Quick Start

### Local Development (Recommended)

```bash
cd SetListBuilder
python -m http.server 8080
```

Then open **<http://localhost:8080>** in your browser.

### Direct File

Double-click `index.html`
> Note: `localStorage` may be restricted with `file://` protocol in some browsers

### Deploy to GitHub Pages

1. Create a public repository
2. Push all files (keep folder structure)
3. Go to **Settings → Pages → Source** → select `main` branch
4. Your app goes live at `yourusername.github.io/SetManager`

---

## Project Structure

```
SetManager/
├── index.html                          # App shell (complete HTML)
├── style.css                           # All styles (responsive, dark/light)
├── js/
│   ├── songs.js                        # 335 songs + global state
│   ├── i18n.js                         # Translations (EN/ES/PT/RU)
│   └── app.js                          # 65+ functions
│
├── docs/                               # Documentation
│   ├── GUIDE.md                        # Complete tutorial
│   ├── QUICK_START.md                  # 5-minute onboarding
│   ├── IMPROVEMENTS.md                 # Roadmap
│   ├── CHANGELOG_V1.md                 # Version history
│   └── FMG_Setlist_Builder_Docs.md     # Technical reference
│
└── README.md                           # This file
```

---

## Getting Started (5 Steps)

1. **Select instruments** → Pick what your band has tonight (Guitar, Bass, Drums, Vocals, etc.)
2. **Choose # of sets** → 2, 3, or 4 sets
3. **Pick duration** → Time per set (minutes)
4. **Select genres** → Pick from 24 available
5. **Generate** → Click "Generate Setlist"
6. **Customize** → Drag songs, add notes, export to PDF

**Full tutorial:** [GUIDE.md](docs/GUIDE.md)

---

## Algorithm

### Phase 1: Song Eligibility

- **Level 1** (preferred): Songs matching instruments AND genres
- **Level 2** (fallback): Only genres if not enough matches
- **Level 3** (last resort): Full pool

### Phase 2: Must-Play Distribution

- Locked songs are distributed evenly across sets
- Guaranteed to appear in every generated setlist

### Phase 3: Energy Curve

```
Early Sets:   LOW (35%) → MID (40%) → HIGH (25%)
Final Set:    LOW (20%) → MID (40%) → HIGH (40%)  ← Peak finish
```

Creates natural audience engagement arc

### Phase 4: Effort Balancing

- Evens physical effort across sets (drummer fatigue, vocalist strain, etc.)
- Conservative swaps: only reorders if it improves balance
- Never sacrifices energy curve for effort

---

## Song Pool (335 Songs)

### Curated Music Library

**Song Metadata per Track**:

- Title & Artist
- Genre classification (24 genres)
- Musical key (A–B, sharps/flats)
- BPM (beats per minute)
- Chord progression (Roman numeral notation)
- Energy level (1–5 scale)
- Instrument requirements
- Effort estimation

**Genre Distribution**:

| Category | Count | Details |
|----------|-------|---------|
| **Classic/Blues** | 99 | Blues, Soul, Ballad, Jazz |
| **Rock** | 93 | Rock, Rock Latino, R&B, Modern |
| **Pop/Dance** | 75 | Pop, Funk, Disco, Funk/Soul |
| **World Music** | 38 | Reggae, Latin, Cumbia |
| **Other** | 30 | Country, Ranchera, Ska, Merengue, etc. |

---

### Band Instruments (11 Total)

| Instrument | Weight | Effort Level | Notes |
|---|:---:|:---:|---|
| Electric Guitar | 1.0 | ⭐⭐ | Lead/rhythm primary |
| Acoustic Guitar | 0.8 | ⭐ | Fingerpicking |
| Bass | 1.2 | ⭐⭐ | Standing + focus |
| **Drums** | **1.8** | **⭐⭐⭐⭐** | Full-body exertion |
| Keys/Piano | 1.0 | ⭐⭐ | Seated play |
| Saxophone | 1.5 | ⭐⭐⭐ | Breath + stamina |
| Trumpet | 1.5 | ⭐⭐⭐ | Embouchure focus |
| Trombone | 1.5 | ⭐⭐⭐ | Breath + movement |
| **Lead Vocals** | **2.0** | **⭐⭐⭐⭐⭐** | Highest vocal strain |
| Backing Vocals | 1.5 | ⭐⭐⭐ | Less intensive |
| Latin Percussion | 1.2 | ⭐⭐ | Congas, bongos |

**All weights are fully configurable**—adjust to match your band's physical conditioning and performance style.

---

### Data & Persistence

**100% Browser-Based** — All data stored locally in `localStorage`

```javascript
{
  'fmg-pool': JSON.stringify(pool),           // Your song library
  'fmg-nights': JSON.stringify(nights),       // Saved setlists & shows
  'fmg-mustPlay': JSON.stringify([...ids]),   // Locked songs
  'fmg-instrs': JSON.stringify(codes),        // Active instruments
  'fmg-effort-weights': JSON.stringify(obj),  // Effort multipliers
  'fmg-lang': 'en|es|pt|ru',                  // Active language
  'fmg-theme': 'dark|light',                  // Theme preference
  'fmg-ai-count': '3|5|8|10'                  // AI suggestion count
}
```

**Privacy First**: No backend server · No cloud accounts · No tracking · Data never leaves your device

---

### Customization & Extension

**Add or Edit a Song**

Edit `js/songs.js` and modify the `DEFAULTS` array:

```javascript
{
  id: 336,
  title: "My Song",
  artist: "My Band",
  genre: "Blues",
  key: "Am",
  bpm: 100,
  prog: "i–IV–i–V",           // Roman numeral chord progression
  energy: 3,                    // 1 (chill) to 5 (explosive)
  instr: ['eg', 'b', 'dr', 'vo'],
  effort: 2                      // Estimated effort level
}
```

**Import Songs via CSV**

1. Open **Pool** tab → click **"CSV Template"**
2. Fill template with your songs (title, artist, BPM, key, etc.)
3. Click **"Import"** and select file
4. Songs automatically merge with existing pool

**Add a New Language**

1. Edit `js/i18n.js` → Copy `en:{...}` block as new language (e.g., `fr:{...}`)
2. In `index.html` topbar, add button: `<button class="lang-btn" data-lang="fr" onclick="setLang('fr')">FR</button>`
3. Translate all UI strings (keep genre names and numbers)
4. See [docs/GUIDE.md](docs/GUIDE.md) for complete instructions

**Change Colors & Theme**

Edit `style.css` CSS variables:

- `:root { --color-bg: ...; --color-text: ...; }` for dark theme
- `html.light { --color-bg: ...; --color-text: ...; }` for light theme
- Detailed variable list provided in stylesheet comments

**Fix or Update Translations**

Edit `js/i18n.js` → Find language block → Update any key-value pair

---

### Export Formats

| Format | Use Case | Output |
|---|---|---|
| PDF | Print-ready setlist | Browser print dialog → save as PDF |
| HTML | Email to bandmates | Self-contained file (no internet needed) |
| Text | Quick copy-paste | Plain text for WhatsApp, email, chat |
| JSON | Data backup/archive | Raw JSON format for safe storage |
| Pool Export | Share song library | Entire database as JSON (import elsewhere) |

---

### AI Features (Optional)

Infrastructure for **AI-powered song suggestions** is present but **disabled by default** in the FOSS version.

**To Activate** (requires API key from service of choice):

1. Open `js/app.js` → Find & remove `return;` in `toggleAIPanel()` function
2. In `index.css`, change `.ai-panel { display: none }` to `display: flex`
3. Provide API key from:
   - [Anthropic Claude](https://console.anthropic.com)
   - [Google Gemini](https://aistudio.google.com/apikey)
   - [OpenAI GPT](https://platform.openai.com/api-keys)

**Security**: API keys stored **locally in your browser**—never sent to FMG servers

---

### Multi-Language Support (4 Languages)

**Español** 🇪🇸 ━ **English** 🇬🇧 ━ **Português** 🇧🇷 ━ **Русский** 🇷🇺

Complete translations for all UI elements, menus, and settings. Add more languages easily—see [docs/GUIDE.md](docs/GUIDE.md) for instructions.

---

### Responsive Design

| Device | Features |
|---|---|
| Desktop (1024px+) | Sidebar navigation, drag-drop reordering, full controls |
| Tablet (768–1024px) | Responsive sidebar, optimized touch controls |
| Mobile (<768px) | Bottom nav bar, slide-up drawer, fully touch-optimized |

**Seamless Experience** across all devices with optimized layouts

---

### Feature Verification Checklist

| Feature | Status |
|---|:---:|
| 335 curated songs | ✅ |
| 11 instruments + weights | ✅ |
| 24 genre categories | ✅ |
| Energy + Effort balancing | ✅ |
| Must-Play locking system | ✅ |
| Drag-to-reorder setlists | ✅ |
| Multi-format export (5 types) | ✅ |
| CSV import/export | ✅ |
| JSON backup/restore | ✅ |
| 4 complete languages | ✅ |
| Dark/Light theme toggle | ✅ |
| Fully responsive design | ✅ |
| localStorage persistence | ✅ |
| **Zero NPM dependencies** | ✅ |
| **100% offline capability** | ✅ |

---

### Troubleshooting

| Issue | Solution |
|---|---|
| **Data not saving** | Use `http://localhost:8080` (not `file://`); check localStorage enabled in browser |
| **Modal stuck/broken** | Reload page (F5); open console (F12) to check for JS errors |
| **Drag-drop not on mobile** | Use "Add/Remove" buttons instead (drag is desktop-only for safety) |
| **App layout broken** | Reset zoom: `Ctrl+0` (Windows) or `Cmd+0` (Mac) |
| **Missing/fewer songs** | Scroll down in Pool tab—table displays 50 per page |
| **Setlist too short** | Reduce event duration or enable more genres in filters |

---

### Performance

| Operation | Speed |
|---|:---:|
| App load | < 1 sec |
| Setlist generation | < 100ms |
| Drag-drop animation | 60fps |
| PDF export | < 2 sec |
| Pool search/filter | < 10ms |

**Lightning-fast** performance on all devices—no lag, no waiting

---

### Documentation

| Document | Purpose |
|---|---|
| [GUIDE.md](docs/GUIDE.md) | Step-by-step tutorial + complete feature guide |
| [QUICK_START.md](docs/QUICK_START.md) | 5-minute beginner's guide |
| [IMPROVEMENTS.md](docs/IMPROVEMENTS.md) | Feature roadmap + future enhancements |
| [CHANGELOG_V1.md](docs/CHANGELOG_V1.md) | Release notes + version history |
| [FMG_Setlist_Builder_Docs.md](docs/FMG_Setlist_Builder_Docs.md) | Technical reference + architecture |

---

### Privacy & Security

- **No backend server** — All processing in your browser
- **No user accounts** — Completely anonymous & free
- **No tracking** — Zero analytics, cookies, or data collection
- **API keys encrypted** — Stored locally, never sent to 3rd parties
- **Open source** — Code fully auditable on GitHub
- **100% offline** — Works without internet connection  

---

### Version History

#### v1.0 - Band Edition (Current)

**Content Expansion**

- 335 songs (↑ from 90) with full metadata
- 11 instruments (↑ from 4) with individual effort weights
- 24 genres (↑ from 11) spanning all musical styles

**Core Features**

- Energy + Effort balancing algorithm
- Must-Play song locking system
- Multi-format export (PDF, HTML, Text, JSON)
- Complete translation (ES/EN/PT/RU)
- Responsive design (mobile, tablet, desktop)

**Bugs Fixed**

- Fixed `_genreTimer` global scope conflict
- Removed duplicate CSS classes

**New Features**

- Added `aiSongCount` variable for AI suggestions
- Implemented `setAICount()` function with persistence
- localStorage auto-recovery for corrupted data

---

### Getting Started in 5 Steps

1. **Open App** → <http://localhost:8080> (or double-click `index.html`)
2. **Generate** → Create first setlist in 60 seconds
3. **Customize** → Add your band's songs to pool
4. **Share** → Export to PDF and send to bandmates
5. **Save** → Store favorited setlists in Shows tab

[Full Tutorial → docs/QUICK_START.md](docs/QUICK_START.md)

---

### Contributing & Roadmap

**Want to Contribute?**

- Fork this repo or edit files directly
- Test thoroughly before pushing changes
- Update documentation if you add features
- Follow existing code style (ES6+, vanilla JS)

**Planned Enhancements** (See [docs/IMPROVEMENTS.md](docs/IMPROVEMENTS.md) for details)

- Undo/Redo system for edits
- Advanced search (BPM ranges, multiple filters)
- Cloud sync (Firebase/Supabase)
- Real-time band collaboration
- Spotify API integration for BPM lookup
- Analytics dashboard (local)
- Vocal range filtering for singers

---

### License & Attribution

**Open Source · Free to Use · Fully Modifiable**

Built for musicians, by musicians

---

#### Built By

**Fearlessly Media Group**  
*Creating music tools for live performers worldwide*

---

**Questions? Ideas? Bug reports?**  
Open an issue or contact us directly.

**Made with care for musicians**
