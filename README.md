# 调弦 · 乐器调音器

[English](README_EN.md)

基于手机/电脑麦克风的免费在线调音器，支持多种弦乐器的标准定弦，单文件 HTML，无需安装、无广告、完全离线。支持中英双语——自动识别系统语言，也可在页面右上角手动切换。

> 从吉他调音器（[guitar-tuner](https://github.com/lccpws/guitar-tuner)）扩展而来，新增尤克里里、贝斯、小提琴支持。

## 支持的乐器

| 乐器 | 标准定弦 | 弦数 | 空弦音域 |
|------|----------|------|----------|
| 吉他 Guitar | E A D G B E | 6 | E2 82.41 Hz – E4 329.63 Hz |
| 尤克里里 Ukulele | G C E A（高 G 定弦） | 4 | C4 261.63 Hz – A4 440.00 Hz |
| 贝斯 Bass | E A D G | 4 | E1 41.20 Hz – G2 98.00 Hz |
| 小提琴 Violin | G D A E | 4 | G3 196.00 Hz – E5 659.25 Hz |

各乐器的标准定弦频率（按界面从左到右的弦序）：

<details>
<summary>吉他 E A D G B E</summary>

| 弦 | 音名 | 频率 |
|----|------|------|
| 6 | E2 | 82.41 Hz |
| 5 | A2 | 110.00 Hz |
| 4 | D3 | 146.83 Hz |
| 3 | G3 | 196.00 Hz |
| 2 | B3 | 246.94 Hz |
| 1 | E4 | 329.63 Hz |

</details>

<details>
<summary>尤克里里 G C E A（高 G）</summary>

| 弦 | 音名 | 频率 |
|----|------|------|
| 4 | G4 | 392.00 Hz |
| 3 | C4 | 261.63 Hz |
| 2 | E4 | 329.63 Hz |
| 1 | A4 | 440.00 Hz |

</details>

<details>
<summary>贝斯 E A D G</summary>

| 弦 | 音名 | 频率 |
|----|------|------|
| 4 | E1 | 41.20 Hz |
| 3 | A1 | 55.00 Hz |
| 2 | D2 | 73.42 Hz |
| 1 | G2 | 98.00 Hz |

</details>

<details>
<summary>小提琴 G D A E</summary>

| 弦 | 音名 | 频率 |
|----|------|------|
| 4 | G3 | 196.00 Hz |
| 3 | D4 | 293.66 Hz |
| 2 | A4 | 440.00 Hz |
| 1 | E5 | 659.25 Hz |

</details>

## 功能

- **四种乐器自由切换**：欢迎页与调弦页顶部均可切换乐器，切换后定弦、琴头弦数、选弦按钮、频率范围与提示同步更新
- **麦克风实时测频**：YIN 自相关算法检测基频，18 根空弦合成测试误差均小于 1 音分
- **音域自适应**：每种乐器使用独立的检测参数（FFT 窗口、高通截止、频率上下限）；贝斯 E1 低至 41 Hz，单独加长采样窗口以保证识别
- **自动识别琴弦**：拨弦后自动判断当前调的是哪根弦，也可手动锁定目标弦
- **音分表盘 + 吸附锁定**：±50 音分量程，进入 ±3¢ 锁定为"准"、偏出 ±6¢ 才解锁，读数稳定不闪烁
- **抗干扰**：八度/谐波误检自动拦截、低次谐波保护、野值剔除、中值滤波，松弦时不再误报一百多 Hz 的假读数
- **调弦指引**：实时提示"偏低 · 拧紧琴钮" / "偏高 · 放松琴钮"，安全调弦（每次 1/8 圈，拧完重新拨弦）
- **数据读数**：实时频率、音分偏差、输入电平
- **信号保持**：拨弦间隙短暂静音时保持读数，不闪烁复位
- **中英双语界面**：自动识别系统语言（中文/英文），右上角可手动切换并记住选择

## 使用

1. 打开页面，选择乐器（默认吉他），点击"开始调弦"并授权麦克风
2. 拨响一根空弦，手机与乐器保持 30–50 cm，安静环境下使用
3. 按指针提示拧紧/放松琴钮，直到指针落在绿区；自动模式下会自行识别当前弦

> 麦克风权限仅用于本地音高识别，音频不上传、不存储。麦克风功能需通过 http/https 访问，直接双击本地文件部分浏览器会禁用麦克风。

## 技术栈

- Web Audio API + YIN 自相关基频检测
- 数据驱动的多乐器模型：定弦、弦序、琴头布局、检测参数统一由 `INSTRUMENTS` 定义
- 每种乐器独立的 FFT 大小与高通系数（贝斯 8192 采样窗 / hpR 0.9985）
- 八度折叠 + 低次谐波保护 + 野值剔除 + 中值滤波
- "准了"判定带迟滞（±3¢ 锁定 / ±6¢ 解锁）
- 纯 HTML/CSS/JS 单文件，字体本地化，无依赖、无后端、完全离线

## Android App

`android-app/` 目录是用 [Capacitor 6](https://capacitorjs.com/) 打包成的离线安卓 App（无需联网、无需浏览器，可直接安装 APK）。

**特性**
- 页面资源与字体全部内嵌，完全离线可用
- 针对鸿蒙 4.2 兼容层做了麦克风权限与启动主题适配
- 蓝色拨片 Logo（无乐器剪影），欢迎页一步进入调弦

**与吉他版共存**

本 App 的包名为 `com.weishuai.instrumenttuner`，显示名「乐器调弦」；吉他调音器 App（[guitar-tuner](https://github.com/lccpws/guitar-tuner)）的包名为 `com.weishuai.guitartuner`，显示名「吉他调音器」。两者包名不同，可以在同一台设备上**同时安装、互不覆盖**。

**本地构建**（需 Node.js、JDK 17、Android SDK platform 34）

```bash
cd android-app
npm install
npx cap sync android
cd android && ./gradlew assembleDebug
```

产物位于 `android/app/build/outputs/apk/debug/app-debug.apk`。

目录说明：
- `index.html` / `www/` — 网页源码（欢迎页 + 调弦页合并的单文件，含多乐器模型）
- `fonts/` — 本地化字体（Fraunces、DM Mono）
- `logo.png` — 应用 Logo
- `android-app/www/` — 供 Capacitor 打包的网页源，与根目录 `index.html` 保持同步
- `android-app/android/` — Capacitor 生成的 Android 工程源码
- `android-app/design/` — Logo 设计稿与图标生成脚本（历史迭代记录）
- `capacitor-cordova-android-plugins/`、`android/app/src/main/assets/public/` 等由 `cap sync` 生成，未纳入版本控制

## License

MIT
