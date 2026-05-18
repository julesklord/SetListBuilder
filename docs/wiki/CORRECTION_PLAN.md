# CORRECTION PLAN - SetManager

Este documento contiene los fixes exactos para cada issue identificado.

---

## FIX #1: Remove Duplicate HTML Tags
**File**: index.html  
**Lines**: 12-14  
**Action**: Delete las líneas duplicadas

### BEFORE (Líneas 9-15):
```html
<link rel="stylesheet" href="style.css">
</head>
<body>
</head>      <!-- ← DELETE THIS LINE -->
<body>       <!-- ← DELETE THIS LINE -->
</head>      <!-- ← DELETE THIS LINE -->
<body>
```

### AFTER (Líneas 9-11):
```html
<link rel="stylesheet" href="style.css">
</head>
<body>
```

---

## FIX #2: Remove Duplicate Modal
**File**: index.html  
**Lines**: 276-315  
**Action**: Delete la segunda copia del modal song-modal

### BEFORE (Línea 276):
```html
<!-- Song modal -->
<div class="overlay" id="song-modal">    <!-- ← THIS IS A DUPLICATE, DELETE IT -->
  <div class="modal">
    <div class="modal-title" id="modal-title">New song</div>
    <!-- ... all form fields ... -->
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal()">Cancel</button>
      <button class="btn-save" onclick="saveSong()">Save</button>
    </div>
  </div>
</div>                                   <!-- ← DELETE EVERYTHING ABOVE INCLUDING THIS -->
<div class="toast" id="toast"></div>
```

**Keep**: Primera versión del modal (líneas 240-275)  
**Delete**: Segunda versión (líneas 276-315)

---

## FIX #3: Initialize mustPlay Variable
**File**: js/songs.js  
**Location**: Después de las otras inicializaciones de variables
**Action**: Agregar línea de inicialización

### FIND (alrededor de línea 10-15):
```javascript
let pool = JSON.parse(localStorage.getItem('fmg-pool')) || DEFAULTS;
let nights = JSON.parse(localStorage.getItem('fmg-nights')) || [];
let sets = [];
let numSets = 3;
let instrs = ['g'];
```

### ADD AFTER (nuevas líneas):
```javascript
let mustPlay = new Set(JSON.parse(localStorage.getItem('fmg-mustPlay') || '[]'));
```

### RESULT:
```javascript
let pool = JSON.parse(localStorage.getItem('fmg-pool')) || DEFAULTS;
let nights = JSON.parse(localStorage.getItem('fmg-nights')) || [];
let sets = [];
let numSets = 3;
let instrs = ['g'];
let mustPlay = new Set(JSON.parse(localStorage.getItem('fmg-mustPlay') || '[]'));  // ← NEW
```

**Benefit**: Inicializa mustPlay AND restaura el estado guardado

---

## FIX #4: Add mustPlay Persistence
**File**: js/app.js  
**Function**: persist()  
**Location**: Línea 17-20  
**Action**: Agregar línea para guardar mustPlay

### BEFORE:
```javascript
function persist() {
  localStorage.setItem('fmg-pool', JSON.stringify(pool));
  localStorage.setItem('fmg-nights', JSON.stringify(nights));
}
```

### AFTER:
```javascript
function persist() {
  localStorage.setItem('fmg-pool', JSON.stringify(pool));
  localStorage.setItem('fmg-nights', JSON.stringify(nights));
  localStorage.setItem('fmg-mustPlay', JSON.stringify([...mustPlay]));
}
```

**Note**: Convierte Set a Array con `[...mustPlay]` para JSON serialización

---

## FIX #5: Safe Song Save (Array Safety)
**File**: js/app.js  
**Function**: saveSong()  
**Location**: Línea ~430  
**Action**: Validar findIndex antes de asignar

### BEFORE:
```javascript
pool[pool.findIndex(x=>x.id===editId)]=s;
```

### AFTER (reemplazar línea completa):
```javascript
const idx = pool.findIndex(x=>x.id===editId);
if(idx >= 0) pool[idx]=s;
else pool.push(s);
```

**Explanation**: Si findIndex retorna -1, push nuevo en lugar de asignar a pool[-1]

---

## FIX #6: Complete Voice Chip Mapping
**File**: js/app.js  
**Function**: loadNight()  
**Location**: Línea ~247  
**Action**: Agregar 'o':'voice' al map

### BEFORE:
```javascript
const map={'g':'guitar','p':'piano','v':'wind'};
```

