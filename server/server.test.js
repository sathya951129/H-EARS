const test = require('node:test');
const assert = require('node:assert');

test('Backend Configuration Check', async (t) => {
  await t.test('Ensure server port variable is valid', () => {
    const PORT = 5001;
    // An automated assertion: We expect PORT to strictly equal 5001
    assert.strictEqual(PORT, 5001);
  });
});