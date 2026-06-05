/**
 * php/index.php の Node.js 移植（外部依存なし）
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const GD_FONT_LARGE = require('./gdfont-large');

const IMG_WIDTH = 64;
const IMG_HEIGHT = 27;
const FONT_WIDTH = 8;
const FONT_HEIGHT = 16;
const COLOR_BLACK = 0;
const COLOR_RED = 16711680; // 0xFF0000, PHP imagecolorat 相当
const IMAGE_JSON_PATH = path.join(__dirname, 'image.json');

const JST_TIMEZONE = 'Asia/Tokyo';

function formatClockText(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: JST_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date);
  const pick = (type) => parts.find((p) => p.type === type).value;
  return `${pick('hour')}:${pick('minute')}:${pick('second')}`;
}

function secondKey(date = new Date()) {
  return Math.floor(date.getTime() / 1000);
}

function createPixelBuffer() {
  const pixels = [];
  for (let y = 0; y < IMG_HEIGHT; y++) {
    pixels[y] = new Array(IMG_WIDTH).fill(COLOR_BLACK);
  }
  return pixels;
}

function drawChar(pixels, ch, x, y) {
  const glyph = GD_FONT_LARGE[ch];
  if (!glyph) return;
  for (let row = 0; row < FONT_HEIGHT; row++) {
    for (let col = 0; col < FONT_WIDTH; col++) {
      if (!glyph[row][col]) continue;
      const py = y + row;
      const px = x + col;
      if (px >= 0 && px < IMG_WIDTH && py >= 0 && py < IMG_HEIGHT) {
        pixels[py][px] = COLOR_RED;
      }
    }
  }
}

function drawText(pixels, text) {
  const tw = text.length * FONT_WIDTH;
  const tx = Math.floor((IMG_WIDTH - tw) / 2);
  const ty = Math.floor((IMG_HEIGHT - FONT_HEIGHT) / 2);
  for (let i = 0; i < text.length; i++) {
    drawChar(pixels, text[i], tx + i * FONT_WIDTH, ty);
  }
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  const crc = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePng(pixels) {
  const raw = Buffer.alloc(IMG_HEIGHT * (1 + IMG_WIDTH * 3));
  let offset = 0;
  for (let y = 0; y < IMG_HEIGHT; y++) {
    raw[offset++] = 0;
    for (let x = 0; x < IMG_WIDTH; x++) {
      const rgb = pixels[y][x];
      raw[offset++] = (rgb >> 16) & 0xff;
      raw[offset++] = (rgb >> 8) & 0xff;
      raw[offset++] = rgb & 0xff;
    }
  }
  const compressed = zlib.deflateSync(raw);

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(IMG_WIDTH, 0);
  ihdr.writeUInt32BE(IMG_HEIGHT, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    signature,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

function generateImageData(date = new Date()) {
  const text = formatClockText(date);
  const pixels = createPixelBuffer();
  drawText(pixels, text);

  return {
    text,
    pixels,
    png: encodePng(pixels),
  };
}

function writeImageJson(data, filePath = IMAGE_JSON_PATH) {
  const payload = { text: data.text, pixels: data.pixels };
  fs.writeFileSync(filePath, JSON.stringify(payload));
  return filePath;
}

let cache = null;
let cacheKey = null;

function getImageData(date = new Date()) {
  const key = secondKey(date);
  if (cache && cacheKey === key) {
    return cache;
  }
  cache = generateImageData(date);
  cacheKey = key;
  writeImageJson(cache);
  return cache;
}

module.exports = {
  generateImageData,
  getImageData,
  writeImageJson,
  IMAGE_JSON_PATH,
  formatClockText,
  secondKey,
  IMG_WIDTH,
  IMG_HEIGHT,
  JST_TIMEZONE,
};
