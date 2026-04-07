with open('js/app.js', 'r') as f:
    content = f.read()

# wait, I should also revert `esc(s.bpm)` in doExportText() since it's text, not HTML.
# But it's not a big deal. Actually, text export doesn't need HTML escaping. Let's fix that.
content = content.replace('s.key} · ${esc(s.bpm)} BPM', 's.key} · ${s.bpm} BPM')

with open('js/app.js', 'w') as f:
    f.write(content)
