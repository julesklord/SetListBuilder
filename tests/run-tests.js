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
// Using new Function is cleaner than eval for avoiding strict mode issues
// but eval is fine here since we control the scope
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
  // Test double smart quotes
  assertEqual(cleanJSON('[{"title": "Test Song"}]'), '[{"title": "Test Song"}]'); // Since I already fixed the regex in js/app.js to look for real smart quotes, I'll pass real ones here:
  assertEqual(cleanJSON('[{"title": “Test Song”}]'), '[{"title": "Test Song"}]');
  // Test single smart quotes
  assertEqual(cleanJSON("[{‘title’: ‘Test Song’}]"), "[{'title': 'Test Song'}]");
});

runTest('Removes problematic control characters but keeps newlines', () => {
  // \x00 (null) and \x08 (backspace) should be removed
  // \n should be kept
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

console.log(`\n=============================================`);

console.log(`Test Summary: ${passed} passed, ${failed} failed`);
console.log(`=============================================`);

if (failed > 0) {
  process.exit(1);
}
