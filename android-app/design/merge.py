# -*- coding: utf-8 -*-
"""把欢迎页作为覆盖层合并进调弦页，消除两步跳转。"""
from pathlib import Path

WWW = Path('/Users/weishuai/WorkBuddy/2026-11-16-10-41-46/guitar-tuner-apk/www')
src = (WWW / 'tuner.html').read_text(encoding='utf-8')

# ── 1. 替换 CSS 中「启动遮罩」段为欢迎页覆盖层样式 ──
css_start = src.index('/* ── 启动遮罩')
css_end = src.index('button:focus-visible{', css_start)
new_css = '''/* ── 欢迎页覆盖层（启动即授权，一步进入调弦） ── */
#welcome{
  position:fixed; inset:0; z-index:20;
  background:
    radial-gradient(130% 55% at 50% -8%, rgba(143,224,77,.10) 0%, transparent 55%),
    radial-gradient(120% 60% at 50% 0%, #262626 0%, #1d1d1d 58%, #171717 100%);
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  padding:clamp(24px,6vh,56px) 26px calc(26px + env(safe-area-inset-bottom));
  text-align:center; transition:opacity .5s ease;
}
#welcome.hide{ opacity:0; pointer-events:none; }
#welcome .geo-top{ display:flex; align-items:center; gap:12px; width:100%; justify-content:center; margin-bottom:clamp(20px,4vh,36px); }
#welcome .geo-top .ln{ height:1px; width:48px; background:linear-gradient(90deg,transparent,var(--line)); }
#welcome .geo-top .ln.r{ background:linear-gradient(90deg,var(--line),transparent); }
#welcome .geo-top .mk{ font-family:var(--mono); font-size:10px; letter-spacing:.34em; color:var(--faint); text-transform:uppercase; }
#welcome .logo{
  width:clamp(132px,36vw,176px); height:auto; border-radius:clamp(28px,8vw,38px);
  filter:drop-shadow(0 12px 30px rgba(0,0,0,.5));
}
#welcome .brandline{ margin-top:clamp(20px,4vh,34px); }
#welcome .brandline h1{ font-family:var(--display); font-weight:500; font-size:clamp(36px,10vw,48px); letter-spacing:.1em; line-height:1; }
#welcome .brandline .en{ display:block; margin-top:10px; font-family:var(--mono); font-size:11px; font-weight:300; letter-spacing:.42em; color:var(--mut); text-transform:uppercase; }
#welcome .tagline{ margin-top:14px; font-size:13px; color:var(--mut); letter-spacing:.06em; line-height:1.7; }
#welcome .features{ display:flex; gap:clamp(12px,4.5vw,22px); margin-top:clamp(22px,4vh,36px); }
#welcome .feature{ flex:1; display:flex; flex-direction:column; align-items:center; gap:9px; }
#welcome .feature .ic{ width:42px; height:42px; border-radius:13px; border:1px solid var(--line); background:rgba(255,255,255,.03); display:flex; align-items:center; justify-content:center; }
#welcome .feature .ic svg{ width:21px; height:21px; stroke:var(--green); fill:none; stroke-width:1.6; stroke-linecap:round; stroke-linejoin:round; }
#welcome .feature .t{ font-size:11px; color:var(--mut); letter-spacing:.03em; }
#welcome .feature .t b{ display:block; color:var(--ink); font-weight:500; font-size:12px; margin-bottom:3px; }
#welcome .actions{ margin-top:auto; padding-top:clamp(24px,5vh,44px); width:100%; }
#startBtn{
  appearance:none; cursor:pointer; width:100%; max-width:420px;
  font-family:var(--body); font-size:16px; font-weight:500; letter-spacing:.2em;
  color:#161616; background:var(--green); border:none;
  border-radius:999px; padding:17px 24px;
  box-shadow:0 8px 30px rgba(143,224,77,.25);
  transition:transform .15s, box-shadow .2s, background .2s;
}
#startBtn:active{ transform:scale(.975); box-shadow:0 4px 16px rgba(143,224,77,.2); }
#startBtn:disabled{ opacity:.7; cursor:wait; }
#gateErr{ color:var(--red); font-size:12px; min-height:20px; margin-top:12px; line-height:1.6; max-width:420px; }
#welcome .hint{ margin-top:12px; font-family:var(--mono); font-size:10px; letter-spacing:.14em; color:var(--faint); }
#welcome footer{ margin-top:16px; font-family:var(--mono); font-size:10px; color:var(--faint); letter-spacing:.12em; }

'''
src = src[:css_start] + new_css + src[css_end:]

