console.log('Test framework initialized\n');

try {
  require('./test-i18n.js');
} catch (e) {
  console.error('Error running tests:', e);
  process.exit(1);
}
