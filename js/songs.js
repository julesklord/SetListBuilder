// ─── SONG POOL ─────────────────────────────────────────────────────────────
// Edit this file to add, remove or correct songs.

// ─── SONG POOL (DEFAULTS) ────────────────────────────────────────────────────
// Edit this file to add, remove or correct songs.
// Fields: id, title, artist, genre, key, bpm, prog, energy(1-5), instr(['g','p','v'])
// Genres: Blues | Rock | Pop | Soul | Funk | R&B | Ballad | Reggae | Latin | Jazz | Country

// ─── DATA ───────────────────────────────────────────────────────────────────
const DEFAULTS = [
  {id:1,title:"The Thrill Is Gone",artist:"B.B. King",genre:"Blues",key:"Bm",bpm:90,prog:"i–IV–i–V–IV–i",energy:3,instr:['g','p','v']},
  {id:2,title:"Stormy Monday",artist:"T-Bone Walker",genre:"Blues",key:"G",bpm:55,prog:"I–IV–I–V–IV–I",energy:2,instr:['g','p','v']},
  {id:3,title:"Ain't No Sunshine",artist:"Bill Withers",genre:"Soul",key:"Am",bpm:79,prog:"i–III–VII–i",energy:3,instr:['g','p']},
  {id:4,title:"Further On Up the Road",artist:"E. Clapton / B. Bland",genre:"Blues",key:"Em",bpm:58,prog:"I–IV–I–V–IV–I",energy:2,instr:['g']},
  {id:5,title:"Tears in Heaven",artist:"Eric Clapton",genre:"Ballad",key:"A",bpm:64,prog:"I–V–vi–IV",energy:2,instr:['g']},
  {id:6,title:"Sweet Home Chicago",artist:"Robert Johnson",genre:"Blues",key:"E",bpm:90,prog:"I–IV–I–V–IV–I",energy:4,instr:['g','p','v']},
  {id:7,title:"I Put a Spell on You",artist:"Jay Hawkins",genre:"Blues",key:"Cm",bpm:68,prog:"i–i7–iv–V7",energy:3,instr:['g','p','v']},
  {id:8,title:"Stand by Me",artist:"Ben E. King",genre:"Soul",key:"A",bpm:116,prog:"I–vi–IV–V",energy:4,instr:['g','p','v']},
  {id:9,title:"Wonderful Tonight",artist:"Eric Clapton",genre:"Ballad",key:"G",bpm:96,prog:"I–V–IV–V",energy:2,instr:['g']},
  {id:10,title:"House of the Rising Sun",artist:"The Animals",genre:"Rock",key:"Am",bpm:117,prog:"i–III–IV–VI–i",energy:2,instr:['g','p']},
  {id:11,title:"Pride and Joy",artist:"SRV",genre:"Blues",key:"E",bpm:120,prog:"I–IV–I–V–IV–I",energy:5,instr:['g']},
  {id:12,title:"Killing Me Softly",artist:"Roberta Flack",genre:"Soul",key:"Dm",bpm:123,prog:"ii–V–I–IV",energy:2,instr:['g','p','v']},
  {id:13,title:"Lonely Avenue",artist:"Ray Charles",genre:"Blues",key:"Bb",bpm:84,prog:"I–IV–V–IV",energy:3,instr:['g','p','v']},
  {id:14,title:"Mustang Sally",artist:"Wilson Pickett",genre:"Soul",key:"C",bpm:110,prog:"I–IV–I–V",energy:4,instr:['g','p','v']},
  {id:15,title:"Let the Good Times Roll",artist:"BB King",genre:"Blues",key:"C",bpm:100,prog:"I–IV–I–V–IV–I",energy:4,instr:['g','p','v']},
  {id:16,title:"Midnight Hour",artist:"Wilson Pickett",genre:"Soul",key:"D",bpm:108,prog:"I–IV–V",energy:4,instr:['g','p','v']},
  {id:17,title:"Sitting on the Dock",artist:"Otis Redding",genre:"Soul",key:"G",bpm:104,prog:"I–IV–I–IV",energy:3,instr:['g','p','v']},
  {id:18,title:"Have You Ever Loved a Woman",artist:"Freddie King",genre:"Blues",key:"F#",bpm:62,prog:"I–IV–I–V–IV–I",energy:3,instr:['g']},
  {id:19,title:"Love in Vain",artist:"Robert Johnson",genre:"Blues",key:"Em",bpm:58,prog:"I–IV–I–V–IV–I",energy:2,instr:['g']},
  {id:20,title:"Drift Away",artist:"Dobie Gray",genre:"Soul",key:"D",bpm:96,prog:"I–V–vi–IV",energy:3,instr:['g','p']},
  {id:21,title:"The Sky Is Crying",artist:"Elmore James",genre:"Blues",key:"A",bpm:56,prog:"I–IV–I–V–IV–I",energy:2,instr:['g']},
  {id:22,title:"Since I've Been Loving You",artist:"Led Zeppelin",genre:"Rock",key:"Cm",bpm:56,prog:"i–iv–i–V–iv–i",energy:2,instr:['g','p','v']},
  {id:23,title:"Nobody Knows You (Down and Out)",artist:"Eric Clapton",genre:"Blues",key:"G",bpm:58,prog:"I–III–IV–iv–I–V",energy:2,instr:['g']},
  {id:24,title:"Little Wing",artist:"Jimi Hendrix",genre:"Rock",key:"Em",bpm:70,prog:"i–VII–VI–V–IV",energy:2,instr:['g']},
  {id:25,title:"Superstition",artist:"Stevie Wonder",genre:"Funk",key:"Eb",bpm:100,prog:"i–VII–i–VII",energy:5,instr:['g','p','v']},
  {id:26,title:"Every Day I Have the Blues",artist:"BB King",genre:"Blues",key:"Bb",bpm:112,prog:"I–IV–I–V–IV–I",energy:5,instr:['g','p','v']},
  {id:27,title:"If I Ain't Got You",artist:"Alicia Keys",genre:"Soul",key:"Dbm",bpm:74,prog:"i–VI–III–VII",energy:3,instr:['g','p']},
  {id:28,title:"I'd Rather Go Blind",artist:"Etta James",genre:"Blues",key:"A",bpm:60,prog:"I–IV–I–V",energy:2,instr:['g','p','v']},
  {id:29,title:"The Weight",artist:"The Band",genre:"Rock",key:"A",bpm:73,prog:"I–III–IV–I",energy:2,instr:['g']},
  {id:30,title:"Cry to Me",artist:"Solomon Burke",genre:"Soul",key:"G",bpm:65,prog:"I–IV–V–I",energy:3,instr:['g','p','v']},
  {id:31,title:"Key to the Highway",artist:"Big Bill Broonzy",genre:"Blues",key:"E",bpm:78,prog:"I–IV–I–V–IV–I",energy:3,instr:['g']},
  {id:32,title:"Green Onions",artist:"Booker T. & the MGs",genre:"Funk",key:"F",bpm:92,prog:"I–IV–V (12-bar)",energy:4,instr:['g','p','v']},
  {id:33,title:"All Your Love",artist:"Otis Rush",genre:"Blues",key:"Am",bpm:62,prog:"i7–iv7–v7",energy:3,instr:['g']},
  {id:34,title:"Things That I Used to Do",artist:"Guitar Slim",genre:"Blues",key:"E",bpm:84,prog:"I–IV–V7",energy:3,instr:['g','p','v']},
  {id:35,title:"Smokestack Lightning",artist:"Howlin' Wolf",genre:"Blues",key:"E",bpm:72,prog:"I–I–I–I (vamp)",energy:3,instr:['g','v']},
  {id:36,title:"Rock Me Baby",artist:"B.B. King",genre:"Blues",key:"G",bpm:88,prog:"I–IV–V (12-bar)",energy:4,instr:['g','p','v']},
  {id:37,title:"I've Got a Woman",artist:"Ray Charles",genre:"Soul",key:"A",bpm:100,prog:"I6–V7–I6–IV7–I6",energy:4,instr:['g','p','v']},
  {id:38,title:"Just the Two of Us",artist:"Bill Withers",genre:"Soul",key:"Db",bpm:68,prog:"Dbmaj7–C7–Fm7–Ebm7",energy:2,instr:['g','p','v']},
  {id:39,title:"I'm Tore Down",artist:"Freddie King",genre:"Blues",key:"F",bpm:108,prog:"I–IV–I–V–IV–I",energy:5,instr:['g']},
  {id:40,title:"The Sky Is Crying",artist:"Albert King",genre:"Blues",key:"Bb",bpm:58,prog:"i–IV–i–V–IV–i",energy:2,instr:['g','v']},
  {id:41,title:"Reconsider Baby",artist:"Lowell Fulson",genre:"Blues",key:"Bb",bpm:80,prog:"I–IV–I–V–IV–I",energy:3,instr:['g','p','v']},
  {id:42,title:"Fake Plastic Trees",artist:"Radiohead",genre:"Pop",key:"Dm",bpm:65,prog:"I–V–vi–IV",energy:2,instr:['g','p','v']},
  {id:43,title:"Someone Like You",artist:"Adele",genre:"Ballad",key:"A",bpm:68,prog:"I–V–vi–IV",energy:2,instr:['g','p']},
  {id:44,title:"Hallelujah",artist:"Leonard Cohen",genre:"Ballad",key:"C",bpm:60,prog:"I–V–I–V",energy:2,instr:['g','p']},
  {id:45,title:"Black Hole Sun",artist:"Soundgarden",genre:"Rock",key:"Cm",bpm:70,prog:"i–VI–VII–VI",energy:3,instr:['g','p','v']},
  {id:46,title:"Layla",artist:"Eric Clapton",genre:"Rock",key:"Dm",bpm:76,prog:"i–VII–i–VII",energy:3,instr:['g','p']},
  {id:47,title:"November Rain",artist:"Guns N' Roses",genre:"Rock",key:"F#m",bpm:80,prog:"I–IV–V–IV",energy:3,instr:['g','p','v']},
  {id:48,title:"Zombie",artist:"The Cranberries",genre:"Rock",key:"Em",bpm:84,prog:"i–III–VII–i",energy:4,instr:['g','v']},
  {id:49,title:"Brown Eyed Girl",artist:"Van Morrison",genre:"Pop",key:"G",bpm:150,prog:"I–IV–I–V",energy:4,instr:['g','p','v']},
  {id:50,title:"Zombie Jamboree",artist:"Kid Creole",genre:"Reggae",key:"G",bpm:96,prog:"I–IV–V–IV",energy:3,instr:['g','p','v']},
  {id:51,title:"Is This Love",artist:"Bob Marley",genre:"Reggae",key:"G",bpm:76,prog:"I–V–vi–IV",energy:3,instr:['g','p','v']},
  {id:52,title:"Three Little Birds",artist:"Bob Marley",genre:"Reggae",key:"A",bpm:76,prog:"I–IV–I–V",energy:3,instr:['g','p','v']},
  {id:53,title:"Bésame Mucho",artist:"Consuelo Velazquez",genre:"Latin",key:"G",bpm:120,prog:"I–IV–V–IV",energy:3,instr:['g','p','v']},
  {id:54,title:"Siboney",artist:"Ernesto Lecuona",genre:"Latin",key:"Dm",bpm:96,prog:"i–i–IV–V",energy:3,instr:['g','p','v']},
  {id:55,title:"Tequila",artist:"The Champs",genre:"Latin",key:"A",bpm:128,prog:"I–IV–I–IV",energy:4,instr:['g','p','v']},
  {id:56,title:"Summertime",artist:"George Gershwin",genre:"Jazz",key:"Am",bpm:52,prog:"i–V7–i–IV",energy:1,instr:['g','p','v']},
  {id:57,title:"All of Me",artist:"John Legend",genre:"Soul",key:"F#m",bpm:76,prog:"vi–IV–I–V",energy:2,instr:['g','p','v']},
  {id:58,title:"Thinking Out Loud",artist:"Ed Sheeran",genre:"Ballad",key:"Bb",bpm:64,prog:"I–V–vi–IV",energy:2,instr:['g','p']},
  {id:59,title:"Perfect",artist:"Ed Sheeran",genre:"Pop",key:"G",bpm:76,prog:"I–V–vi–IV",energy:2,instr:['g','p']},
  {id:60,title:"Shape of You",artist:"Ed Sheeran",genre:"Pop",key:"C#m",bpm:96,prog:"I–V–vi–IV",energy:4,instr:['g','p','v']},
  {id:61,title:"Hoochie Coochie Man",artist:"Muddy Waters",genre:"Blues",key:"Bb",bpm:113,prog:"I–I–I–V–I",energy:4,instr:['g','v']},
  {id:62,title:"Got My Mojo Working",artist:"Muddy Waters",genre:"Blues",key:"E",bpm:120,prog:"I–IV–V–IV",energy:5,instr:['g','p','v']},
  {id:63,title:"Help Me",artist:"Sonny Boy Williamson",genre:"Blues",key:"G",bpm:80,prog:"I–IV–I–V",energy:3,instr:['g','p']},
  {id:64,title:"Mannish Boy",artist:"Muddy Waters",genre:"Blues",key:"E",bpm:88,prog:"I–I–I–IV",energy:4,instr:['g','p','v']},
  {id:65,title:"Five Long Years",artist:"Eddie Boyd",genre:"Blues",key:"F",bpm:96,prog:"I–IV–I–V",energy:3,instr:['g','p']},
  {id:66,title:"Shine On You Crazy Diamond",artist:"Pink Floyd",genre:"Rock",key:"Am",bpm:63,prog:"i–VII–VI–VII",energy:2,instr:['g','p','v']},
  {id:67,title:"Bohemian Rhapsody",artist:"Queen",genre:"Rock",key:"Bb",bpm:55,prog:"IV–I–V–IV",energy:3,instr:['g','p','v']},
  {id:68,title:"Comfortably Numb",artist:"Pink Floyd",genre:"Rock",key:"G#m",bpm:63,prog:"i–VI–III–VII",energy:3,instr:['g','p','v']},
  {id:69,title:"Whole Lotta Love",artist:"Led Zeppelin",genre:"Rock",key:"Em",bpm:89,prog:"i–i–i–IV",energy:5,instr:['g','v']},
  {id:70,title:"My Generation",artist:"The Who",genre:"Rock",key:"G",bpm:128,prog:"I–IV–V–IV",energy:5,instr:['g','v']},
  {id:71,title:"Hey Jude",artist:"The Beatles",genre:"Pop",key:"C",bpm:76,prog:"I–IV–I–V",energy:3,instr:['g','p','v']},
  {id:72,title:"The Sound of Silence",artist:"Simon & Garfunkel",genre:"Pop",key:"Em",bpm:72,prog:"i–VI–III–VII",energy:2,instr:['g','p']},
  {id:73,title:"Yesterday",artist:"The Beatles",genre:"Ballad",key:"F",bpm:68,prog:"IV–I–IV–I",energy:2,instr:['g','p']},
  {id:74,title:"Blackbird",artist:"The Beatles",genre:"Pop",key:"G",bpm:76,prog:"I–V–vi–IV",energy:2,instr:['g']},
  {id:75,title:"Pinball Wizard",artist:"The Who",genre:"Rock",key:"D",bpm:120,prog:"I–IV–V–IV",energy:4,instr:['g','p','v']},
  {id:76,title:"Let It Be",artist:"The Beatles",genre:"Pop",key:"C",bpm:68,prog:"I–V–I–IV",energy:2,instr:['g','p']},
  {id:77,title:"Bluesette",artist:"Toots Thielemans",genre:"Jazz",key:"Dm",bpm:120,prog:"i–VI–II–V",energy:3,instr:['g','p','v']},
  {id:78,title:"Funky Chicken",artist:"Arthur Conley",genre:"Funk",key:"C",bpm:132,prog:"I–IV–I–V",energy:5,instr:['g','p','v']},
  {id:79,title:"Uptown Special",artist:"James Brown",genre:"Funk",key:"Dm",bpm:116,prog:"i–VII–i–IV",energy:5,instr:['g','p','v']},
  {id:80,title:"Flashlight",artist:"Parliament",genre:"Funk",key:"Fm",bpm:108,prog:"i–i–i–IV",energy:4,instr:['g','p','v']},
  {id:81,title:"Sittin' on the Toilet",artist:"Jimmy Spheeris",genre:"Soul",key:"Em",bpm:76,prog:"i–VI–III–VII",energy:2,instr:['g','p']},
  {id:82,title:"Let Me Down Easy",artist:"Steppenwolf",genre:"Soul",key:"Am",bpm:100,prog:"i–IV–i–V",energy:3,instr:['g','p','v']},
  {id:83,title:"Sweet Child O' Mine",artist:"Guns N' Roses",genre:"Rock",key:"Dm",bpm:120,prog:"i–III–VII–i",energy:4,instr:['g']},
  {id:84,title:"You Are So Beautiful",artist:"Joe Cocker",genre:"Soul",key:"Db",bpm:60,prog:"I–V–I–IV",energy:2,instr:['g','p','v']},
  {id:85,title:"Respect",artist:"Aretha Franklin",genre:"Soul",key:"C",bpm:108,prog:"I–IV–I–V",energy:4,instr:['g','p','v']},
  {id:86,title:"Redemption Song",artist:"Bob Marley",genre:"Reggae",key:"G",bpm:76,prog:"I–V–vi–IV",energy:3,instr:['g']},
  {id:87,title:"Girl from Ipanema",artist:"João Gilberto",genre:"Latin",key:"Dm",bpm:96,prog:"i–VI–III–VII",energy:2,instr:['g','p','v']},
  {id:88,title:"Man of Constant Sorrow",artist:"Old Crow Medicine Show",genre:"Country",key:"Am",bpm:100,prog:"i–III–VII–i",energy:3,instr:['g']},
  {id:89,title:"Tell Me I'm Not Dreaming",artist:"Ray Parker Jr.",genre:"R&B",key:"G",bpm:100,prog:"I–IV–I–V",energy:4,instr:['g','p','v']},
  {id:90,title:"Sexual Healing",artist:"Marvin Gaye",genre:"R&B",key:"Em",bpm:96,prog:"i–VI–III–VII",energy:3,instr:['g','p','v']},
];


