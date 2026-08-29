# iOS App Playbook: Capacitor-Wrapped Web Widget → Apple App Store

A complete reference for turning a web widget into a signed, TestFlight-tested,
App Store–submitted iOS app using Capacitor and Codemagic CI/CD — **without
owning a Mac**. Companion to the Android Playbook; written from the
FunWithPuzzles Daily Challenge app build.

---

## 1. What This Approach Is

Same Capacitor project as your Android app, targeting iOS instead. The
critical difference: Apple's tooling (Xcode, code signing, App Store
submission) only runs on macOS. Since most indie developers don't own a Mac,
this playbook uses **Codemagic** — a cloud CI/CD service with hosted macOS
build machines — to build, sign, and publish entirely from a Windows/Linux
machine.

**You will need, at minimum, brief one-time access to any iPhone or iPad**
(borrowed is fine) for Apple Developer Program enrollment, if your region
doesn't support web-based enrollment. Nothing else in this process requires
Apple hardware.

---

## 2. Accounts You'll Need

| What | Cost | Notes |
|---|---|---|
| Apple Developer Program | $99/year | developer.apple.com |
| Codemagic account | Free tier available | codemagic.io |
| AdMob account (if monetizing) | Free | A **separate app entry** from your Android one — different App ID, different ad units |
| GitHub account | Free | Codemagic builds from a Git repo, not local files |

---

## 3. Apple Developer Program Enrollment

### The app-only enrollment trap
Apple's enrollment page states it's available "through the Apple Developer
app and on the web," but **in some regions (including India, as of this
writing), web enrollment is broken or unavailable**, forcing you into the
Apple Developer app — which only runs on iPhone/iPad/Mac.

**Fix:** Borrow any iPhone or iPad for ~10 minutes. Enrollment is tied to
your Apple Account, not the device — sign in, tap Account → Enroll, pay the
fee, done. You do not need that device again afterward.

If enrollment approval doesn't seem to arrive, check your email (including
spam) — it can take a few hours to a couple of days, similar to Google Play's
review timeline.

---

## 4. Registering Your Bundle ID

developer.apple.com/account → Certificates, Identifiers & Profiles →
Identifiers → **+** → App IDs → App → enter your Bundle ID explicitly (e.g.
`com.yourcompany.yourapp`).

> ⚠️ Like Android's `applicationId`, this is **permanent once you submit a
> live app**. It does not need to match your Android package name, but
> keeping them identical is a clean convention if you want.

No capabilities need to be enabled for a basic Capacitor + AdMob app.

---

## 5. Adding the iOS Platform to Your Capacitor Project

```bash
npm install @capacitor/ios
npx cap add ios
npx cap sync ios
```

### SPM vs CocoaPods — use the default (SPM)

**Capacitor 8 defaults to Swift Package Manager**, not CocoaPods. This means:
- No `Podfile` is generated (this is normal, not an error).
- The buildable unit is `ios/App/App.xcodeproj` — there is **no**
  `.xcworkspace` to target.
- CocoaPods is being phased out industry-wide (shared specs repo goes
  read-only December 2026) — SPM is the forward-compatible choice, and is
  what this entire playbook's `codemagic.yaml` assumes.

If you ever see `No 'Podfile' found in the project directory` from a CI
script, it means the pipeline was written for CocoaPods against an SPM
project — don't try to force CocoaPods; fix the pipeline to target the
`.xcodeproj` directly instead (see §9).

### iPad support
Capacitor generates a **Universal** app (iPhone + iPad) by default — no
extra configuration needed if you want iPad support. If you want iPhone-only,
that's a Target setting change in Xcode (not something you can do without a
Mac — leave it Universal unless you have a strong reason not to).

---

## 6. Setting Up GitHub (Required for Codemagic)

Codemagic builds from a **Git repository**, not local files.

1. Create a repo on GitHub (private recommended).
2. Use **GitHub Desktop** if you're not comfortable with git CLI commands —
   it does everything (init, stage, commit, push) via buttons.
