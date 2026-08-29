# Android App Playbook: Capacitor-Wrapped Web Widget → Google Play

A complete reference for turning a web widget into a signed, published Android
app using Capacitor, and keeping it updated over time. Written from the
FunWithPuzzles.com Daily Challenge app build — reuse this for future projects.
The working widget can be found at
https://www.funwithpuzzles.com/p/daily-challenge.html
---

## 1. What This Approach Is

A **Capacitor WebView wrapper**: a small native Android app shell that loads
your existing web widget (HTML/CSS/JS) inside a WebView, so you reuse 100% of
your web code instead of rewriting natively.

**Good fit when:** you already have a working, polished web widget and want
it installable from Google Play without a rewrite.

**Not a fit when:** you need deep native features (camera, background
services, complex offline storage) — that points toward a fuller native or
React Native/Flutter build instead.

---

## 2. Accounts & Software You'll Need

| What | Cost | Notes |
|---|---|---|
| Node.js (18+) | Free | nodejs.org |
| Android Studio | Free | Installs Android SDK, emulator, Gradle |
| Google Play Developer account | $25 one-time | play.google.com/console/signup |
| AdMob account (if monetizing) | Free | apps.admob.com |
| Git + GitHub account | Free | For version control / CI later |

---

## 3. Initial Project Setup

```bash
mkdir my-app && cd my-app
mkdir www
npm init -y
npm install @capacitor/core @capacitor/android @capacitor/cli --save
```

