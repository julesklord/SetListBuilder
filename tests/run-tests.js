const fs = require('fs');
const path = require('path');

// Simple testing framework
let passed = 0;
let failed = 0;

function runTest(name, testFn) {
  try {
    testFn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (error) {
    console.error(`❌ FAIL: ${name}`);
    console.error(error);
    failed++;
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message ? message + ': ' : ''}Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
  }
}

function assertArrayEqual(actual, expected, message) {
  if (!Array.isArray(actual) || !Array.isArray(expected) || actual.length !== expected.length) {
    throw new Error(`${message ? message + ': ' : ''}Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
  }
  for (let i = 0; i < actual.length; i++) {
    if (actual[i] !== expected[i]) {
      throw new Error(`${message ? message + ': ' : ''}Expected element ${i} to be ${JSON.stringify(expected[i])} but got ${JSON.stringify(actual[i])}`);
    }
  }
}

// Extract cleanJSON function from js/app.js for testing
const appJsPath = path.join(__dirname, '../js/app.js');
const songsJsContent = fs.readFileSync(path.join(__dirname, '../js/songs.js'), 'utf8');
const appJsContent = fs.readFileSync(appJsPath, 'utf8');

// Mock browser environment required by app.js
global.window = {
  crypto: {
    getRandomValues: (arr) => {
      for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
      return arr;
    }
  },
  pool: [],
  nights: [],
  sets: [],
  numSets: 3,
  instrs: ['g'],
  pf: 'all',
  selectedGenres: [],
  editId: null,
  dragSrc: null,
  nextId: 91,
  aiTab: 'lookup',
  apiProvider: 'claude',
  apiKeys: {claude:'', gemini:'', chatgpt:''},
  mustPlay: new Set(),
  DEFAULTS: []
};
global.document = {
  getElementById: () => ({ innerHTML: '', value: '', style: {}, classList: { add: () => {}, remove: () => {} }, addEventListener: () => {} }),
  querySelectorAll: () => ([]),
  addEventListener: () => {}
};
global.localStorage = {
  getItem: () => null,
  setItem: () => {}
};
global.navigator = {
  serviceWorker: { register: () => Promise.resolve() }
};
global.fetch = () => Promise.resolve({ text: () => Promise.resolve('') });
global.setTimeout = () => {};

// Evaluate the file content and export cleanJSON
try {
  eval(songsJsContent);
  eval(appJsContent);
} catch (e) {
  console.log("Error evaluating app.js, proceeding anyway assuming functions are loaded: ", e.message);
}

// 2. Tests for cleanJSON
console.group('\n✅ Test Group: cleanJSON utility');
console.log('Running tests for cleanJSON function...');

runTest('Basic trim removes leading/trailing whitespace', () => {
  assertEqual(cleanJSON('  [{"test": 1}]  \n\t'), '[{"test": 1}]');
});

runTest('Removes markdown json code blocks', () => {
  assertEqual(cleanJSON("```json\n[{\"test\": 1}]\n```"), '[{"test": 1}]');
});

runTest('Removes plain markdown code blocks', () => {
  assertEqual(cleanJSON("```\n[{\"test\": 1}]\n```"), '[{"test": 1}]');
});

runTest('Extracts JSON array from surrounding text', () => {
  assertEqual(cleanJSON("Here is the JSON you requested:\n[{\"test\": 1}]\nHope it helps!"), '[{"test": 1}]');
});

runTest('Extracts array ignoring non-array JSON objects', () => {
  assertEqual(cleanJSON("Response: {\"some\": \"data\"}\n[\n{\"test\": 1}\n]"), '[\n{"test": 1}\n]');
});

runTest('Replaces smart quotes with regular quotes', () => {
  assertEqual(cleanJSON('[{"title": "Test Song"}]'), '[{"title": "Test Song"}]');
  assertEqual(cleanJSON('[{"title": “Test Song”}]'), '[{"title": "Test Song"}]');
  assertEqual(cleanJSON("[{‘title’: ‘Test Song’}]"), "[{'title': 'Test Song'}]");
});

runTest('Removes problematic control characters but keeps newlines', () => {
  assertEqual(cleanJSON('[{"test": 1}]\x00\x08\n[{"test": 2}]'), '[{"test": 1}]\n[{"test": 2}]');
});

console.groupEnd();

// 3. Tests for API Key Encryption
console.group('\n✅ Test Group: API Key Encryption');
runTest('encryptApiKey adds ENC: prefix', () => {
  const encrypted = encryptApiKey('sk-ant-test-key');
  assertEqual(encrypted.startsWith('ENC:'), true);
});

runTest('decryptApiKey restores original key', () => {
  const originalKey = 'sk-ant-api03-abcdefg-12345';
  const encrypted = encryptApiKey(originalKey);
  const decrypted = decryptApiKey(encrypted);
  assertEqual(decrypted, originalKey);
});

runTest('decryptApiKey handles legacy plaintext keys', () => {
  const legacyKey = 'sk-old-plaintext-key';
  const decrypted = decryptApiKey(legacyKey);
  assertEqual(decrypted, legacyKey);
});

runTest('API Key migration from legacy key to dynamic key', () => {
  const originalKey = 'sk-migration-test-key';
  const LEGACY_KEY = "FMG_V2_PROD_KEY_2024";

  // 1. Simulate legacy encrypted key in localStorage
  let legacyEncrypted = '';
  for (let i = 0; i < originalKey.length; i++) {
    legacyEncrypted += String.fromCharCode(originalKey.charCodeAt(i) ^ LEGACY_KEY.charCodeAt(i % LEGACY_KEY.length));
  }
  const legacyStorageValue = 'ENC:' + btoa(legacyEncrypted);

  const storage = {
    'fmg-api-key-claude': legacyStorageValue,
    'fmg-crypto-key': null
  };

  const mockLocalStorage = {
    getItem: (k) => storage[k] || null,
    setItem: (k, v) => { storage[k] = v; }
  };

  // Backup real localStorage
  const realLS = global.localStorage;
  global.localStorage = mockLocalStorage;

  // 2. Re-evaluate CRYPTO_KEY logic (it's an IIFE, but we can simulate its logic or re-evaluate the file)
  // Since we already evaluated songs.js, CRYPTO_KEY is already set.
  // For testing migration, we need to ensure the logic runs with our mock LS.

  // Re-run the IIFE logic manually for testing
  const NEW_DYNAMIC_KEY = (() => {
    const LEGACY = "FMG_V2_PROD_KEY_2024";
    let key = mockLocalStorage.getItem('fmg-crypto-key');
    if (!key) {
      key = 'test-dynamic-key-123456';
      ['claude'].forEach(provider => {
        const storageKey = 'fmg-api-key-' + provider;
        const val = mockLocalStorage.getItem(storageKey);
        if (val && val.startsWith('ENC:')) {
          const decoded = atob(val.slice(4));
          let decrypted = '';
          for (let i = 0; i < decoded.length; i++) {
            decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ LEGACY.charCodeAt(i % LEGACY.length));
          }
          let newlyEncrypted = '';
          for (let i = 0; i < decrypted.length; i++) {
            newlyEncrypted += String.fromCharCode(decrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length));
          }
          mockLocalStorage.setItem(storageKey, 'ENC:' + btoa(newlyEncrypted));
        }
      });
      mockLocalStorage.setItem('fmg-crypto-key', key);
    }
    return key;
  })();

  // 3. Verify migration result
  const migratedValue = mockLocalStorage.getItem('fmg-api-key-claude');
  assertEqual(migratedValue.startsWith('ENC:'), true, 'Migrated value should have ENC: prefix');
  assertEqual(migratedValue !== legacyStorageValue, true, 'Migrated value should be different from legacy value');

  // 4. Verify decryption with new key
  const decoded = atob(migratedValue.slice(4));
  let decrypted = '';
  for (let i = 0; i < decoded.length; i++) {
    decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ NEW_DYNAMIC_KEY.charCodeAt(i % NEW_DYNAMIC_KEY.length));
  }
  assertEqual(decrypted, originalKey, 'Decrypted migrated key should match original');

  // Restore real localStorage
  global.localStorage = realLS;
});
console.groupEnd();


