const { Resvg } = require('/tmp/fontwork/node_modules/@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const RES = '/Users/weishuai/WorkBuddy/2026-11-16-10-41-46/guitar-tuner-apk/android/app/src/main/res';
const SRC = '/Users/weishuai/WorkBuddy/2026-11-16-10-41-46/guitar-tuner-apk/design/user-logo.png';
const b64 = fs.readFileSync(SRC).toString('base64');
const dataUri = `data:image/png;base64,${b64}`;

function render(svg, size, out) {
  const full = svg.replace(/__W__/g, size).replace(/__IMG__/g, dataUri);
  const png = new Resvg(full, { fitTo: { mode: 'width', value: size } }).render().asPng();
  fs.writeFileSync(out, png);
}

// legacy launcher icon: 整图（含白底方形）铺满画布
const legacySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="__W__" height="__W__" viewBox="0 0 __W__ __W__"><image href="__IMG__" x="0" y="0" width="__W__" height="__W__" preserveAspectRatio="xMidYMid meet"/></svg>`;
// adaptive foreground: 图形缩进中心 70/108 安全区，四周透明（background 层提供白底）
function fgSvg(size) {
  const area = Math.round(size * (70 / 108));
  const pad = Math.round((size - area) / 2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><image href="${dataUri}" x="${pad}" y="${pad}" width="${area}" height="${area}" preserveAspectRatio="xMidYMid meet"/></svg>`;
}
// 纯白 background PNG
const whiteSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="__W__" height="__W__" viewBox="0 0 __W__ __W__"><rect width="__W__" height="__W__" fill="#FFFFFF"/></svg>`;

const legacy = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };
const foreground = { mdpi: 108, hdpi: 162, xhdpi: 216, xxhdpi: 324, xxxhdpi: 432 };
const bgSize = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };

for (const [den, sz] of Object.entries(legacy)) {
  const dir = path.join(RES, `mipmap-${den}`);
  fs.mkdirSync(dir, { recursive: true });
  render(legacySvg, sz, path.join(dir, 'ic_launcher.png'));
  render(legacySvg, sz, path.join(dir, 'ic_launcher_round.png'));
  console.log(`${den}: legacy ${sz}px`);
}
for (const [den, sz] of Object.entries(foreground)) {
  const dir = path.join(RES, `mipmap-${den}`);
  render(fgSvg(sz), sz, path.join(dir, 'ic_launcher_foreground.png'));
  console.log(`${den}: foreground ${sz}px`);
}
for (const [den, sz] of Object.entries(bgSize)) {
  const dir = path.join(RES, `mipmap-${den}`);
  render(whiteSvg, sz, path.join(dir, 'ic_launcher_background.png'));
}
console.log('ALL DONE');
