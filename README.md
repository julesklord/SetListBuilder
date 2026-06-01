<table border="0">
  <tr>
    <td valign="top">
      <h1>SetManager</h1>
      <p><strong>Setlist generator for live musicians</strong><br/>
      <em>Coordinates energy levels and physical effort for stage performances.</em></p>
      <p>
        <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="License MIT"></a>
        <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version">
        <img src="https://img.shields.io/badge/status-production%20ready-success" alt="Status">
        <img src="https://img.shields.io/badge/javascript-vanilla-yellow" alt="JS">
      </p>
    </td>
  </tr>
</table>

---

## Features

- **Database**: 336 curated songs across 24 genres with verified BPM and musical keys.
- **Optimization**: Energy curve adjustment and physical effort balancing.
- **Offline Access**: PWA support with `localStorage` persistence.
- **Localization**: Supports English, Spanish, Portuguese, and Russian.

---

## Documentation

The **[Wiki](docs/wiki/INDEX.md)** provides technical details and guides.

*   **[Technical Architecture](docs/wiki/FMG_Setlist_Builder_Docs.md)**
*   **[User Guide](docs/wiki/GUIDE.md)**
*   **[Deployment Guide](docs/wiki/DEPLOYMENT.md)**
*   **[Agent SOP](docs/AGENT.md)**

---

## Installation and Execution

### Online Access
[**Launch App**](https://julesklord.github.io/SetListBuilder)

### Local Development

```bash
git clone https://github.com/julesklord/SetListBuilder.git
cd SetListBuilder
python -m http.server 8000
```
Open **http://localhost:8000**.

### Project Structure

- `src/`: Source code, styles, and logic.
- `docs/`: Onboarding and user guides.
- `tests/`: Manual and automated validation procedures.

---

## Algorithm Logic

### Song Eligibility
1. Prioritizes songs matching both instruments and genres.
2. Falls back to genre matches.
3. Uses the full pool as a last resort.

### Energy Mapping
Sets follow a structured engagement arc:
- Early Sets: LOW (35%) → MID (40%) → HIGH (25%)
- Final Set: LOW (20%) → MID (40%) → HIGH (40%)

### Effort Balancing
The algorithm evens physical exertion across sets to manage fatigue. It reorders songs only when it improves balance without disrupting the energy curve.

---

## Song Library

The library contains 335 songs with metadata including artist, genre, key, BPM, energy level, and instrument requirements.

**Genre Distribution:**
- Classic/Blues: 99
- Rock: 93
- Pop/Dance: 75
- World Music: 38
- Other: 30

---

## Persistence

Data remains in `localStorage`:
- Song library (`fmg-pool`)
- Saved setlists (`fmg-nights`)
- Locked songs (`fmg-mustPlay`)
- Active instruments (`fmg-instrs`)

The application requires no backend or cloud accounts.

---

## Export Formats

- **PDF**: Print-ready setlists.
- **HTML**: Self-contained file for distribution.
- **Text**: Plain text for messaging apps.
- **JSON**: Data backup and archive.

---

## License

MIT License.

---
*Developed by Fearlessly Media Group.*
