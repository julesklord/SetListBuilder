// ─── SAFETY FALLBACKS ────────────────────────────────────────────────────────
if(typeof pool==='undefined'){ window.pool=[];window.nights=[];window.sets=[];window.numSets=3;window.instrs=['g'];window.pf='all';window.selectedGenres=['Blues','Rock','Pop','Soul','R&B','Ballad'];window.editId=null;window.dragSrc=null;window.nextId=91;window.aiTab='lookup';window.apiProvider='claude';window.apiKeys={claude:'',gemini:'',chatgpt:''};window.mustPlay=new Set();window.DEFAULTS=[]; }
if(typeof mustPlay==='undefined') window.mustPlay=new Set();
if(typeof tr==='undefined') window.tr=function(k){return k;}
let _genreTimer; // genre debounce — module-level so all functions can access

// ─── APP ────────────────────────────────────────────────────────────────────
// Depends on: songs.js → i18n.js → app.js (load order matters)

// Note modal context
let noteModalContext = {si: null, id: null};

// ─── MUST PLAY ───────────────────────────────────────────────────────────────
function toggleMustPlay(id){
  if(mustPlay.has(id)){mustPlay.delete(id);}
  else{mustPlay.add(id);}
  renderPool();
  // update lock icons in current sets
  document.querySelectorAll(`.lock-btn[data-id="${id}"]`).forEach(b=>{
    b.classList.toggle('locked', mustPlay.has(id));
    b.title = mustPlay.has(id) ? 'Remove Must Play' : 'Mark as Must Play';
  });
}

// ─── PERSIST ────────────────────────────────────────────────────────────────
function persist() {
  localStorage.setItem('fmg-pool', JSON.stringify(pool));
  localStorage.setItem('fmg-nights', JSON.stringify(nights));
  localStorage.setItem('fmg-mustPlay', JSON.stringify([...mustPlay]));
}

// ─── CSV IMPORT / EXPORT ─────────────────────────────────────────────────────
function downloadCSVTemplate(){
  var NL = '\n';
  var header = 'title,artist,genre,key,bpm,prog,energy,instr,effort';
  var row1 = '"The Thrill Is Gone","B.B. King","Blues","Bm",90,"i-IV-i-V",3,"g,p",2';
  var row2 = '"Superstition","Stevie Wonder","Funk","Eb",100,"i-VII-i-VII",5,"g,p,v,o",4';
  var row3 = '"Stand by Me","Ben E. King","Soul","A",116,"I-vi-IV-V",4,"g,p,o",3';
  var notes = '# INSTRUCTIONS:' + NL + '# genre: Blues|Rock|Pop|Soul|Funk|R&B|Ballad|Reggae|Latin|Jazz|Country' + NL + '# instr: g=guitar,p=piano,v=winds,o=voice (comma-sep, no spaces)' + NL + '# energy: 1=very calm 5=peak energy' + NL + '# effort: 1=very easy 5=exhausting';
  var csv = notes + NL + header + NL + row1 + NL + row2 + NL + row3 + NL;
  var a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'fmg-songs-template.csv';
  a.click();
  toast('Template downloaded');
}

function importCSV(ev){
  const file = ev.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(e){
    const lines = e.target.result.replace(/\r\n/g,'\n').replace(/\r/g,'\n').split('\n').filter(l=>l.trim()&&!l.startsWith('#'));
    if(!lines.length){toast(tr('toast_invalid_json'));return;}
    // Parse header
    const hdr = lines[0].split(',').map(h=>h.trim().replace(/^"|"$/g,'').toLowerCase());
    const required = ['title','artist','genre'];
    if(!required.every(r=>hdr.includes(r))){
      toast('CSV missing required columns: title, artist, genre');
      return;
    }
    const VALID_GENRES = ['Blues','Rock','Pop','Soul','Funk','R&B','Ballad','Reggae','Latin','Jazz','Country'];
    const INSTR_MAP = {g:'g',p:'p',v:'v',o:'o',guitar:'g',piano:'p',winds:'v',voice:'o'};
    let added = 0, skipped = 0;
    for(let i=1;i<lines.length;i++){
      const vals = parseCSVLine(lines[i]);
      if(vals.length < 3) continue;
      const row = {};
      hdr.forEach((h,j)=>row[h]=vals[j]||'');
      const title  = row.title?.trim();
      const artist = row.artist?.trim();
      if(!title||!artist){skipped++;continue;}
      if(pool.find(x=>x.title.toLowerCase()===title.toLowerCase()&&x.artist.toLowerCase()===artist.toLowerCase())){skipped++;continue;}
      const instrRaw = (row.instr||'g').split(',').map(x=>x.trim().toLowerCase());
      const instr = instrRaw.map(x=>INSTR_MAP[x]).filter(Boolean);
      const genre = VALID_GENRES.includes(row.genre)||VALID_GENRES.map(g=>g.toLowerCase()).includes((row.genre||'').toLowerCase())
        ? VALID_GENRES.find(g=>g.toLowerCase()===(row.genre||'').toLowerCase())||'Blues'
        : 'Blues';
      const song = {
        id: nextId++,
        title, artist, genre,
        key:   row.key?.trim()||'C',
        bpm:   Math.max(40,Math.min(250,parseInt(row.bpm)||100)),
        prog:  row.prog?.trim()||'I-IV-V',
        energy:Math.min(5,Math.max(1,parseInt(row.energy)||3)),
        instr: instr.length?instr:['g'],
        effort:Math.min(5,Math.max(1,parseInt(row.effort)||2))
      };
      pool.push(song);
      added++;
    }
    persist();
    renderPool();
    ev.target.value = '';
    toast(added+tr('toast_songs_added')+' imported'+(skipped?' ('+skipped+' skipped)':''));
  };
  reader.readAsText(file);
}

function parseCSVLine(line){
  // Handle quoted fields with commas inside
  const result = [];
  let cur = '', inQ = false;
  for(let i=0;i<line.length;i++){
    const ch = line[i];
    if(ch==='"'){inQ=!inQ;}
    else if(ch===','&&!inQ){result.push(cur.trim());cur='';}
    else{cur+=ch;}
  }
  result.push(cur.trim());
  return result;
}

// ─── EFFORT WEIGHTS ──────────────────────────────────────────────────────────
function saveEffortWeights(){
  const codes = ['eg','ag','b','dr','k','sx','tp','tb','vo','bv','pc'];
  const inputs = {};
  codes.forEach(c=>{
    inputs[c] = Math.min(5,Math.max(0.5,parseFloat(document.getElementById('ew-'+c)?.value)||1.0));
  });
  effortWeights = inputs;
  localStorage.setItem('fmg-effort-weights', JSON.stringify(effortWeights));
  toast('Effort weights saved');
}

function renderEffortWeights(){
  ['eg','ag','b','dr','k','sx','tp','tb','vo','bv','pc'].forEach(k=>{
    const el = document.getElementById('ew-'+k);
    if(el) el.value = effortWeights[k]||1.0;
  });
}

// ─── TOAST ──────────────────────────────────────────────────────────────────
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2400);
}

