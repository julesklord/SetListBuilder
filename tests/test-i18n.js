// Read the actual tr function from i18n.js to make it a true unit test
const fs = require('fs');
const path = require('path');
const code = fs.readFileSync(path.join(__dirname, '../js/i18n.js'), 'utf8');

// Extract the tr function string
const trRegex = /function\s+tr\s*\([^)]*\)\s*\{[^}]+\}/;
const trMatch = code.match(trRegex);

if (!trMatch) {
  console.error("Could not find tr function in js/i18n.js");
  process.exit(1);
}

const trFunctionStr = trMatch[0];

// Define globals needed by tr
global.i18n = {
  en: { btn_save: 'Save', missing_in_ru_only: 'English Fallback' },
  ru: { btn_save: 'Сохранить' }
};
global.currentLang = 'en';

// Evaluate the actual tr function from the source file
eval(trFunctionStr);

console.log("Testing tr fallback from js/i18n.js...");
let errors = 0;

try {
  // Test 1: Key exists in current language (en)
  const val1 = tr('btn_save');
  if (val1 !== 'Save') {
    console.error(`Test 1 Failed: Expected 'Save', got '${val1}'`);
    errors++;
  } else {
    console.log("Test 1 Passed: Key exists in current lang");
  }

  // Set language to Russian
  global.currentLang = 'ru';

  // Test 2: Key exists in current language (ru)
  const val2 = tr('btn_save');
  if (val2 !== 'Сохранить') {
    console.error(`Test 2 Failed: Expected 'Сохранить', got '${val2}'`);
    errors++;
  } else {
    console.log("Test 2 Passed: Key exists in target lang");
  }

  // Test 3: Key missing in target lang but exists in English
  const val3 = tr('missing_in_ru_only');
  if (val3 !== 'English Fallback') {
    console.error(`Test 3 Failed: Expected 'English Fallback', got '${val3}'`);
    errors++;
  } else {
    console.log("Test 3 Passed: Fallback to English when missing in current lang");
  }

  // Test 4: Key missing everywhere returns the key itself
  const val4 = tr('completely_unknown_key');
  if (val4 !== 'completely_unknown_key') {
    console.error(`Test 4 Failed: Expected 'completely_unknown_key', got '${val4}'`);
    errors++;
  } else {
    console.log("Test 4 Passed: Fallback to key when completely unknown");
  }

} catch (e) {
  console.error("Test execution error:", e);
  errors++;
}

if (errors > 0) {
  console.error(`\n❌ Failed with ${errors} error(s)`);
  process.exit(1);
} else {
  console.log(`\n✅ All tests passed!`);
}
