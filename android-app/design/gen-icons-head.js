const { Resvg } = require('/tmp/fontwork/node_modules/@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const RES = '/Users/weishuai/WorkBuddy/2026-11-16-10-41-46/guitar-tuner-apk/android/app/src/main/res';
const DESIGN = '/Users/weishuai/WorkBuddy/2026-11-16-10-41-46/guitar-tuner-apk/design';

function render(svg, size, out) {
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
  fs.writeFileSync(out, png);
}

// 前景：琴头图形，去掉白底圆角（自适应图标背景层提供白底），图形缩到安全区约 64%
const headPath = `M 256,140 C 234,140 216,132 200,114 C 188,100 174,92 158,96 C 148,116 144,140 146,170 C 148,220 152,272 168,318 C 184,364 208,392 226,410 L 286,410 C 304,392 328,364 344,318 C 360,272 364,220 366,170 C 368,140 364,116 354,96 C 338,92 324,100 312,114 C 296,132 278,140 256,140 Z`;

const fgInner = `
  <path d="${headPath}" fill="#1c1c1c"/>
  <path d="M 236,140 L 276,140 L 268,410 L 244,410 Z" fill="#ffffff" opacity="0.09"/>
  <g>
    <circle cx="146" cy="164" r="23" fill="#ffffff" stroke="#1c1c1c" stroke-width="6"/>
    <circle cx="154" cy="232" r="23" fill="#ffffff" stroke="#1c1c1c" stroke-width="6"/>
    <circle cx="170" cy="300" r="23" fill="#ffffff" stroke="#1c1c1c" stroke-width="6"/>
    <circle cx="366" cy="164" r="23" fill="#ffffff" stroke="#1c1c1c" stroke-width="6"/>
    <circle cx="358" cy="232" r="23" fill="#ffffff" stroke="#1c1c1c" stroke-width="6"/>
    <circle cx="342" cy="300" r="23" fill="#ffffff" stroke="#1c1c1c" stroke-width="6"/>
  </g>
  <g stroke="#5cab2e" stroke-width="2.6" opacity="0.95">
    <line x1="240" y1="142" x2="247" y2="408"/><line x1="246" y1="142" x2="251" y2="408"/>
    <line x1="252" y1="142" x2="254" y2="408"/><line x1="260" y1="142" x2="258" y2="408"/>
    <line x1="266" y1="142" x2="261" y2="408"/><line x1="272" y1="142" x2="265" y2="408"/>
  </g>
  <line x1="234" y1="140" x2="278" y2="140" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
`;

const fgSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <g transform="translate(256,258) scale(0.62) translate(-256,-258)">${fgInner}</g>
</svg>`;

const fullSvg = fs.readFileSync(path.join(DESIGN, 'logo-head-app.svg'), 'utf8');
const bgSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512"><rect width="512" height="512" fill="#ffffff"/></svg>`;

const densities = [
  { dir: 'mdpi', fg: 108, legacy: 48 },
  { dir: 'hdpi', fg: 162, legacy: 72 },
  { dir: 'xhdpi', fg: 216, legacy: 96 },
  { dir: 'xxhdpi', fg: 324, legacy: 144 },
  { dir: 'xxxhdpi', fg: 432, legacy: 192 },
];

for (const d of densities) {
  const dir = path.join(RES, 'mipmap-' + d.dir);
  fs.mkdirSync(dir, { recursive: true });
  render(fgSvg, d.fg, path.join(dir, 'ic_launcher_foreground.png'));
  render(bgSvg, d.fg, path.join(dir, 'ic_launcher_background.png'));
  render(fullSvg, d.legacy, path.join(dir, 'ic_launcher.png'));
  render(fullSvg, d.legacy, path.join(dir, 'ic_launcher_round.png'));
}
console.log('ALL DONE - head logo icons generated');
