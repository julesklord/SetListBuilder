/**
 * SetManager Validation Script
 * Run this in your browser's DevTools Console
 */
console.group('SetManager Validation Tests');
let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log('✅ PASS: ' + message);
    passed++;
  } else {
    console.error('❌ FAIL: ' + message);
  }
}

try {
  console.group('✅ Test Group: cleanJSON Utility');

  // Test 1: Basic JSON
  assert(
    cleanJSON('{"title": "Song 1"}') === '{"title": "Song 1"}',
    'Preserves valid JSON'
  );

  // Test 2: Markdown blocks
  assert(
    cleanJSON('```json\n[{"title": "Song 1"}]\n```') === '[{"title": "Song 1"}]',
    'Removes markdown code blocks'
  );

  // Test 3: Extraneous text
  assert(
    cleanJSON('Here is your json:\n[\n{"title": "Song 1"}\n]\nEnjoy!') === '[\n{"title": "Song 1"}\n]',
    'Strips extraneous text before and after array'
  );

  // Test 4: Smart quotes
  assert(
    cleanJSON('[{“title”: “Song 1”}]') === '[{"title": "Song 1"}]',
    'Replaces double smart quotes'
  );

  assert(
    cleanJSON("[{‘title’: ‘Song 1’}]") === "[{'title': 'Song 1'}]",
    'Replaces single smart quotes'
  );

  // Test 5: Control characters
  assert(
    cleanJSON('[\n  {"title": "Song\x01 1"}\n]') === '[\n  {"title": "Song 1"}\n]',
    'Removes invalid control characters'
  );

  console.groupEnd();
} catch (e) {
  console.error('❌ Error running cleanJSON tests:', e);
}

console.log(`\n📊 Results: ${passed}/${total} tests passed.`);
console.groupEnd();