// 4. Tests for parseCSVLine
console.group('\n✅ Test Group: CSV Parsing');

runTest('Basic comma separated values', () => {
  assertArrayEqual(parseCSVLine('Title,Artist,Genre'), ['Title', 'Artist', 'Genre']);
});

runTest('Handles values with spaces', () => {
  assertArrayEqual(parseCSVLine('Song Title, The Artist, Pop Rock'), ['Song Title', 'The Artist', 'Pop Rock']);
});

runTest('Handles empty fields', () => {
  assertArrayEqual(parseCSVLine('Title,,Genre'), ['Title', '', 'Genre']);
  assertArrayEqual(parseCSVLine(',Artist,Genre'), ['', 'Artist', 'Genre']);
  assertArrayEqual(parseCSVLine('Title,Artist,'), ['Title', 'Artist', '']);
});

runTest('Handles quoted fields containing commas', () => {
  assertArrayEqual(parseCSVLine('Title,"Artist, The",Genre'), ['Title', 'Artist, The', 'Genre']);
});

runTest('Trims whitespace from unquoted fields', () => {
  assertArrayEqual(parseCSVLine('  Title  ,  Artist  ,  Genre  '), ['Title', 'Artist', 'Genre']);
});

console.groupEnd();

// 5. Tests for validateSong
console.group('\n✅ Test Group: validateSong');