let pool = (()=>{
  try {
    const p = JSON.parse(localStorage.getItem('fmg-pool'));
    return (Array.isArray(p) && p.length > 0) ? p : DEFAULTS;
  } catch(e) { return DEFAULTS; }
})();
let nights = (()=>{
  try {
    const n = JSON.parse(localStorage.getItem('fmg-nights'));
    return Array.isArray(n) ? n : [];
  } catch(e) { return []; }
})();
let sets = [];
let numSets = 3;
let instrs = ['g'];
let mustPlay = (()=>{
  try {
    const m = JSON.parse(localStorage.getItem('fmg-mustPlay') || '[]');
    return new Set(Array.isArray(m) ? m : []);
  } catch(e) { return new Set(); }
})();
let pf = 'all';
let selectedGenres = ['Blues','Rock','Pop','Soul','R&B','Ballad'];
let editId = null;
let dragSrc = null;
let nextId = (pool.length ? Math.max(...pool.map(s=>s.id)) : 90) + 1;
let aiTab = 'lookup';
let apiProvider = localStorage.getItem('fmg-api-provider') || 'claude';
let apiKeys = {
  claude: localStorage.getItem('fmg-api-key-claude') || '',
  gemini: localStorage.getItem('fmg-api-key-gemini') || '',
  chatgpt: localStorage.getItem('fmg-api-key-chatgpt') || ''
};

// ─── TRANSLATIONS ────────────────────────────────────────────────────────────
// Add a new language: copy an existing block, change the key (e.g. 'fr'),
// add a lang button in index.html, and add 'fr' to the setLang() call.
// Keys marked PRESERVE are intentionally not translated (setlist, BPM, genre names, etc.)