**`www/index.html`** — host page that loads your widget:
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<title>Your App Name</title>
<style>
  html,body{margin:0;padding:0;background:#fff;min-height:100%;}
  body{padding:12px 8px;padding-top:calc(12px + env(safe-area-inset-top));padding-bottom:calc(12px + env(safe-area-inset-bottom));}
</style>
</head>
<body>
  <div id="your-widget-container"></div>
  <script src="your-widget.js"></script>
</body>
</html>
```

**`capacitor.config.json`** at project root:
```json
{
  "appId": "com.yourcompany.yourapp",
  "appName": "Your App Name",
  "webDir": "www",
  "server": { "androidScheme": "https" }
}
```

> ⚠️ `appId` is **permanent** once you publish. Pick it deliberately (reverse
> domain, matches your brand) before your first upload.

---

## 4. Adding the Android Platform

```bash
npx cap add android
npx cap sync android
npx cap open android
```

This generates a full native Android Studio project under `android/`, copies
`www/` into it, and opens Android Studio pointed at it.

### ⚠️ Critical gotcha: `namespace` vs `applicationId`

`android/app/build.gradle` has **two separate identifiers**:
- `namespace` — determines where your compiled Java/Kotlin code
  (`MainActivity.java`) actually lives. Set once by Capacitor at project
  creation, tied to the folder structure under `android/app/src/main/java/`.
- `applicationId` — the public Play Store identity. Safe to change any time
  before first publish.

**They are allowed to differ.** If you ever rename `applicationId` for
branding/SEO reasons, do **not** touch `namespace` unless you also physically
move the Java source folder to match (use Android Studio's Refactor → Rename
Package tool, don't hand-edit). Editing both via find-and-replace without
moving files causes:

```
FATAL EXCEPTION: main
java.lang.ClassNotFoundException: Didn't find class "com.yourapp.MainActivity"
```

**Fix:** keep `namespace` matching wherever `MainActivity.java` actually
sits; change only `applicationId` for the public-facing ID.

---

## 5. SDK / Environment Setup Issues (Windows-specific)

- **"Please select Android SDK"** → Tools → SDK Manager, note the SDK path,
  confirm it matches `android/local.properties`'s `sdk.dir=` line (auto-set
  by Android Studio; edit manually only if needed). Windows paths need
  doubled backslashes: `sdk.dir=C\:\\Users\\you\\AppData\\Local\\Android\\Sdk`.
- **`adb` not recognized in terminal** → not on PATH. Either add
  `<SDK path>\platform-tools` to your Windows PATH (Environment Variables →
  Path → New), or just call it by full path each time:
  ```powershell
  & "C:\Users\you\AppData\Local\Android\Sdk\platform-tools\adb.exe" devices
  ```
- **Emulator: "Windows Hypervisor Platform is not enabled"** → enable
  virtualization in BIOS (not just Windows Features), confirm with
  `systeminfo` (Hyper-V Requirements section should all say Yes), and
  uninstall/disable Intel HAXM if present (conflicts with WHPX). **Easier
  alternative: skip the emulator, test on a real phone via USB** — usually
  faster anyway.
- **Phone not detected over USB** → install the phone manufacturer's
  official USB driver (e.g. Samsung USB Driver / Smart Switch), confirm USB
  mode is "File Transfer" not "Charging only", accept the "Allow USB
  debugging?" prompt on the phone, and check Device Manager for driver
  warnings.
- **"device offline" in adb** → `adb kill-server && adb start-server`,
  re-toggle USB debugging off/on, prefer USB cable over wireless ADB.

---

## 6. Testing on a Real Device

1. Phone: Settings → About Phone → tap Build Number 7× → Developer Options
   appears.
2. Developer Options → enable USB Debugging.
3. Plug in via USB, accept the debugging prompt.
4. Select your phone in Android Studio's device dropdown → Run ▶.

**Debugging crashes:** use `adb logcat` filtered to fatal errors:
```powershell
adb logcat -c
adb logcat | Select-String "FATAL EXCEPTION","AndroidRuntime"
```
Then launch the app and read the stack trace. Note: this JS-console-to-logcat
bridge (`Capacitor/Console` log lines) generally only works on **debug**
builds — release/Play Store installs disable WebView debugging by default,
so native-level filtering (`Select-String "Ads","GoogleApiManager"` etc.) is
what you'll see instead once it's a signed build.

---

## 7. Signing & Producing a Release Build

1. Android Studio → **Build → Generate Signed Bundle / APK** → **Android App
   Bundle**.
2. **Create new keystore** (first time only):
   - Save the `.jks` file **outside** your project folder, in a dedicated,
     backed-up location.
   - Set a strong password, alias, and alias password — write them down
     somewhere safe (password manager).
   - **This keystore is the only way to ever publish an update to this app.
     Losing it means starting a brand-new listing from scratch.**
3. Choose `release` build variant → Finish.
4. Output: `android/app/release/app-release.aab`.

**Every subsequent release:** reuse the *same* keystore file and passwords.
Never generate a new one for the same app.

---

## 8. Version Numbers

`android/app/build.gradle` → `defaultConfig {}`:
```gradle
versionCode 1        // integer, MUST increase by ≥1 on every single upload
versionName "1.0"    // human-readable label, semantic versioning is fine
```

- `versionCode` is **never reusable** — even a broken/crashed upload
  permanently consumes that number. If Play Console says *"Version code X
  has already been used"*, just bump it (`versionCode 2`, `3`, ...) and
  rebuild.
- `versionName` is just a label; update it however you like (`1.0.1`,
  `1.1`, etc.) but it doesn't need to follow strict rules.

---

## 9. App Icons

Generate once from a high-res source logo (ideally 1000×1000+ PNG):

- **Play Store listing icon:** 512×512 PNG, transparency OK.
- **Android launcher icons:** legacy + adaptive, at mdpi/hdpi/xhdpi/xxhdpi/
  xxxhdpi densities (48/72/96/144/192px), placed in
  `android/app/src/main/res/mipmap-*/`. Use Android Studio's **New → Image
  Asset** wizard (right-click `res` folder), or script it with Pillow if you
  want repeatable, non-interactive generation.
- **Feature Graphic** (Play listing banner): exactly 1024×500, JPG or 24-bit
  PNG, no alpha channel.

---

## 10. Google Play Console Setup

### Create the app
Play Console → Create app → fill name, language, app/game type, free/paid.

### Store listing content
- **Short description:** 80 chars max.
- **Full description:** 4,000 chars max. Weave in real keywords (category
  names, feature counts) naturally — this is what search ranking weighs.
- **App icon** (512×512), **Feature Graphic** (1024×500), **Screenshots**
  (min 2, max 8; JPG/24-bit PNG; 320–3840px per side; 16:9–9:16 aspect
  ratio). Real device screenshots (Power+Volume Down) work well — crop out
  the phone's status bar/nav bar and optionally add a branded caption band.

### Required declarations (App content section)
- Privacy Policy URL
- Content rating questionnaire
- Target audience & content
- Data safety form (declare what data you/your SDKs collect — revisit this
  when you add AdMob or any other SDK)
- Ads declaration (Yes once you add AdMob)
- Government/News app declarations (No/No, unless applicable)

### New personal developer accounts: mandatory closed testing
Accounts created after Nov 13, 2023 must run a **closed test with 12+
testers, opted in continuously for 14 days**, before Production access
unlocks.

1. Testing → Closed testing → create a track.
2. Create new release → upload your signed `.aab` → wait for it to leave
   "in review".
3. Testers tab → add 12+ real tester emails → share the generated opt-in
   link → testers click "Become a tester" → install from Play Store.
4. Wait 14 continuous days with 12+ opted-in testers.
5. Apply for production access (you'll be asked to summarize tester
   feedback — actually collect a line or two from real testers for this).

**Common upload errors:**
- *"Version code already used"* → bump `versionCode`, rebuild, re-upload.
- *"This release does not add or remove any app bundles" / "doesn't allow
  existing users to upgrade"* → the `.aab` upload didn't actually attach.
  Re-upload and **wait for the green checkmark + version details** before
  saving; don't navigate away mid-upload.

---

## 11. When Your Web Widget (`your-widget.js`) Changes

Whenever you update the underlying web widget/site content:

1. Copy the new `your-widget.js` into `www/` (replacing the old one).
2. If you use the AdMob bundler step, run `npm run build:admob` too (see
   §13).
3. `npx cap sync android` — copies updated `www/` into the native project.
4. Bump `versionCode` (and optionally `versionName`) in
   `android/app/build.gradle`.
5. Build → Generate Signed Bundle (same keystore).
6. Upload as a new release to whichever track you're using (closed testing
   or production).

You do **not** need to touch `capacitor.config.json`, the Android manifest,
or redo signing setup for a content-only update — only for native-level
changes (new permissions, new plugins, changed app ID, etc.).

---

## 12. Ads with AdMob (Capacitor + Community Plugin)

### Why a bundler is required
`@capacitor-community/admob`'s browser build is a UMD bundle that does not
reliably self-register via a plain `<script>` tag in a no-bundler project —
it depends on internal wiring only a proper module bundler resolves
correctly. **Don't fight raw script tags; add a tiny bundler step.**

```bash
npm install @capacitor-community/admob esbuild --save-dev
```

`package.json` scripts:
```json
"build:admob": "esbuild src/admob-init.js --bundle --outfile=www/admob-init.js --format=iife --platform=browser",
"sync": "npm run build:admob && npx cap sync"
```

`src/admob-init.js` (source you edit) → compiles to `www/admob-init.js`
(generated output, never hand-edit, referenced from `index.html`).

### Minimal-distraction ad format
Use a single **Adaptive Banner**, anchored bottom — not interstitials. Core
logic:
```js
import { Capacitor } from '@capacitor/core';
import { AdMob } from '@capacitor-community/admob';

async function initAdMob() {
  if (!Capacitor.isNativePlatform()) return;
  const consentInfo = await AdMob.requestConsentInfo();
  if (consentInfo.isConsentFormAvailable && consentInfo.status === 'REQUIRED') {
    await AdMob.showConsentForm();
  }
  await AdMob.initialize({ initializeForTesting: false });
  await AdMob.showBanner({
    adId: 'ca-app-pub-XXXX/YYYY',
    adSize: 'ADAPTIVE_BANNER',
    position: 'BOTTOM_CENTER',
    margin: 0,
    isTesting: true, // remove for production
  });
}
initAdMob();
```

**Prevent the banner overlapping your content:** listen for the size event
and pad the page body by the real banner height:
```js
AdMob.addListener('bannerAdSizeChanged', (size) => {
  if (size?.height) document.body.style.paddingBottom = size.height + 'px';
});
```
Include a ~1s fallback padding (e.g. 50px) in case the event doesn't fire on
your plugin version.

### Native manifest setup
`android/app/src/main/AndroidManifest.xml`, inside `<application>`:
```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"/>
```

### GDPR/consent setup (required, not optional)
AdMob console → **Privacy & Messaging** → create a GDPR (EEA/UK) message
(and US states message if relevant) → **publish it**. Skipping this causes:
```
Publisher misconfiguration: ... no form(s) configured for the input app ID.
```
Allow a few hours to propagate after publishing.

### Kids content caveat
If any part of your app is child-directed content, Google requires tagging
ad requests accordingly and restricts personalization/targeting. Review
Google's Families Policy before enabling ads if this applies
(play.google.com/console/about/families/).

---

## 13. Switching From Test Ads to Real Ads at Launch

Checklist for going live with real ads:

1. **Remove `isTesting: true`** from the `showBanner()` call in
   `src/admob-init.js`, rebuild (`npm run build:admob`), resync, and produce
   a new signed release.
2. **Confirm your AdMob account is fully verified/approved** — new accounts
   often have a warm-up period (hours to ~48h) before real ads reliably
   serve; near-zero fill immediately after switching off test mode is
   usually this, not a bug.
3. **Check ad unit status** in AdMob console (should show "Ready", not a
   warning).
4. **Play Console declarations must be accurate:** App content → Ads →
   "Yes"; Data safety form updated to declare Advertising ID / device
   identifier collection via the AdMob SDK.
5. **Payments profile** in AdMob must be complete for payouts to actually
   process once revenue starts.
6. **Monitor for policy issues** in AdMob console's Policy Center for the
   first weeks — accidental self-clicks, invalid traffic, or placement
   issues can trigger account restrictions.
7. Optionally keep a **test device hash ID** registered in AdMob (shown in
   logcat as `ConsentDebugSettings.Builder().addTestDeviceHashedId(...)`) so
   you personally always see test ads even on a "production" build, letting
   you verify layout without accidentally invalid-clicking real ads.

---

## 14. Moving the Project Folder Later

Safe to do — almost everything is relative or machine-independent:

1. Fully close Android Studio.
2. Move the whole project folder (including hidden `.git`) to the new
   location.
3. Delete these (safe, auto-regenerated): `android/.gradle/`,
   `android/app/build/`, `android/build/`, `.idea/`, and optionally
   `node_modules/`.
4. `npm install` at the new location.
5. Open `android/` fresh in Android Studio, let Gradle sync.
6. `android/local.properties` (SDK path) does **not** need changes — it's
   about your SDK install location, not your project location.
7. Rebuild (`npm run build:admob`, `npx cap sync android`) and test on
   device to confirm.

Your keystore (kept outside the project folder) and GitHub remote are both
unaffected by a project folder move.

---

## 15. Quick Reference: Common Commands

```bash
# One-time setup
npm install
npx cap add android

# Every time you change web content or native config
npm run build:admob       # if using AdMob
npx cap sync android

# Open native project
npx cap open android

# Debugging on device
adb devices
adb logcat -c
adb logcat | Select-String "FATAL EXCEPTION","AndroidRuntime"
```

---

## 16. Pre-Flight Checklist for a New App Using This Playbook

- [ ] Node.js, Android Studio, Google Play dev account, AdMob account ready
- [ ] `capacitor.config.json` `appId` decided deliberately (permanent)
- [ ] `www/index.html` + widget script in place
- [ ] `npx cap add android` run, project opens cleanly in Android Studio
- [ ] Real device or working emulator confirmed for testing
- [ ] Keystore created and backed up in 2+ safe locations, outside the repo
- [ ] App icons (512, adaptive set, 1024 feature graphic) generated
- [ ] Store listing copy written (short/full description, keywords baked in)
- [ ] Screenshots captured and polished
- [ ] Privacy policy URL live
- [ ] Data safety / content rating / target audience forms completed
- [ ] Closed testing track set up with 12+ real testers (if new personal
      account)
- [ ] If using ads: bundler-based AdMob integration, GDPR message published,
      banner overlap handled, manifest App ID set
- [ ] `versionCode` bump process understood before every future release
