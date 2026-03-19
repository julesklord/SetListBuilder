# Mejoras UI/UX Recomendadas

Este documento liste mejoras sugeridas para potenciar la interfaz.

## 🎨 Mejoras Visuales Sugeridas

### 1. **Indicadores de Estado Visuales**
- Agregar animación de "cargando..." cuando se genera setlist
- Badge rojo en nav para "Shows sin guardar"
- Tooltip flotante para explicar cada botón

### 2. **Mejora de Drag & Drop**
- Agregar "ghost image" visual cuando arrastras
- Sombra más pronunciada en elemento siendo arrastrado
- Animación de "swap" cuando intercambias canciones

### 3. **Tema de Colores**
- Dark mode: Mejorar contraste oro/fondo (actualmente discreto)
- Light mode: Tonos más suaves para no cansar la vista
- Agregar distintos esquemas de color (azul, verde, púrpura)

### 4. **Responsive Mobile**
- Hacer más espaciado botones en móvil (target más grande)
- Teclado virtual en inputs de nota no se superponga
- Opciones de swipe para eliminar canciones (además de click)

### 5. **Accesibilidad**
- Agregar `aria-labels` a todos los botones
- Mejorar contraste de texto en modo claro
- Soportar navegación por teclado en Pool

---

## 🔧 Mejoras Funcionales

### 1. **Búsqueda y Filtros en Pool**
- Buscar por género + artista simultáneamente
- Filtros por rango de BPM
- Búsqueda por progresión de acordes

### 2. **Undo/Redo**
- Sistema de historial para ediciones del pool
- Undo para movimientos de canciones en sets

### 3. **Clips/Presets de Generación**
- "Quick presets" (ej: Solo Blues, Rock & Soul, Top 40)
- Guardar preferencias de generación frecuentes

### 4. **Columna de Duración Total**
- Mostrar duración estimada de todo el setlist
- Recomendación automática: "Setlist demasiado corto / largo"

### 5. **Historial de Shows**
- Ver shows anteriores agrupados por fecha
- Estadísticas: géneros más usados, canciones más tocadas

---

## 📊 Mejoras de Datos

### 1. **Sugerencias Inteligentes**
- "Probaste esta canción? Qué tal?" después de tocar
- Recomendaciones basadas en historial
- "Combina bien con:" sugerencias automáticas

### 2. **Validación de Datos**
- Advertencia si BPM no es realista (< 40 o > 220)
- Sugerir transposición si canción es muy aguda/grave

### 3. **Análisis del Setlist**
- Mostrar balance de géneros en gráfico pie chart
- Advertencia si haces 3+ canciones seguidas del mismo género
- Reporte de esfuerzo: "Batería al 95%, cansancio?"

---

## 🎬 Animaciones Propuestas

```css
/* Fade-in suave cuando genera setlist */
@keyframes slideInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Pulse en Must Play */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Bounce en botones */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
```

---

## 📱 Mobile-First Improvements

1. **Bottom sheet** para el formulario "Add song"
2. **Swipe up** para abrir drawer de settings
3. **Pull to refresh** para regenerar setlist
4. **Haptic feedback** (vibración) en acciones importantes
5. **Voice input** para búsqueda en pool

---

## 🤖 Funcionalidades Futuras (Roadmap)

- [ ] Sincronización en la nube (Firebase)
- [ ] Colaboración en tiempo real con bandmates
- [ ] Integración con Spotify (obtener BPM real)
- [ ] Editor visual de energía (gráfico arrastrable)
- [ ] Exportación a setlists.com / otros formatos
- [ ] Análisis de técnica de canciones
- [ ] Modo "Practice": desglosa las partes por instrumento
- [ ] Integración con capo/transposición

---

## 💡 Mejoras de UX Copilot (No código)

### 1. **Onboarding Mejorado**
- Tutorial paso-a-paso para primer usuario
- Puntos de "Hago esto?" en UI inteligente
- Video embedido mostrando workflow

### 2. **Contexto Sensible**
- Help tooltip aparece justo donde lo necesitas
- Sugerencias emergentes basadas en acciones

### 3. **Feedback Inmediato**
- Toasts mejorados con iconos
- Animación de "guardado" más evidente
- Sonido subtle para confirmaciones

### 4. **Diseño de Errores**
- Mensajes de error amigables (no "JSON parsing error")
- Sugerencias claras para resolver

---

## 🎯 Prioridad de Implementación

### **Rápidas** (< 30 min)
- Mejorar contraste de colores
- Agregar más animaciones suaves
- Expandir botones en móvil

### **Medianas** (30 min - 2h)
- Undo/Redo system
- Búsqueda avanzada en pool
- Gráficos de análisis

### **Largas** (> 2h)
- Sincronización en la nube
- Colaboración real-time
- Integración con APIs externas

---

**Propuesto por:** FMG Development Team  
**Versión:** 1.0 Base Edition
