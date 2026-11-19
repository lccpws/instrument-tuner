# Tune · Instrument Tuner

[中文](README.md)

A free online tuner built on your phone or computer's microphone, supporting standard tunings for multiple string instruments. Single-file HTML — no installation, no ads, fully offline. Supports both Chinese and English (auto-detects your system language, with a manual switch).

> Extended from the guitar tuner ([guitar-tuner](https://github.com/lccpws/guitar-tuner)), adding ukulele, bass, and violin support.

## Supported Instruments

| Instrument | Standard Tuning | Strings | Open-string Range |
|------------|-----------------|---------|-------------------|
| Guitar | E A D G B E | 6 | E2 82.41 Hz – E4 329.63 Hz |
| Ukulele | G C E A (high-G tuning) | 4 | C4 261.63 Hz – A4 440.00 Hz |
| Bass | E A D G | 4 | E1 41.20 Hz – G2 98.00 Hz |
| Violin | G D A E | 4 | G3 196.00 Hz – E5 659.25 Hz |

Standard tuning frequencies for each instrument (string order left to right in the interface):

<details>
<summary>Guitar E A D G B E</summary>

| String | Note | Frequency |
|--------|------|-----------|
| 6 | E2 | 82.41 Hz |
| 5 | A2 | 110.00 Hz |
| 4 | D3 | 146.83 Hz |
| 3 | G3 | 196.00 Hz |
| 2 | B3 | 246.94 Hz |
| 1 | E4 | 329.63 Hz |

</details>

<details>
<summary>Ukulele G C E A (high G)</summary>

| String | Note | Frequency |
|--------|------|-----------|
| 4 | G4 | 392.00 Hz |
| 3 | C4 | 261.63 Hz |
| 2 | E4 | 329.63 Hz |
| 1 | A4 | 440.00 Hz |

</details>

<details>
<summary>Bass E A D G</summary>

| String | Note | Frequency |
|--------|------|-----------|
| 4 | E1 | 41.20 Hz |
| 3 | A1 | 55.00 Hz |
| 2 | D2 | 73.42 Hz |
| 1 | G2 | 98.00 Hz |

</details>

<details>
<summary>Violin G D A E</summary>

| String | Note | Frequency |
|--------|------|-----------|
| 4 | G3 | 196.00 Hz |
| 3 | D4 | 293.66 Hz |
| 2 | A4 | 440.00 Hz |
| 1 | E5 | 659.25 Hz |

</details>

## Features

- **Four instruments, switch freely** — on both the welcome screen and the top of the tuner screen; switching updates the tuning, headstock string count, peg buttons, frequency range, and prompts together
- **Real-time pitch detection via microphone** — YIN algorithm, all 18 open strings tested with error under 1 cent
- **Adaptive frequency range** — each instrument uses independent detection parameters (FFT window, high-pass cutoff, frequency limits); bass E1 goes as low as 41 Hz with a separately lengthened sampling window
- **Automatic string detection** — identifies which string you plucked, or lock a target string manually
- **Cent dial + snap lock** — ±50 cent range, locks as "in tune" within ±3¢, unlocks beyond ±6¢, steady reading without flicker
- **Anti-interference** — automatic octave/harmonic misdetection interception, low-harmonic protection, outlier rejection, median filtering; no more false 100-plus Hz readings on loose strings
- **Tuning guidance** — live hints of "too flat · tighten slightly" / "too sharp · loosen the peg", with safe tuning advice (1/8 turn at a time, pluck again to check)
- **Live readings** — real-time frequency, cent deviation, input level
- **Signal hold** — keeps the reading through brief silences between plucks
- **Bilingual interface** — auto-detects system language (Chinese/English), with a manual switch in the top-right corner that remembers your choice

## Usage

1. Open the page, select an instrument (guitar by default), click "Start Tuning" and grant microphone permission
2. Pluck an open string, keeping the phone 30–50 cm from the instrument, in a quiet environment
3. Follow the pointer, tightening or loosening the peg until it lands in the green zone; auto mode identifies the current string for you

> The microphone permission is used only for local pitch detection — audio is never uploaded or stored. Microphone access requires an http/https connection; opening the file directly by double-clicking disables the microphone in some browsers.

## Tech Stack

- Web Audio API + YIN autocorrelation pitch detection
- Data-driven multi-instrument model: tuning, string order, headstock layout, and detection parameters are all defined in `INSTRUMENTS`
- Independent FFT size and high-pass coefficient per instrument (bass: 8192-sample window / hpR 0.9985)
- Octave correction + low-harmonic protection + outlier rejection + median filtering
- "In tune" decision with hysteresis (±3¢ lock / ±6¢ unlock)
- Pure HTML/CSS/JS in a single file, localized fonts, no dependencies, no backend, fully offline

## Android App

The `android-app/` directory packages this tuner into an offline Android app using [Capacitor 6](https://capacitorjs.com/) — no internet or browser needed, install the APK directly.

**Features**
- All page assets and fonts embedded; fully offline
- Microphone permission and startup theme adapted for the HarmonyOS 4.2 compatibility layer
- Blue-guitar-pick logo (no instrument silhouette), one step from welcome screen to tuning

**Coexistence with the guitar version**

This app's package name is `com.weishuai.instrumenttuner` with display name "Instrument Tune"; the guitar tuner app ([guitar-tuner](https://github.com/lccpws/guitar-tuner)) uses `com.weishuai.guitartuner` with display name "Guitar Tune". The two use different package names and can be **installed simultaneously without overwriting each other**.

**Local build** (requires Node.js, JDK 17, Android SDK platform 34)

```bash
cd android-app
npm install
npx cap sync android
cd android && ./gradlew assembleDebug
```

The output is at `android/app/build/outputs/apk/debug/app-debug.apk`.

Directory notes:
- `index.html` / `www/` — web source (the merged single-file welcome + tuner screen, with the multi-instrument model)
- `fonts/` — localized fonts (Fraunces, DM Mono)
- `logo.png` — app logo
- `android-app/www/` — web source for Capacitor packaging, kept in sync with the root `index.html`
- `android-app/android/` — Android project generated by Capacitor
- `android-app/design/` — logo drafts and icon generation scripts (history)
- `capacitor-cordova-android-plugins/`, `android/app/src/main/assets/public/`, etc. are generated by `cap sync` and not version-controlled

## License

MIT