### AFTER:
```javascript
const map={'g':'guitar','p':'piano','v':'wind','o':'voice'};
```

**Impact**: Voice chip ahora se actualiza correctamente al cargar una noche

---

## FIX #7: Prevent HTML Escaping Issues in Notes
**File**: js/app.js  
**Function**: Donde se asigna m-notes  
**Location**: Línea ~285  
**Action**: Usar .value property directamente

### BEFORE (potencial XSS):
```javascript
document.getElementById('m-notes').value = `"${note.replace(/"/g,'&quot;')}"`;
```

### AFTER (seguro):
```javascript
const notesInput = document.getElementById('m-notes');
notesInput.value = note || '';
```

**Why**: El .value property automáticamente escapa HTML, no necesita manipulación manual

---

## FIX #8: Add localStorage Error Handling
**File**: js/songs.js  
**Location**: Línea ~1-18 (todas las inicializaciones localStorage)  
**Action**: Wrap in try-catch

### BEFORE:
```javascript
let pool = JSON.parse(localStorage.getItem('fmg-pool')) || DEFAULTS;
let nights = JSON.parse(localStorage.getItem('fmg-nights')) || [];
```

### AFTER:
```javascript
let pool, nights;
try {
  pool = JSON.parse(localStorage.getItem('fmg-pool')) || DEFAULTS;
  nights = JSON.parse(localStorage.getItem('fmg-nights')) || [];
} catch(e) {
  console.warn('localStorage read error:', e);
  pool = DEFAULTS;
  nights = [];
}
```

**Benefit**: Maneja casos donde localStorage está deshabilitado o lleno

---

## FIX #9: Also restore voice state properly
**File**: js/app.js  
**Function**: loadNight()  
**Location**: Línea ~240-250  
**Action**: Asegurar 'o' se mapea correctamente

Cuando instrs array contiene 'o', debe aplicarse a chip-voice:

### Current Code Context (verify exists):
```javascript
savingInstruments.forEach(i=>{
  document.querySelectorAll(`.chip-${map[i]}`).forEach(c=>c.classList.add('active'));
});
```

**Note**: Con FIX #6, la línea `.chip-${map[i]}` ahora soporta 'o' → 'voice'

---

## FIX #10: Add Basic API Key Validation
**File**: js/app.js  
**Function**: updateApiKey()  
**Location**: Línea ~50-60  
**Action**: Mejorar validación

### BEFORE:
```javascript
function updateApiKey() {
  const key = document.getElementById('api-key-input').value;
  if(!key){toast('Needs API Key'); return;}
  apiKeys[apiProvider] = key;
  localStorage.setItem('fmg-api-keys', JSON.stringify(apiKeys));
  initApiBar();
}
```

### AFTER:
```javascript
function updateApiKey() {
  const key = document.getElementById('api-key-input').value.trim();
  if(!key){toast('API key required'); return;}
  if(key.length < 10){toast('API key seems too short'); return;}
  apiKeys[apiProvider] = key;
  localStorage.setItem('fmg-api-keys', JSON.stringify(apiKeys));
  initApiBar();
  toast('API key saved for '+apiProvider);
}
```

**Improvements**: 
- `.trim()` elimina espacios
- Validation mínima de longitud
- Feedback al usuario

---

## TESTING CHECKLIST

After applying all fixes:

- [ ] HTML valida (usar validator.w3.org)
- [ ] No console errors al abrir página
- [ ] Click "Must Play" button → funciona sin error
- [ ] Marcar canción como Must Play → persiste después de reload
- [ ] Crear set con Voice instrument → se guarda/carga correctamente
- [ ] Añadir nueva canción con título especial → se guarda sin corrupción
- [ ] Cambiar idioma en mobile → drawer se actualiza
- [ ] Desactivar localStorage en DevTools → app cae a DEFAULTS sin crash
- [ ] Verificar Inspector: solo una tabla, sin duplicados de id

---

## APPLY FIXES IN THIS ORDER

1️⃣ **HTML fixes first** (FIX #1, #2)
   - Requiere mínimo testing

2️⃣ **Critical variable fixes** (FIX #3, #4)
   - Habilita must-play feature

3️⃣ **Data safety** (FIX #5, #6)
   - Previene data corruption

4️⃣ **Security & robustness** (FIX #7, #8, #9, #10)
   - Mejora confiabilidad general

---

**Total estimated time**: 15-20 minutos para todo
**Risk level**: BAJO (todos son cambios seguros y directos)
**Testing time**: 5 minutos
