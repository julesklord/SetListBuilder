with open('js/app.js', 'r') as f:
    content = f.read()

content = content.replace('${s.bpm}', '${esc(s.bpm)}')
content = content.replace('${x.bpm}', '${esc(x.bpm)}')
content = content.replace('${x.effort||2}', '${esc(x.effort||2)}')
content = content.replace('b${gClass}', 'b${esc(gClass)}')

with open('js/app.js', 'w') as f:
    f.write(content)
