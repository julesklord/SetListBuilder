# 🧪 SetManager Testing Guide

## Quick Start (5 minutos)

### 1. Abrir la App
```
Navega a: http://localhost:8000/index.html
(O abre index.html directamente en el navegador)
```

### 2. Abrir DevTools
```
Windows/Linux: F12 o Ctrl+Shift+I
Mac: Cmd+Option+I
```

### 3. Ir a la pestaña "Console"
```
Verás: "FMG Setlist Builder" en la consola si todo cargó bien
```

### 4. Ejecutar Validación Automática
```javascript
// Copia y pega en la consola:
fetch('validation-script.js')
  .then(r => r.text())
  .then(code => eval(code));
```

---

## Tests Manuales (10-15 minutos)

### Test A: Generación de Setlist

**Objetivo:** Verificar que el algoritmo genera setlists balanseados

1. **Setup:**
   - Abre la app en navegador
   - Asegúrate que "Instruments tonight" tenga: El. Guitar, Bass, Drums, Lead Vox (chips azules)
   - Sets: 3 (por defecto)
   - Duration: ~45 min

2. **Ejecutar:**
   - Click en botón **"Generate Setlist"** en la barra lateral

3. **Verificar Consola:**
   - Abre DevTools (F12)
   - Ve a pestaña **"Console"**
   - Deberías ver líneas como:
     ```
     Effort balanced at iteration 3, variance: 12.5%
     Effort balancing stable at iteration 5
     ```

4. **Verificar Interfaz:**
   - Se generaron 3 sets ✅
   - Cada set tiene múltiples canciones ✅
   - Las canciones tienen iconos de energía (barras verdes/naranjas) ✅

**Resultado esperado:** 
- ✅ No hay errores en la consola
- ✅ Los logs muestran convergencia del algoritmo
- ✅ Distribución visual equilibrada de canciones

---

### Test B: Memoria y Drag-Drop

**Objetivo:** Verificar que no hay memory leaks al arrastrar canciones

1. **Setup:**
   - Genera un setlist (Test A)
   - Abre DevTools → pestaña **"Performance"**

2. **Ejecutar:**
   - Arrastra la **misma canción 5-10 veces** dentro de su set
   - Observa el monitor de Performance

3. **Verificar:**
   - Las acciones de drag son **suave/fluidas** ✅
   - **No hay ralentizaciones** progresivas ✅
   - La memoria se mantiene **estable** (gráfica no sube constantemente) ✅

4. **Opcional - Verificación Profunda:**
   ```javascript
   // En consola:
   document.getElementById('sets-area').getEventListeners?.()
   // Debería mostrar SOLO 5 listeners (dragstart, dragend, dragover, dragleave, drop)
   // NO múltiples listeners (eso indicaría memory leak)
   ```

**Resultado esperado:**
- ✅ Drag interactions son smooth
- ✅ Sin ralentizaciones o parones
- ✅ Memoria estable

---

### Test C: Modal de Notas

**Objetivo:** Verificar que el modal no guarda datos obsoletos

1. **Setup:**
   - Genera un setlist
   - Abre DevTools → Console

2. **Ejecutar:**
   - Click en botón **"+ note"** de cualquier canción en Set 1
   - Escribe una nota: `"Test Note 1"`
   - Click **"Save"** (o presiona Enter)
   - Cierra el modal
   - Click en botón **"+ note"** de una DIFERENTE canción en Set 2
   - Verifica si el campo contiene la nota anterior

3. **Verificar:**
   ```javascript
   // En consola, ejecuta:
   const modal = document.getElementById('note-modal');
   console.log('setIndex:', modal.dataset.setIndex);
   console.log('songId:', modal.dataset.songId);
   console.log('Note value:', document.getElementById('m-note').value);
   ```

4. **Resultado esperado:**
   - ✅ El campo de nota está **vacío** cuando abres el modal de otra canción
   - ✅ No ve la nota anterior (`"Test Note 1"`)
   - ✅ El dataset contiene los valores correctos

---

### Test D: Búsqueda en Pool (Debouncing)

**Objetivo:** Verificar que la búsqueda no renderiza en exceso

1. **Setup:**
   - Navega a pestaña **"Pool"** (arriba a la derecha)
   - Abre DevTools → Console

2. **Ejecutar:**
   ```javascript
   // Reemplaza renderPool para contar llamadas:
   const originalRender = renderPool;
   let callCount = 0;
   window.renderPool = function() {
     callCount++;
     console.log(`renderPool called (${callCount}x)`);
     return originalRender.apply(this, arguments);
   };
   ```

3. **Ahora tipo rápido en la caja de búsqueda:**
   - Escribe: `"rock blues metal guitar"`
   - Mira la consola

4. **Verificar:**
   - ❌ **INCORRECTO:** renderPool called (20x) - una por cada carácter
   - ✅ **CORRECTO:** renderPool called (2-4x) - agrupadas por debounce
   - Debería haber un delay de ~200ms entre llamadas

