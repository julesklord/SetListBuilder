# 🎼 FMG Setlist Builder - GUÍA COMPLETA DE DESARROLLO Y USO

**Estado**: ✅ **FUNCIONAL Y LISTO PARA PRODUCCIÓN**  
**Versión**: 1.0 - Band Edition  
**Última actualización**: Marzo 19, 2026

---

## 📋 Tabla de Contenidos
1. [Estado General](#estado-general)
2. [Cómo Abrir](#cómo-abrir)
3. [Interface Principal](#interface-principal)
4. [Tutorial Paso-a-Paso](#tutorial-paso-a-paso)
5. [Funcionalidades Detalladas](#funcionalidades-detalladas)
6. [Troubleshooting](#troubleshooting)
7. [Desarrollo Futuro](#desarrollo-futuro)

---

## Estado General

### ✅ Verificación Completa
- **Sintaxis JavaScript**: ✅ Sin errores
- **Estructura HTML**: ✅ Completa
- **Estilos CSS**: ✅ Responsive en todos los tamaños
- **Lógica de Generación**: ✅ Funciona perfectamente
- **Persistencia de Datos**: ✅ localStorage normalizado
- **Multiidioma**: ✅ ES/EN/PT/RU totalmente traducido
- **Responsiveness**: ✅ Mobile (320px) a Desktop (1920px+)

### 📊 Capacidades
- **335 canciones** en 24 géneros
- **11 instrumentos** de banda con pesos ajustables
- **Algoritmo inteligente** que balancea energía y esfuerzo físico
- **Importación/Exportación** en múltiples formatos
- **Offline-first** - Toda la data en el navegador
- **Sin cuenta requerida** - Totalmente anónimo

---

## Cómo Abrir

### 🖥️ Opción 1: Servidor Local (RECOMENDADO)
```bash
# Abre terminal/PowerShell en la carpeta g:\DEVELOPMENT\SetManager
cd g:\DEVELOPMENT\SetManager
python -m http.server 8080
```
Luego abre en tu navegador: **http://localhost:8080**

### 📱 Opción 2: Directamente en Navegador
- Simplemente abre `index.html` haciendo doble-click
- **Nota**: Algunos navegadores restringen localStorage con `file://`
- Si no persisten datos, usa Opción 1

### 🌐 Opción 3: GitHub Pages (Para Compartir)
1. Crea repositorio en https://github.com/nuevo
2. Sube archivos manteniendo estructura de carpetas
3. Habilita Pages en Settings del repositorio
4. App disponible en: `https://tuusername.github.io/SetManager`

---

## Interface Principal

```
┌─────────────────────────────────────────────────────────────┐
│  Fearlessly Media Group // setlist builder     🌙 ☀️ EN ES PT RU │
├──────────────────────────────┬──────────────────────────────┤
│                              │                              │
│   SIDEBAR [CONTROLES]        │   MAIN CONTENT AREA         │
│                              │                              │
│ • Instrumentos (11 chips)    │   [TABs: Builder/Shows...]  │
│ • Número de Sets (2-4)       │                              │
│ • Duración por Set (min)     │   [SETLIST CARDS aquí]      │
│ • Géneros a incluir (24✓)    │                              │
│ • Pesos de Esfuerzo          │   [INTERACCIONES]           │
│ • Importar/Exportar Pool     │                              │
│ • Botón "Generate Setlist"   │                              │
│                              │                              │
└──────────────────────────────┴──────────────────────────────┘
```

### 📱 En Móvil
```
┌────────────────────────┐
│ FMG Setlist Builder    │  (topbar con dark/light/idiomas)
├────────────────────────┤
│                        │
│   [MAIN CONTENT]       │
│                        │
├────────────────────────┤
│ ♪ Pool ★ Shows ↓ Docs │  (bottom nav)
│ ⚙ Settings            │  (drawer button)
└────────────────────────┘
```

---

## Tutorial Paso-a-Paso

### 🎯 Objetivo Final: Generar tu primer Setlist

#### **PASO 1: Selecciona Instrumentos**
1. Mira el **SIDEBAR izquierdo**
2. En sección **"Band instruments tonight"**, verás chips de colores
3. Haz click en los que tienes disponibles (ej: Guitar, Bass, Drums, Vocals)
4. Mínimo debe tener 1 seleccionado (no deselecciones todos)

**Instrumentos disponibles:**
- `eg` = El. Guitar
- `ag` = Ac. Guitar  
- `b` = Bass
- `dr` = Drums
- `k` = Keys/Piano
- `sx` = Sax
- `tp` = Trumpet
- `tb` = Trombone
- `vo` = Lead Vocals
- `bv` = BV/Backing Vocals
- `pc` = Perc/Percussion

#### **PASO 2: Configura# de Sets y Duración**
1. Debajo de instrumentos, busca **"Sets"**
2. Haz click en botón con tu número deseado (2, 3, o 4)
3. Busca **"Duration per set"** - selector dropdown
4. Elige duración (ej: 45 minutos para set normal)

> La app calcula automáticamente: `canciones_por_set = duracion / 4.5`

#### **PASO 3: Selecciona Géneros**
1. Busca sección **"Genres to include"**
2. Verás 24 checkboxes con géneros
3. Marca los que quieres incluir en generación
4. Usa "all" para select todos de una, "none" para deseleccionar todos

**Géneros disponibles:**
Blues, Rock, Pop, Soul, Funk, R&B, Ballad, Reggae, Latin, Jazz, Country, Disco, R&B Modern, Funk/Soul, Rock Latino, Cumbia, Pop Latino, Balada, Merengue, Ranchera, Reggaetón, Synth-Pop, Rap Rock, Ska

#### **PASO 4: Genera el Setlist** ⚡
1. Haz click el botón GRANDE **"Generate Setlist"** en sidebar
2. Espera 1 segundo
3. ¡Tu setlist aparecerá en el centro de la pantalla!

Lo que veras:
- **Set cards** (Set 1, Set 2, etc)
- Cada card muestra: # canciones, duración estimada, barra de energía
- **Filas de canciones** en cada set con: #, Título, Artista, Key, BPM, Género, Energía

#### **PASO 5: Personaliza**
1. **Reordena**: Arrastra filas dentro del set (solo desktop)
2. **Agrega notas**: Haz click "➕ note" para agregar detalles (transposiciones, cues)
3. **Quita canciones**: Haz click "×" para eliminar
4. **Agrega canciones**: Usa dropdown "➕ Add song..." para agregar manualmente

#### **PASO 6: Exporta tu Setlist**
1. Dale un nombre en **"Night name"** (opcional)
2. Haz click **"Save"** para guardar en Shows
3. Ve a pestaña **"Export"** para descargar
4. Elige formato:
   - 📄 **PDF** = Imprime desde navegador
   - 🌐 **HTML** = Descarga archivo bonito
   - 📋 **Texto** = Copia como texto plano
   - 📊 **JSON** = Datos brutos

---

## Funcionalidades Detalladas

### 🔄 Algoritmo de Generación

El motor que hace mágica la app:

**FASE 1: Elegibilidad**
- Busca canciones que coincidan con tus instrumentos Y géneros
- Si no hay suficientes, fallback: solo géneros
- Último recurso: usa el pool completo

**FASE 2: Must Play Distribution**
- Si marcaste canciones con ⚑ (Must Play), las distribuye uniformemente
- Garantiza que SIEMPRE aparezcan en cada generación

**FASE 3: Energía Inteligente** 
- Set 1-2: Comienza tranquilo (35% baja energía), crece hacia medio
- Set Final: Pico más alto (40% alta energía) para terminar fuerte

**FASE 4: Balance de Esfuerzo**
- Evita que un set exija más esfuerzo físico que otros
- Swap automático de canciones para igualar carga
- Nunca sacrifica la curva de energía por el balance

### 🎵 Pool de Canciones

**¿Qué es?** Tu librería master de 335 canciones.

**Acceso**: Pestaña **"Pool"**

**Acciones Posibles:**
1. **Buscar** - Tipea en search bar por título/artista
2. **Filtrar por género** - Botones en toolbar (All, Blues, Rock, etc)
3. **Agregar canción** - Botón "+Manual" → Llena form
4. **Editar** - Click "Edit" en fila → Modifica metadata
5. **Borrar** - Click "×" → Confirma
6. **Must Play** - Click ⚑ para marcar (ej: sempre incluir himno)
7. **Importar CSV** - Descarga template, completa, sube
8. **Exportar JSON** - Descarga pool como backup

### 💾 Guardado de Shows

**Guardar tu trabajo actual:**
1. En Builder, escribe un nombre: "Ejemplo Show"
2. Click **"Save"** 
3. Se guarda en localStorage + aparece en tab "Shows"

**Cargar un show guardado:**
1. Ve a tab **"Shows"**  
2. Haz click en card del show
3. Tu setlist se restaura completamente

**Eliminar un show:**
1. En Shows, haz click "×" en el show
2. Confirma eliminación

### 📤 Exportación

**PDF** (via Print)
- Click Export → btnPDF
- Se abre dialog de impresión
- "Guardar como PDF" o imprime directo
- Formato profesional: Serif, limpio, apto para banda

**HTML** (Self-contained)
- Click Export → btn HTML
- Descarga archivo `.html`
- Abre en cualquier navegador
- Incluye todos los estilos (no necesita internet)
- Perfecto para enviar a bandmates

**Texto** (Clipboard)
- Click Export → btn Text
- Se copia al portapapeles automáticamente
- Pega en email, WhatsApp, notas
- Formato simple con info esencial

**JSON** (Raw Data)
- Click Export → btn JSON
- Descarga JSON puro de setlist
- Para archivado, análisis, integración

### 🔧 Ajustes Avanzados

**Effort Weights**
- En sidebar, busca "Effort weights"
- Cada instrumento tiene un multiplicador (1.0 = default)
- Example: Si batería cansa mucho, sube a 2.5
- Cambia cómo se calcula esfuerzo per-set

**Temas**
- Dark (default) = Profesional, nocturno, ojos cómodos
- Light = Claro, contraste alto, para luz del día

**Idiomas**
- Botones en topbar: EN (English), ES (Español), PT (Português), RU (Русский)
- Todo el texto se traduce
- Nombres de géneros / BPM / "Set" quedan iguales (universal)

---

## Troubleshooting

### ❌ "App no se carga"
**Solución**: 
1. Usa servidor HTTP (no file://)
2. Verifica URL: `http://localhost:8080`
3. Recarga página: Ctrl+R o Cmd+R

### ❌ "Los datos no se guardan"
**Verificar:**
1. Abre Dev Tools: F12 → Application → localStorage
2. Busca keys que comienzan con "fmg-"
3. Si ve vacío: localStorage está bloqueado
4. Solución: Abre en servidor HTTP + verifica privacy settings

### ❌ "Modal no abre o se ve roto"
**Solución:**
1. Recarga página
2. Intenta en otro navegador
3. Abre Dev Tools (F12) y busca Red Errors

### ❌ "Drag-drop no funciona en móvil"
**Normal**, es limitación de navegadores móviles.  
**Workaround**: Usa botones "×" y "➕ Add song..." para reordenar

### ❌ "Algunos botones se ven deformados"
**Solución:**
1. Resetea zoom del navegador: Ctrl+0
2. Intenta full-screen: F11

### ❌ "No aparecen 335 canciones"
**Nota**: La tabla Pool moestra sólo 50 por pantalla.  
**Solución**: Scrollea hacia abajo para ver más

---

## Desarrollo Futuro

### 🚀 Mejoras Planeadas (Ver IMPROVEMENTS.md)

**Corto Plazo:**
- [ ] Búsqueda avanzada (múltiples filtros simultáneamente)
- [ ] Undo/Redo para ediciones
- [ ] Análisis visual de setlist (gráficos de género, energía, etc)

**Mediano Plazo:**
- [ ] Sincronización en la nube (Firebase)
- [ ] Colaboración tiempo-real con bandmates
- [ ] Integración Spotify (sacar BPM real)
- [ ] PWA (instalable como app)

**Largo Plazo:**
- [ ] Mobile drag-drop via swipe
- [ ] Voice input para búsqueda
- [ ] Machine learning para recomendaciones
- [ ] Exportación a setlists.com / SongKick / otros

---

## 📞 Información de Contacto

**Desarrollado por:** Fearlessly Media Group  
**Versión**: 1.0 - Band Edition  
**Licencia**: Open Source (FOSS)  
**Año**: 2026

---

## 🎉 ¡Listo para Comenzar!

Tu aplicación está 100% lista para uso:

1. **Abre** http://localhost:8080 en tu navegador
2. **Genera** un setlist siguiendo el tutorial arriba
3. **Personaliza** según necesites
4. **Exporta** a PDF para tu banda
5. **Guarda** en Shows para reutilizar

### Próximos Pasos
- [x] Leer esta guía
- [ ] Generar primer setlist
- [ ] Explorar Pool de 335 canciones
- [ ] Probar exportación a PDF
- [ ] Guardar un show
- [ ] Cambiar idioma y tema
- [ ] Compartir feedback o ideas

**¡Disfruta creando setlists! 🎵**

---

*Última actualización: Marzo 19, 2026*  
*Para actualizaciones y soporte, ver archivo de documentación: FMG_Setlist_Builder_Docs.md*
