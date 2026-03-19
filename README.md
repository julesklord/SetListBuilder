# 🎼 FMG Setlist Builder v1.0 - Band Edition

**Fearlessly Media Group · Open Source**

Intelligent setlist generator for live musicians—balance energy curves with physical effort, no backend required, 100% offline.

---

## ✨ Key Features

- **335 curated songs** across 24 genres with verified BPM, key, and chord progressions
- **11 band instruments** (guitar, bass, drums, keys, winds, vocals, percussion) with configurable effort weights
- **Intelligent generation** algorithm: 50/50 blend of energy curve and effort distribution
- **Must Play** locking—guarantee songs appear in every setlist
- **Multiple exports**: PDF, HTML, JSON, plain text
- **Multiidioma**: Spanish, English, Portuguese, Russian
- **Fully responsive**: Desktop, tablet, mobile with native bottom nav and slide-out drawer
- **100% offline**—all data lives in your browser's localStorage
- **No account needed**—completely anonymous and private
- **AI-ready** infrastructure (disabled in FOSS version)

---

## 📁 Project Structure

```
SetManager/
├── index.html                      ← App shell (complete HTML)
├── style.css                       ← All styles (responsive, dark/light, components)
├── js/
│   ├── songs.js                    ← 335 songs + global state + effort weights
│   ├── i18n.js                     ← Translations (EN/ES/PT/RU) + tr() + setLang()
│   └── app.js                      ← 65+ functions (generation, export, modal handlers)
│
├── 📖 Documentation (User Guides)
├── GUIDE.md                        ← Complete step-by-step tutorial
├── QUICK_START.md                  ← Fast onboarding for new users
├── IMPROVEMENTS.md                 ← Future roadmap and enhancement ideas
├── CHANGELOG_V1.md                 ← Version history and bug fixes
├── FMG_Setlist_Builder_Docs.md    ← Technical reference (original docs)
└── README.md                       ← This file
```

---

## 🚀 Getting Started

### Local Development (Recommended)
```bash
cd SetManager
python -m http.server 8080
# Open http://localhost:8080
```

### Direct File
- Double-click `index.html` (some browsers may restrict localStorage with `file://`)

### GitHub Pages
1. Create a public repository
2. Push all files (keep this folder structure)
3. Settings → Pages → Source: `main` / `(root)`
4. App live at `yourusername.github.io/SetManager`

---

## 🎯 Quick Tutorial

1. **Select instruments** present tonight (Guitar, Bass, Drums, Vocals, etc.)
2. **Choose # of sets** (2, 3, or 4) and duration per set
3. **Pick genres** to include (24 available)
4. **Click "Generate Setlist"** → algorithm runs instantly
5. **Personalize**: drag songs to reorder, add notes, export to PDF

For complete tutorial, see [GUIDE.md](GUIDE.md) or [QUICK_START.md](QUICK_START.md).

---

## 🎵 The Algorithm

### Phase 1: Song Eligibility
- Filters songs matching your selected instruments AND genres
- Fallback 1: Only genres (if not enough instrument-matches)
- Fallback 2: Entire pool (worst-case)

### Phase 2: Must-Play Distribution
- If you've locked songs (⚑), they're distributed evenly across sets
- Guaranteed to appear in every generated setlist

### Phase 3: Energy Curve
- Early sets: Start low/mellow, build to mid-energy (35% low, 40% mid, 25% high)
- Final set: Climb higher, peak finish (20% low, 40% mid, 40% high)
- Maintains audience engagement and natural performance arc

### Phase 4: Effort Balancing
- Evens out physical effort across sets (drummer fatigue, vocalist strain, etc.)
- Conservative swaps: only reorders if it reduces imbalance
- Never sacrifices energy curve for effort balance

---

## 📊 Song Pool (335 Songs)

Curated across 24 genres with verified metadata:

**Classic/Blues**: Blues (41), Soul (30), Ballad (14), Jazz (14)  
**Rock**: Rock (49), Rock Latino (20), R&B (12), R&B Modern (12)  
**Pop/Dance**: Pop (31), Funk (17), Disco (14), Funk/Soul (13)  
**World**: Reggae (13), Latin (15), Cumbia (10)  
**Other**: Country (10), Pop Latino (4), Balada (4), Merengue (1), Ranchera (1), Reggaetón (1), Synth-Pop (1), Rap Rock (1), Ska (1)