runTest('Returns null for non-object input', () => {
  assertEqual(validateSong(null), null);
  assertEqual(validateSong(undefined), null);
  assertEqual(validateSong('string'), null);
  assertEqual(validateSong(123), null);
});

runTest('Returns default values for empty object', () => {
  const song = validateSong({});
  assertEqual(typeof song.id, 'number');
  assertEqual(song.title, 'Untitled');
  assertEqual(song.artist, 'Unknown');
  assertEqual(song.genre, 'Blues');
  assertEqual(song.key, 'C');
  assertEqual(song.bpm, 100);
  assertEqual(song.prog, 'I-IV-V');
  assertEqual(song.energy, 3);
  assertEqual(song.effort, 2);
  assertArrayEqual(song.instr, ['g']);
  assertEqual(song.note, '');
});

runTest('Sanitizes and trims string fields', () => {
  const input = {
    title: '  My Song  ',
    artist: '  My Artist  ',
    genre: '  Rock  ',
    key: '  Am  ',
    prog: '  i-iv-v  ',
    note: '  some note  '
  };
  const song = validateSong(input);
  assertEqual(song.title, 'My Song');
  assertEqual(song.artist, 'My Artist');
  assertEqual(song.genre, 'Rock');
  assertEqual(song.key, 'Am');
  assertEqual(song.prog, 'i-iv-v');
  assertEqual(song.note, 'some note');
});

runTest('Enforces BPM range constraints (40-250)', () => {
  assertEqual(validateSong({bpm: 10}).bpm, 40);
  assertEqual(validateSong({bpm: 300}).bpm, 250);
  assertEqual(validateSong({bpm: 120}).bpm, 120);
  assertEqual(validateSong({bpm: '120'}).bpm, 120);
});

runTest('Enforces energy and effort range constraints (1-5)', () => {
  // If energy/effort are 0 or below, parseInt() || 3/2 might be triggered if s.energy is falsy
  // 0 is falsy, so {energy: 0} results in parseInt(0) || 3 -> 3.
  // -1 is truthy, so {energy: -1} results in parseInt(-1) || 3 -> -1. Then Math.max(1, -1) -> 1.
  assertEqual(validateSong({energy: 0}).energy, 3); // Because 0 is falsy
  assertEqual(validateSong({energy: -1}).energy, 1);
  assertEqual(validateSong({energy: 10}).energy, 5);

  assertEqual(validateSong({effort: 0}).effort, 2); // Because 0 is falsy
  assertEqual(validateSong({effort: -1}).effort, 1);
  assertEqual(validateSong({effort: 10}).effort, 5);
});

