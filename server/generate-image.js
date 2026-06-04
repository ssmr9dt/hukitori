/**
 * php/index.php の Node.js 移植（外部依存なし）
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const GD_FONT_LARGE = require('./gdfont-large');

const IMG_WIDTH = 48;
const IMG_HEIGHT = 27;
const FONT_WIDTH = 8;
const FONT_HEIGHT = 16;
const COLOR_BLACK = 0;
const COLOR_RED = 16711680; // 0xFF0000, PHP imagecolorat 相当
const IMAGE_JSON_PATH = path.join(__dirname, 'image.json');

function hourSeed() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  return parseInt(`${y}${m}${day}${h}`, 10);
}

function rand1000to9999(seed) {
  let s = seed >>> 0;
  s = Math.imul(s ^ (s >>> 16), 2246822507);
  s = Math.imul(s ^ (s >>> 13), 3266489909);
  s ^= s >>> 16;
  return 1000 + (s >>> 0) % 9000;
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

function generateImageData() {
  const text = String(rand1000to9999(hourSeed()));
  const pixels = createPixelBuffer();
  drawText(pixels, text);

  return {
    text: parseInt(text, 10),
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
let cacheSeed = null;

function getImageData() {
  const seed = hourSeed();
  if (cache && cacheSeed === seed) {
    return cache;
  }
  cache = generateImageData();
  cacheSeed = seed;
  writeImageJson(cache);
  return cache;
}

module.exports = {
  generateImageData,
  getImageData,
  writeImageJson,
  IMAGE_JSON_PATH,
  hourSeed,
};