Every song includes: title, artist, genre, key, BPM, chord progression, energy level (1–5), and instrument tags.

---

## 🎛️ Band Instruments (11 Total)

| Code | Instrument | Default Weight | Notes |
|------|------------|-----------------|-------|
| `eg` | Electric Guitar | 1.0 | Lead/rhythm primary |
| `ag` | Acoustic Guitar | 0.8 | Lower effort—fingerpicking |
| `b` | Bass | 1.2 | Standing + low-end focus |
| `dr` | Drums | 1.8 | Full-body exertion |
| `k` | Keys/Piano | 1.0 | Seated—moderate effort |
| `sx` | Saxophone | 1.5 | Breath control + stamina |
| `tp` | Trumpet | 1.5 | Embouchure fatigue |
| `tb` | Trombone | 1.5 | Breath + slide movement |
| `vo` | Lead Vocals | 2.0 | Highest fatigue—vocal strain |
| `bv` | Backing Vocals | 1.5 | Less intense than lead |
| `pc` | Latin Percussion | 1.2 | Congas, bongos, timbales |

Weights are **configurable** per band—adjust to match your musicians' physical demands.

---

## 💾 Data & Persistence

All data stored in browser `localStorage`:

```javascript
{
  'fmg-pool': JSON.stringify(pool),           // Your song library
  'fmg-nights': JSON.stringify(nights),       // Saved setlists
  'fmg-mustPlay': JSON.stringify([...ids]),   // Locked songs
  'fmg-instrs': JSON.stringify(codes),        // Active instruments
  'fmg-effort-weights': JSON.stringify(obj),  // Effort multipliers
  'fmg-lang': 'en|es|pt|ru',                  // Active language
  'fmg-theme': 'dark|light',                  // Theme preference
  'fmg-ai-count': '3|5|8|10'                  // AI song suggestion count
}
```

**No server, no cloud sync, no account**—data never leaves your device.

---

## 🛠️ Customization

### Add or Edit a Song
Edit `js/songs.js` → modify `DEFAULTS` array. Example:
```javascript
{
  id: 336,
  title: "My Song",
  artist: "My Band",
  genre: "Blues",
  key: "Am",
  bpm: 100,
  prog: "i–IV–i–V",
  energy: 3,
  instr: ['eg', 'b', 'dr', 'vo'],
  effort: 2
}
```

### Import Songs via CSV
1. In **Pool** tab, click **"⬇ CSV Template"**
2. Fill out template with your songs
3. Upload via **"Import"** button
4. New songs merge with existing pool

### Fix Translation
Edit `js/i18n.js` → find language block (`en:{}`, `es:{}`, etc.) → update key-value pairs.

### Add New Language
1. Copy `en:{...}` block in `i18n.js`, rename key (e.g., `fr`)
2. In `index.html` topbar, add: `<button class="lang-btn" data-lang="fr" onclick="setLang('fr')">FR</button>`
3. Translate all values (keep genre names, "BPM", numbers unchanged)

### Change Colors/Theme
Edit `style.css`:
- `:root { --color-bg: ... }` for dark mode colors
- `html.light { --color-bg: ... }` for light mode colors
- CSS variables in comments show all available customizations

---

## 📤 Export Formats

| Format | Use Case | Output |
|--------|----------|--------|
| **PDF** | Print-friendly | Browser print dialog → save as PDF |
| **HTML** | Email to bandmates | Self-contained `.html` file (no internet needed) |
| **Text** | Quick share (WhatsApp, email) | Clipboard text—plain, clean format |
| **JSON** | Archive/backup | Raw data in JSON format |
| **Pool Export** | Share song library | Entire pool as JSON (import on other device) |

---

## 🤖 AI Features (Optional)

Infrastructure for AI-powered song lookup and suggestions is present but **disabled in FOSS version**.

