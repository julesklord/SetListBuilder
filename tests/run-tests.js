// Setup basic browser mocks so app.js can be imported in Node.js
global.window = {
  location: { search: '' }
};
global.document = {
  querySelectorAll: () => [],
  getElementById: () => ({ style: {}, classList: { add: ()=>{}, remove: ()=>{} }, addEventListener: ()=>{} }),
  createElement: () => ({ style: {} }),
  addEventListener: () => {}
};
global.localStorage = {
  getItem: () => null,
  setItem: () => {}
};
global.fetch = () => Promise.resolve({ json: () => Promise.resolve({}), ok: true });

const { cleanJSON } = require('../js/app.js');

console.log("🧪 Testing cleanJSON utility...\n");

const testCases = [
  {
    name: "Normal JSON",
    input: '{"title": "Song 1", "artist": "Artist 1"}',
    expected: '{"title": "Song 1", "artist": "Artist 1"}'
  },
  {
    name: "Markdown code block (json)",
    input: '```json\n[{"title": "Song 1", "artist": "Artist 1"}]\n```',
    expected: '[{"title": "Song 1", "artist": "Artist 1"}]'
  },
  {
    name: "Markdown code block (no language)",
    input: '```\n[{"title": "Song 1", "artist": "Artist 1"}]\n```',
    expected: '[{"title": "Song 1", "artist": "Artist 1"}]'
  },
  {
    name: "Extraneous text before/after",
    input: 'Here is your JSON:\n[\n  {"title": "Song 1", "artist": "Artist 1"}\n]\nEnjoy!',
    expected: '[\n  {"title": "Song 1", "artist": "Artist 1"}\n]'
  },
  {
    name: "Smart quotes double",
    input: '[{“title”: “Song 1”}]',
    expected: '[{"title": "Song 1"}]'
  },
  {
    name: "Smart quotes single",
    input: "[{‘title’: ‘Song 1’}]",
    expected: "[{'title': 'Song 1'}]"
  },
  {
    name: "Control characters removal (except newlines/tabs)",
    input: '[\n  {"title": "Song\x01 1"}\n]',
    expected: '[\n  {"title": "Song 1"}\n]'
  },
  {
    name: "Mixed markdown and extraneous text",
    input: "Here is the list:\n```json\n[\n  {\"title\": \"Song 1\"}\n]\n```\nHope it helps!",
    expected: "[\n  {\"title\": \"Song 1\"}\n]"
  }
];

let passedCount = 0;
let failedCount = 0;

testCases.forEach(tc => {
  try {
    const result = cleanJSON(tc.input);
    if (result === tc.expected) {
      console.log(`✅ PASS: ${tc.name}`);
      passedCount++;
    } else {
      console.error(`❌ FAIL: ${tc.name}`);
      console.error(`   Expected: ${JSON.stringify(tc.expected)}`);
      console.error(`   Got:      ${JSON.stringify(result)}`);
      failedCount++;
    }
  } catch (err) {
    console.error(`❌ FAIL: ${tc.name} (Error: ${err.message})`);
    failedCount++;
  }
});

console.log(`\n📊 Results: ${passedCount}/${testCases.length} tests passed.`);

if (failedCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