// ─── AI MODELS ───────────────────────────────────────────────────────────────
const models = {
  claude: [
    { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
    { id: 'claude-3-opus-20250219', name: 'Claude 3 Opus' },
    { id: 'claude-3-haiku-20250307', name: 'Claude 3 Haiku' }
  ],
  gemini: [
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
    { id: 'gemini-1.5-flash-001', name: 'Gemini 1.5 Flash' },
    { id: 'gemini-2.0-flash-thinking-exp-01-21', name: 'Gemini 2.0 Flash Thinking' }
  ],
  chatgpt: [
    { id: 'gpt-4o', name: 'GPT-4o' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini' }
  ]
};

let selectedModel = localStorage.getItem('fmg-ai-model') || 'gemini-2.5-flash';

// ─── API KEY ─────────────────────────────────────────────────────────────────
function initApiBar(){ /* AI disabled in FOSS version */ }
function updateModelSelector() {
  const modelSelect = document.getElementById('ai-model');
  const providerModels = models[apiProvider] || [];
  const firstModelId = providerModels[0]?.id;
  // Use saved model if it exists for this provider, otherwise use the first one
  if(!providerModels.some(m => m.id === selectedModel)) {
    selectedModel = firstModelId || 'gpt-4o-mini';
    localStorage.setItem('fmg-ai-model', selectedModel);
  }
  modelSelect.innerHTML = providerModels.map(m => 
    `<option value="${m.id}" ${m.id === selectedModel ? 'selected' : ''}>${m.name}</option>`
  ).join('');
}

function updateAIModel() {
  selectedModel = document.getElementById('ai-model').value;
  localStorage.setItem('fmg-ai-model', selectedModel);
}
function updateApiLabel() {
  apiProvider = document.getElementById('api-provider').value;
  localStorage.setItem('fmg-api-provider', apiProvider);
  document.getElementById('api-key-input').value = '';
  updateModelSelector();
  setTheme(localStorage.getItem('fmg-theme')||'dark');
setLang(currentLang);
renderDocs();
initApiBar();
}
function saveApiKey() {
  const val = document.getElementById('api-key-input').value.trim();
  if (!val || val.startsWith('••')) return;
  if(val.length < 10){toast('API key seems too short');return;}
  apiKeys[apiProvider] = val;
  localStorage.setItem('fmg-api-key-'+apiProvider, val);
  initApiBar();
  toast(tr('toast_api_saved')+' '+apiProvider);
}

// ─── NAVIGATION ─────────────────────────────────────────────────────────────
function gotoView(v) {
  document.querySelectorAll('.view').forEach(el=>el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el=>el.classList.remove('active'));
  const viewEl = document.getElementById('view-'+v);
  if(viewEl) viewEl.classList.add('active');
  const navOrder = ['builder','shows','pool','export','docs'];
  const navIdx = navOrder.indexOf(v);
  const navBtns = document.querySelectorAll('.nav-btn');
  if(navIdx >= 0 && navBtns[navIdx]) navBtns[navIdx].classList.add('active');
  if(v==='pool')   renderPool();
  if(v==='export') renderExport();
  if(v==='docs')   renderDocs();
  if(v==='shows')  renderShows();
}

// ─── INSTRUMENTS / SETS ─────────────────────────────────────────────────────
function toggleInstr(name){
  // name is the chip name (eguitar, bass, drums, etc.)
  // map to instrument code
  const NAME_TO_CODE = {eguitar:'eg',aguitar:'ag',bass:'b',drums:'dr',keys:'k',sax:'sx',trumpet:'tp',trombone:'tb',vocal:'vo',backing:'bv',percussion:'pc'};
  const code = NAME_TO_CODE[name] || name;
  if(instrs.includes(code)){
    if(instrs.length===1){toast(tr('toast_min_instr'));return;}
    instrs = instrs.filter(x=>x!==code);
  } else {
    instrs.push(code);
  }
  localStorage.setItem('fmg-instrs', JSON.stringify(instrs));
  // Sync all chips with this name
  ['chip-'+name, 'chip-'+name+'-m'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.classList.toggle('on', instrs.includes(code));
  });
}

function setN(n) {
  numSets=n;
  document.querySelectorAll('.sc-btn').forEach((b,i)=>b.classList.toggle('on',[2,3,4][i]===n));
}

// ─── GENERATE ────────────────────────────────────────────────────────────────
function setAllGenres(val){
  const ids = ['blues','rock','pop','soul','funk','rnb','ballad','reggae','latin','jazz','country','disco','rbmodern','funksoul','rocklatino','cumbia','poplatino','balada','merengue','ranchera','reggaeton','synthpop','raprock','ska'];
  ids.forEach(g=>{
    ['genre-'+g, 'genre-'+g+'-m'].forEach(id=>{
      const el=document.getElementById(id);
      if(el) el.checked=val;
    });
  });
  generate();
}
function updateGenreFilters(){
  const ALL_GENRES = ['Blues','Rock','Pop','Soul','Funk','R&B','Ballad','Reggae','Latin','Jazz','Country','Disco','R&B Modern','Funk/Soul','Rock Latino','Cumbia','Pop Latino','Balada','Merengue','Ranchera','Reggaetón','Synth-Pop','Rap Rock','Ska'];
  const ID_MAP = {Blues:'blues',Rock:'rock',Pop:'pop',Soul:'soul',Funk:'funk','R&B':'rnb',Ballad:'ballad',Reggae:'reggae',Latin:'latin',Jazz:'jazz',Country:'country',Disco:'disco','R&B Modern':'rbmodern','Funk/Soul':'funksoul','Rock Latino':'rocklatino',Cumbia:'cumbia','Pop Latino':'poplatino',Balada:'balada',Merengue:'merengue',Ranchera:'ranchera','Reggaetón':'reggaeton','Synth-Pop':'synthpop','Rap Rock':'raprock',Ska:'ska'};
  selectedGenres = ALL_GENRES.filter(g=>{
    const el = document.getElementById('genre-'+ID_MAP[g]);
    return el ? el.checked : true;
  });
  if(!selectedGenres.length) selectedGenres = [...ALL_GENRES];
}
function generate(){
  if(typeof mustPlay==='undefined') mustPlay=new Set();
  if(!pool||!pool.length){toast('Pool empty — add songs first');return;}
  updateGenreFilters();
  const durEl = document.getElementById('dur-sel');
  const dur = durEl ? parseInt(durEl.value)||45 : 45;
  const sps = Math.max(5, Math.round(dur / 4.5));

  // Eligible songs
  let elig = pool.filter(s=>s.instr.some(i=>instrs.includes(i))&&selectedGenres.includes(s.genre));
  if(elig.length < sps*numSets) elig = pool.filter(s=>selectedGenres.includes(s.genre));
  if(elig.length < sps*numSets) elig = [...pool];

  const sh = a=>[...a].sort(()=>Math.random()-.5);

  // Must-play songs (distributed evenly)
  const mpSongs = [...mustPlay].map(id=>pool.find(s=>s.id===id)).filter(Boolean);
  const used = new Set(mpSongs.map(s=>s.id));
  const free = elig.filter(s=>!mustPlay.has(s.id));

  // Effort score for a song given current instrument weights
  function songEffort(s){
    const w = s.instr.reduce((max,i)=>Math.max(max, effortWeights[i]||1.0), 1.0);
    return (s.effort||2) * w;
  }

  // Total effort for a set
  function setEffort(arr){ return arr.reduce((t,s)=>t+songEffort(s),0); }

  // Energy buckets
  const low  = sh(free.filter(s=>s.energy<=2));
  const mid  = sh(free.filter(s=>s.energy===3));
  const high = sh(free.filter(s=>s.energy>=4));
  const fb   = sh(free);

  function pick(arr,n,usedSet){
    const o=[];
    for(const s of arr){if(o.length>=n)break;if(!usedSet.has(s.id)){o.push(s);usedSet.add(s.id);}}
    return o;
  }

  // Build candidate sets
  const mpPerSet = Math.ceil(mpSongs.length/numSets);
  let candidates = [];
  for(let i=0;i<numSets;i++){
    const setMp = mpSongs.slice(i*mpPerSet,(i+1)*mpPerSet);
    const rem = sps - setMp.length;
    const last = i===numSets-1;
    const lN = Math.max(0,last?Math.floor(rem*.2):Math.floor(rem*.35));
    const hN = Math.max(0,last?Math.floor(rem*.4):Math.floor(rem*.25));
    const mN = Math.max(0,rem-lN-hN);
    let arr = [...setMp,...pick(low,lN,used),...pick(mid,mN,used),...pick(high,hN,used)];
    if(arr.length<sps) arr=[...arr,...pick(fb,sps-arr.length,used)];
    candidates.push(noConsecKey(arr));
  }

  // 50/50 effort balancing: try to redistribute to equalize effort
  // Target effort per set
  const totalEffort = candidates.flat().reduce((t,s)=>t+songEffort(s),0);
  const targetEffort = totalEffort / numSets;

  // Simple swap pass: for each set above target, try to swap a heavy song
  // with a lighter one from an under-target set (max 3 passes)
  const poolById = {};
  pool.forEach(s=>poolById[s.id]=s);

  for(let pass=0;pass<3;pass++){
    const efforts = candidates.map(setEffort);
    const avgE = efforts.reduce((a,b)=>a+b,0)/numSets;
    for(let i=0;i<numSets;i++){
      if(efforts[i] <= avgE*1.15) continue; // within 15% — ok
      // Find heaviest non-mustplay song in this set
      const heavy = [...candidates[i]]
        .filter(s=>!mustPlay.has(s.id))
        .sort((a,b)=>songEffort(b)-songEffort(a))[0];
      if(!heavy) continue;
      // Find lightest non-mustplay song from a lighter set
      for(let j=0;j<numSets;j++){
        if(i===j||efforts[j]>=avgE) continue;
        const light = [...candidates[j]]
          .filter(s=>!mustPlay.has(s.id))
          .sort((a,b)=>songEffort(a)-songEffort(b))[0];
        if(!light) continue;
        // Only swap if it improves balance
        const diffBefore = Math.abs(efforts[i]-efforts[j]);
        const newI = efforts[i]-songEffort(heavy)+songEffort(light);
        const newJ = efforts[j]-songEffort(light)+songEffort(heavy);
        const diffAfter = Math.abs(newI-newJ);
        if(diffAfter<diffBefore){
          // Do the swap
          candidates[i] = candidates[i].map(s=>s.id===heavy.id?light:s);
          candidates[j] = candidates[j].map(s=>s.id===light.id?heavy:s);
          break;
        }
      }
    }
  }

  sets = candidates;
  renderSets();
  const total = sets.reduce((a,s)=>a+s.length,0);
  toast(tr('toast_generated')+total+tr('toast_songs_added'));
}
function noConsecKey(a){
  const r=[...a];
  for(let i=1;i<r.length;i++){if(r[i].key===r[i-1].key&&i+1<r.length){const t=r[i];r[i]=r[i+1];r[i+1]=t;}}
  return r;
}

// ─── RENDER SETS ─────────────────────────────────────────────────────────────
function durMin(songs){return Math.round(songs.reduce((a,s)=>a+(s.bpm>90?3.5:s.bpm>70?4.5:5.5),0));}
function renderSets(){
  const area=document.getElementById('sets-area');
  area.innerHTML='';
  if(!sets.length){
    area.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text3);font-family:var(--font-mono);font-size:12px;flex-direction:column;gap:8px;"><div>No sets generated yet.</div><div style="font-size:10px;">Click Generate Setlist in the sidebar.</div></div>';
    return;
  }
  sets.forEach((songs,si)=>{
    const ep=Math.round((songs.reduce((a,s)=>a+s.energy,0)/(songs.length*5||1))*100);
    const card=document.createElement('div');
    card.className='set-card';
    card.innerHTML=`
      <div class="set-hdr">
        <span class="set-hdr-title">Set ${si+1}</span>
        <span class="set-hdr-meta">${songs.length} songs · ~${durMin(songs)} min</span>
        <div class="ebar"><div class="ebar-fill" style="width:${ep}%"></div></div>
      </div>
      <div id="ss-${si}">${songs.map((s,i)=>sRow(s,i,si)).join('')}</div>
      <div class="add-row">
        <select class="add-sel" id="as-${si}">
          <option value="">+ Add song…</option>
          ${pool.map(s=>`<option value="${s.id}">${s.title} — ${s.artist}</option>`).join('')}
        </select>
        <button class="add-btn" onclick="addToSet(${si})">Add</button>
      </div>`;
    area.appendChild(card);
  });
  attachDrag();
}
function sRow(s,i,si){
  const gClass=s.genre==='R&B'?'RnB':s.genre;
  const mpIcon = mustPlay.has(s.id) ? '<span class="mp-icon" title="Must Play">⚑</span>' : '';
  const effortDots = Array.from({length:5},(_,j)=>`<div class="efd${j<(s.effort||2)?' on':''}"></div>`).join('');
  const noteIndicator = s.note ? '<span style="color:var(--gold);font-size:11px;">✎</span>' : '';
  return `<div class="song-row" draggable="true" data-id="${s.id}" data-si="${si}">
    <span class="dh">⠿</span>
    <span class="snum">${i+1}</span>
    <div class="sinfo">
      <div class="stitle">${mpIcon}${s.title}</div>
      <div class="sartist">${s.artist}</div>
    </div>
    <span class="skey">${s.key}</span><span class="sbpm">${s.bpm}</span>
    <span class="sbadge b${gClass}">${s.genre}</span>
    <div class="emini" title="Energy">${Array.from({length:5},(_,j)=>`<div class="ed${j<s.energy?' on':''}${j<s.energy&&s.energy>=4?' hi':''}"></div>`).join('')}</div>
    <button class="note-btn" onclick="openNoteModal(${si},${s.id})" title="Add note..." style="padding:4px 8px;background:transparent;border:0.5px solid var(--border2);color:var(--text3);border-radius:var(--r);cursor:pointer;font-size:12px;transition:all .15s;">${noteIndicator || '+ note'}</button>
    <button class="srem" onclick="remFromSet(${si},${s.id})">×</button>
  </div>`;
}
function attachDrag(){
  document.querySelectorAll('.song-row').forEach(r=>{
    r.addEventListener('dragstart',e=>{dragSrc=r;r.classList.add('dragging');e.dataTransfer.effectAllowed='move';});
    r.addEventListener('dragend',()=>{r.classList.remove('dragging');dragSrc=null;document.querySelectorAll('.song-row').forEach(x=>x.classList.remove('drag-over'));});
    r.addEventListener('dragover',e=>{e.preventDefault();if(r!==dragSrc)r.classList.add('drag-over');});
    r.addEventListener('dragleave',()=>r.classList.remove('drag-over'));
    r.addEventListener('drop',e=>{
      e.preventDefault();r.classList.remove('drag-over');
      if(!dragSrc||dragSrc===r)return;
      const ss=parseInt(dragSrc.dataset.si),si=parseInt(r.dataset.si);
      if(ss!==si)return;
      const set=sets[ss];
      const fi=set.findIndex(s=>s.id===parseInt(dragSrc.dataset.id));
      const ti=set.findIndex(s=>s.id===parseInt(r.dataset.id));
      const[m]=set.splice(fi,1);set.splice(ti,0,m);
      renderSets();
    });
  });
}
function remFromSet(si,id){sets[si]=sets[si].filter(s=>s.id!==id);renderSets();}