# ── 2. 替换 DOM 中的 #gate 为欢迎页覆盖层 ──
dom_start = src.index('<div id="gate">')
dom_end = src.index('<div class="wrap">', dom_start)
welcome_dom = '''<div id="welcome">
  <div class="geo-top"><span class="ln"></span><span class="mk">Est. in tune</span><span class="ln r"></span></div>
  <img class="logo" src="logo.svg" alt="调弦 Logo">
  <div class="brandline">
    <h1>调弦</h1>
    <span class="en">Guitar Tuner</span>
  </div>
  <p class="tagline">让每一根空弦，都回归它本来的音高</p>
  <div class="features">
    <div class="feature">
      <div class="ic"><svg viewBox="0 0 24 24"><path d="M3 12h2l2-6 3 12 3-9 2 6h6"/></svg></div>
      <div class="t"><b>精准识别</b>YIN 基频算法</div>
    </div>
    <div class="feature">
      <div class="ic"><svg viewBox="0 0 24 24"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/><path d="M9 12l2 2 4-4"/></svg></div>
      <div class="t"><b>安全调弦</b>断弦风险提示</div>
    </div>
    <div class="feature">
      <div class="ic"><svg viewBox="0 0 24 24"><path d="M5 12a7 7 0 0114 0"/><path d="M12 12l4-4"/><circle cx="12" cy="12" r="1.5"/></svg></div>
      <div class="t"><b>完全离线</b>无需联网</div>
    </div>
  </div>
  <div class="actions">
    <button id="startBtn">开 始 调 弦</button>
    <div id="gateErr"></div>
    <div class="hint">首次使用需授权麦克风 · 建议在安静环境中</div>
  </div>
  <footer>几何制图 · 黄金比例 · 标准定弦 E A D G B E</footer>
</div>

'''
src = src[:dom_start] + welcome_dom + src[dom_end:]

# ── 3. 修正 JS 中的 DOM 引用：gate → welcome ──
src = src.replace(
    'const autoBtn = $("autoBtn"), gate = $("gate"), startBtn = $("startBtn"), gateErr = $("gateErr");',
    'const autoBtn = $("autoBtn"), welcome = $("welcome"), startBtn = $("startBtn"), gateErr = $("gateErr");'
)

# ── 4. 改造启动按钮 JS：加 loading 态、隐藏 welcome ──
old_js = '''startBtn.addEventListener("click", async () => {
  gateErr.textContent = "";
  try {'''
new_js = '''startBtn.addEventListener("click", async () => {
  gateErr.textContent = "";
  startBtn.disabled = true;
  startBtn.textContent = "正在开启…";
  try {'''
assert old_js in src, 'start JS head not found'
src = src.replace(old_js, new_js)

src = src.replace('''    gate.classList.add("hide");
    loop();''', '''    welcome.classList.add("hide");
    loop();''')

# 失败时恢复按钮
old_catch = '''    gateErr.textContent = e.name === "NotAllowedError"
      ? "麦克风权限被拒绝，请在浏览器设置中允许后重试。"
      : "无法访问麦克风：" + (e.message || e.name);
  }
});'''
new_catch = '''    gateErr.textContent = e.name === "NotAllowedError"
      ? "麦克风权限被拒绝，请在系统设置中允许本应用使用麦克风后重试。"
      : "无法访问麦克风：" + (e.message || e.name);
    startBtn.disabled = false;
    startBtn.textContent = "开 始 调 弦";
  }
});'''
assert old_catch in src, 'start JS catch not found'
src = src.replace(old_catch, new_catch)

(WWW / 'index.html').write_text(src, encoding='utf-8')
print('MERGED OK, length=', len(src))
