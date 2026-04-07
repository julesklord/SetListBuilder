🎯 **What:** Added HTML escaping for previously unescaped fields (`bpm`, `effort`, `gClass`) in `renderExport`, `doExportHTML`, `doExportPDF`, `renderPool`, and `renderSets`.
⚠️ **Risk:** A malicious user could inject arbitrary HTML/JavaScript into the DOM or exported files by importing a crafted JSON file containing an XSS payload in these fields.
🛡️ **Solution:** Used the existing `esc(str)` function to safely encode these values before they are concatenated into HTML strings.