// ─── NOTE MODAL ────────────────────────────────────────────────────────────
function openNoteModal(si, id){
  noteModalContext = {si, id};
  const song = sets[si]?.find(x=>x.id===id);
  if(!song) return;
  document.getElementById('m-note').value = song.note || '';
  document.getElementById('note-modal').classList.add('open');
}
function closeNoteModal(){
  document.getElementById('note-modal').classList.remove('open');
  noteModalContext = {si: null, id: null};
}
function saveNote(){
  const {si, id} = noteModalContext;
  if(si === null || id === null) return;
  if(!sets[si]) return;
  const song = sets[si].find(x=>x.id===id);
  if(song) {
    song.note = document.getElementById('m-note').value.trim();
    persist();
    renderSets();
  }
  closeNoteModal();
  toast('Note saved');
}
function setSongNote(si, id, val){
  if(!sets[si]) return;
  const s = sets[si].find(x=>x.id===id);
  if(s) s.note = val.trim();
}

function addToSet(si){
  const sel=document.getElementById('as-'+si);
  if(!sel)return;
  const id=parseInt(sel.value);if(!id)return;
  if(!sets[si])return;
  if(sets[si].find(s=>s.id===id)){toast(tr('toast_already_set'));return;}
  const s=pool.find(x=>x.id===id);
  if(s){sets[si].push(s);renderSets();}
}

