# FMG Setlist Builder — Documentación Técnica
**Fearlessly Media Group · v1.0 Band Edition · FOSS**

> Herramienta de gestión de setlists para bandas en vivo. Pool de 335 canciones · 24 géneros · 11 instrumentos · Algoritmo de balanceo energía/esfuerzo · Importación CSV · Exportación PDF · Sin cuenta, sin backend, 100% local.

---

## Tabla de contenidos

1. [Resumen](#1-resumen)
2. [Estructura del proyecto](#2-estructura-del-proyecto)
3. [Pool de canciones (songs.js)](#3-pool-de-canciones-songsjs)
4. [Sistema de instrumentos](#4-sistema-de-instrumentos)
5. [Algoritmo de generación](#5-algoritmo-de-generación)
6. [Navegación y vistas](#6-navegación-y-vistas)
7. [Funcionalidades](#7-funcionalidades)
8. [Internacionalización (i18n.js)](#8-internacionalización-i18njs)
9. [localStorage — Claves de persistencia](#9-localstorage--claves-de-persistencia)
10. [IA (desactivada en versión FOSS)](#10-ia-desactivada-en-versión-foss)
11. [Referencia de funciones (app.js)](#11-referencia-de-funciones-appjs)
12. [Despliegue](#12-despliegue)
13. [Limitaciones conocidas y roadmap](#13-limitaciones-conocidas-y-roadmap)
14. [Changelog](#14-changelog)

---

## 1. Resumen

FMG Setlist Builder es una aplicación web estática sin dependencias de servidor, diseñada para bandas de covers multi-género. Genera setlists optimizados combinando curva de energía musical y distribución de esfuerzo físico entre sets.

Todos los datos se almacenan en el `localStorage` del navegador — sin cuenta, sin backend, sin suscripciones. Puede ser hosteada en cualquier servidor de archivos estáticos incluyendo GitHub Pages.

**Capacidades principales:**
- Pool de 335 canciones curadas en 24 géneros con BPM, tonalidades y progresiones verificadas
- Generación inteligente: balance 50/50 entre curva de energía y esfuerzo físico por set
- Sistema de instrumentos de banda completa (11 instrumentos) con pesos de esfuerzo configurables por instrumento
- Bloqueos Must Play (⚑) — canciones garantizadas en cada setlist generado
- Notas por canción para instrucciones de escenario
- Importación CSV para carga masiva · Exportación JSON para respaldo del pool
- Exportación en PDF, HTML y texto para uso en escenario
- Interfaz multiidioma: Español, Inglés, Portugués, Ruso
- Diseño responsive — funciona en escritorio y móvil
- FOSS — sin requisito de API de IA, funcional 100% offline

---

## 2. Estructura del proyecto

```
fmg-setlist/
├── index.html      # Shell HTML: layout, navegación, modales, chips de instrumentos
├── style.css       # Estilos completos: tema oscuro/claro, responsive, componentes
└── js/
    ├── songs.js    # Pool de 335 canciones (DEFAULTS), variables globales, pesos de esfuerzo
    ├── i18n.js     # Traducciones (ES/EN/PT/RU) + tr() + setLang()
    └── app.js      # Toda la lógica de la aplicación (65 funciones)
```

### Orden de carga

Los scripts deben cargarse en este orden: `songs.js` → `i18n.js` → `app.js`. Los tres usan el atributo `defer` para garantizar ejecución después de que el DOM esté listo. `app.js` envuelve su inicialización en un listener de `DOMContentLoaded` como salvaguarda.

Las variables de estado declaradas en `songs.js` (`pool`, `nights`, `instrs`, `mustPlay`, `effortWeights`, etc.) son accesibles globalmente en todos los scripts ya que comparten el mismo scope de `window` al cargarse como etiquetas `<script>`.

### Tamaños de archivo

| Archivo | Tamaño | Contenido |
|---------|--------|-----------|
| `index.html` | ~34 KB | Estructura HTML, navegación, todos los modales, chips de instrumentos |
| `style.css` | ~33 KB | CSS completo incluyendo tema oscuro/claro y todos los breakpoints responsive |
| `js/songs.js` | ~43 KB | 335 canciones en array `DEFAULTS` + variables de estado globales |
| `js/i18n.js` | ~38 KB | Objeto i18n (4 idiomas) + funciones `tr()` y `setLang()` |
| `js/app.js` | ~62 KB | 65 funciones cubriendo toda la lógica de la aplicación |

---

## 3. Pool de canciones (songs.js)

### Schema de canción

```js
{
  id:     number,     // entero único, auto-incremental
  title:  string,     // título de la canción
  artist: string,     // artista original
  genre:  string,     // uno de los 24 géneros soportados
  key:    string,     // tonalidad (ej. "Am", "Bb", "F#m")
  bpm:    number,     // tempo verificado en pulsaciones por minuto
  prog:   string,     // progresión de acordes abreviada (ej. "i–iv–i–V")
  energy: number,     // nivel de energía 1–5 (1=muy tranquila, 5=pico)
  instr:  string[],   // array de códigos de instrumento (ver sección 4)
  effort: number,     // esfuerzo físico para tocarla 1–5 (1=fácil, 5=agotador)
}
```

### Distribución por género (335 canciones)

| Género | Canciones | Género | Canciones |
|--------|-----------|--------|-----------|
| Rock | 49 | Disco | 14 |
| Blues | 41 | Reggae | 13 |
| Pop | 31 | Funk/Soul | 13 |
| Soul | 30 | R&B | 12 |
| Rock Latino | 20 | R&B Modern | 12 |
| Funk | 17 | Country | 10 |
| Latin | 15 | Cumbia | 10 |
| Ballad | 14 | Pop Latino | 4 |
| Jazz | 14 | Balada | 4 |
| — | — | Rap Rock, Ranchera, Reggaetón, Synth-Pop, Ska, Merengue | 1–3 c/u |

### Variables globales (declaradas en songs.js)

| Variable | Tipo | Default | Descripción |
|----------|------|---------|-------------|
| `pool` | `Song[]` | DEFAULTS o localStorage | Biblioteca activa de canciones |
| `nights` | `Night[]` | `[]` o localStorage | Shows guardados |
| `sets` | `Song[][]` | `[]` | Setlist actual (array de sets) |
| `numSets` | `number` | `3` | Número de sets a generar |
| `instrs` | `string[]` | `['eg','b','dr','vo']` | Códigos de instrumento activos esta noche |
| `mustPlay` | `Set` | `Set()` o localStorage | IDs de canciones bloqueadas |
| `selectedGenres` | `string[]` | Los 24 géneros | Géneros habilitados para generación |
| `effortWeights` | `object` | `{eg:1.0, dr:1.8, vo:2.0…}` | Multiplicadores de esfuerzo por instrumento |
| `editId` | `number\|null` | `null` | ID de canción siendo editada en modal |
| `dragSrc` | `element\|null` | `null` | Elemento de canción siendo arrastrado |
| `nextId` | `number` | `max(IDs del pool) + 1` | Auto-incremento para canciones nuevas |

---

## 4. Sistema de instrumentos

### Códigos de instrumento

| Código | Nombre | Peso default | Notas |
|--------|--------|-------------|-------|
| `eg` | Guitarra Eléctrica | 1.0 | Instrumento principal de lead/ritmo |
| `ag` | Guitarra Acústica | 0.8 | Menor esfuerzo — rasgueo/fingerpicking |
| `b` | Bajo Eléctrico | 1.2 | Postura de pie constante |
| `dr` | Batería | 1.8 | Esfuerzo de cuerpo completo |
| `k` | Piano/Teclado | 1.0 | Sentado — esfuerzo moderado |
| `sx` | Saxofón | 1.5 | Instrumento de aliento — esfuerzo pulmonar |
| `tp` | Trompeta | 1.5 | Aliento — fatiga de embocadura |
| `tb` | Trombón | 1.5 | Aliento + movimiento físico de vara |
| `vo` | Voz Principal | 2.0 | Mayor esfuerzo — fatiga vocal crítica |
| `bv` | Coros (BV) | 1.5 | Menos intenso que voz principal |
| `pc` | Percusión Latina | 1.2 | Congas, bongos, timbales |

### Configuración de pesos de esfuerzo

Los pesos de esfuerzo son configurables por banda desde el panel "Effort weights" en el sidebar. Los valores son multiplicadores aplicados al campo `effort` de cada canción al calcular el esfuerzo total del set.

**Fórmula:** `esfuerzo_canción = song.effort × max(pesos de instrumentos activos en esa canción)`

Los pesos se persisten en `localStorage` con la clave `fmg-effort-weights`.

### Chips de instrumento

El sidebar muestra chips representando los instrumentos disponibles de la banda para el show de esta noche. Por defecto activos: `eg`, `b`, `dr`, `vo`. Hacer click en un chip alterna ese instrumento. Al menos un instrumento debe permanecer activo. El estado de los chips persiste en `localStorage` como `fmg-instrs`.

---

## 5. Algoritmo de generación

La función `generate()` construye un setlist que optimiza simultáneamente dos objetivos con igual peso: **curva de energía musical** y **distribución de esfuerzo físico**.

### Fase 1 — Elegibilidad de canciones

Las canciones se filtran en tres niveles de fallback progresivo:

1. **Nivel 1** — Canciones que coinciden con instrumentos activos Y géneros seleccionados _(preferido)_
2. **Nivel 2** — Canciones que coinciden solo con géneros seleccionados _(si Nivel 1 es muy pequeño)_
3. **Nivel 3** — Pool completo _(último recurso)_

El umbral para fallback es: `canciones disponibles < canciones_por_set × número_de_sets`.

### Fase 2 — Colocación de Must Play

Las canciones bloqueadas con ⚑ se extraen primero y se distribuyen uniformemente entre sets (división por techo). Se colocan al inicio de cada set antes de llenar los slots restantes. Las canciones Must Play se excluyen de los swaps de optimización subsiguientes.

### Fase 3 — Llenado por curva de energía

Los slots restantes por set se llenan por nivel de energía siguiendo una curva definida:

| Posición del set | Baja energía (1–2) | Media (3) | Alta (4–5) |
|-----------------|-------------------|-----------|-----------|
| Sets tempranos (no último) | 35% | ~40% | 25% |
| Set final | 20% | ~40% | 40% |

Las canciones dentro de cada tier de energía se mezclan aleatoriamente antes de la selección, proporcionando variación entre generaciones. `noConsecKey()` reordena para evitar canciones consecutivas en la misma tonalidad.

### Fase 4 — Balanceo de esfuerzo (optimización 50/50)

Después de la asignación por energía, se ejecutan hasta 3 pasadas de swap para equilibrar el esfuerzo físico entre sets:

1. Calcular esfuerzo total de cada set
2. Para sets que superan el 115% del promedio, encontrar la canción más pesada (no Must Play)
3. Encontrar la canción más liviana de un set con esfuerzo por debajo del promedio
4. Calcular el delta de esfuerzo antes y después del swap
5. **Solo ejecutar el swap si reduce el desequilibrio** (`diffAfter < diffBefore`)

Esta estrategia conservadora garantiza que el balanceo de esfuerzo nunca degrada la curva de energía.

### Estimación de duración

`durMin(songs)` estima la duración del set en minutos usando el BPM como proxy:

```
BPM > 90  →  ~3.5 min por canción
BPM > 70  →  ~4.5 min por canción
BPM ≤ 70  →  ~5.5 min por canción
```

---

## 6. Navegación y vistas

La aplicación tiene 5 vistas principales navegables desde la barra de navegación superior. En móvil, una barra de navegación inferior proporciona acceso equivalente más un botón de Ajustes.

| Vista | ID | Descripción |
|-------|-----|-------------|
| **Builder** | `view-builder` | Vista principal del setlist. Sets actuales con drag-to-reorder, notas por canción, indicadores Must Play y controles de agregar/quitar |
| **Shows** | `view-shows` | Biblioteca de setlists guardados. Cards con título, fecha, cantidad de sets y canciones. Cargar o eliminar shows guardados |
| **Pool** | `view-pool` | Tabla completa de canciones. Filtrar por género/búsqueda, agregar canciones (manual o CSV), gestionar bloqueos Must Play |
| **Export** | `view-export` | Exportar el setlist actual como PDF, HTML, texto plano o JSON |
| **Docs** | `view-docs` | Documentación integrada renderizada dinámicamente desde strings de i18n |

### Sidebar (escritorio)

El sidebar izquierdo contiene todos los controles de configuración: chips de instrumentos, cantidad de sets, duración por set, filtros de género, botón generar, pesos de esfuerzo, y sección de importación/exportación (JSON + CSV). Todo el contenido está dentro de un contenedor con scroll (`sidebar-scroll`).

### Mobile drawer

En pantallas ≤ 768px el sidebar está oculto. Un drawer deslizable hacia arriba, activado por el botón Ajustes en el nav inferior, proporciona acceso a todos los controles del sidebar incluyendo el set completo de chips de instrumentos, checkboxes de géneros y selector de duración. El drawer sincroniza bidireccionalmente con el estado del sidebar de escritorio.

---

## 7. Funcionalidades

### Must Play (⚑)

Cualquier canción del pool puede marcarse como Must Play mediante el botón ⚑ en la vista Pool. Las canciones bloqueadas están garantizadas en cada setlist generado, distribuidas uniformemente entre sets. El estado Must Play es visible en las filas del set como un ícono ⚑ dorado y en todos los formatos de exportación. Persiste en `localStorage` como array JSON de IDs.

### Notas por canción

Cada fila de canción en la vista Builder tiene un input de texto inline para notas por actuación. Usos comunes: posición de cejilla, recordatorios de transposición, instrucciones de intro, cues para otros músicos. Las notas se guardan junto con el set al guardar un show y aparecen en todos los formatos de exportación.

### Importación CSV

La vista Pool ofrece importación masiva vía CSV. Descargar la plantilla (⬇ CSV Template) para obtener un archivo correctamente formateado con instrucciones:

```
title,artist,genre,key,bpm,prog,energy,instr,effort
```

**Reglas:**
- Columnas requeridas: `title`, `artist`, `genre`
- `instr`: códigos separados por coma entre comillas — ej. `"eg,b,dr,vo"`
- `genre`: debe coincidir exactamente con uno de los 24 géneros soportados
- `energy` y `effort`: enteros 1–5
- Líneas que comienzan con `#` se tratan como comentarios y se ignoran
- Canciones duplicadas (mismo título + artista) se saltan silenciosamente
- Valores de género inválidos defaultean a Blues

### Formatos de exportación

| Formato | Función | Descripción |
|---------|---------|-------------|
| PDF | `doExportPDF()` | Abre el diálogo de impresión del navegador con layout limpio en serif. Incluye íconos Must Play, notas y estimados de duración. Usar "Guardar como PDF" |
| HTML | `doExportHTML()` | Descarga archivo `.html` autocontenido con estilos embebidos. Ideal para enviar a músicos de la banda o al técnico de sonido del venue |
| Texto | `doExportText()` | Copia texto plano al portapapeles. Incluye ⚑ para Must Play y notas entre paréntesis. Formato: `01. Título — Artista  [Tonalidad · BPM]` |
| JSON | `doExportJSON()` | Descarga los datos del setlist en JSON |
| Pool JSON | `exportPoolJSON()` | Descarga el pool completo para respaldo o transferencia entre dispositivos |

### Guardar y cargar shows

Hacer click en Guardar en la vista Builder persiste el setlist actual en la pestaña Shows. Los shows guardados almacenan: título, timestamp, array de sets (con notas) y selección de instrumentos. La pestaña Shows muestra todos los shows como cards con acciones de cargar y eliminar.

### Tema

La aplicación usa tema oscuro por defecto (paleta marrón-negro profundo con acentos dorados). El tema claro está disponible mediante el toggle ☀️ en la barra superior. La preferencia persiste en `localStorage`.

---

## 8. Internacionalización (i18n.js)

El sistema i18n cubre todos los strings visibles al usuario. Los nombres de género, "Set", "Setlist", "BPM", nombres de proveedores de API y códigos de instrumento son intencionalmente no traducidos (terminología musical universal).

### Idiomas soportados

| Código | Idioma | Cobertura |
|--------|--------|-----------|
| `es` | Español | Completo — idioma primario de desarrollo |
| `en` | Inglés | Completo — todos los strings de UI, nombres de instrumento, documentación |
| `pt` | Portugués | Completo — todos los strings de UI, nombres de instrumento, documentación |
| `ru` | Ruso | Completo — Cirílico, todos los strings de UI, nombres de instrumento |

### Agregar un nuevo idioma

1. En `i18n.js`, copiar el bloque `en:{...}` y cambiar la clave al nuevo código (ej. `fr`)
2. Traducir todos los valores. Dejar los nombres de género, códigos de instrumento y BPM sin cambiar
3. En `index.html`, agregar un botón de idioma en la topbar: `<button class="lang-btn" data-lang="fr" onclick="setLang('fr')">FR</button>`
4. Agregar el mismo botón al drawer móvil para consistencia

### Comportamiento de `setLang()`

Actualiza todo el texto en el DOM incluyendo: etiquetas de navegación, etiquetas de secciones del sidebar, texto de chips de instrumento, etiquetas de filtros de género, headers de tabla del pool, etiquetas de campos del modal, texto de botones de exportación y la vista Docs renderizada dinámicamente.

---

## 9. localStorage — Claves de persistencia

| Clave | Tipo | Descripción |
|-------|------|-------------|
| `fmg-pool` | `JSON Song[]` | Pool de canciones del usuario. Sobreescribe DEFAULTS al cargar |
| `fmg-nights` | `JSON Night[]` | Todos los shows guardados |
| `fmg-mustPlay` | `JSON number[]` | Array de IDs de canciones Must Play |
| `fmg-instrs` | `JSON string[]` | Códigos de instrumento activos (ej. `["eg","b","dr","vo"]`) |
| `fmg-effort-weights` | `JSON object` | Multiplicadores de esfuerzo por instrumento |
| `fmg-lang` | `string` | Código de idioma activo (es/en/pt/ru) |
| `fmg-theme` | `string` | `"dark"` o `"light"` |
| `fmg-ai-provider` | `string` | `"claude"`, `"gemini"` o `"chatgpt"` (no utilizado en FOSS) |
| `fmg-ai-count` | `string` | Número de canciones a solicitar a IA (3/5/8/10) |
| `fmg-ai-model` | `string` | Identificador de modelo de IA seleccionado |

### Seguridad de datos

`pool` y `nights` se cargan con guardas `try/catch`. Si `localStorage` está corrupto o vacío, `pool` cae de vuelta a `DEFAULTS` y `nights` a `[]`. `nextId` se calcula desde el ID máximo existente + 1, guardado contra arrays vacíos para prevenir `-Infinity`.

> **Recomendación:** exportar el pool como JSON regularmente (Vista Pool → Export JSON) y guardar el archivo en un lugar seguro. `localStorage` puede ser limpiado por el navegador o al limpiar datos del sitio.

---

## 10. IA (desactivada en versión FOSS)

El panel de IA está presente en el código pero desactivado en la versión FOSS. La función `toggleAIPanel()` retorna inmediatamente con una notificación toast. La barra de API key está oculta via estilo inline.

La infraestructura subyacente (`runAI`, `cleanJSON`, `normalizeInstr`) permanece en `app.js` para habilitar reactivación en una versión de pago/hosteada eliminando el `return` temprano en `toggleAIPanel()` y mostrando la barra de API.

### Qué hace el sistema de IA (cuando está activo)

- **Búsqueda de canción:** dado un título + artista, completa género, tonalidad, BPM, progresión, energía y códigos de instrumento
- **Sugerir por mood:** dada una descripción de estilo/sensación, devuelve N canciones con metadata completa listas para agregar
- **Soporta tres proveedores:** Claude (Anthropic), Gemini (Google), ChatGPT (OpenAI)
- **Cantidad configurable:** 3, 5, 8 o 10 canciones con estimado de tokens mostrado
- **Parser de respuesta** (`cleanJSON`): maneja markdown fences, comillas especiales, comas finales, arrays truncados y objetos solitarios
- **`normalizeInstr()`**: mapea cualquier descripción de instrumento devuelta por la IA al sistema estándar de 11 códigos

---

## 11. Referencia de funciones (app.js)

### Generación central

| Función | Descripción |
|---------|-------------|
| `generate()` | Generación principal del setlist. Aplica curva de energía + algoritmo de balanceo de esfuerzo |
| `noConsecKey(arr)` | Reordena un array de canciones para evitar tonalidades consecutivas iguales |
| `durMin(songs)` | Estima duración total del set en minutos usando proxy de BPM |
| `updateGenreFilters()` | Sincroniza el array `selectedGenres` desde el estado de los checkboxes en el DOM |

### Gestión del pool

| Función | Descripción |
|---------|-------------|
| `renderPool()` | Redibuja la tabla del pool aplicando búsqueda y filtro de género actuales |
| `openAddModal()` | Abre el modal de canción en modo "nueva canción" con campos en blanco |
| `openEdit(id)` | Abre el modal de canción poblado con la canción que coincide con `id` |
| `saveSong()` | Guarda los datos del formulario modal como canción nueva o actualizada; llama `renderPool()` |
| `delSong(id)` | Confirma y elimina una canción del pool; llama `renderPool()` |
| `toggleMustPlay(id)` | Agrega o elimina una canción del Set `mustPlay`; persiste y re-renderiza |
| `setPF(genre, btn)` | Establece el filtro de género del pool; re-renderiza la tabla |
| `importCSV(event)` | Parsea un archivo CSV subido e importa canciones en masa al pool |
| `importPoolJSON(event)` | Fusiona un respaldo JSON del pool con el pool actual |
| `exportPoolJSON()` | Descarga el pool actual como archivo JSON |
| `downloadCSVTemplate()` | Descarga una plantilla CSV con instrucciones y filas de ejemplo |
| `parseCSVLine(line)` | Parsea una línea CSV, manejando campos entre comillas con comas internas |

### Setlist (filas de canción)

| Función | Descripción |
|---------|-------------|
| `renderSets()` | Redibuja todos los cards de set con drag handles, filas de canciones y dropdowns de agregar |
| `sRow(s, i, si)` | Devuelve HTML para una fila de canción individual con input de nota, dots de energía y controles |
| `attachDrag(r, si)` | Adjunta event listeners de drag start/over/drop/end a una fila de canción |
| `remFromSet(si, id)` | Elimina una canción de un set por ID; re-renderiza |
| `addToSet(si)` | Agrega la canción seleccionada del dropdown al set `si`; verifica duplicados |
| `setSongNote(si, id, val)` | Actualiza el campo de nota para una canción específica en un set |

### Shows / Noches

| Función | Descripción |
|---------|-------------|
| `saveNight()` | Guarda el setlist actual (título, timestamp, sets, instrs) en el array `nights`; llama `persist()` y `renderShows()` |
| `loadNight(id)` | Restaura un show guardado en el array de sets actual; actualiza chips de instrumento; navega al Builder |
| `delNight(id)` | Confirma y elimina un show guardado; llama `renderShows()` |
| `renderShows()` | Renderiza la pestaña Shows con todos los cards de shows guardados |

### Exportación

| Función | Descripción |
|---------|-------------|
| `renderExport()` | Renderiza el panel de preview en la vista Export |
| `doExportPDF()` | Abre ventana de impresión con layout limpio de PDF incluyendo notas e íconos Must Play |
| `doExportHTML()` | Descarga un archivo HTML autocontenido y con estilos del setlist |
| `doExportText()` | Copia el setlist en texto plano al portapapeles |
| `doExportJSON()` | Descarga el setlist como JSON |

### UI / Navegación

| Función | Descripción |
|---------|-------------|
| `gotoView(v)` | Cambia la vista activa; dispara `renderPool`/`renderExport`/`renderDocs`/`renderShows` según corresponda |
| `setTheme(t)` | Establece tema oscuro o claro; persiste en `localStorage` |
| `setLang(lang)` | Cambia el idioma de la UI; actualiza todo el texto del DOM; re-renderiza docs |
| `toast(msg)` | Muestra una notificación toast temporal en la parte inferior de la pantalla |
| `toggleInstr(name)` | Alterna un chip de instrumento; actualiza array `instrs`; persiste; sincroniza chips escritorio y móvil |
| `toggleMobileDrawer()` | Abre/cierra el drawer de ajustes móvil; llama `syncMobileDrawer()` |
| `syncMobileDrawer()` | Sincroniza estados de chips del drawer, checkboxes de géneros y `dur-sel` desde el estado de escritorio |
| `setN(n)` | Establece el número de sets; actualiza estados de botones |
| `saveEffortWeights()` | Lee inputs de pesos de esfuerzo y persiste en `localStorage` y variable `effortWeights` |
| `renderEffortWeights()` | Popula los campos de input de pesos de esfuerzo desde los valores actuales de `effortWeights` |

---

## 12. Despliegue

### GitHub Pages (recomendado)

```
1. Crear un repositorio público en GitHub
2. Subir todos los 5 archivos manteniendo la estructura:
   - index.html y style.css en la raíz
   - Los 3 archivos JS dentro de la subcarpeta js/
3. Ir a Settings → Pages → Source → Deploy from branch → main → / (root)
4. La app estará disponible en: yourusername.github.io/repo-name
```

> ⚠️ **Advertencia más común:** la carpeta `js/` debe existir en el repositorio. Subir solo `index.html` sin la subcarpeta `js/` es el error de despliegue más frecuente.

### Desarrollo local

```bash
cd fmg-setlist
python -m http.server 8080
# Abrir: http://localhost:8080
```

Abrir `index.html` directamente con protocolo `file://` funciona para la mayoría de características, pero algunos navegadores restringen `localStorage` con file:// — usar un servidor HTTP local si los datos no persisten.

### Auto-hosteado

Copiar los 5 archivos a cualquier servidor web estático. Sin configuración del lado del servidor. Sin pasos de build. Sin dependencias que instalar.

### Portabilidad de datos

Dado que todos los datos viven en `localStorage`, son específicos del dispositivo y navegador. Para mover datos entre dispositivos:

- **Pool:** Vista Pool → Export JSON → transferir archivo → Vista Pool → Import JSON en el nuevo dispositivo
- **Shows/noches:** actualmente requieren manipulación manual de JSON _(exportación de shows planificada en roadmap)_

---

## 13. Limitaciones conocidas y roadmap

### Limitaciones actuales

| Limitación | Workaround |
|-----------|------------|
| Sin sincronización entre dispositivos | Exportar pool como JSON e importar en cada dispositivo |
| Shows (noches) no exportables como JSON | Copiar desde `localStorage` manualmente via DevTools |
| Sin deshacer para ediciones del pool | Exportar pool regularmente como respaldo |
| Estimación de duración es aproximación basada en BPM | Ajustar canciones manualmente después de la generación |
| La importación CSV no actualiza canciones existentes | Eliminar y re-importar para actualizar metadata |
| Drag-to-reorder no disponible en móvil | Usar Agregar/Quitar para manejar el orden en móvil |

### Features potenciales (roadmap)

- Exportación de shows como JSON o PDF
- Perfiles de miembros de banda — presets de pesos de esfuerzo por músico
- Historial de setlist con diff entre versiones
- Opción de sincronización con Firebase/Supabase para acceso multi-dispositivo
- Manifiesto PWA + service worker para instalación offline en Android/iOS
- Vista de impresión para escenario: fuente grande, un set por página
- Helper de cejilla/transposición integrado en las notas de canción
- Sistema de rating de canciones — marcar canciones que funcionaron bien o mal en un show

---

## 14. Changelog

### v1.0 — Band Edition (actual)

| Categoría | Cambio |
|-----------|--------|
| Pool | 335 canciones en 24 géneros (antes 90 canciones, 11 géneros) |
| Instrumentos | 11 instrumentos de banda (eg/ag/b/dr/k/sx/tp/tb/vo/bv/pc) — reemplazó sistema de 4 códigos solo |
| Algoritmo | Balanceo de esfuerzo agregado a la generación — optimización 50/50 energía/esfuerzo |
| Esfuerzo | Campo `effort` (1–5) por canción y configuración de peso de esfuerzo por instrumento |
| Géneros | Agregados: Disco, R&B Modern, Funk/Soul, Rock Latino, Cumbia, Pop Latino, Balada, Merengue, Ranchera, Reggaetón, Synth-Pop, Rap Rock, Ska |
| Navegación | Pestaña Shows agregada — setlists guardados movidos fuera del sidebar a vista dedicada |
| Importación | Importación CSV con plantilla descargable |
| Must Play | Sistema de bloqueo ⚑ — canciones garantizadas en cada setlist generado |
| Notas | Notas inline por canción en filas del set, persistidas con shows guardados |
| Export | Exportación PDF via `window.print()` con layout limpio |
| Móvil | Diseño responsive completo con nav inferior y drawer deslizable |
| i18n | ES/EN/PT/RU — todos los nombres de instrumento, nuevos géneros, strings de UI |
| IA | Panel presente pero desactivado en versión FOSS |
| Bugs | `_genreTimer` movido a scope de módulo (fix crítico de generación), CSS deduplicado (20+ clases duplicadas eliminadas), `initMobileGenreSync` actualizado a 24 géneros |

---

*FMG Setlist Builder es software libre. Desarrollado por Fearlessly Media Group.*
