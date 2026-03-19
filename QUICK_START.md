# FMG Setlist Builder - Guía Rápida de Inicio

## ✅ Estado Current: FUNCIONAL

La aplicación está completamente actualizada y lista para usar. Todos los archivos necesarios están presentes y configurados.

---

## 🚀 Cómo Comenzar

### 1️⃣ **Abrir la Aplicación**
- **Local**: Abre `index.html` en tu navegador
- **Servidor**: Accede a `http://localhost:8080` si ejecutaste un servidor local

### 2️⃣ **Primeros Pasos en la Interfaz**

#### **Paso 1: Seleccionar Instrumentos**
1. En el **Sidebar izquierdo**, busca la sección **"Band instruments tonight"**
2. Haz click en los chips de instrumentos disponibles esta noche
3. Mínimo debe haber 1 instrumento seleccionado
4. Instrumentos disponibles: El. Guitar, Ac. Guitar, Bass, Drums, Keys, Sax, Trumpet, Trombone, Lead Vox, BV, Perc

#### **Paso 2: Configurar Sets y Duración**
1. Selecciona el **número de sets** (2, 3 o 4)
2. Elige la **duración por set** (en minutos)
3. La aplicación estima automáticamente canciones por set

#### **Paso 3: Seleccionar Géneros** 
1. En **"Genres to include"**, marca los géneros que deseas
2. Hay **24 géneros** disponibles
3. Puedes usar los botones "all" / "none" para select rápido

#### **Paso 4: Generar Setlist**
1. Haz click en **"Generate Setlist"**
2. La aplicación generará automáticamente un setlist optimizado con:
   - ✨ Curva de energía inteligente
   - 💪 Balance de esfuerzo físico
   - 🎵 Variación de géneros

#### **Paso 5: Personalizar**
1. **Arrastra y suelta** canciones para reordenarlas dentro de un set
2. Haz click en **"+ note"** para agregar notas especiales (transposiciones, cues, etc)
3. Usa **"×"** para eliminar una canción del set
4. Haz click en **"+ Add song..."** para agregar canciones manualmente

#### **Paso 6: Exportar**
1. Ve a la pestaña **"Export"**
2. Elige tu formato:
   - 📄 **PDF** - Imprime directamente desde tu navegador
   - 🌐 **HTML** - Descarga un archivo HTML bonito
   - 📋 **Texto** - Copia el setlist como texto plano
   - 📊 **JSON** - Descarga datos brutos

---

## 📊 Pestañas Principales

| Pestaña | Función | Acciones |
|---------|---------|----------|
| **Builder** | Vista principal de construcción | Generar, reordenar, agregar/quitar canciones |
| **Shows** | Biblioteca de setlists guardados | Guardar, cargar, eliminar shows |
| **Pool** | Gestión de canciones | Buscar, agregar, editar, marcar Must Play |
| **Export** | Descargar setlist | PDF, HTML, Texto, JSON |
| **Docs** | Documentación integrada | Guía completa y tips |

---

## 🎵 Pool de Canciones

### ¿Qué es el Pool?
Es tu biblioteca master de canciones. Viene pre-cargado con **335 canciones** en **24 géneros**.

### Gestionar Canciones
- **Agregar**: Haz click en **"+ Manual"** o importa CSV
- **Buscar**: Usa el buscador por título o artista
- **Editar**: Haz click en **"Edit"**
- **Eliminar**: Haz click en **"×"**
- **Must Play (⚑)**: Marca canciones que SIEMPRE deben estar en cada setlist

### Importar/Exportar Pool
1. **Exportar**: Click en **"Export JSON"** para descargar respaldo
2. **Importar**: Click en **"Import JSON"** para cargar un respaldo

---

## 💾 Cómo Guardar Tus Datos

### Guardado Automático
Tu setlist actual se guarda automáticamente en `localStorage` del navegador.

### Guardar un Show Completo
1. En la pestaña **Builder**, escribe un nombre en **"Night name"**
2. Haz click en **"Save"**
3. El show aparecerá en la pestaña **"Shows"**

### Cargar un Show Guardado
1. Ve a la pestaña **"Shows"**
2. Haz click en el show que deseas cargar
3. Tu setlist se restaurará completamente

---

## ⚙️ Configuración Avanzada

### Ajustar Pesos de Esfuerzo
En el sidebar, busca **"Effort weights"** para ajustar cómo cada instrumento afecta el balance de esfuerzo:
- Valores más altos = Mayor esfuerzo físico esperado
- Valores predeterminados ya están optimizados

### Temas
- 🌙 **Dark Mode** (predeterminado) - Tema oscuro profesional
- ☀️ **Light Mode** - Tema claro alto contraste

### Idiomas
Soportados: **English, Español, Português, Русский**
- Botones en la barra superior para cambiar

---

## 🆘 Solución de Problemas

| Problema | Solución |
|----------|----------|
| "Necesitas más canciones" | Habilita más géneros o baja la duración por set |
| Los datos no se guardan | Asegúrate que localStorage no esté deshabilitado |
| Modal no abre | Recarga la página |
| Setlist se ve mal en móvil | Usa el drawer de Settings (⚙) en la barra inferior |

---

## 📱 Versión Móvil

La aplicación es completamente responsive:
- **Barra inferior** con navegación (♪ Builder, ☰ Pool, ★ Shows, ↓ Export, ? Docs)
- **Botón ⚙** abre drawer deslizable con todos los controles
- **Drag & drop** solo en escritorio (en móvil usa agregar/quitar)

---

## 🎯 Casos de Uso Comunes

### Generar un Setlist Rápido
1. Selecciona instrumentos
2. Elige número de sets y duración
3. Click "Generate Setlist"
4. Exporta a PDF

### Setlist Temático por Género  
1. Desselecciona todos los géneros
2. Selecciona solo Blues + Soul
3. Genera
4. Obtén un setlist cohesivo

### Preparar Varios Shows
1. Genera un setlist
2. Personalízalo (reordena, agrega notas)
3. Click "Save" para guardar
4. Repite con diferentes géneros para variedad

---

## 🔑 Información Importante

✅ **Sin Servidor** - Toda la data está en tu navegador  
✅ **Sin Cuenta** - No necesitas crear usuario  
✅ **Sin Suscripción** - Totalmente gratis y open source  
✅ **Offline** - Funciona 100% sin internet (después del primer carga)  

### Respaldar Datos
Exporta tu pool como JSON regularmente. Los datos en `localStorage` pueden borrarse si limpias el historial del navegador.

---

## 📞 Características

- ✨ **335 canciones** curadas con metadata completa
- 🎛️ **11 instrumentos** de banda con pesos de esfuerzo ajustables
- 🎵 **24 géneros** para máxima variedad
- 💾 **Importación CSV** para cargar tus propias canciones
- 📄 **Exportación múltiple** (PDF, HTML, Texto, JSON)
- 🌍 **Multiidioma** (ES/EN/PT/RU)
- 📱 **Fully responsive** - Escrit desktop y móvil
- ⚡ **Ultra rápido** - Sin lag, generación instantánea
- 🔒 **Privado** - Tus datos nunca dejan tu navegador

---

## 🚀 Próximos Pasos

1. **Explora el Pool** - Revisa las 335 canciones y aprende la metadata
2. **Genera varios setlists** - Cada generación es diferente
3. **Personaliza** - Reordena, agrega notas, marca Must Play
4. **Exporta y comparte** - Descarga HTML para enviar a bandmates
5. **Guarda favoritos** - Usa la pestaña Shows para tus setlists mejores

---

**FMG Setlist Builder v1.0 - Band Edition**  
*Fearlessly Media Group - Open Source*