3. **Critical**: your `.gitignore` must exclude, at minimum:
   ```
   node_modules/
   android/app/build/
   android/.gradle/
   android/local.properties
   ios/App/Pods/
   ios/App/build/
   ```
4. If you get "Repository creation failed (name already exists)" while
   trying to publish from GitHub Desktop, it's because you already created
   an empty repo of that name on GitHub.com separately — either delete the
   empty one and let GitHub Desktop create it fresh, or link to the existing
   one via Repository → Repository Settings → Remote instead of Publish.

---

## 7. App Store Connect: Creating the App Record

App Store Connect → Apps → **+** → New App:
- **Platforms**: check **iOS only**. Do NOT check macOS, tvOS, or visionOS —
  those are genuinely separate app binaries/targets your Capacitor project
  doesn't produce, unlike Android TV which shares the same Android platform.
- **Bundle ID**: select the one you registered in §4.
- **SKU**: any internal code, never shown publicly.
- **User Access**: Full Access is simplest for a solo developer.

---

## 8. Setting Up Codemagic

### 8.1 Connect your repo
codemagic.io → sign up (GitHub sign-in recommended) → Add application →
select your repo.

### 8.2 Generate an App Store Connect API key — with the RIGHT role
App Store Connect → Users and Access → Integrations → App Store Connect API
→ Generate API Key.