**Resultado esperado:**
- ✅ Búsqueda es smooth (sin lag por cada keystroke)
- ✅ Llamadas a renderPool agrupadas (debounce trabajando)
- ✅ callCount es bajo (no por cada carácter)

---

### Test E: Carga de Data Corrupta

**Objetivo:** Verificar que la app recovers de datos inválidos sin crashes

1. **Setup:**
   - Abre DevTools → Application/Storage → localStorage

2. **Simular Corrupción:**
   ```javascript
   // En consola:
   localStorage.setItem('fmg-pool', 'corrupted data {]');
   // O simplemente edita el valor en DevTools
   ```

3. **Ejecutar:**
   - Recarga la página (`F5`)

4. **Verificar:**
   - ✅ La app carga normalmente (no crash blanco)
   - ✅ La consola muestra advertencia:
     ```
     Pool load error, using DEFAULTS: SyntaxError: ...
     ```
   - ✅ Se usan las 335+ canciones DEFAULTS
   - ✅ La funcionalidad completa sigue operando

**Resultado esperado:**
- ✅ No hay crash o "white screen"
- ✅ Warning message en consola
- ✅ App con datos válidos por defecto
- ✅ Usuario puede seguir usando la app

---

### Test F: Límite de Almacenamiento

**Objetivo:** Verificar que se handled correctamente el quota exceeded

1. **Setup:**
   - Crea **30-40 setlists nuevos** (click "Save show" 30-40 veces)
   - Vigila localStorage size en DevTools

2. **Ejecutar:**
   - Continúa creando shows nuevos hasta que veas el warning

3. **Verificar Consola:**
   - Debería ver mensaje:
     ```
     localStorage near quota: ~4100KB / 5MB
     ```
   - O cuando se alcanza:
     ```
     Storage quota exceeded. Clearing old shows...
     ```

4. **Verificar Interfaz:**
   - ✅ Aparece toast: `"Storage near limit..."`
   - ✅ Se limpian automáticamente shows antiguos
   - ✅ Nuevos shows se guardan exitosamente

**Resultado esperado:**
- ✅ Warnings proactivos antes de alcanzar límite
- ✅ Auto-cleanup de shows antiguos
- ✅ No hay data loss (guarda lo más importante)

---

### Test G: IDs Duplicados (Despacito)

**Objetivo:** Verificar que no hay colisión de IDs

1. **Setup:**
   - Abre DevTools → Console

2. **Ejecutar:**
   ```javascript
   const despacitos = pool.filter(s => s.title.includes('Despacito'));
   console.table(despacitos);
   ```

3. **Verificar:**
   - ✅ Se muestran **2 filas**
   - ✅ Primera: ID 292, "Despacito" (Pop Latino)
   - ✅ Segunda: ID 336, "Despacito (Reggaetón Version)" (Reggaetón)
   - ✅ IDs son **diferentes**

**Resultado esperado:**
- ✅ Dos Despacito distintos con IDs únicos
- ✅ No hay "find by ID" conflictos

---

## 📋 Checklist de Verificación

Marca cada item:

### Fixes de Integridad
- [ ] Double comma arreglado (syntax valid)
- [ ] Duplicate Despacito IDs corregido
- [ ] Song schema validation funciona
- [ ] nextId es seguro (sin colisiones)

### Fixes de Persistencia
- [ ] checkStorageQuota() detecta límite
- [ ] persist() maneja quota exceeded
- [ ] loadNight() valida references
- [ ] Data corruption recovery funciona

### Fixes de Algoritmo
- [ ] noConsecKey() optimiza energía
- [ ] Effort balancing converge (10 iteraciones)
- [ ] Console logs muestran progreso

### Fixes de UI
- [ ] Drag-drop memory leak fijo
- [ ] Modal state no corrupto
- [ ] Pool search debounce funciona

---

## 🚨 Problemas Comunes y Soluciones

### Problema: "ReferenceError: pool is not defined"
**Solución:** Asegúrate que `songs.js` se carga ANTES de `app.js` (check en index.html `<script>`)

### Problema: "localStorage.setItem throws error"
**Solución:** Algunos navegadores no permiten localStorage en file:// URLs. Usa servidor local (http://localhost:8000)

### Problema: Modal muestra nota de canción anterior
**Solución:** Recarga la página (Ctrl+F5). Si persiste, hay que revisar `closeNoteModal()` en app.js

### Problema: Drag-drop es lento después de genera varias veces
**Solución:** Verifica que `attachDrag()` use event delegation, no múltiples listeners

### Problema: Consola no muestra "Effort balanced..." logs
**Solución:** Verifica que la función `generate()` se completó sin errores. Si hay error, ve a línea 368+

---

## ✅ Passing All Tests

Si pasas todos estos tests, estás listo para:
- ✅ Production deployment
- ✅ Beta testing con usuarios
- ✅ Commit a rama main (git)
- ✅ Release notes v2.0

---

**Última actualización:** 24 de Marzo 2026  
**Tester:** GitHub Copilot  
**Status:** 🟢 READY FOR TESTING
