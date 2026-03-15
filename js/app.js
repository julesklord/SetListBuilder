// ─── APP ─────────────────────────────────────────────────────────────────────
// Depends on: songs.js (DEFAULTS), i18n.js (i18n, tr, setLang)
// Load order in index.html: songs.js → i18n.js → app.js

// ─── PERSIST ────────────────────────────────────────────────────────────────
function persist() {
  localStorage.setItem('fmg-pool', JSON.stringify(pool));
  localStorage.setItem('fmg-nights', JSON.stringify(nights));
}

// ─── TOAST ──────────────────────────────────────────────────────────────────
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2400);
}

// ─── API KEY ─────────────────────────────────────────────────────────────────
function initApiBar() {
  document.getElementById('api-provider').value = apiProvider;
  const bar = document.getElementById('api-bar');
  const status = document.getElementById('api-status');
  const currentKey = apiKeys[apiProvider];
  const providerNames = {claude:'Claude',gemini:'Gemini',chatgpt:'ChatGPT'};
  if (currentKey) {
    bar.classList.remove('warn');
    status.className = 'api-status ok';
    status.textContent = '✦ '+providerNames[apiProvider]+' API key set';
    document.getElementById('api-key-input').value = '••••••••••••••••';
  } else {
    bar.classList.add('warn');
    status.className = 'api-status missing';
    status.textContent = '✦ API key required for AI features';
  }
}
function updateApiLabel() {
  apiProvider = document.getElementById('api-provider').value;
  localStorage.setItem('fmg-api-provider', apiProvider);
  document.getElementById('api-key-input').value = '';
  setTheme(localStorage.getItem('fmg-theme')||'dark');
setLang(currentLang);
renderDocs();
initApiBar();
}
function saveApiKey() {
  const val = document.getElementById('api-key-input').value.trim();
  if (!val || val.startsWith('••')) return;
  apiKeys[apiProvider] = val;
  localStorage.setItem('fmg-api-key-'+apiProvider, val);
  initApiBar();
  toast(tr('toast_api_saved'));
}

// ─── NAVIGATION ─────────────────────────────────────────────────────────────
function gotoView(v) {
  document.querySelectorAll('.view').forEach(el=>el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el=>el.classList.remove('active'));
  document.getElementById('view-'+v).classList.add('active');
  document.querySelectorAll('.nav-btn')[['builder','pool','export','docs'].indexOf(v)].classList.add('active');
  if(v==='pool') renderPool();
  if(v==='export') renderExport();
  if(v==='docs') renderDocs();
}

// ─── INSTRUMENTS / SETS ─────────────────────────────────────────────────────
function toggleInstr(i) {
  const map = {guitar:'g', piano:'p', wind:'v'};
  const key = map[i];
  const chip = document.getElementById('chip-'+i);
  if(instrs.includes(key)){
    if(instrs.length===1){toast(tr('toast_min_instr'));return;}
    instrs=instrs.filter(x=>x!==key);chip.classList.remove('on');
  } else{instrs.push(key);chip.classList.add('on');}
}
function setN(n) {
  numSets=n;
  document.querySelectorAll('.sc-btn').forEach((b,i)=>b.classList.toggle('on',[2,3,4][i]===n));
}