> ⚠️ **Critical lesson learned**: an API key with **App Manager** role can
> manage builds and TestFlight, but **cannot create certificates or
> provisioning profiles**. If your Codemagic signing steps fail with
> permission-flavored errors, regenerate the key with **Admin** role
> instead. (Apple doesn't let you change a key's role after creation — you
> must generate a new one and update Codemagic's integration with it.)

Download the `.p8` file **immediately** — it's only downloadable once. Note
the Key ID and Issuer ID too.

Add it to Codemagic: Team settings → Integrations → App Store Connect →
paste in Issuer ID, Key ID, upload the `.p8` file. Name the integration
something you'll reference in `codemagic.yaml` (e.g. `AppStoreConnect`).

---

## 9. Code Signing Setup — the Hard-Won Sequence

This is the single most error-prone part of the whole process. Follow this
**exact order** to avoid the pitfalls documented in §12.

### 9.1 Generate the certificate through Codemagic's UI (not via script)
Codemagic → Team settings → Code signing identities → iOS certificates →
**Generate certificate**:
- Certificate type: **Apple Distribution** (the modern universal type — not
  the legacy "iOS Distribution")
- Uses your App Store Connect API key
- Reference name: anything memorable (e.g. `ios-distribution`) — this name
  is NOT referenced anywhere in `codemagic.yaml`; it's purely a label for
  your own recognition in Codemagic's UI.

This is more reliable than scripting `app-store-connect fetch-signing-files
--create` with a manually-supplied private key, which produces a
**mismatched certificate type** (see §12).

### 9.2 Manually create the provisioning profile (don't rely on auto-creation)
Apple Developer Portal → Profiles → **+** → App Store → select your Bundle
ID → select your certificate from §9.1 → name it → Generate → **download
the `.mobileprovision` file**.

> Codemagic's automatic `ios_signing:` pre-flight check only *matches*
> profiles that already exist — it does not create new ones from nothing.
> You have to make one first, either through this manual Apple Portal flow,
> or by letting a build attempt fail once (which sometimes creates one on
> Apple's side you can then fetch).

### 9.3 Upload the profile to Codemagic
Codemagic → Code signing identities → iOS provisioning profiles → **Upload
a provisioning profile** (not "Fetch profiles" — that only pulls existing
ones and won't help if you need to attach a *specific* one to your specific
certificate) → select the `.mobileprovision` file → confirm it shows a
green checkmark matched against your certificate (not "Certificate: Not
uploaded", which means a mismatch).

### 9.4 Treat the Apple Developer Portal's Certificates page as hands-off
Once this is working, don't manually revoke/delete certificates on Apple's
side unless Codemagic specifically tells you to. Accidentally revoking your
sole certificate (e.g., while poking around the portal) instantly breaks
signing and requires redoing §9.1–9.3 from scratch.

---

## 10. The Complete `codemagic.yaml`

```yaml
workflows:
  ios-workflow:
    name: iOS Workflow
    max_build_duration: 60
    instance_type: mac_mini_m2

    integrations:
      app_store_connect: AppStoreConnect   # exact name from §8.2

    environment:
      ios_signing:
        distribution_type: app_store
        bundle_identifier: com.yourcompany.yourapp
      vars:
        BUNDLE_ID: "com.yourcompany.yourapp"
        XCODE_PROJECT: "ios/App/App.xcodeproj"   # NOT .xcworkspace — see §5
        XCODE_SCHEME: "App"
      node: 22   # Capacitor 8 CLI requires Node >=22
      xcode: latest

    scripts:
      - name: Install npm dependencies
        script: npm install

      - name: Build AdMob bundle
        script: npm run build:admob   # skip/adjust if you don't use this step

      - name: Capacitor sync (copies www/ into the native iOS project)
        script: npx cap sync ios

      - name: Set up code signing (certificates + provisioning profile)
        script: |
          xcode-project use-profiles --profile distribution_profile.mobileprovision

      - name: Increment build number
        script: |
          cd $CM_BUILD_DIR/ios/App
          echo "Using Codemagic's own build counter: $PROJECT_BUILD_NUMBER"
          agvtool new-version -all $PROJECT_BUILD_NUMBER

      - name: Build .ipa for distribution
        script: |
          xcode-project build-ipa \
            --project "$XCODE_PROJECT" \
            --scheme "$XCODE_SCHEME" \
            --archive-flags "-destination 'generic/platform=iOS'"

    artifacts:
      - build/ios/ipa/*.ipa
      - /tmp/xcodebuild_logs/*.log

    publishing:
      app_store_connect:
        auth: integration
        submit_to_testflight: true
```

### Key design decisions baked into this file (and why)

- **No `keychain initialize` step.** This was the single hardest bug to
  find (§12.5) — Codemagic's automatic `ios_signing:` pre-flight check
  already installs your certificate into the default keychain *before* any
  of your scripts run. Adding your own `keychain initialize` call creates a
  **brand new, empty keychain** and makes it the new default — silently
  wiping out the certificate that was just correctly installed a moment
  earlier. Diagnosed via `security find-identity -v -p codesigning`
  returning "0 valid identities found" despite the certificate genuinely
  existing.
- **`--profile distribution_profile.mobileprovision`** — an explicit,
  committed file path, not automatic API-based profile matching. This
  removes all ambiguity about which certificate a given profile is actually
  bound to.
- **`$PROJECT_BUILD_NUMBER`** instead of querying Apple's API for "the
  latest build number." Querying `get-latest-app-store-build-number` (empty
  before your first App Store release) or even
  `get-latest-testflight-build-number` proved unreliable and repeatedly
  produced duplicate-version-number upload failures. Codemagic's own
  per-build counter is simple and always monotonically increasing.
- **`--project`, not `--workspace`**, throughout — because this is an SPM
  project (§5).

---

## 11. Adding `distribution_profile.mobileprovision` to Your Repo

1. Copy the file you downloaded in §9.2 into your project root.
2. Rename it to exactly `distribution_profile.mobileprovision` (matching
   the YAML above), or adjust the YAML to match whatever you name it.
3. Commit and push via GitHub Desktop.

This file is not secret (it doesn't contain a private key), so committing it
is fine.

---

## 12. Troubleshooting Guide — Every Error We Actually Hit, In Order

### 12.1 `No matching profiles found for bundle identifier "..." and distribution type "app_store"`
**Cause:** Having an `ios_signing:` block in `environment` triggers a
pre-flight check that looks for an *already-uploaded* profile before any
scripts run. On a fresh project, nothing exists yet.
**Fix:** Complete §9.1–9.3 (generate cert via UI, manually create + upload
profile) before your first build attempt.

### 12.2 `No 'Podfile' found in the project directory`
**Cause:** Capacitor 8 defaults to SPM, not CocoaPods (§5). A CocoaPods-era
build script (`cd ios/App && pod install`) has nothing to install.
**Fix:** Remove the CocoaPods step entirely; target `.xcodeproj` not
`.xcworkspace` in `build-ipa`.

### 12.3 `Cannot save Signing Certificates without certificate private key`
**Cause:** Using `app-store-connect fetch-signing-files --create` with a
manually-generated `CERTIFICATE_PRIVATE_KEY` environment variable creates a
certificate of the wrong/legacy type, or hits a permission wall if your API
key has App Manager (not Admin) role.
**Fix:** Don't manually supply a private key. Use Codemagic's **Generate
certificate** UI button instead (§9.1), which handles key generation
correctly and keeps the private key properly on Codemagic's side.

### 12.4 `No signing certificate "iOS Distribution" found: No "iOS Distribution" ... matching team ID ... with a private key was found`
**Cause:** This is confusing because your certificate genuinely IS type
"Apple Distribution" (the modern type) and DOES have its private key —
Xcode's archive step is looking for a stale/different generic identity
category. Every attempt to fix this by overriding `CODE_SIGN_IDENTITY` via
`--archive-xcargs` failed, even with correct-looking command-line
arguments.
**Real cause (confirmed via diagnostic):** the certificate genuinely wasn't
in the keychain at archive time — see §12.5.

### 12.5 The actual root cause of 12.4: a redundant `keychain initialize` step
**Diagnosis method:** insert a diagnostic script step running
`security find-identity -v -p codesigning` right after your signing setup
step, before the archive step. If it reports **"0 valid identities found"**,
your certificate isn't actually in the keychain used for signing —
regardless of what Codemagic's UI shows you.
**Cause:** Codemagic's automatic `ios_signing:` pre-flight check
("Set up code signing identities" — runs before your scripts) already
installs the certificate into the default keychain. A subsequent
`keychain initialize` script step creates a **new, empty** keychain and
sets it as default, hiding the certificate that was correctly installed
moments earlier.
**Fix:** Remove any explicit `keychain initialize` step from your YAML.
Trust the automatic pre-flight step to handle keychain setup.

### 12.6 Two duplicate certificates, can't tell which one Codemagic actually holds the key for
**Cause:** Repeated failed attempts (from 12.3/12.4) sometimes created a
certificate on Apple's side even when the overall flow failed, leaving
orphaned duplicates.
**Fix:** When in doubt, do a full clean-slate reset: delete ALL
certificates on Apple's Certificates page, delete Codemagic's local
certificate record too, then generate exactly ONE fresh certificate via
Codemagic's UI (§9.1) and proceed from there.

### 12.7 Accidentally revoking your only certificate
**Cause:** Manually exploring the Apple Developer Portal's Certificates
page and revoking something by mistake.
**Symptom:** Certificate creation flow for new profiles shows zero
selectable certificates; builds fail with the same "no certificate ...
with a private key" error as §12.4, but this time it's genuinely true.
**Fix:** Remove the now-orphaned record from Codemagic's certificate list,
then redo §9.1–9.3 fresh.

### 12.8 `The bundle version must be higher than the previously uploaded version`
**Cause:** Querying Apple's API for "the latest build number" and adding 1
returns 0 (and thus 1 again) if no App Store version exists yet, or if the
TestFlight query also comes back empty/unreliable.
**Fix:** Use `$PROJECT_BUILD_NUMBER` (Codemagic's own always-incrementing
counter) instead of querying Apple's API at all (§10).

### 12.9 TestFlight submission fails: "Complete test information is required... Missing Beta App Information: Feedback Email... Missing Beta App Review Information: First Name, Last Name, Phone Number, Email"
**Cause:** This only blocks **External** testing submission, not Internal.
**Fix:** App Store Connect → TestFlight → Test Information page → fill in
Beta App Information (feedback email) and Beta App Review Information
(your contact details). Not required at all if you're only using Internal
Testing.

### 12.10 Added an individual tester, but they see "No Builds Available"
**Cause:** TestFlight's "Individual Tester" feature is actually a form of
**External** testing, which requires Apple's Beta App Review before ANY
build becomes available — even for one person.
**Fix:** For fast, review-free self-testing, use **Internal Testing**
instead (App Store Connect Users only, but as the account owner you
qualify automatically) — not the Individual Tester flow.

### 12.11 AdMob: `Publisher misconfiguration: Failed to read publisher's account configuration; no form(s) configured for the input app ID`
**Cause:** No Privacy & Messaging consent form configured for your iOS
AdMob app specifically. **Your Android app's consent setup does NOT cover
iOS** — they're registered as completely separate apps in AdMob console.
**Fix:** AdMob console → Privacy & Messaging → select your iOS app → create
and **publish** (not just save) a GDPR message. Allow a few hours to
propagate.

### 12.12 No ads showing at all (not even test ads) on a real device via TestFlight
**Debugging technique used:** since there's no easy way to attach Xcode's
console without a Mac, add a temporary on-screen debug banner in your JS
that writes each initialization step's status directly onto the page
(`document.body` innerText append), rather than relying on
`console.warn`. This immediately surfaced the exact error text (§12.11 in
this case) without needing any native debugging tools.

### 12.13 App icon still shows default/placeholder on App Store Connect's website
**Not actually a bug** if TestFlight on-device already shows the correct
icon — that confirms the icon is genuinely embedded in your binary
correctly. The App Store Connect *website's own dashboard thumbnail* can
lag by several hours to about a day due to Apple-side caching. No fix
needed; just wait.

### 12.14 Screenshots captured show a "◀ TestFlight" bar and don't fill the screen
**Cause:** Screenshot was taken while the app was still showing TestFlight's
own launch/preview chrome, not the fully-running standalone app.
**Fix:** Launch the app from its home screen icon directly (it's installed
like a normal app once accepted via TestFlight), confirm it fills the
entire screen with no visible TestFlight UI, then capture.

### 12.15 Screenshot dimensions don't match any of Apple's accepted sizes
**Cause:** Real device screenshots are captured at the device's native
resolution, which often doesn't exactly match Apple's specific required
list (varies by year/device — check current requirements in App Store
Connect directly, as they shift).
**Fix:** Since captured screenshots are almost always higher resolution
than Apple's targets, downscale precisely in image-editing/scripting
software to the exact required pixel dimensions rather than uploading
native-resolution captures and hoping they're accepted. If your content's
own aspect ratio doesn't match the target aspect ratio, scale to fit
whichever dimension is the binding constraint and center with padding on
the other axis, rather than distorting the image to force-fit.

---

## 13. iOS-Specific AdMob Setup (No Android Equivalent)

### 13.1 Register a separate iOS app in AdMob
AdMob console → Apps → Add app → iOS. This gets a **different** App ID
(`ca-app-pub-XXXX~YYYY`) than your Android one. Create a separate Banner ad
unit here too.

### 13.2 `Info.plist` additions
Add inside the outer `<dict>...</dict>` of `ios/App/App/Info.plist`:

```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY</string>

<key>NSUserTrackingUsageDescription</key>
<string>This identifier will be used to deliver more relevant ads to you.</string>

<key>SKAdNetworkItems</key>
<array>
  <!-- Get Google's current full list from
       https://developers.google.com/admob/ios/ios14 — it updates
       periodically, don't hardcode from memory. -->
</array>
```

### 13.3 App Tracking Transparency (ATT) in your JS
```javascript
const [trackingInfo, consentInfo] = await Promise.all([
  AdMob.trackingAuthorizationStatus(),
  AdMob.requestConsentInfo(),
]);

if (trackingInfo.status === 'notDetermined') {
  await AdMob.requestTrackingAuthorization();
}
```
This triggers Apple's native "Allow Tracking?" system prompt. Required
before requesting personalized ads using the IDFA.

### 13.4 Platform-specific ad unit selection in shared code
Since `www/` is shared between Android and iOS builds, pick the ad unit ID
at runtime:
```javascript
const platformAdId = Capacitor.getPlatform() === 'ios'
  ? 'ca-app-pub-XXXX/IOS_UNIT_ID'
  : 'ca-app-pub-XXXX/ANDROID_UNIT_ID';
```

---

## 14. App Icon

Apple requires exactly **1024×1024px, no alpha channel** (flatten
transparency onto a solid background if your source has any), no rounded
corners (Apple applies those automatically).

Two separate places this needs to go:
1. **Baked into the binary**: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
   — modern Xcode (14+) only needs ONE image entry via a `Contents.json`
   with `idiom: universal`, no more generating a dozen legacy sizes.
2. **App Store Connect's own listing** — may or may not have a separate
   manual upload field depending on current Apple UI; if you can't find
   one, the binary's icon usually gets picked up automatically once a
   build is processed.

---

## 15. Screenshot Requirements (Check Current Values — They Shift)

As of this writing:
- **iPhone (6.9" class)**: 1284×2778px or 1242×2688px (portrait)
- **iPad (13" class)**: 2048×2732px or 2064×2752px (portrait)

Always double-check current values directly in App Store Connect's upload
screen, since Apple revises these periodically as new device classes ship.

---

## 16. Path to Submission

1. **Internal Testing** first — instant, no review, confirms everything
   works end to end on a real device.
2. **External Testing** (optional but recommended for a wider beta) — needs
   Test Information filled in (§12.9) and goes through a quick Beta App
   Review (usually faster than full App Review).
3. **App Privacy** ("nutrition label") — Apple's equivalent of Android's
   Data Safety form. Declare AdMob's data collection (Advertising ID,
   Usage Data) here.
4. **App Store screenshots + listing copy** — reuse your Play Store
   description content; Apple has a separate 30-char Subtitle and 100-char
   Keywords field instead of Play's structure.
5. **Submit for App Store Review** — typically 24–48 hours, though this
   varies. Common rejection triggers to preempt: ATT compliance, SKAdNetwork
   list completeness, App Privacy accuracy.

---

## 17. When Your Web Widget Changes (Ongoing Maintenance)

Same as the Android playbook's §11 — update `www/`, bump whatever version
mechanism you use, commit, push. Codemagic's `$PROJECT_BUILD_NUMBER`
handles iOS build numbering automatically on every run, so no manual
version bumping is needed there (unlike Android's `versionCode`, which
still needs a manual increment in `build.gradle`).

---

## 18. Quick Reference: Common Commands

```bash
# One-time setup
npm install @capacitor/ios
npx cap add ios

# Every time you change web content
npx cap sync ios
git add . && git commit -m "..." && git push   # (or GitHub Desktop UI)
# → triggers/allows a new Codemagic build

# Diagnosing signing issues on a Codemagic build
# (add as a temporary script step in codemagic.yaml)
security find-identity -v -p codesigning
```

---

## 19. Pre-Flight Checklist for a New iOS App Using This Playbook

- [ ] Apple Developer Program enrolled and approved
- [ ] Bundle ID registered (permanent — decided deliberately)
- [ ] `npx cap add ios` run, confirmed SPM (no Podfile expected)
- [ ] Project pushed to GitHub with correct `.gitignore`
- [ ] App record created in App Store Connect (iOS platform only)
- [ ] Codemagic connected to repo
- [ ] App Store Connect API key generated with **Admin** role
- [ ] Certificate generated via Codemagic's UI (Apple Distribution type)
- [ ] Provisioning profile manually created on Apple Portal, uploaded to
      Codemagic, shows green checkmark match
- [ ] `distribution_profile.mobileprovision` committed to repo root
- [ ] `codemagic.yaml` in place, no `keychain initialize` step, uses
      `$PROJECT_BUILD_NUMBER`
- [ ] First build succeeds and reaches TestFlight
- [ ] iOS-specific AdMob setup complete: separate app ID, Info.plist keys,
      ATT code, Privacy & Messaging consent published for iOS specifically
- [ ] App icon (1024×1024, no alpha) in place
- [ ] Screenshots captured cleanly (no TestFlight chrome) and resized to
      exact current Apple requirements
- [ ] Internal Testing confirms everything works before proceeding to
      External Testing / submission
