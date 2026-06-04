const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(
  path.join(__dirname, '../server/gdfontl-source.c'),
  'utf8'
);

const digits = {};
for (let c = 48; c <= 57; c++) {
  const marker = `/* Char ${c} */`;
  const start = src.indexOf(marker);
  const next = src.indexOf('/* Char ', start + marker.length);
  const block = src.slice(start + marker.length, next === -1 ? undefined : next);
  const rows = block
    .trim()
    .split('\n')
    .map((line) =>
      line
        .split(',')
        .map((x) => parseInt(x.trim(), 10))
        .filter((n) => !Number.isNaN(n))
    )
    .filter((row) => row.length === 8);
  digits[String.fromCharCode(c)] = rows.slice(0, 16);
}

const out = `/** PHP gdFontLarge (imagestring font 4) digits 0-9 */\nmodule.exports = ${JSON.stringify(digits)};\n`;
fs.writeFileSync(path.join(__dirname, '../server/gdfont-large.js'), out);
console.log('written', Object.keys(digits).join(''));
