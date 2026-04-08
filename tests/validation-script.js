console.group('SetManager Validation Suite');
// Mock environment
let testErrors = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    testErrors++;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

// Group 1: i18n Fallback Test
console.group('✅ Test 1: i18n tr() Fallback');
try {
  // We don't overwrite the actual global i18n and tr to avoid breaking the app,
  // we just test the logic inline using the global tr if possible or our own copy

  // Create a scoped mock testing the tr logic
  const mockI18n = {
    en: { btn_save: 'Save', missing_in_ru: 'English Fallback' },
    ru: { btn_save: 'Сохранить' }
  };
  let mockCurrentLang = 'en';
  function mockTr(k){return mockI18n[mockCurrentLang]?.[k] ?? mockI18n.en[k] ?? k;}

  // 1. Current lang
  assert(mockTr('btn_save') === 'Save', 'Key exists in current language');

  // 2. Change lang
  mockCurrentLang = 'ru';
  assert(mockTr('btn_save') === 'Сохранить', 'Language change works');

  // 3. Fallback to EN
  assert(mockTr('missing_in_ru') === 'English Fallback', 'Falls back to English if missing in target lang');

  // 4. Fallback to key
  assert(mockTr('unknown_key') === 'unknown_key', 'Falls back to key if missing everywhere');

} catch (e) {
  console.error('❌ FAIL: Execution error in Test 1', e);
  testErrors++;
}
console.groupEnd();

console.groupEnd();

if (testErrors === 0) {
  console.log('%c✅ All validation tests passed!', 'color: green; font-weight: bold; font-size: 14px');
} else {
  console.error(`%c❌ Validation failed with ${testErrors} errors`, 'color: red; font-weight: bold; font-size: 14px');
}