// ─── SAVED NIGHTS ────────────────────────────────────────────────────────────
function saveNight(){
  const title=document.getElementById('night-title').value.trim()||'Untitled';
  const date=new Date().toLocaleDateString('en-US',{month:'short',day:'2-digit'});
  nights.unshift({id:Date.now(),title,date,sets:sets.map(s=>[...s]),instrs:[...instrs]});
  if(nights.length>30)nights.pop();
  persist();renderSaved();toast(tr('toast_saved')+title);
  renderShows();
}
function loadNight(id){
  const n=nights.find(x=>x.id===id);if(!n)return;
  sets=n.sets.map(s=>s.filter(song=>song&&song.id).map(song=>pool.find(p=>p.id===song.id)||song));
  instrs=(Array.isArray(n.instrs)&&n.instrs.length>0)?n.instrs:['g'];
  document.getElementById('night-title').value=n.title;
  // Update instrument chips
  document.querySelectorAll('[id^="chip-"]').forEach(el=>el.classList.remove('on'));
  const map={'eg':'eguitar','ag':'aguitar','b':'bass','dr':'drums','k':'keys','sx':'sax','tp':'trumpet','tb':'trombone','vo':'vocal','bv':'backing','pc':'percussion'};
  instrs.forEach(i=>{const id=map[i];if(id)document.getElementById('chip-'+id)?.classList.add('on');});
  renderSets();gotoView('builder');
  document.querySelectorAll('.sv-item').forEach(el=>el.classList.toggle('cur',parseInt(el.dataset.id)===id));
}
function delNight(id){
  const n=nights.find(x=>x.id===id);
  if(n&&!confirm(tr('confirm_del_night')+n.title+tr('confirm_del_night2')))return;
  nights=nights.filter(x=>x.id!==id);persist();renderSaved();
}
function renderShows(){
  const area = document.getElementById('shows-full-list');
  if(!area) return;
  if(!nights.length){
    area.innerHTML = '<div style="color:var(--text3);font-family:var(--font-mono);font-size:12px;padding:1rem 0;">'+tr('no_saved')+'</div>';
    return;
  }
  area.innerHTML = nights.map(n=>{
    const date = n.date ? new Date(n.date).toLocaleDateString() : '';
    const setCount = n.sets ? n.sets.length : 0;
    const songCount = n.sets ? n.sets.reduce((a,s)=>a+s.length,0) : 0;
    return `<div class="show-card">
      <div class="show-card-info">
        <div class="show-card-title">${n.title}</div>
        <div class="show-card-meta">${date ? date+' · ' : ''}${setCount} sets · ${songCount} songs</div>
      </div>
      <div class="show-card-actions">
        <button class="btn-xs" onclick="loadNight(${n.id})">Load</button>
        <button class="btn-xs" style="color:var(--text3)" onclick="delNight(${n.id})">×</button>
      </div>
    </div>`;
  }).join('');
}

function renderSaved(){
  const el=document.getElementById('saved-list');
  if(!nights.length){el.innerHTML="<div class=\"sv-empty\">" + tr('no_saved') + "</div>";return;}
  el.innerHTML=nights.map(n=>`
    <div class="sv-item" data-id="${n.id}" onclick="loadNight(${n.id})">
      <span class="sv-date">${n.date}</span>
      <span class="sv-name">${n.title}</span>
      <button class="sv-del" onclick="event.stopPropagation();delNight(${n.id})">×</button>
    </div>`).join('');
}

// ─── POOL ────────────────────────────────────────────────────────────────────
function setPF(f,btn){pf=f;document.querySelectorAll('.pf-btn').forEach(b=>b.classList.remove('on'));btn.classList.add('on');renderPool();}
function renderPool(){
  const q=(document.getElementById('pool-search')?.value||'').toLowerCase();
  let s=pool;
  if(pf!=='all')s=s.filter(x=>x.genre===pf);
  if(q)s=s.filter(x=>x.title.toLowerCase().includes(q)||x.artist.toLowerCase().includes(q));
  const pc=document.getElementById('pool-count');
  if(pc)pc.textContent=s.length+' / '+pool.length;
  document.getElementById('pool-tbody').innerHTML=s.map((x,i)=>{
    const gClass=x.genre==='R&B'?'RnB':x.genre;
    return `<tr>
      <td style="color:var(--text3);font-family:var(--font-mono);font-size:10px;">${i+1}</td>
      <td class="pt">${x.title}</td><td class="pa">${x.artist}</td>
      <td><span class="sbadge b${gClass}">${x.genre}</span></td>
      <td class="pk">${x.key}</td><td class="pb">${x.bpm}</td><td class="pe">${x.effort||2}</td><td class="pp">${x.prog}</td>
      <td><div class="pi">
        ${x.instr.includes('g')?'<div class="id id-g">G</div>':''}
        ${x.instr.includes('p')?'<div class="id id-p">P</div>':''}
        ${x.instr.includes('v')?'<div class="id id-v">V</div>':''}
      </div></td>
      <td style="white-space:nowrap;display:flex;gap:3px;align-items:center;">
        <button class="lock-btn${mustPlay.has(x.id)?' locked':''}" data-id="${x.id}" onclick="toggleMustPlay(${x.id})" title="${mustPlay.has(x.id)?'Remove Must Play':'Mark as Must Play'}">⚑</button>
        <button class="eb-btn" onclick="openEdit(${x.id})">Edit</button>
        <button class="dl-btn" onclick="delSong(${x.id})">×</button>
      </td>
    </tr>`;
  }).join('');
}
function delSong(id){
  const s=pool.find(x=>x.id===id);if(!s)return;
  if(!confirm((i18n[currentLang]?.confirm_del_song_prefix||i18n.en.confirm_del_song_prefix)+s.title+tr('confirm_del_song')))return;
  pool=pool.filter(x=>x.id!==id);persist();renderPool();
  toast(tr('toast_removed')+s.title);
}

// ─── AI PANEL ────────────────────────────────────────────────────────────────
let aiResults = []; // Almacena resultados de IA
let aiSongCount = 5; // Default number of songs for AI suggestions

function setAICount(n){
  aiSongCount = n;
  document.querySelectorAll('.ai-count-btn').forEach(b=>b.classList.toggle('on', parseInt(b.dataset.n)===n));
  localStorage.setItem('fmg-ai-count', String(n));
}

