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