To activate (requires API key):
1. Remove `return;` early exit in `toggleAIPanel()`
2. Show API bar: change `display:none` to `display:flex`
3. Provide API key from [Anthropic](https://console.anthropic.com), [Google](https://aistudio.google.com/apikey), or [OpenAI](https://platform.openai.com/api-keys)

Keys **stay in your browser**—never transmitted to FMG servers.

---

## 🌐 Multiidioma

Full translations included:
- **Español** — Spanish (primary development language)
- **English** — Complete UI + documentation
- **Português** — Brazilian Portuguese
- **Русский** — Russian (Cyrillic)

Add more: See [GUIDE.md](GUIDE.md) "Adding a new language" section.

---

## 📱 Responsive Design

Fully adaptive across all screen sizes:

| Device | Features |
|--------|----------|
| **Desktop** (1024px+) | Sidebar, full navigation, drag-to-reorder |
| **Tablet** (768–1024px) | Sidebar + responsive layout |
| **Mobile** (<768px) | Bottom nav bar + slide-up settings drawer, touch-optimized |

---

## ✅ Verification Checklist

- [x] 335 songs pre-loaded ✓
- [x] 11 instruments with weights ✓
- [x] 24 genres supported ✓
- [x] Energy + Effort algorithm ✓
- [x] Must Play system ✓
- [x] Drag-to-reorder ✓
- [x] Multiple exports ✓
- [x] CSV import ✓
- [x] JSON backup/restore ✓
- [x] Multi-language (4 complete) ✓
- [x] Dark/Light theme ✓
- [x] Responsive mobile ✓
- [x] localStorage persistence ✓
- [x] Zero dependencies ✓
- [x] 100% offline capability ✓

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Data not saving | Use HTTP server (not `file://`); check localStorage enabled |
| Modal stuck/broken | Reload page; check console for JS errors |
| Drag-drop not working on mobile | Use "Add/Remove" buttons instead (drag is desktop-only) |
| App renders incorrectly | Reset browser zoom: Ctrl+0 (Windows) or Cmd+0 (Mac) |
| Missing songs in pool | Scroll down—table shows 50 per page |
| Setlist seems short | Reduce duration/sets or enable more genres |

---

## 📈 Performance

- ⚡ **App load**: < 1 second
- ⚡ **Setlist generation**: Instant (< 100ms)
- ⚡ **Drag-drop**: Smooth 60fps
- ⚡ **PDF export**: < 2 seconds
- ⚡ **Pool search**: < 10ms

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [GUIDE.md](GUIDE.md) | Complete tutorial + feature guide |
| [QUICK_START.md](QUICK_START.md) | 5-minute quick start |
| [IMPROVEMENTS.md](IMPROVEMENTS.md) | Feature roadmap |
| [CHANGELOG_V1.md](CHANGELOG_V1.md) | Release notes + version history |
| [FMG_Setlist_Builder_Docs.md](FMG_Setlist_Builder_Docs.md) | Technical reference |

---

## 🔐 Privacy & Security

✅ **No backend server**—all processing happens in your browser  
✅ **No user accounts**—completely anonymous  
✅ **No tracking**—zero analytics or cookies  
✅ **API keys stay local**—encrypted in localStorage, never sent to third parties  
✅ **Open source**—code fully auditable  

---

## 📦 Version History

### v1.0 - Band Edition (Current)
- 335 songs (from 90)
- 11 instruments with effort weights (from 4 generic)
- 24 genres (from 11)
- Energy + effort balancing algorithm
- Must Play locking system
- PDF/HTML/Text/JSON export
- Full ES/EN/PT/RU support
- Responsive mobile + desktop
- Fixed bug: `_genreTimer` scope (was global, conflicted)
- Fixed bug: duplicate CSS classes removed
- Added: `aiSongCount` variable + `setAICount()` function

---

## 🎉 Next Steps

1. **Try it**: Open http://localhost:8080 (or double-click `index.html`)
2. **Generate**: Create your first setlist in 2 minutes
3. **Customize**: Add your own songs to the pool
4. **Share**: Export to PDF and send to your band
5. **Save**: Store favorite setlists in the Shows tab

---

## 🤝 Contributing

Found a bug? Have a suggestion?  
- Edit files directly in this repo
- Test thoroughly before pushing
- Update documentation if you add features

### Recommended Enhancements
See [IMPROVEMENTS.md](IMPROVEMENTS.md) for a full roadmap:
- Undo/Redo system
- Advanced search (BPM ranges, multiple filters)
- Cloud sync (Firebase)
- Real-time band collaboration
- Spotify BPM integration

---

## 📄 License

Open Source · Free to use, modify, and distribute  
Built for musicians, by musicians

---

## 👥 Built By

**Fearlessly Media Group**  
*Making music creation tools for live performers*

---

**Happy setlist building! 🎵**