// ─── GENERATE ────────────────────────────────────────────────────────────────
function setAllGenres(val){
  ['blues','rock','pop','soul','funk','rnb','ballad','reggae','latin','jazz','country'].forEach(g=>{
    const el=document.getElementById('genre-'+g);
    if(el)el.checked=val;
  });
  generate();
}
function updateGenreFilters(){
  const map={blues:'Blues',rock:'Rock',pop:'Pop',soul:'Soul',funk:'Funk',rnb:'R&B',ballad:'Ballad',reggae:'Reggae',latin:'Latin',jazz:'Jazz',country:'Country'};
  selectedGenres=['blues','rock','pop','soul','funk','rnb','ballad','reggae','latin','jazz','country']
    .filter(g=>document.getElementById('genre-'+g)?.checked)
    .map(g=>map[g]);
}
function generate(){
  updateGenreFilters();
  const dur = parseInt(document.getElementById('dur-sel').value);
  const sps = Math.round(dur / 4.5);
  let elig = pool.filter(s=>(s.instr.some(i=>instrs.includes(i))&&selectedGenres.includes(s.genre)));
  if(elig.length < sps * numSets) elig = [...pool.filter(s=>selectedGenres.includes(s.genre))];
  if(elig.length < sps * numSets) elig = [...pool];
  const sh = a=>[...a].sort(()=>Math.random()-.5);
  const low=sh(elig.filter(s=>s.energy<=2)), mid=sh(elig.filter(s=>s.energy===3)), high=sh(elig.filter(s=>s.energy>=4));
  const used=new Set();
  function pick(arr,n){const o=[];for(const s of arr){if(o.length>=n)break;if(!used.has(s.id)){o.push(s);used.add(s.id);}}return o;}
  const fallback=sh(elig);
  function pickFB(n){const o=[];for(const s of fallback){if(o.length>=n)break;if(!used.has(s.id)){o.push(s);used.add(s.id);}}return o;}
  sets=[];
  for(let i=0;i<numSets;i++){
    const last=i===numSets-1;
    const lN=last?Math.floor(sps*.2):Math.floor(sps*.35);
    const hN=last?Math.floor(sps*.4):Math.floor(sps*.25);
    const mN=sps-lN-hN;
    let arr=[...pick(low,lN),...pick(mid,mN),...pick(high,hN)];
    if(arr.length<sps) arr=[...arr,...pickFB(sps-arr.length)];
    sets.push(noConsecKey(arr));
  }
  renderSets();
  toast(tr('toast_generated')+sets.reduce((a,s)=>a+s.length,0)+tr('toast_songs_added'));
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
  return `<div class="song-row" draggable="true" data-id="${s.id}" data-si="${si}">
    <span class="dh">⠿</span>
    <span class="snum">${i+1}</span>
    <div class="sinfo"><div class="stitle">${s.title}</div><div class="sartist">${s.artist}</div></div>
    <span class="skey">${s.key}</span><span class="sbpm">${s.bpm}</span>
    <span class="sbadge b${gClass}">${s.genre}</span>
    <div class="emini">${Array.from({length:5},(_,j)=>`<div class="ed${j<s.energy?' on':''}${j<s.energy&&s.energy>=4?' hi':''}"></div>`).join('')}</div>
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
}
function loadNight(id){
  const n=nights.find(x=>x.id===id);if(!n)return;
  sets=n.sets.map(s=>s.filter(song=>song&&song.id).map(song=>pool.find(p=>p.id===song.id)||song));
  instrs=(Array.isArray(n.instrs)&&n.instrs.length>0)?n.instrs:['g'];
  document.getElementById('night-title').value=n.title;
  // Update instrument chips
  document.querySelectorAll('[id^="chip-"]').forEach(el=>el.classList.remove('on'));
  const map={'g':'guitar','p':'piano','v':'wind'};
  instrs.forEach(i=>{const id=map[i];if(id)document.getElementById('chip-'+id)?.classList.add('on');});
  renderSets();gotoView('builder');
  document.querySelectorAll('.sv-item').forEach(el=>el.classList.toggle('cur',parseInt(el.dataset.id)===id));
}
function delNight(id){
  const n=nights.find(x=>x.id===id);
  if(n&&!confirm(tr('confirm_del_night')+n.title+tr('confirm_del_night2')))return;
  nights=nights.filter(x=>x.id!==id);persist();renderSaved();
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
      <td class="pk">${x.key}</td><td class="pb">${x.bpm}</td><td class="pp">${x.prog}</td>
      <td><div class="pi">
        ${x.instr.includes('g')?'<div class="id id-g">G</div>':''}
        ${x.instr.includes('p')?'<div class="id id-p">P</div>':''}
        ${x.instr.includes('v')?'<div class="id id-v">V</div>':''}
      </div></td>
      <td style="white-space:nowrap;">
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
function toggleAIPanel(){
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
async function runAI(){
  const currentKey = apiKeys[apiProvider];
  if(!currentKey){toast(tr('api_set_key'));gotoView('docs');return;}
  const status=document.getElementById('ai-status');
  const results=document.getElementById('ai-results');
  const goBtn=document.getElementById(aiTab==='lookup'?'ai-go-btn':'ai-go-btn2');
  const query=document.getElementById(aiTab==='lookup'?'ai-lookup-input':'ai-suggest-input').value.trim();
  if(!query){toast(tr('ai_enter_query'));return;}
  status.className='ai-status';status.textContent='Asking '+apiProvider+'…';
  results.innerHTML='';goBtn.disabled=true;

  const systemPrompt = aiTab==='lookup'
    ? `You are a music metadata assistant. Given a song title and artist, return ONLY a JSON array with ONE object containing: title, artist, genre (one of: Blues, Rock, Pop, Soul, Funk, R&B, Ballad, Reggae, Latin, Jazz, Country), key (e.g. Am, E, Bb), bpm (integer), prog (chord progression string), energy (1-5 integer where 1=very slow/quiet 5=high energy), instr (array of "g","p","v" for guitar/piano/winds based on what suits the song). Return ONLY the JSON array, no markdown, no explanation.`
    : `You are a music expert specializing in multiple genres. Given a mood/style description, suggest exactly 5 classic songs that fit. Return ONLY a JSON array of objects each with: title, artist, genre (one of: Blues, Rock, Pop, Soul, Funk, R&B, Ballad, Reggae, Latin, Jazz, Country), key, bpm (integer), prog (chord progression), energy (1-5), instr (array of "g","p","v"). Only suggest well-known classic songs. Return ONLY the JSON array, no markdown, no explanation.`;

  try {
    let songs;
    if(apiProvider==='claude'){
      const res=await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST',
        headers:{'Content-Type':'application/json','x-api-key':currentKey,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
        body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,system:systemPrompt,messages:[{role:'user',content:query}]})
      });
      if(!res.ok){const e=await res.json();throw new Error(e.error?.message||'API error '+res.status);}
      const data=await res.json();
      const raw=data.content.map(c=>c.text||'').join('');
      const clean=raw.replace(/```json|```/g,'').trim();
      songs=JSON.parse(clean);
    } else if(apiProvider==='gemini'){
      const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${currentKey}`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({contents:[{parts:[{text:systemPrompt+'\n\nUser query: '+query}]}],generationConfig:{temperature:0.7,maxOutputTokens:1000}})
      });
      if(!res.ok){const e=await res.json();throw new Error(e.error?.message||'API error '+res.status);}
      const data=await res.json();
      const raw=data.candidates?.[0]?.content?.parts?.[0]?.text||'';
      const clean=raw.replace(/```json|```/g,'').trim();
      songs=JSON.parse(clean);
    } else if(apiProvider==='chatgpt'){
      const res=await fetch('https://api.openai.com/v1/chat/completions',{
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+currentKey},
        body:JSON.stringify({model:'gpt-4o-mini',max_tokens:1000,messages:[{role:'system',content:systemPrompt},{role:'user',content:query}]})
      });
      if(!res.ok){const e=await res.json();throw new Error(e.error?.message||'API error '+res.status);}
      const data=await res.json();
      const raw=data.choices?.[0]?.message?.content||'';
      const clean=raw.replace(/```json|```/g,'').trim();
      songs=JSON.parse(clean);
    }
    status.textContent=`${songs.length} song${songs.length!==1?'s':''} found`;
    results.innerHTML=songs.map((s,i)=>`
      <div class="ai-result-item" id="air-${i}">
        <div class="ai-result-info">
          <div class="ai-result-title">${s.title} — ${s.artist}</div>
          <div class="ai-result-sub">${s.genre} · ${s.key} · ${s.bpm} BPM · ${s.prog}</div>
        </div>
        <button class="ai-add-song-btn" onclick="addAISong(${i},${JSON.stringify(s).replace(/"/g,'&quot;')})">Add to pool</button>
      </div>`).join('');
  } catch(e) {
    status.className='ai-status err';
    status.textContent='Error: '+e.message;
  }
  goBtn.disabled=false;
}
function addAISong(i,s){
  if(pool.find(x=>x.title.toLowerCase()===s.title.toLowerCase()&&x.artist.toLowerCase()===s.artist.toLowerCase())){
    toast(tr('toast_already_pool'));return;
  }
  const song={...s,id:nextId++,instr:Array.isArray(s.instr)?s.instr:['g']};
  pool.push(song);persist();
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
  ['g','p','v'].forEach(i=>document.getElementById('mt-'+i).classList.toggle('on',s.instr.includes(i)));
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
    instr:['g','p','v'].filter(i=>document.getElementById('mt-'+i).classList.contains('on'))
  };
  if(editId){pool[pool.findIndex(x=>x.id===editId)]=s;}
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
  const iNames=instrs.map(i=>({g:'Guitar',p:'Piano',v:'Winds'}[i])).join(', ');
  let html=`<div class="exp-night">${title}</div><div class="exp-meta">${date} &nbsp;·&nbsp; ${iNames} &nbsp;·&nbsp; ${numSets} sets</div>`;
  sets.forEach((songs,si)=>{
    html+=`<div class="exp-set"><div class="exp-set-title">Set ${si+1} — ${songs.length} songs · ~${durMin(songs)} min</div>
      ${songs.map((s,i)=>`<div class="exp-row"><span class="en">${i+1}</span><span class="et">${s.title}</span><span class="ea">${s.artist}</span><span class="ek">${s.key}</span><span class="eb">${s.bpm}</span></div>`).join('')}
    </div>`;
  });
  document.getElementById('export-preview').innerHTML=html;
}
function doExportHTML(){
  const title=document.getElementById('night-title').value||'Setlist';
  const date=new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  let c=`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${title} — FMG</title>
  <style>body{font-family:monospace;background:#080706;color:#ede8df;padding:2rem;max-width:700px;margin:0 auto;}
  h1{color:#e2b95a;font-size:1.8rem;margin-bottom:4px;font-family:Georgia,serif;}
  .meta{color:#524d44;font-size:11px;margin-bottom:2rem;}
  .st{color:#c49a3c;font-size:10px;letter-spacing:.1em;text-transform:uppercase;border-bottom:1px solid #1a1714;padding-bottom:4px;margin:1.5rem 0 .4rem;}
  .r{display:flex;gap:12px;padding:4px 0;border-bottom:1px solid #131110;font-size:12px;}
  .n{color:#524d44;width:18px;}.t{flex:1;font-weight:bold;}.a{color:#968f82;}.k{color:#c49a3c;}
  .brand{margin-top:3rem;padding-top:1rem;border-top:1px solid #1a1714;font-size:10px;color:#524d44;}</style>
  </head><body><h1>${title}</h1><div class="meta">${date}</div>`;
  sets.forEach((songs,si)=>{
    c+=`<div class="st">Set ${si+1} — ${songs.length} songs · ~${durMin(songs)} min</div>`;
    songs.forEach((s,i)=>{c+=`<div class="r"><span class="n">${i+1}</span><span class="t">${s.title}</span><span class="a">${s.artist}</span><span class="k">${s.key}</span><span class="k" style="color:#524d44">${s.bpm} bpm</span></div>`;});
  });
  c+=`<div class="brand">Fearlessly Media Group · FMG Setlist Builder</div></body></html>`;
  const a=document.createElement('a');
  a.href='data:text/html;charset=utf-8,'+encodeURIComponent(c);
  a.download=title.replace(/\s+/g,'-').toLowerCase()+'.html';a.click();toast(tr('toast_html_dl'));
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
// Initialize instrument chips based on selected instrs
instrs.forEach(i=>{
  const map={'g':'guitar','p':'piano','v':'wind'};
  const cid=map[i];
  if(cid) document.getElementById('chip-'+cid)?.classList.add('on');
});
// Add listeners to genre checkboxes
let _genreTimer;
['blues','rock','pop','soul','funk','rnb','ballad','reggae','latin','jazz','country'].forEach(g=>{
  const el=document.getElementById('genre-'+g);
  if(el)el.addEventListener('change',()=>{clearTimeout(_genreTimer);_genreTimer=setTimeout(()=>generate(),150);});
});
generate();
}); // DOMContentLoaded
