// ─── TRANSLATIONS ────────────────────────────────────────────────────────────
// Add a new language: copy an existing block, change the key (e.g. 'fr'),
// add a lang button in index.html, and add 'fr' to the setLang() call.
// Keys marked PRESERVE are intentionally not translated (setlist, BPM, genre names, etc.)

// ─── I18N ────────────────────────────────────────────────────────────────────
const i18n = {
en:{
  // topbar
  logo_sub:'// setlist builder',
  // nav
  nav_builder:'Builder', nav_pool:'Pool', nav_export:'Export', nav_docs:'Docs',
  // sidebar
  instruments:'Instruments tonight',
  instr_hint:'Generation prioritizes songs suited to the selected instruments.',
  sets:'Sets', duration:'Duration per set',
  genres_label:'Genres to include', genres_all:'all', genres_none:'none',
  import_export:'Import / Export pool',
  btn_export_json:'Export JSON', btn_import_json:'Import JSON', btn_export_bld:'Export',
  quick_start:'Quick start guide',
  qs_1:'Select available instruments',
  qs_2:'Choose # of sets & duration',
  qs_3:'Pick genres to include',
  qs_4:'Click Generate Setlist',
  qs_5:'Drag rows to reorder songs',
  qs_6:'Go to Pool to add/edit songs',
  qs_7:'Export as HTML, JSON, or text',
  qs_note:'All data stays in your browser. No account needed.',
  generate:'Generate Setlist',
  // instruments
  guitar:'Guitar', piano:'Piano', winds:'Winds',
  // api bar
  api_required:'✦ API key required for AI features',
  api_save:'Save', api_what:'What is this?',
  // builder
  night_placeholder:'Night name…',
  btn_save_night:'Save', btn_export:'Export',
  // pool
  pool_title:'Song pool',
  search_ph:'Search…',
  pf_all:'All',
  btn_add_ai:'✦ Add with AI', btn_add_manual:'+ Manual',
  // ai panel
  ai_title:'AI song assistant',
  ai_tab_lookup:'Song lookup', ai_tab_suggest:'Suggest by mood',
  ai_ph_lookup:'e.g. Red House – Jimi Hendrix',
  ai_ph_suggest:'e.g. slow blues, guitar, melancholic, key of Am',
  ai_btn_fill:'Fill info', ai_btn_suggest:'Suggest',
  // pool table headers
  th_song:'Song', th_artist:'Artist', th_genre:'Genre', th_key:'Key',
  th_bpm:'BPM', th_prog:'Progression', th_instr:'Instr.',
  // pool row buttons
  btn_edit:'Edit', btn_delete:'×',
  // export
  export_title:'Export setlist',
  btn_dl_html:'Download HTML', btn_copy_text:'Copy as text', btn_dl_json:'Export JSON',
  // modal
  modal_new:'New song', modal_edit:'Edit song',
  field_title:'Title', field_artist:'Artist', field_genre:'Genre',
  field_key:'Key', field_bpm:'BPM', field_prog:'Progression',
  field_energy:'Energy (1–5)', field_instr:'Best instruments',
  btn_cancel:'Cancel', btn_save:'Save',
  // docs — hero
  docs_hero_p:'A tool for musicians to build, organize, and export setlists — with AI-powered song lookup and mood-based suggestions. All data stays in your browser. No account required.',
  // docs — sections
  docs_getting_started:'Getting started',
  docs_instr_gen:'Instruments & generation',
  docs_ai:'AI features',
  docs_pool:'Song pool',
  docs_export_share:'Export & share',
  docs_github:'Deploying to GitHub Pages',
  docs_tips:'Tips & tricks',
  docs_instr_hint:'When you select Guitar, Piano, or Winds in the sidebar, the algorithm prefers songs tagged for those instruments. Each song has instrument tags (G, P, V) indicating how well it suits each instrument. If there aren\'t enough songs matching your selections, the algorithm falls back to the full pool.',
  docs_energy_title:'Energy curve',
  docs_energy_p:'Each setlist follows a musical energy pattern:',
  docs_energy_note:'This keeps audiences engaged and provides natural peaks and valleys in your performance.',
  docs_energy_1:'Set 1 & 2: Opens slow/mellow, builds toward mid-energy',
  docs_energy_2:'Final set: Climbs higher, ends on a peak',
  docs_ai_provider:'Choosing an API provider',
  docs_ai_provider_p:'Use the dropdown in the settings bar to select which AI provider to use. Each provider has similar performance for music metadata tasks. Claude and ChatGPT tend to be slightly more reliable for complex requests, while Gemini is often faster and cheaper.',
  docs_ai_lookup_p:'Type a song name and artist (e.g. "Red House – Jimi Hendrix") and the AI will automatically fill in the genre, key, BPM, chord progression, energy level, and best instrument fit. Review and click Add to pool to save it.',
  docs_ai_suggest_p:'Describe what you\'re looking for (e.g. "upbeat funk with bass, energetic, Dm") and the AI will suggest 5 songs that fit — with full metadata ready to add to your pool. Works across all genres.',
  docs_pool_p:'The pool is your master library of songs. It comes pre-loaded with 90 carefully curated songs spanning 11 genres — ensuring you have plenty of options without needing AI to generate setlists.',
  docs_pool_li1:'Add songs manually via + Manual',
  docs_pool_li2:'Add songs via AI lookup or suggestion',
  docs_pool_li3:'Edit any song\'s metadata (genre, key, BPM, progression, instruments)',
  docs_pool_li4:'Delete songs from the pool',
  docs_pool_li5:'Export the pool as JSON and import it on another device',
  docs_pool_instr_p:'Each song has an instrument tag (G = Guitar, P = Piano, V = Winds) that controls which songs get prioritized when you select available instruments and genres for generation.',
  docs_export_p:'All data lives in your browser\'s localStorage. To move it between devices or share with collaborators, use the export features:',
  docs_export_li1:'Download HTML — a self-contained styled file of your setlist, ready to print or distribute',
  docs_export_li2:'Copy as text — plain text version for messaging, emails, or notes',
  docs_export_li3:'Export JSON — raw setlist data for archiving',
  docs_export_li4:'Export pool JSON (in Pool view) — save your entire song library as a file',
  docs_export_li5:'Import pool JSON (in Pool view) — load a previously exported pool, merges with no duplicates',
  docs_github_p:'Deploy this app publicly so your band or team can access it from anywhere.',
  docs_github_note:'Each visitor has their own independent song pool and setlist data stored locally in their browser. Data doesn\'t sync between users — use JSON export/import to share pools across devices.',
  docs_tip1_title:'Genre mixing:',
  docs_tip1:'Try selecting 2-3 genres for variety. Blues + Soul creates a cohesive vibe, while Pop + Rock + Soul broadens appeal.',
  docs_tip2_title:'Song sequencing:',
  docs_tip2:'Drag rows to manually fine-tune the energy curve. Avoid two high-energy songs back-to-back.',
  docs_tip3_title:'Test the algorithm:',
  docs_tip3:'Generate several setlists by unchecking/checking genres. The algorithm uses randomization, so each run is slightly different.',
  docs_tip4_title:'Add custom songs:',
  docs_tip4:'Don\'t see a song you want? Go to Pool and add it manually or use AI lookup.',
  docs_tip5_title:'Backup your pool:',
  docs_tip5:'Export your song pool as JSON regularly. Store it somewhere safe in case your browser clears localStorage.',
  docs_tip6_title:'Share setlists:',
  docs_tip6:'Export as HTML for a professional-looking document to share with band members or send to venues.',
  docs_built:'Built for musicians.',
  docs_version:'fmg-setlist v2.3 — 90 songs, 11 genres, AI-powered, multi-provider, open source.',
  // saved nights
  saved_nights:'Saved nights', no_saved:'No saved nights',
  // toasts / confirms
  toast_saved:'Saved: ',
  toast_generated:'Setlist generated — ',
  toast_songs_added:' songs',
  toast_removed:'Removed: ',
  toast_imported:' new songs imported',
  toast_pool_exported:'Pool exported',
  toast_html_dl:'HTML downloaded',
  toast_json_dl:'JSON downloaded',
  toast_copied:'Copied to clipboard',
  toast_api_saved:'API key saved',
  toast_already_set:'Already in this set',
  toast_song_added:'Song added',
  toast_song_updated:'Song updated',
  toast_min_instr:'At least one instrument must be selected',
  toast_req_fields:'Title and artist required',
  toast_invalid_json:'Invalid JSON file',
  confirm_del_song:'" from pool?',
  confirm_del_night:'Delete "', confirm_del_song_prefix:'Remove "',
  confirm_del_night2:'"?',
  api_set_key:'Set your API key first',
  ai_enter_query:'Enter a song or description',
  toast_already_pool:'Already in pool',
  toast_added:'Added: ',
},
es:{
  logo_sub:'// constructor de setlists',
  nav_builder:'Constructor', nav_pool:'Cancionero', nav_export:'Exportar', nav_docs:'Docs',
  instruments:'Instrumentos esta noche',
  instr_hint:'La generación prioriza canciones adecuadas a los instrumentos seleccionados.',
  sets:'Sets', duration:'Duración por set',
  genres_label:'Géneros a incluir', genres_all:'todos', genres_none:'ninguno',
  import_export:'Importar / Exportar pool',
  btn_export_json:'Exportar JSON', btn_import_json:'Importar JSON', btn_export_bld:'Exportar',
  quick_start:'Guía rápida',
  qs_1:'Selecciona los instrumentos disponibles',
  qs_2:'Elige nº de sets y duración',
  qs_3:'Selecciona los géneros a incluir',
  qs_4:'Haz clic en Generar Setlist',
  qs_5:'Arrastra filas para reordenar canciones',
  qs_6:'Ve al Cancionero para agregar/editar',
  qs_7:'Exporta como HTML, JSON o texto',
  qs_note:'Todos los datos se quedan en tu navegador. Sin cuenta.',
  generate:'Generar Setlist',
  guitar:'Guitarra', piano:'Piano', winds:'Vientos',
  api_required:'✦ Se requiere API key para funciones IA',
  api_save:'Guardar', api_what:'¿Qué es esto?',
  night_placeholder:'Nombre de la noche…',
  btn_save_night:'Guardar', btn_export:'Exportar',
  pool_title:'Pool de canciones',
  search_ph:'Buscar…',
  pf_all:'Todas',
  btn_add_ai:'✦ Agregar con IA', btn_add_manual:'+ Manual',
  ai_title:'Asistente IA de canciones',
  ai_tab_lookup:'Buscar canción', ai_tab_suggest:'Sugerir por mood',
  ai_ph_lookup:'ej. Red House – Jimi Hendrix',
  ai_ph_suggest:'ej. blues lento, guitarra, melancólico, tonalidad Am',
  ai_btn_fill:'Rellenar info', ai_btn_suggest:'Sugerir',
  th_song:'Canción', th_artist:'Artista', th_genre:'Género', th_key:'Tono',
  th_bpm:'BPM', th_prog:'Progresión', th_instr:'Instr.',
  btn_edit:'Editar', btn_delete:'×',
  export_title:'Exportar setlist',
  btn_dl_html:'Descargar HTML', btn_copy_text:'Copiar como texto', btn_dl_json:'Exportar JSON',
  modal_new:'Nueva canción', modal_edit:'Editar canción',
  field_title:'Título', field_artist:'Artista', field_genre:'Género',
  field_key:'Tonalidad', field_bpm:'BPM', field_prog:'Progresión',
  field_energy:'Energía (1–5)', field_instr:'Instrumentos que favorece',
  btn_cancel:'Cancelar', btn_save:'Guardar',
  docs_hero_p:'Una herramienta para músicos para construir, organizar y exportar setlists — con búsqueda de canciones por IA y sugerencias por mood. Todos los datos se quedan en tu navegador. Sin cuenta.',
  docs_getting_started:'Primeros pasos',
  docs_instr_gen:'Instrumentos y generación',
  docs_ai:'Funciones IA',
  docs_pool:'Pool de canciones',
  docs_export_share:'Exportar y compartir',
  docs_github:'Publicar en GitHub Pages',
  docs_tips:'Consejos y trucos',
  docs_instr_hint:'Al seleccionar Guitarra, Piano o Vientos, el algoritmo prefiere canciones etiquetadas para esos instrumentos. Si no hay suficientes, usa el pool completo.',
  docs_energy_title:'Curva de energía',
  docs_energy_p:'Cada setlist sigue un patrón de energía musical:',
  docs_energy_note:'Esto mantiene al público enganchado con picos y valles naturales en tu actuación.',
  docs_energy_1:'Sets 1 y 2: Abre suave, construye hacia energía media',
  docs_energy_2:'Set final: Sube más alto, termina en el pico',
  docs_ai_provider:'Elegir proveedor de IA',
  docs_ai_provider_p:'Usa el selector para elegir el proveedor de IA. Claude y ChatGPT son ligeramente más fiables para solicitudes complejas; Gemini suele ser más rápido y económico.',
  docs_ai_lookup_p:'Escribe el nombre de una canción y artista y la IA rellenará automáticamente género, tono, BPM, progresión, energía e instrumentos. Revisa y haz clic en Agregar al pool.',
  docs_ai_suggest_p:'Describe lo que buscas (ej. "funk animado con bajo, energético, Dm") y la IA sugerirá 5 canciones con metadata completa lista para agregar al pool.',
  docs_pool_p:'El pool es tu biblioteca de canciones. Viene precargado con 90 canciones cuidadosamente seleccionadas de 11 géneros.',
  docs_pool_li1:'Agregar canciones manualmente con + Manual',
  docs_pool_li2:'Agregar canciones por búsqueda IA o sugerencia',
  docs_pool_li3:'Editar metadata de cualquier canción (género, tono, BPM, progresión, instrumentos)',
  docs_pool_li4:'Eliminar canciones del pool',
  docs_pool_li5:'Exportar el pool como JSON e importarlo en otro dispositivo',
  docs_pool_instr_p:'Cada canción tiene una etiqueta de instrumento (G = Guitarra, P = Piano, V = Vientos) que controla qué canciones se priorizan según los instrumentos seleccionados.',
  docs_export_p:'Todos los datos viven en el localStorage de tu navegador. Para moverlos entre dispositivos o compartir:',
  docs_export_li1:'Descargar HTML — archivo con estilo listo para imprimir o distribuir',
  docs_export_li2:'Copiar como texto — versión de texto plano para mensajes o notas',
  docs_export_li3:'Exportar JSON — datos del setlist para archivo',
  docs_export_li4:'Exportar pool JSON (en Pool) — guarda toda tu biblioteca como archivo',
  docs_export_li5:'Importar pool JSON (en Pool) — carga un pool exportado, sin duplicados',
  docs_github_p:'Publica esta app para que tu banda o equipo pueda acceder desde cualquier lugar.',
  docs_github_note:'Cada visitante tiene su propio pool y setlists guardados localmente en su navegador. Los datos no se sincronizan entre usuarios — usa export/import JSON para compartir.',
  docs_tip1_title:'Mezcla de géneros:',
  docs_tip1:'Prueba seleccionando 2-3 géneros. Blues + Soul crea un ambiente coherente; Pop + Rock + Soul amplía el atractivo.',
  docs_tip2_title:'Secuencia de canciones:',
  docs_tip2:'Arrastra filas para ajustar manualmente la curva de energía. Evita dos canciones de alta energía seguidas.',
  docs_tip3_title:'Prueba el algoritmo:',
  docs_tip3:'Genera varios setlists marcando/desmarcando géneros. El algoritmo usa aleatoriedad, cada ejecución es diferente.',
  docs_tip4_title:'Agregar canciones personalizadas:',
  docs_tip4:'¿No ves una canción? Ve al Pool y agrégala manualmente o usa búsqueda IA.',
  docs_tip5_title:'Respalda tu pool:',
  docs_tip5:'Exporta tu pool como JSON regularmente y guárdalo en un lugar seguro.',
  docs_tip6_title:'Comparte setlists:',
  docs_tip6:'Exporta como HTML para un documento de aspecto profesional para compartir con tu banda o enviar al venue.',
  docs_built:'Hecho para músicos.',
  docs_version:'fmg-setlist v2.3 — 90 canciones, 11 géneros, potenciado por IA, multi-proveedor, open source.',
  saved_nights:'Noches guardadas', no_saved:'Sin noches guardadas',
  toast_saved:'Guardado: ',
  toast_generated:'Setlist generado — ',
  toast_songs_added:' canciones',
  toast_removed:'Eliminado: ',
  toast_imported:' canciones importadas',
  toast_pool_exported:'Pool exportado',
  toast_html_dl:'HTML descargado',
  toast_json_dl:'JSON descargado',
  toast_copied:'Copiado al portapapeles',
  toast_api_saved:'API key guardada',
  toast_already_set:'Ya está en este set',
  toast_song_added:'Canción agregada',
  toast_song_updated:'Canción actualizada',
  toast_min_instr:'Al menos un instrumento debe estar seleccionado',
  toast_req_fields:'Título y artista requeridos',
  toast_invalid_json:'Archivo JSON inválido',
  confirm_del_song:'" del pool?',
  confirm_del_night:'¿Eliminar "', confirm_del_song_prefix:'¿Eliminar "',
  confirm_del_night2:'"?',
  api_set_key:'Primero establece tu API key',
  ai_enter_query:'Escribe una canción o descripción',
  toast_already_pool:'Ya está en el pool',
  toast_added:'Agregado: ',
},
pt:{
  logo_sub:'// construtor de setlists',
  nav_builder:'Construtor', nav_pool:'Cancioneiro', nav_export:'Exportar', nav_docs:'Docs',
  instruments:'Instrumentos esta noite',
  instr_hint:'A geração prioriza músicas adequadas aos instrumentos selecionados.',
  sets:'Sets', duration:'Duração por set',
  genres_label:'Gêneros a incluir', genres_all:'todos', genres_none:'nenhum',
  import_export:'Importar / Exportar pool',
  btn_export_json:'Exportar JSON', btn_import_json:'Importar JSON', btn_export_bld:'Exportar',
  quick_start:'Guia rápido',
  qs_1:'Selecione os instrumentos disponíveis',
  qs_2:'Escolha nº de sets e duração',
  qs_3:'Selecione os gêneros a incluir',
  qs_4:'Clique em Gerar Setlist',
  qs_5:'Arraste linhas para reordenar músicas',
  qs_6:'Vá ao Cancioneiro para adicionar/editar',
  qs_7:'Exporte como HTML, JSON ou texto',
  qs_note:'Todos os dados ficam no seu navegador. Sem conta.',
  generate:'Gerar Setlist',
  guitar:'Guitarra', piano:'Piano', winds:'Metais/Sopros',
  api_required:'✦ API key necessária para recursos de IA',
  api_save:'Salvar', api_what:'O que é isso?',
  night_placeholder:'Nome da noite…',
  btn_save_night:'Salvar', btn_export:'Exportar',
  pool_title:'Pool de músicas',
  search_ph:'Pesquisar…',
  pf_all:'Todas',
  btn_add_ai:'✦ Adicionar com IA', btn_add_manual:'+ Manual',
  ai_title:'Assistente IA de músicas',
  ai_tab_lookup:'Buscar música', ai_tab_suggest:'Sugerir por mood',
  ai_ph_lookup:'ex. Red House – Jimi Hendrix',
  ai_ph_suggest:'ex. blues lento, guitarra, melancólico, tom Am',
  ai_btn_fill:'Preencher info', ai_btn_suggest:'Sugerir',
  th_song:'Música', th_artist:'Artista', th_genre:'Gênero', th_key:'Tom',
  th_bpm:'BPM', th_prog:'Progressão', th_instr:'Instr.',
  btn_edit:'Editar', btn_delete:'×',
  export_title:'Exportar setlist',
  btn_dl_html:'Baixar HTML', btn_copy_text:'Copiar como texto', btn_dl_json:'Exportar JSON',
  modal_new:'Nova música', modal_edit:'Editar música',
  field_title:'Título', field_artist:'Artista', field_genre:'Gênero',
  field_key:'Tom', field_bpm:'BPM', field_prog:'Progressão',
  field_energy:'Energia (1–5)', field_instr:'Instrumentos favorecidos',
  btn_cancel:'Cancelar', btn_save:'Salvar',
  docs_hero_p:'Uma ferramenta para músicos construírem, organizarem e exportarem setlists — com busca de músicas por IA e sugestões por mood. Todos os dados ficam no seu navegador. Sem conta.',
  docs_getting_started:'Primeiros passos',
  docs_instr_gen:'Instrumentos e geração',
  docs_ai:'Recursos de IA',
  docs_pool:'Pool de músicas',
  docs_export_share:'Exportar e compartilhar',
  docs_github:'Publicar no GitHub Pages',
  docs_tips:'Dicas e truques',
  docs_instr_hint:'Ao selecionar Guitarra, Piano ou Metais, o algoritmo prefere músicas marcadas para esses instrumentos. Se não houver suficientes, usa o pool completo.',
  docs_energy_title:'Curva de energia',
  docs_energy_p:'Cada setlist segue um padrão de energia musical:',
  docs_energy_note:'Isso mantém o público engajado com picos e vales naturais na sua performance.',
  docs_energy_1:'Sets 1 e 2: Abre suave, cresce até energia média',
  docs_energy_2:'Set final: Sobe mais, termina no pico',
  docs_ai_provider:'Escolher provedor de IA',
  docs_ai_provider_p:'Use o seletor para escolher o provedor de IA. Claude e ChatGPT são levemente mais confiáveis para pedidos complexos; Gemini costuma ser mais rápido e barato.',
  docs_ai_lookup_p:'Digite o nome de uma música e artista e a IA preencherá automaticamente gênero, tom, BPM, progressão, energia e instrumentos. Revise e clique em Adicionar ao pool.',
  docs_ai_suggest_p:'Descreva o que você procura e a IA sugerirá 5 músicas com metadata completa pronta para adicionar ao pool.',
  docs_pool_p:'O pool é sua biblioteca de músicas. Vem pré-carregado com 90 músicas cuidadosamente selecionadas de 11 gêneros.',
  docs_pool_li1:'Adicionar músicas manualmente com + Manual',
  docs_pool_li2:'Adicionar músicas por busca IA ou sugestão',
  docs_pool_li3:'Editar metadata de qualquer música',
  docs_pool_li4:'Deletar músicas do pool',
  docs_pool_li5:'Exportar o pool como JSON e importar em outro dispositivo',
  docs_pool_instr_p:'Cada música tem uma tag de instrumento (G = Guitarra, P = Piano, V = Metais) que controla quais músicas são priorizadas.',
  docs_export_p:'Todos os dados vivem no localStorage do seu navegador.',
  docs_export_li1:'Baixar HTML — arquivo estilizado pronto para imprimir ou distribuir',
  docs_export_li2:'Copiar como texto — versão de texto simples para mensagens ou notas',
  docs_export_li3:'Exportar JSON — dados do setlist para arquivamento',
  docs_export_li4:'Exportar pool JSON (em Pool) — salva toda sua biblioteca como arquivo',
  docs_export_li5:'Importar pool JSON (em Pool) — carrega pool exportado, sem duplicatas',
  docs_github_p:'Publique este app para que sua banda ou equipe possa acessar de qualquer lugar.',
  docs_github_note:'Cada visitante tem seu próprio pool e setlists armazenados localmente. Os dados não sincronizam entre usuários.',
  docs_tip1_title:'Mistura de gêneros:',
  docs_tip1:'Tente selecionar 2-3 gêneros. Blues + Soul cria um ambiente coeso; Pop + Rock + Soul amplia o apelo.',
  docs_tip2_title:'Sequência de músicas:',
  docs_tip2:'Arraste linhas para ajustar a curva de energia. Evite duas músicas de alta energia seguidas.',
  docs_tip3_title:'Teste o algoritmo:',
  docs_tip3:'Gere vários setlists marcando/desmarcando gêneros. O algoritmo usa aleatoriedade.',
  docs_tip4_title:'Adicionar músicas personalizadas:',
  docs_tip4:'Não encontrou uma música? Vá ao Pool e adicione manualmente ou use a busca IA.',
  docs_tip5_title:'Faça backup do pool:',
  docs_tip5:'Exporte seu pool como JSON regularmente e guarde em local seguro.',
  docs_tip6_title:'Compartilhe setlists:',
  docs_tip6:'Exporte como HTML para um documento profissional para compartilhar com sua banda.',
  docs_built:'Feito para músicos.',
  docs_version:'fmg-setlist v2.3 — 90 músicas, 11 gêneros, IA, multi-provedor, open source.',
  saved_nights:'Noites salvas', no_saved:'Sem noites salvas',
  toast_saved:'Salvo: ',
  toast_generated:'Setlist gerado — ',
  toast_songs_added:' músicas',
  toast_removed:'Removido: ',
  toast_imported:' músicas importadas',
  toast_pool_exported:'Pool exportado',
  toast_html_dl:'HTML baixado',
  toast_json_dl:'JSON baixado',
  toast_copied:'Copiado para a área de transferência',
  toast_api_saved:'API key salva',
  toast_already_set:'Já está neste set',
  toast_song_added:'Música adicionada',
  toast_song_updated:'Música atualizada',
  toast_min_instr:'Pelo menos um instrumento deve estar selecionado',
  toast_req_fields:'Título e artista são obrigatórios',
  toast_invalid_json:'Arquivo JSON inválido',
  confirm_del_song:'" do pool?',
  confirm_del_night:'Excluir "', confirm_del_song_prefix:'Excluir "',
  confirm_del_night2:'"?',
  api_set_key:'Configure sua API key primeiro',
  ai_enter_query:'Digite uma música ou descrição',
  toast_already_pool:'Já está no pool',
  toast_added:'Adicionado: ',
},
ru:{
  logo_sub:'// конструктор сетлистов',
  nav_builder:'Конструктор', nav_pool:'Каталог', nav_export:'Экспорт', nav_docs:'Помощь',
  instruments:'Инструменты сегодня',
  instr_hint:'Генерация отдаёт приоритет песням, подходящим для выбранных инструментов.',
  sets:'Сеты', duration:'Длительность сета',
  genres_label:'Жанры для включения', genres_all:'все', genres_none:'ничего',
  import_export:'Импорт / Экспорт каталога',
  btn_export_json:'Экспорт JSON', btn_import_json:'Импорт JSON', btn_export_bld:'Экспорт',
  quick_start:'Быстрый старт',
  qs_1:'Выберите доступные инструменты',
  qs_2:'Выберите количество сетов и длительность',
  qs_3:'Выберите жанры для включения',
  qs_4:'Нажмите Создать сетлист',
  qs_5:'Перетащите строки для изменения порядка',
  qs_6:'Перейдите в Каталог для добавления/редактирования',
  qs_7:'Экспортируйте как HTML, JSON или текст',
  qs_note:'Все данные хранятся в вашем браузере. Аккаунт не нужен.',
  generate:'Создать сетлист',
  guitar:'Гитара', piano:'Фортепиано', winds:'Духовые',
  api_required:'✦ API ключ необходим для функций ИИ',
  api_save:'Сохранить', api_what:'Что это такое?',
  night_placeholder:'Название вечера…',
  btn_save_night:'Сохранить', btn_export:'Экспорт',
  pool_title:'База песен',
  search_ph:'Поиск…',
  pf_all:'Все',
  btn_add_ai:'✦ Добавить с ИИ', btn_add_manual:'+ Вручную',
  ai_title:'ИИ-ассистент песен',
  ai_tab_lookup:'Найти песню', ai_tab_suggest:'Предложить по настроению',
  ai_ph_lookup:'напр. Red House – Jimi Hendrix',
  ai_ph_suggest:'напр. медленный блюз, гитара, Am',
  ai_btn_fill:'Заполнить', ai_btn_suggest:'Предложить',
  th_song:'Песня', th_artist:'Артист', th_genre:'Жанр', th_key:'Тональность',
  th_bpm:'BPM', th_prog:'Прогрессия', th_instr:'Инстр.',
  btn_edit:'Изменить', btn_delete:'×',
  export_title:'Экспорт сетлиста',
  btn_dl_html:'Скачать HTML', btn_copy_text:'Копировать текст', btn_dl_json:'Экспорт JSON',
  modal_new:'Новая песня', modal_edit:'Изменить песню',
  field_title:'Название', field_artist:'Артист', field_genre:'Жанр',
  field_key:'Тональность', field_bpm:'BPM', field_prog:'Прогрессия',
  field_energy:'Энергия (1–5)', field_instr:'Подходящие инструменты',
  btn_cancel:'Отмена', btn_save:'Сохранить',
  docs_hero_p:'Инструмент для музыкантов для составления, организации и экспорта сетлистов — с поиском песен через ИИ. Все данные хранятся в вашем браузере.',
  docs_getting_started:'Начало работы',
  docs_instr_gen:'Инструменты и генерация',
  docs_ai:'Функции ИИ',
  docs_pool:'База песен',
  docs_export_share:'Экспорт и обмен',
  docs_github:'Публикация на GitHub Pages',
  docs_tips:'Советы',
  docs_instr_hint:'При выборе инструментов алгоритм предпочитает песни, помеченные для них. Если таких недостаточно, используется весь каталог.',
  docs_energy_title:'Кривая энергии',
  docs_energy_p:'Каждый сетлист следует музыкальной кривой энергии:',
  docs_energy_note:'Это удерживает внимание аудитории, создавая естественные пики и спады.',
  docs_energy_1:'Сеты 1 и 2: Открывается мягко, нарастает к средней энергии',
  docs_energy_2:'Финальный сет: Поднимается выше, заканчивается на пике',
  docs_ai_provider:'Выбор провайдера ИИ',
  docs_ai_provider_p:'Claude и ChatGPT надёжнее для сложных запросов; Gemini обычно быстрее и дешевле.',
  docs_ai_lookup_p:'Введите название песни и артиста — ИИ автоматически заполнит жанр, тональность, BPM, прогрессию, энергию и инструменты.',
  docs_ai_suggest_p:'Опишите, что ищете, и ИИ предложит 5 подходящих песен с полными данными.',
  docs_pool_p:'База — ваша главная библиотека. Поставляется с 90 тщательно отобранными песнями 11 жанров.',
  docs_pool_li1:'Добавлять песни вручную',
  docs_pool_li2:'Добавлять через поиск ИИ',
  docs_pool_li3:'Редактировать метаданные любой песни',
  docs_pool_li4:'Удалять песни из базы',
  docs_pool_li5:'Экспортировать базу как JSON и импортировать на другом устройстве',
  docs_pool_instr_p:'Каждая песня имеет метку инструмента (G = Гитара, P = Фортепиано, V = Духовые).',
  docs_export_p:'Все данные хранятся в localStorage вашего браузера.',
  docs_export_li1:'Скачать HTML — стилизованный файл сетлиста для печати',
  docs_export_li2:'Копировать текст — текстовая версия для сообщений',
  docs_export_li3:'Экспорт JSON — данные сетлиста для архива',
  docs_export_li4:'Экспорт JSON каталога (в Каталоге) — сохранить всю библиотеку',
  docs_export_li5:'Импорт JSON каталога (в Каталоге) — загрузить экспортированный каталог',
  docs_github_p:'Опубликуйте приложение, чтобы группа имела к нему доступ из любого места.',
  docs_github_note:'У каждого посетителя своя база и сетлисты в браузере. Данные не синхронизируются.',
  docs_tip1_title:'Смешение жанров:',
  docs_tip1:'Попробуйте 2-3 жанра. Blues + Soul создаёт единый стиль.',
  docs_tip2_title:'Последовательность песен:',
  docs_tip2:'Перетаскивайте для тонкой настройки кривой энергии.',
  docs_tip3_title:'Тестируйте алгоритм:',
  docs_tip3:'Генерируйте несколько сетлистов — алгоритм использует случайность.',
  docs_tip4_title:'Добавить свои песни:',
  docs_tip4:'Не нашли песню? Добавьте вручную или через ИИ.',
  docs_tip5_title:'Резервная копия:',
  docs_tip5:'Регулярно экспортируйте базу как JSON.',
  docs_tip6_title:'Делитесь сетлистами:',
  docs_tip6:'Экспортируйте как HTML для профессионального документа.',
  docs_built:'Создано для музыкантов.',
  docs_version:'fmg-setlist v2.3 — 90 песен, 11 жанров, ИИ, open source.',
  saved_nights:'Сохранённые вечера', no_saved:'Нет сохранённых вечеров',
  toast_saved:'Сохранено: ',
  toast_generated:'Сетлист создан — ',
  toast_songs_added:' песен',
  toast_removed:'Удалено: ',
  toast_imported:' песен импортировано',
  toast_pool_exported:'Каталог экспортирован',
  toast_html_dl:'HTML скачан',
  toast_json_dl:'JSON скачан',
  toast_copied:'Скопировано',
  toast_api_saved:'API ключ сохранён',
  toast_already_set:'Уже в этом сете',
  toast_song_added:'Песня добавлена',
  toast_song_updated:'Песня обновлена',
  toast_min_instr:'Нужен хотя бы один инструмент',
  toast_req_fields:'Название и артист обязательны',
  toast_invalid_json:'Неверный файл JSON',
  confirm_del_song:'" из каталога?',
  confirm_del_night:'Удалить "', confirm_del_song_prefix:'Удалить "',
  confirm_del_night2:'"?',
  api_set_key:'Сначала введите API ключ',
  ai_enter_query:'Введите песню или описание',
  toast_already_pool:'Уже в каталоге',
  toast_added:'Добавлено: ',
}
};
let currentLang = localStorage.getItem('fmg-lang') || 'en';
function tr(k){return i18n[currentLang]?.[k] ?? i18n.en[k] ?? k;}
function setLang(lang){
  if(!i18n[lang])lang='en';
  currentLang=lang;
  localStorage.setItem('fmg-lang',lang);
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
  function setq(sel,key){
    const el=typeof sel==='string'?document.querySelector(sel):sel;
    if(!el)return;
    const tn=[...el.childNodes].find(n=>n.nodeType===3&&n.textContent.trim());
    if(tn)tn.textContent=tr(key);else el.textContent=tr(key);
  }
  function setph(id,key){const el=document.getElementById(id);if(el)el.placeholder=tr(key);}
  // logo
  setq('.logo-sub','logo_sub');
  // nav
  document.querySelectorAll('.nav-btn[data-i18n]').forEach(b=>b.textContent=tr(b.dataset.i18n));
  // api bar
  const as=document.getElementById('api-status');if(as&&as.classList.contains('missing'))as.textContent=tr('api_required');
  setq('#api-bar .api-save-btn','api_save');
  setq('#api-bar .btn-xs','api_what');
  // sidebar
  setq('.s-label[data-i18n="instruments"]','instruments');
  setq('.instr-hint','instr_hint');
  const cg=document.getElementById('chip-guitar');if(cg)cg.childNodes[cg.childNodes.length-1].textContent=tr('guitar');
  const cp=document.getElementById('chip-piano');if(cp)cp.childNodes[cp.childNodes.length-1].textContent=tr('piano');
  const cw=document.getElementById('chip-wind');if(cw)cw.childNodes[cw.childNodes.length-1].textContent=tr('winds');
  setq('.s-label[data-i18n="sets"]','sets');
  setq('.s-label[data-i18n="duration"]','duration');
  setq('.s-label[data-i18n="genres_label"]','genres_label');
  setq('button[data-i18n="genres_all"]','genres_all');
  setq('button[data-i18n="genres_none"]','genres_none');
  setq('button[data-i18n="generate"]','generate');
  setq('.s-label[data-i18n="import_export"]','import_export');
  setq('button[data-i18n="btn_export_json"]','btn_export_json');
  setq('button[data-i18n="btn_import_json"]','btn_import_json');
  setq('.s-label[data-i18n="quick_start"]','quick_start');
  ['qs_1','qs_2','qs_3','qs_4','qs_5','qs_6','qs_7','qs_note'].forEach(k=>{
    const el=document.querySelector('[data-i18n="'+k+'"]');
    if(!el)return;
    // these elements have a <strong> child + trailing text node
    const tns=[...el.childNodes].filter(n=>n.nodeType===3);
    const last=tns[tns.length-1];
    if(last)last.textContent=' '+tr(k).replace(/^\d+\.\s*/,'');
    else setq(el,k);
  });
  // builder
  setph('night-title','night_placeholder');
  setq('button[data-i18n="btn_save_night"]','btn_save_night');
  setq('button[data-i18n="btn_export_bld"]','btn_export');
  // pool
  setq('.pool-title','pool_title');
  setph('pool-search','search_ph');
  document.querySelectorAll('.pf-btn').forEach(b=>{if(b.dataset.i18n)setq(b,b.dataset.i18n);});
  setq('.ai-add-btn','btn_add_ai');
  setq('.manual-add-btn','btn_add_manual');
  // ai panel
  setq('.ai-panel-title','ai_title');
  const tl=document.getElementById('tab-lookup');if(tl)tl.textContent=tr('ai_tab_lookup');
  const ts=document.getElementById('tab-suggest');if(ts)ts.textContent=tr('ai_tab_suggest');
  setph('ai-lookup-input','ai_ph_lookup');
  setph('ai-suggest-input','ai_ph_suggest');
  const gb=document.getElementById('ai-go-btn');if(gb)gb.textContent=tr('ai_btn_fill');
  const gb2=document.getElementById('ai-go-btn2');if(gb2)gb2.textContent=tr('ai_btn_suggest');
  // pool table headers
  const ths=document.querySelectorAll('.pool-tbl thead th');
  ['','th_song','th_artist','th_genre','th_key','th_bpm','th_prog','th_instr',''].forEach((k,i)=>{if(k&&ths[i])ths[i].textContent=tr(k);});
  // export
  setq('.export-title','export_title');
  const eb=document.querySelectorAll('.exp-btn');
  if(eb[0])eb[0].textContent=tr('btn_dl_html');
  if(eb[1])eb[1].textContent=tr('btn_copy_text');
  if(eb[2])eb[2].textContent=tr('btn_dl_json');
  // modal
  const mt=document.getElementById('modal-title');
  if(mt)mt.textContent=editId?tr('modal_edit'):tr('modal_new');
  const fls=document.querySelectorAll('.flabel');
  ['field_title','field_artist','field_genre','field_key','field_bpm','field_prog','field_energy','field_instr'].forEach((k,i)=>{if(fls[i])fls[i].textContent=tr(k);});
  setq('.btn-cancel','btn_cancel');
  setq('.btn-save','btn_save');
  // saved nights label
  setq('.s-label[data-i18n="saved_nights"]','saved_nights');
  renderSaved();
  // docs h2 sections
  const h2s=document.querySelectorAll('.docs-section h2');
  ['docs_getting_started','docs_instr_gen','docs_ai','docs_pool','docs_export_share','docs_github','docs_tips'].forEach((k,i)=>{if(h2s[i])h2s[i].textContent=tr(k);});
  // docs data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const skip=['nav-btn','s-label','lang-btn','pf-btn'];
    if(skip.some(c=>el.classList.contains(c)))return;
    const k=el.dataset.i18n;
    if(k&&i18n.en[k]!==undefined){
      const tn=[...el.childNodes].find(n=>n.nodeType===3&&n.textContent.trim());
      if(tn)tn.textContent=tr(k);else if(!el.children.length)el.textContent=tr(k);
    }
  });
  renderDocs();
}
