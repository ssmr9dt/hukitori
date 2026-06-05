const assert = require('assert');
const {
  formatClockText,
  secondKey,
  generateImageData,
  JST_TIMEZONE,
  IMG_WIDTH,
} = require('../server/generate-image');

assert.strictEqual(JST_TIMEZONE, 'Asia/Tokyo');

const text = formatClockText(new Date('2026-06-05T03:04:05Z'));
assert.match(text, /^\d{2}:\d{2}:\d{2}$/);
assert.strictEqual(text.length, 8);

const data = generateImageData(new Date('2026-06-05T15:30:52+09:00'));
assert.strictEqual(data.text, '15:30:52');
assert.strictEqual(data.pixels[0].length, IMG_WIDTH);

const k1 = secondKey(new Date('2026-06-05T15:30:52+09:00'));
const k2 = secondKey(new Date('2026-06-05T15:30:52.999+09:00'));
assert.strictEqual(k1, k2);

console.log('ok', text);