function toggleAIPanel(){
  // AI features disabled in FOSS version
  toast('AI features not available in this version');
  return;
  // eslint-disable-next-line no-unreachable
  const p=document.getElementById('ai-panel');
  p.classList.toggle('open');
}
function setAITab(t){
  aiTab=t;
  document.getElementById('tab-lookup').classList.toggle('on',t==='lookup');
  document.getElementById('tab-suggest').classList.toggle('on',t==='suggest');
  document.getElementById('ai-lookup-ui').style.display=t==='lookup'?'block':'none';
  document.getElementById('ai-suggest-ui').style.display=t==='suggest'?'block':'none';
  document.getElementById('ai-results').innerHTML='';
  document.getElementById('ai-status').textContent='';
}
// ─── AI HELPERS (global) ─────────────────────────────────────────────────────
function cleanJSON(raw) {
  let clean = raw.trim();
  
  // Remove markdown code blocks
  clean = clean.replace(/^```json\s*/i, '').replace(/```\s*$/, '');
  clean = clean.replace(/^```\s*/i, '').replace(/```\s*$/, '');
  
  // Find and extract JSON array
  const start = clean.indexOf('[');
  const end = clean.lastIndexOf(']');
  if(start !== -1 && end !== -1 && end > start) {
    clean = clean.substring(start, end + 1);
  }
  clean = clean.trim();
  
  // Fix common issues without breaking the JSON
  // Replace smart quotes with regular quotes (outside of JSON strings)
  clean = clean.replace(/[""]/g, '"').replace(/[']/g, "'");
  
  // Remove problematic control characters but keep newlines in context
  clean = clean.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  return clean;
}



function normalizeInstr(raw) {
  const MAP={guitar:'g',guitarra:'g',g:'g',piano:'p',keyboards:'p',keys:'p',p:'p',
    winds:'v',wind:'v',brass:'v',horns:'v',v:'v',
    voice:'o',vocals:'o',vocal:'o',voz:'o',singing:'o',o:'o'};
  if(!Array.isArray(raw)) return ['g'];
  const result=[];
  for(const item of raw){
    const code=MAP[String(item).toLowerCase().trim()];
    if(code&&!result.includes(code)) result.push(code);
  }
  return result.length?result:['g'];
}

async function runAI(){
  const currentKey = apiKeys[apiProvider];
  if(!currentKey){toast(tr('api_set_key'));gotoView('docs');return;}
  const status=document.getElementById('ai-status');
  const results=document.getElementById('ai-results');
  const goBtn=document.getElementById(aiTab==='lookup'?'ai-go-btn':'ai-go-btn2');
  const query=document.getElementById(aiTab==='lookup'?'ai-lookup-input':'ai-suggest-input').value.trim();
  if(!query){toast(tr('ai_enter_query'));return;}
  status.className='ai-status loading';status.textContent='Asking '+apiProvider+'…';
  results.innerHTML='';goBtn.disabled=true;

    const EXAMPLE = JSON.stringify([{title:"Song Title",artist:"Artist Name",genre:"Blues",key:"Am",bpm:90,prog:"i-iv-V",energy:3,instr:["g"]}]);
  const GENRES = "Blues, Rock, Pop, Soul, Funk, R&B, Ballad, Reggae, Latin, Jazz, Country";
  const INSTR_RULES = "instr: array of codes only: g=guitar p=piano v=winds o=voice. Keep prog under 30 chars.";
  const systemPrompt = aiTab==='lookup'
    ? `You are a music metadata expert. The user gives you a song title and artist.
Return ONLY a valid JSON array with exactly ONE object. No markdown, no text outside the JSON.
Fields: title, artist, genre (one of: ${GENRES}), key (e.g. "Am"), bpm (integer), prog (chord progression), energy (integer 1-5), instr (array).
${INSTR_RULES}
Exact format: ${EXAMPLE}`
    : `You are a music expert. The user describes a musical style or mood.
Return ONLY a valid JSON array of exactly ${aiSongCount} song objects. No markdown, no text outside the JSON.
Fields: title, artist, genre (one of: ${GENRES}), key (e.g. "Am"), bpm (integer), prog (chord progression), energy (integer 1-5), instr (array).
${INSTR_RULES}
Exact format: ${EXAMPLE}`;

  try {
    let songs;
    if(apiProvider==='claude'){
      const res=await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST',
        headers:{'Content-Type':'application/json','x-api-key':currentKey,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
        body:JSON.stringify({model:selectedModel,max_tokens:2048,temperature:0.3,system:systemPrompt,messages:[{role:'user',content:query}]})
      });
      if(!res.ok){const e=await res.json();throw new Error(e.error?.message||'API error '+res.status);}
      const data=await res.json();
      const raw=data.content.map(c=>c.text||'').join('');
      const clean=cleanJSON(raw);
      try {
        songs=JSON.parse(clean);
      } catch(e) {
        console.error('Raw response:', raw);
        console.error('Cleaned:', clean);
        throw new Error('Invalid JSON from Claude: ' + e.message);
      }
    } else if(apiProvider==='gemini'){
      const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${currentKey}`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({contents:[{parts:[{text:systemPrompt+'\n\nUser request: '+query}]}],generationConfig:{temperature:0.3,maxOutputTokens:2048,responseMimeType:'application/json'}})
      });
      if(!res.ok){const e=await res.json();throw new Error(e.error?.message||'API error '+res.status);}
      const data=await res.json();
      const candidate=data.candidates?.[0];
      if(candidate?.finishReason==='MAX_TOKENS') throw new Error('Response truncated — try fewer songs');
      const raw=candidate?.content?.parts?.[0]?.text||'';
      const clean=cleanJSON(raw);
      try {
        songs=JSON.parse(clean);
      } catch(e) {
        console.error('Raw response:', raw);
        console.error('Cleaned:', clean);
        throw new Error('Invalid JSON from Gemini: ' + e.message);
      }
    } else if(apiProvider==='chatgpt'){
      const res=await fetch('https://api.openai.com/v1/chat/completions',{
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+currentKey},
        body:JSON.stringify({model:selectedModel,max_tokens:2048,messages:[{role:'system',content:systemPrompt},{role:'user',content:query}]})
      });
      if(!res.ok){const e=await res.json();throw new Error(e.error?.message||'API error '+res.status);}
      const data=await res.json();
      const raw=data.choices?.[0]?.message?.content||'';
      const clean=cleanJSON(raw);
      try {
        songs=JSON.parse(clean);
      } catch(e) {
        console.error('Raw response:', raw);
        console.error('Cleaned:', clean);
        throw new Error('Invalid JSON from ChatGPT: ' + e.message);
      }
    }
    songs=songs.filter(s=>s&&s.title&&s.artist).map(s=>({
      title:String(s.title||'').trim(), artist:String(s.artist||'').trim(),
      genre:['Blues','Rock','Pop','Soul','Funk','R&B','Ballad','Reggae','Latin','Jazz','Country'].includes(s.genre)?s.genre:'Blues',
      key:String(s.key||'C').trim(), bpm:Math.max(40,Math.min(220,parseInt(s.bpm)||90)),
      prog:String(s.prog||'I-IV-V').trim().slice(0,40),
      energy:Math.min(5,Math.max(1,parseInt(s.energy)||3)),
      instr:normalizeInstr(s.instr)
    }));
    if(!songs.length) throw new Error('No valid songs in response');
    status.className='ai-status ok';
    status.textContent=songs.length+' song'+(songs.length!==1?'s':'')+' found';
    aiResults = songs;
    results.innerHTML=songs.map((s,i)=>`
      <div class="ai-result-item" id="air-${i}">
        <div class="ai-result-info">
          <div class="ai-result-title">${s.title} — ${s.artist}</div>
          <div class="ai-result-sub">${s.genre} · ${s.key} · ${s.bpm} BPM · ${s.prog}</div>
        </div>
        <button class="ai-add-song-btn" onclick="addAISong(${i})">Add to pool</button>
      </div>`).join('');
  } catch(e) {
    status.className='ai-status err';
    status.textContent='Error: '+e.message;
  }
  goBtn.disabled=false;
}
function addAISong(i){
  const s = aiResults[i];
  if(!s) return;
  if(pool.find(x=>x.title.toLowerCase()===s.title.toLowerCase()&&x.artist.toLowerCase()===s.artist.toLowerCase())){
    toast(tr('toast_already_pool'));return;
  }
  const song={...s,id:nextId++,instr:normalizeInstr(s.instr),energy:Math.min(5,Math.max(1,parseInt(s.energy)||3)),bpm:Math.max(1,parseInt(s.bpm)||100)};
  pool.push(song);persist();renderPool();
  const btn=document.querySelector(`#air-${i} .ai-add-song-btn`);
  if(btn){btn.textContent='Added ✓';btn.className='ai-add-song-btn added';btn.disabled=true;}
  toast(tr('toast_added')+s.title);
}

// ─── MODAL ───────────────────────────────────────────────────────────────────
function openAddModal(){
  editId=null;
  document.getElementById('modal-title').textContent='New song';
  ['m-title','m-artist','m-key','m-bpm','m-prog'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('m-genre').value='Blues';
  document.getElementById('m-energy').value='3';
  ['g','p','v'].forEach(i=>document.getElementById('mt-'+i).classList.toggle('on',i==='g'));
  document.getElementById('song-modal').classList.add('open');
}
function openEdit(id){
  editId=id;
  const s=pool.find(x=>x.id===id);
  document.getElementById('modal-title').textContent='Edit song';
  document.getElementById('m-title').value=s.title;
  document.getElementById('m-artist').value=s.artist;
  document.getElementById('m-genre').value=s.genre;
  document.getElementById('m-key').value=s.key;
  document.getElementById('m-bpm').value=s.bpm;
  document.getElementById('m-prog').value=s.prog;
  document.getElementById('m-energy').value=s.energy;
  ['eg','ag','b','dr','k','sx','tp','tb','vo','bv','pc'].forEach(k=>{const el=document.getElementById('mt-'+k);if(el)el.classList.toggle('on',Array.isArray(s.instr)&&s.instr.includes(k));});
  document.getElementById('song-modal').classList.add('open');
}
function closeModal(){document.getElementById('song-modal').classList.remove('open');}
function togMI(i){document.getElementById('mt-'+i).classList.toggle('on');}
function saveSong(){
  const title=document.getElementById('m-title').value.trim();
  const artist=document.getElementById('m-artist').value.trim();
  if(!title||!artist){toast(tr('toast_req_fields'));return;}
  const s={
    id:editId||nextId++,title,artist,
    genre:document.getElementById('m-genre').value,
    key:document.getElementById('m-key').value.trim()||'C',
    bpm:parseInt(document.getElementById('m-bpm').value)||72,
    prog:document.getElementById('m-prog').value.trim()||'I–IV–V',
    energy:Math.min(5,Math.max(1,parseInt(document.getElementById('m-energy').value)||3)),
    effort:Math.min(5,Math.max(1,parseInt(document.getElementById('m-effort').value)||2)),
    instr: ['eg','ag','b','dr','k','sx','tp','tb','vo','bv','pc'].filter(c=>document.getElementById('mt-'+c)?.classList.contains('on')),
  };
  if(editId){
    const idx = pool.findIndex(x=>x.id===editId);
    if(idx >= 0) pool[idx]=s;
    else pool.push(s);
  }
  else pool.push(s);
  persist();closeModal();renderPool();
  toast(editId?tr('toast_song_updated'):tr('toast_song_added'));
}

// ─── IMPORT / EXPORT POOL ────────────────────────────────────────────────────
function exportPoolJSON(){
  const a=document.createElement('a');
  a.href='data:application/json;charset=utf-8,'+encodeURIComponent(JSON.stringify(pool,null,2));
  a.download='fmg-pool.json';a.click();toast(tr('toast_pool_exported'));
}
function importPoolJSON(e){
  const file=e.target.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=ev=>{
    try{
      const imported=JSON.parse(ev.target.result);
      let added=0;
      imported.forEach(s=>{
        if(!pool.find(x=>x.title.toLowerCase()===s.title.toLowerCase()&&x.artist.toLowerCase()===s.artist.toLowerCase())){
          pool.push({...s,id:nextId++});added++;
        }
      });
      persist();renderPool();toast(added+tr('toast_imported'));
    }catch{toast(tr('toast_invalid_json'));}
  };
  reader.readAsText(file);
  e.target.value='';
}

// ─── EXPORT SETLIST ──────────────────────────────────────────────────────────
function renderExport(){
  if(!sets.length){
    const ep=document.getElementById('export-preview');
    if(ep)ep.innerHTML='<p style="color:var(--text3);font-family:var(--font-mono);font-size:12px;">'+tr('generate')+'...</p>';
    return;
  }
  const title=document.getElementById('night-title').value||'Setlist';
  const date=new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  const iNames=instrs.map(i=>({'eg':'El.Guitar','ag':'Ac.Guitar','b':'Bass','dr':'Drums','k':'Keys','sx':'Sax','tp':'Trumpet','tb':'Trombone','vo':'Vocal','bv':'BV','pc':'Perc'}[i])||i).join(', ');
  let html=`<div class="exp-night">${title}</div><div class="exp-meta">${date} &nbsp;·&nbsp; ${iNames} &nbsp;·&nbsp; ${numSets} sets</div>`;
  sets.forEach((songs,si)=>{
    html+=`<div class="exp-set"><div class="exp-set-title">Set ${si+1} — ${songs.length} songs · ~${durMin(songs)} min</div>
      ${songs.map((s,i)=>{
        const mp = mustPlay.has(s.id) ? '<span style="color:var(--gold);margin-right:3px;font-size:9px;">⚑</span>' : '';
        const note = s.note ? `<div class="exp-note">${s.note}</div>` : '';
        return `<div class="exp-row"><span class="en">${i+1}</span><span class="et">${mp}${s.title}</span><span class="ea">${s.artist}</span><span class="ek">${s.key}</span><span class="eb">${s.bpm}</span></div>${note}`;
      }).join('')}
    </div>`;
  });
  document.getElementById('export-preview').innerHTML=html;
}
function doExportHTML(){
  const title=document.getElementById('night-title').value||'Setlist';
  const date=new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  const iNames=instrs.map(i=>({'eg':'El.Guitar','ag':'Ac.Guitar','b':'Bass','dr':'Drums','k':'Keys','sx':'Sax','tp':'Trumpet','tb':'Trombone','vo':'Vocal','bv':'BV','pc':'Perc'}[i])||i).join(', ');
  let rows='';
  sets.forEach((songs,si)=>{
    rows+=`<div class="st">Set ${si+1} — ${songs.length} songs · ~${durMin(songs)} min</div>`;
    songs.forEach((s,idx)=>{
      const note = s.note ? `<div class="note">${s.note}</div>` : '';
      const mp   = mustPlay.has(s.id) ? '<span class="mp">⚑</span>' : '';
      rows+=`<div class="r"><span class="n">${idx+1}</span><span class="t">${mp}${s.title}</span><span class="a">${s.artist}</span><span class="k">${s.key}</span><span class="bpm">${s.bpm}</span></div>${note}`;
    });
  });
  const c=`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${title} — FMG</title>
  <style>
    body{font-family:Georgia,serif;background:#fff;color:#111;padding:2rem;max-width:680px;margin:0 auto;}
    h1{font-size:2rem;margin-bottom:3px;}
    .meta{color:#888;font-size:11px;font-family:monospace;margin-bottom:2rem;}
    .st{font-family:monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;
        border-bottom:1px solid #ccc;padding-bottom:4px;margin:1.5rem 0 .4rem;color:#c49a3c;}
    .r{display:flex;gap:10px;padding:5px 0;border-bottom:1px solid #eee;font-size:13px;align-items:baseline;}
    .n{color:#aaa;width:18px;font-family:monospace;font-size:11px;flex-shrink:0;}
    .t{flex:1;font-weight:bold;}.a{color:#666;min-width:100px;}
    .k{font-family:monospace;color:#c49a3c;width:30px;flex-shrink:0;}
    .bpm{font-family:monospace;color:#aaa;font-size:10px;width:36px;flex-shrink:0;}
    .note{font-size:11px;color:#888;font-style:italic;padding:1px 0 4px 26px;}
    .mp{color:#c49a3c;margin-right:3px;font-size:11px;}
    .brand{margin-top:3rem;padding-top:.75rem;border-top:1px solid #eee;font-size:10px;color:#aaa;font-family:monospace;}
  </style></head><body>
  <h1>${title}</h1>
  <div class="meta">${date} · ${iNames}</div>
  ${rows}
  <div class="brand">Fearlessly Media Group · FMG Setlist Builder</div>
  </body></html>`;
  const a=document.createElement('a');
  a.href='data:text/html;charset=utf-8,'+encodeURIComponent(c);
  a.download=title.replace(/\s+/g,'-').toLowerCase()+'.html';
  a.click();
  toast(tr('toast_html_dl'));
}

function doExportPDF(){
  if(!sets.length){toast(tr('generate')+'...');return;}
  const title=document.getElementById('night-title').value||'Setlist';
  const date=new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  const iNames=instrs.map(i=>({'eg':'El.Guitar','ag':'Ac.Guitar','b':'Bass','dr':'Drums','k':'Keys','sx':'Sax','tp':'Trumpet','tb':'Trombone','vo':'Vocal','bv':'BV','pc':'Perc'}[i])||i).join(', ');
  // Build print window
  const w=window.open('','_blank','width=700,height=900');
  if(!w){toast('Pop-up blocked — allow pop-ups for PDF');return;}
  let rows='';
  sets.forEach((songs,si)=>{
    rows+=`<div class="st">Set ${si+1} &nbsp;·&nbsp; ${songs.length} songs &nbsp;·&nbsp; ~${durMin(songs)} min</div>`;
    songs.forEach((s,idx)=>{
      const note = s.note ? `<div class="note">${s.note}</div>` : '';
      const mp   = mustPlay.has(s.id) ? '<span class="mp">⚑</span> ' : '';
      rows+=`<div class="r">
        <span class="n">${idx+1}</span>
        <span class="t">${mp}${s.title}</span>
        <span class="a">${s.artist}</span>
        <span class="k">${s.key}</span>
        <span class="bpm">${s.bpm}</span>
      </div>${note}`;
    });
  });
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
  <title>${title} — FMG</title>
  <style>
    @page{margin:1.5cm 2cm;}
    *{box-sizing:border-box;}
    body{font-family:Georgia,serif;font-size:12px;color:#111;margin:0;padding:0;}
    .cover{margin-bottom:1.5rem;border-bottom:2px solid #c49a3c;padding-bottom:.75rem;}
    h1{font-size:24px;margin:0 0 3px;}
    .meta{font-family:monospace;font-size:10px;color:#888;}
    .st{font-family:monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;
        border-bottom:1px solid #ccc;padding-bottom:3px;margin:1.2rem 0 .3rem;color:#c49a3c;
        page-break-after:avoid;}
    .r{display:flex;gap:8px;padding:4px 0;border-bottom:1px solid #f0f0f0;align-items:baseline;
       page-break-inside:avoid;}
    .n{color:#bbb;width:16px;font-family:monospace;font-size:10px;flex-shrink:0;}
    .t{flex:1;font-weight:bold;font-size:12px;}
    .a{color:#666;min-width:90px;font-size:11px;}
    .k{font-family:monospace;color:#c49a3c;width:28px;flex-shrink:0;font-size:11px;}
    .bpm{font-family:monospace;color:#bbb;font-size:9px;width:32px;flex-shrink:0;}
    .note{font-size:10px;color:#888;font-style:italic;padding:1px 0 3px 24px;page-break-inside:avoid;}
    .mp{color:#c49a3c;font-size:10px;}
    .brand{margin-top:2rem;padding-top:.5rem;border-top:1px solid #eee;font-size:9px;color:#bbb;font-family:monospace;}
    @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
  </style></head><body>
  <div class="cover"><h1>${title}</h1><div class="meta">${date} · ${iNames}</div></div>
  ${rows}
  <div class="brand">Fearlessly Media Group · FMG Setlist Builder</div>
  </body></html>`);
  w.document.close();
  w.focus();
  setTimeout(()=>{w.print();},400);
}

function doExportText(){
  const title=document.getElementById('night-title').value||'Setlist';
  let t=title.toUpperCase()+'\n'+'─'.repeat(title.length)+'\n\n';
  sets.forEach((songs,si)=>{
    t+=`SET ${si+1}  (~${durMin(songs)} min)\n${'─'.repeat(22)}\n`;
    songs.forEach((s,i)=>{t+=`${String(i+1).padStart(2,'0')}. ${s.title} — ${s.artist}  [${s.key} · ${s.bpm} BPM]\n`;});
    t+='\n';
  });
  t+='Fearlessly Media Group';
  if(navigator.clipboard){
    navigator.clipboard.writeText(t).then(()=>toast(tr('toast_copied'))).catch(()=>{
      const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);
      ta.select();document.execCommand('copy');document.body.removeChild(ta);
      toast(tr('toast_copied'));
    });
  } else {
    const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);
    ta.select();document.execCommand('copy');document.body.removeChild(ta);
    toast(tr('toast_copied'));
  }
}
function doExportJSON(){
  const title=document.getElementById('night-title').value||'Setlist';
  const data={title,date:new Date().toISOString(),sets};
  const a=document.createElement('a');
  a.href='data:application/json;charset=utf-8,'+encodeURIComponent(JSON.stringify(data,null,2));
  a.download=title.replace(/\s+/g,'-').toLowerCase()+'.json';a.click();toast(tr('toast_json_dl'));
}

// ─── THEME ───────────────────────────────────────────────────────────────────
function setTheme(t){
  document.documentElement.classList.toggle('light',t==='light');
  localStorage.setItem('fmg-theme',t);
  document.getElementById('btn-dark').style.borderColor=t==='dark'?'var(--gold-border)':'var(--border2)';
  document.getElementById('btn-dark').style.color=t==='dark'?'var(--gold2)':'var(--text3)';
  document.getElementById('btn-light').style.borderColor=t==='light'?'var(--gold-border)':'var(--border2)';
  document.getElementById('btn-light').style.color=t==='light'?'var(--gold2)':'var(--text3)';
}

// ─── DOCS RENDERER ───────────────────────────────────────────────────────────
function renderDocs(){
  const area = document.getElementById('docs-area');
  if(!area) return;
  const T = (k) => tr(k) || '';
  const L = currentLang;
  const kbd = (t) => '<span class="docs-kbd">'+t+'</span>';
  const h3 = (t) => '<h3>'+t+'</h3>';
  const step = (n, txt) => '<div class="docs-step"><div class="docs-step-n">'+n+'</div><p>'+txt+'</p></div>';
  const li = function(){ return '<ul>'+Array.from(arguments).map(function(i){return '<li>'+i+'</li>';}).join('')+'</ul>'; };
  const tip = (title, body) => '<li><strong>'+title+'</strong> '+body+'</li>';

  function loc(en, es, pt, ru){
    if(L==='es') return es;
    if(L==='pt') return pt;
    if(L==='ru') return ru;
    return en;
  }

  const warn = '<div class="docs-warning"><strong>'+
    loc('Important:','Importante:','Importante:','Важно:')+
    '</strong> '+
    loc(
      'AI features require an API key from one of three providers:',
      'Las funciones IA requieren una API key de uno de estos tres proveedores:',
      'Os recursos de IA requerem uma API key de um dos três provedores:',
      'Функции ИИ требуют API ключ от одного из трёх провайдеров:'
    )+
    ' <strong>Claude (Anthropic)</strong>, <strong>Gemini (Google)</strong>, '+
    loc('or','o','ou','или')+
    ' <strong>ChatGPT (OpenAI)</strong>. '+
    loc(
      "Your key is stored only in your browser — never sent anywhere else. Get keys from:",
      "Tu key se guarda solo en tu navegador. Obtén las keys en:",
      "Sua key fica apenas no seu navegador. Obtenha as keys em:",
      "Ваш ключ хранится только в браузере. Получите ключи на:"
    )+
    ' <a href="https://console.anthropic.com" target="_blank">Anthropic</a> | '+
    '<a href="https://aistudio.google.com/apikey" target="_blank">Google</a> | '+
    '<a href="https://platform.openai.com/api-keys" target="_blank">OpenAI</a>.</div>';

  area.innerHTML =
    '<div class="docs-inner">'+
      '<div class="docs-hero">'+
        '<h1>FMG Setlist Builder</h1>'+
        '<p>'+T('docs_hero_p')+'</p>'+
      '</div>'+

      '<div class="docs-section">'+
        '<h2>'+T('docs_getting_started')+'</h2>'+
        step(1, loc(
          'Select the <strong>instruments available tonight</strong> in the sidebar. Choose any combination of Guitar, Piano, and Winds.',
          'Selecciona los <strong>instrumentos disponibles esta noche</strong> en el sidebar.',
          'Selecione os <strong>instrumentos disponíveis esta noite</strong> no sidebar.',
          'Выберите <strong>доступные инструменты</strong> в боковой панели.'
        ))+
        step(2, loc(
          'Choose the <strong>number of sets</strong> (2, 3, or 4) and <strong>duration per set</strong>.',
          'Elige el <strong>número de sets</strong> (2, 3 o 4) y la <strong>duración por set</strong>.',
          'Escolha o <strong>número de sets</strong> (2, 3 ou 4) e a <strong>duração por set</strong>.',
          'Выберите <strong>количество сетов</strong> (2, 3 или 4) и <strong>длительность</strong>.'
        ))+
        step(3, loc(
          'Select which <strong>genres to include</strong>. Check the boxes in the sidebar.',
          'Selecciona los <strong>géneros a incluir</strong>. Marca las casillas en el sidebar.',
          'Selecione os <strong>gêneros a incluir</strong>. Marque as caixas no sidebar.',
          'Выберите <strong>жанры для включения</strong>. Отметьте в боковой панели.'
        ))+
        step(4,
          loc('Click','Haz clic en','Clique em','Нажмите')+' '+
          kbd('Generate Setlist')+'. '+
          T('docs_energy_p')
        )+
        step(5, loc(
          'Drag and drop songs within a set to reorder them. Use '+kbd('×')+' to remove a song.',
          'Arrastra y suelta canciones para reordenarlas. Usa '+kbd('×')+' para eliminar.',
          'Arraste e solte músicas para reordená-las. Use '+kbd('×')+' para remover.',
          'Перетаскивайте песни для изменения порядка. Используйте '+kbd('×')+' для удаления.'
        ))+
        step(6,
          loc('Give your setlist a name and click','Da un nombre y haz clic en','Dê um nome e clique em','Дайте название и нажмите')+' '+
          kbd('Export')+' '+
          loc('to download.','para descargar.','para baixar.','для скачивания.')
        )+
      '</div>'+

      '<div class="docs-section">'+
        '<h2>'+T('docs_instr_gen')+'</h2>'+
        '<p>'+loc(
          'The generator intelligently prioritizes songs based on your selected instruments and genres.',
          'El generador prioriza canciones según los instrumentos y géneros seleccionados.',
          'O gerador prioriza músicas com base nos instrumentos e gêneros selecionados.',
          'Генератор приоритизирует песни по выбранным инструментам и жанрам.'
        )+'</p>'+
        h3(loc('How instruments work','Cómo funcionan los instrumentos','Como os instrumentos funcionam','Как работают инструменты'))+
        '<p>'+T('docs_instr_hint')+'</p>'+
        h3(T('docs_energy_title'))+
        '<p>'+T('docs_energy_p')+'</p>'+
        '<ul><li>'+T('docs_energy_1')+'</li><li>'+T('docs_energy_2')+'</li></ul>'+
        '<p>'+T('docs_energy_note')+'</p>'+
      '</div>'+

      '<div class="docs-section">'+
        '<h2>'+T('docs_ai')+'</h2>'+
        warn+
        h3(T('docs_ai_provider'))+
        '<p>'+T('docs_ai_provider_p')+'</p>'+
        h3(loc('Song lookup','Búsqueda de canción','Busca de música','Поиск песни'))+
        '<p>'+T('docs_ai_lookup_p')+'</p>'+
        h3(loc('Suggest by mood','Sugerir por mood','Sugerir por mood','Предложить по настроению'))+
        '<p>'+T('docs_ai_suggest_p')+'</p>'+
      '</div>'+

      '<div class="docs-section">'+
        '<h2>'+T('docs_pool')+'</h2>'+
        '<p>'+T('docs_pool_p')+'</p>'+
        li(T('docs_pool_li1'),T('docs_pool_li2'),T('docs_pool_li3'),T('docs_pool_li4'),T('docs_pool_li5'))+
        '<p>'+T('docs_pool_instr_p')+'</p>'+
      '</div>'+

      '<div class="docs-section">'+
        '<h2>'+T('docs_export_share')+'</h2>'+
        '<p>'+T('docs_export_p')+'</p>'+
        li(T('docs_export_li1'),T('docs_export_li2'),T('docs_export_li3'),T('docs_export_li4'),T('docs_export_li5'))+
      '</div>'+

      '<div class="docs-section">'+
        '<h2>'+T('docs_github')+'</h2>'+
        '<p>'+T('docs_github_p')+'</p>'+
        step(1,
          loc('Create a GitHub account at','Crea una cuenta en','Crie uma conta em','Создайте аккаунт на')+
          ' <a href="https://github.com" target="_blank">github.com</a>.'
        )+
        step(2,
          loc(
            'Create a new public repository (e.g. <code>fmg-setlist</code>).',
            'Crea un repositorio público (ej. <code>fmg-setlist</code>).',
            'Crie um repositório público (ex. <code>fmg-setlist</code>).',
            'Создайте новый публичный репозиторий (напр. <code>fmg-setlist</code>).'
          )
        )+
        step(3,
          loc('Rename this file to','Renombra este archivo a','Renomeie este arquivo para','Переименуйте файл в')+
          ' <code>index.html</code> '+
          loc('and upload it to the repository.','y súbelo al repositorio.','e envie ao repositório.','и загрузите в репозиторий.')
        )+
        step(4,
          loc('Go to','Ve a','Vá em','Перейдите в')+
          ' <strong>Settings → Pages → Source → main branch</strong>. '+
          loc('Save.','Guarda.','Salve.','Сохраните.')
        )+
        step(5,
          loc(
            'In a few minutes your app will be live at',
            'En unos minutos tu app estará en',
            'Em alguns minutos seu app estará em',
            'Через несколько минут приложение будет доступно на'
          )+
          ' <code>yourusername.github.io/fmg-setlist</code>.'
        )+
        '<p style="margin-top:.75rem;">'+T('docs_github_note')+'</p>'+
      '</div>'+

      '<div class="docs-section">'+
        '<h2>'+T('docs_tips')+'</h2>'+
        '<ul>'+
          tip(T('docs_tip1_title'), T('docs_tip1'))+
          tip(T('docs_tip2_title'), T('docs_tip2'))+
          tip(T('docs_tip3_title'), T('docs_tip3'))+
          tip(T('docs_tip4_title'), T('docs_tip4'))+
          tip(T('docs_tip5_title'), T('docs_tip5'))+
          tip(T('docs_tip6_title'), T('docs_tip6'))+
        '</ul>'+
      '</div>'+

      '<hr class="docs-divider">'+
      '<div class="docs-fmg">'+
        '<div class="docs-fmg-logo">Fearlessly Media Group</div>'+
        '<div class="docs-fmg-text">'+T('docs_built')+'<br>'+T('docs_version')+'</div>'+
      '</div>'+
    '</div>';
}


// ─── INIT ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
setTheme(localStorage.getItem('fmg-theme') || 'dark');
setLang(currentLang);
renderDocs();
initApiBar();
// Initialize aiSongCount from storage
aiSongCount = parseInt(localStorage.getItem('fmg-ai-count') || '5');
document.querySelectorAll('.ai-count-btn').forEach(b=>{
  if(parseInt(b.dataset.n)===aiSongCount) b.classList.add('on');
});
// Initialize instrument chips based on selected instrs
const CODE_TO_NAME={eg:'eguitar',ag:'aguitar',b:'bass',dr:'drums',k:'keys',sx:'sax',tp:'trumpet',tb:'trombone',vo:'vocal',bv:'backing',pc:'percussion'};
instrs.forEach(code=>{
  const name=CODE_TO_NAME[code];
  if(name){
    document.getElementById('chip-'+name)?.classList.add('on');
    document.getElementById('chip-'+name+'-m')?.classList.add('on');
  }
});
// Add listeners to genre checkboxes
['blues','rock','pop','soul','funk','rnb','ballad','reggae','latin','jazz','country','disco','rbmodern','funksoul','rocklatino','cumbia','poplatino','balada','merengue','ranchera','reggaeton','synthpop','raprock','ska'].forEach(g=>{
  const el=document.getElementById('genre-'+g);
  if(el)el.addEventListener('change',()=>{clearTimeout(_genreTimer);_genreTimer=setTimeout(()=>generate(),150);});
});
generate();
  renderEffortWeights();
}); // DOMContentLoaded

// ─── MOBILE / RESPONSIVE ─────────────────────────────────────────────────────
function isMobile(){ return window.innerWidth <= 768; }

function toggleMobileDrawer(){
  const d = document.getElementById('mobile-drawer');
  const o = document.getElementById('drawer-overlay');
  const isOpen = d.classList.contains('open');
  if(isOpen){ closeMobileDrawer(); }
  else {
    d.classList.add('open');
    o.classList.add('open');
    // sync mobile drawer state with desktop sidebar
    syncMobileDrawer();
  }
}
function closeMobileDrawer(){
  document.getElementById('mobile-drawer')?.classList.remove('open');
  document.getElementById('drawer-overlay')?.classList.remove('open');
}

function setActiveBottomNav(v){
  document.querySelectorAll('.bn-item').forEach(b=>b.classList.remove('active'));
  const el = document.getElementById('bn-'+v);
  if(el) el.classList.add('active');
}

// Keep mobile drawer chip states in sync with desktop sidebar
function syncMobileDrawer(){
  const CODE_TO_NAME = {eg:'eguitar',ag:'aguitar',b:'bass',dr:'drums',k:'keys',sx:'sax',tp:'trumpet',tb:'trombone',vo:'vocal',bv:'backing',pc:'percussion'};
  // Sync instrument chips desktop → mobile
  Object.entries(CODE_TO_NAME).forEach(([code, name])=>{
    const mob = document.getElementById('chip-'+name+'-m');
    if(mob) mob.classList.toggle('on', instrs.includes(code));
  });
  // Sync genre checkboxes desktop → mobile
  const genres = ['blues','rock','pop','soul','funk','rnb','ballad','reggae','latin','jazz','country','disco','rbmodern','funksoul','rocklatino','cumbia','poplatino','balada','merengue','ranchera','reggaeton','synthpop','raprock','ska'];
  genres.forEach(g=>{
    const desktop = document.getElementById('genre-'+g);
    const mobile  = document.getElementById('genre-'+g+'-m');
    if(desktop && mobile) mobile.checked = desktop.checked;
  });
  // Sync dur-sel
  const desktopDur = document.getElementById('dur-sel');
  const mobileDur  = document.getElementById('dur-sel-m');
  if(desktopDur && mobileDur) mobileDur.value = desktopDur.value;
  // Sync set count buttons
  [2,3,4].forEach(n=>{
    document.querySelectorAll('.sc-btn').forEach((b,i)=>{
      b.classList.toggle('on',[2,3,4][i]===numSets);
    });
  });
}

// Sync mobile dur-sel → desktop and regenerate
function syncDurSel(val){
  const desktop = document.getElementById('dur-sel');
  if(desktop) desktop.value = val;
}

// Sync mobile genre checkboxes → desktop on change
function initMobileGenreSync(){
  const genres = ['blues','rock','pop','soul','funk','rnb','ballad','reggae','latin','jazz','country','disco','rbmodern','funksoul','rocklatino','cumbia','poplatino','balada','merengue','ranchera','reggaeton','synthpop','raprock','ska'];
  genres.forEach(g=>{
    const mob = document.getElementById('genre-'+g+'-m');
    if(mob){
      mob.addEventListener('change',()=>{
        const desktop = document.getElementById('genre-'+g);
        if(desktop) desktop.checked = mob.checked;
        clearTimeout(_genreTimer);
        _genreTimer = setTimeout(()=>generate(), 150);
      });
    }
  });
}

// Patch gotoView to also update bottom nav
const _origGotoView = gotoView;
gotoView = function(v){
  _origGotoView(v);
  setActiveBottomNav(v);
  if(isMobile()) window.scrollTo(0,0);
};

// Patch toggleInstr to sync mobile drawer chips

// Init mobile on load
document.addEventListener('DOMContentLoaded', function(){
  initMobileGenreSync();
});