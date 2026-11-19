const { Resvg } = require('/tmp/fontwork/node_modules/@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const RES = '/Users/weishuai/WorkBuddy/2026-11-16-10-41-46/guitar-tuner-apk/android/app/src/main/res';
const DESIGN = '/Users/weishuai/WorkBuddy/2026-11-16-10-41-46/guitar-tuner-apk/design';

function render(svg, size, out) {
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
  fs.writeFileSync(out, png);
}

// ── 1. 自适应图标前景：吉他主体，留出安全区（图形缩到约 66% 画布） ──
const fgSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <g transform="translate(256,256) scale(0.68) translate(-256,-256)">
    <path d="M 256,452 A 100,100 0 1 1 256,252 A 66,66 0 1 1 256,120 A 66,66 0 0 1 256,252 A 100,100 0 1 1 256,452 Z"
          fill="none" stroke="#1c1c1c" stroke-width="17" stroke-linejoin="round"/>
    <path d="M 222,120 L 228,52 M 290,120 L 284,52" fill="none" stroke="#1c1c1c" stroke-width="17" stroke-linecap="round"/>
    <line x1="224" y1="52" x2="288" y2="52" stroke="#1c1c1c" stroke-width="17" stroke-linecap="round"/>
    <circle cx="256" cy="186" r="30" fill="none" stroke="#5cab2e" stroke-width="15"/>
    <g fill="#1c1c1c"><circle cx="230" cy="52" r="5"/><circle cx="256" cy="52" r="5"/><circle cx="282" cy="52" r="5"/></g>
  </g>
</svg>`;

// ── 2. 传统方形/圆形图标：白底圆角 + 吉他（铺满） ──
const fullSvg = fs.readFileSync(path.join(DESIGN, 'logo-app.svg'), 'utf8');

// ── 3. 背景层：纯白 ──
const bgSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512"><rect width="512" height="512" fill="#ffffff"/></svg>`;

const densities = [
  { dir: 'mdpi',    fg: 108, legacy: 48 },
  { dir: 'hdpi',    fg: 162, legacy: 72 },
  { dir: 'xhdpi',   fg: 216, legacy: 96 },
  { dir: 'xxhdpi',  fg: 324, legacy: 144 },
  { dir: 'xxxhdpi', fg: 432, legacy: 192 },
];

for (const d of densities) {
  const dir = path.join(RES, 'mipmap-' + d.dir);
  fs.mkdirSync(dir, { recursive: true });
  render(fgSvg, d.fg, path.join(dir, 'ic_launcher_foreground.png'));
  render(bgSvg, d.fg, path.join(dir, 'ic_launcher_background.png'));
  render(fullSvg, d.legacy, path.join(dir, 'ic_launcher.png'));
  render(fullSvg, d.legacy, path.join(dir, 'ic_launcher_round.png'));
  console.log('generated', d.dir);
}

// ── 4. 自适应图标配置 ──
fs.writeFileSync(path.join(RES, 'values', 'ic_launcher_background.xml'),
`<?xml version="1.0" encoding="utf-8"?>
<resources><color name="ic_launcher_background">#FFFFFF</color></resources>
`);

fs.writeFileSync(path.join(RES, 'values', 'ic_launcher.xml'),
`<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
  <background android:drawable="@color/ic_launcher_background"/>
  <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
`);

fs.writeFileSync(path.join(RES, 'values-v26', 'ic_launcher.xml'), '' ); // placeholder removed below
try { fs.unlinkSync(path.join(RES, 'values-v26', 'ic_launcher.xml')); fs.rmdirSync(path.join(RES, 'values-v26')); } catch(e){}

console.log('ALL DONE');