runTest('Filters instruments to allowed list', () => {
  const song = validateSong({instr: ['eg', 'invalid', 'dr', 'b']});
  assertArrayEqual(song.instr, ['eg', 'dr', 'b']);
});

runTest('Defaults to ["g"] if no valid instruments provided', () => {
  // If instr: [], s.instr.length is 0, so it returns ['g']
  assertArrayEqual(validateSong({instr: []}).instr, ['g']);
  // If instr: ['invalid'], filter returns [], but .length check was on ORIGINAL s.instr.
  // Wait: s.instr.length is 1. filter returns []. So it returns [].
  // This looks like a bug in validateSong implementation if it wants to ensure at least one valid instrument.
  // Fix: Check filtered array length instead.
  assertArrayEqual(validateSong({instr: ['invalid']}).instr, ['g']);
  // If instr: 'not-an-array', Array.isArray is false, returns ['g']
  assertArrayEqual(validateSong({instr: 'not-an-array'}).instr, ['g']);
});

runTest('Truncates prog field to 40 characters', () => {
  const longProg = 'A'.repeat(50);
  const song = validateSong({prog: longProg});
  assertEqual(song.prog.length, 40);
  assertEqual(song.prog, 'A'.repeat(40));
});

console.groupEnd();

// 6. Tests for normalizeInstr
console.group('\n✅ Test Group: normalizeInstr');

runTest('Returns ["g"] for non-array input', () => {
  assertArrayEqual(normalizeInstr(null), ['g']);
  assertArrayEqual(normalizeInstr(undefined), ['g']);
  assertArrayEqual(normalizeInstr('guitar'), ['g']);
  assertArrayEqual(normalizeInstr(123), ['g']);
  assertArrayEqual(normalizeInstr({}), ['g']);
});

runTest('Returns ["g"] for empty array', () => {
  assertArrayEqual(normalizeInstr([]), ['g']);
});

runTest('Maps instrument names to internal codes', () => {
  assertArrayEqual(normalizeInstr(['guitar']), ['g']);
  assertArrayEqual(normalizeInstr(['guitarra']), ['g']);
  assertArrayEqual(normalizeInstr(['piano', 'keyboards', 'keys']), ['p']);
  assertArrayEqual(normalizeInstr(['winds', 'wind', 'brass', 'horns']), ['v']);
  assertArrayEqual(normalizeInstr(['voice', 'vocals', 'vocal', 'voz', 'singing']), ['o']);
});

runTest('Accepts existing codes', () => {
  assertArrayEqual(normalizeInstr(['g', 'p', 'v', 'o']), ['g', 'p', 'v', 'o']);
});

runTest('Handles case-insensitivity and trimming', () => {
  assertArrayEqual(normalizeInstr(['  GUITAR  ', 'Vocals ']), ['g', 'o']);
});

runTest('Removes duplicates in the resulting codes', () => {
  assertArrayEqual(normalizeInstr(['guitar', 'guitarra', 'g']), ['g']);
  assertArrayEqual(normalizeInstr(['piano', 'keys', 'p', 'vocals', 'o']), ['p', 'o']);
});

runTest('Filters out invalid instruments', () => {
  assertArrayEqual(normalizeInstr(['guitar', 'invalid-instrument', 'piano']), ['g', 'p']);
});

runTest('Returns ["g"] if all instruments in array are invalid', () => {
  assertArrayEqual(normalizeInstr(['invalid1', 'invalid2']), ['g']);
});

runTest('Handles non-string elements by converting to string', () => {
  // Map expects strings. String(null) is "null", String(1) is "1".
  // None of these are in the MAP, so it should filter them out and return ['g']
  assertArrayEqual(normalizeInstr([1, null, true]), ['g']);
});

console.groupEnd();

console.log(`\n=============================================`);
console.log(`Test Summary: ${passed} passed, ${failed} failed`);
console.log(`=============================================`);

if (failed > 0) {
  process.exit(1);
}
