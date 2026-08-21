# FWP Daily Puzzles — Build & Distribution Guide

This guide explains how to build and distribute **FWP Daily Puzzles** for:

- Web browsers
- Windows portable distribution
- Microsoft Store

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Play in a Browser](#1-play-in-a-browser)
4. [Windows Portable Build](#2-windows-portable-build)
5. [Microsoft Store AppX Build](#3-microsoft-store-appx-build)
6. [Troubleshooting](#troubleshooting-guide)

---

## Prerequisites

Before building the project, make sure the following requirements are met:

1. **Node.js** is installed — preferably the LTS version.
2. Project dependencies are installed. Run the following once inside the project folder:

   ```bash
   npm install
   ```

3. **Windows Developer Mode** is enabled in Windows Settings. This helps prevent symlink-related build errors.
4. **Microsoft Edge** is available for working with Microsoft Partner Center.
5. An `icon.png` file, sized **256 × 256 pixels**, exists in the project root.

---

## Project Structure

Your project folder should look similar to this:

```text
fwp-puzzles/
├── index.html              # Browser version
├── main.js                 # Electron wrapper
├── package.json            # Build configuration
├── icon.png                # Main application icon
└── build/
    └── appx/               # Microsoft Store tile icons
        ├── Square150x150Logo.png
        ├── Square44x44Logo.png
        ├── StoreLogo.png
        └── Wide310x150Logo.png
```

> **Important:** The files inside `build/appx/` can be copies of `icon.png` renamed to the required filenames. Electron Builder uses this folder when creating the AppX package.

---

# 1. Play in a Browser

Use this method for platforms such as **itch.io**, **Game Jolt**, or **IndieDB**.

Only the `index.html` file is required.

## Build Steps

1. Right-click `index.html`.
2. Select **Send to → Compressed (zipped) folder**.
3. Rename the resulting ZIP file to:

   ```text
   FWP-Browser.zip
   ```

4. Verify the ZIP file by opening it.

   The structure should be:

   ```text
   FWP-Browser.zip
   └── index.html
   ```

   `index.html` must be located directly at the root of the ZIP file and **not inside another folder**.

## Upload Steps for itch.io

1. Edit your project.
2. Set **Classification** to **Games**.
3. Set **Kind of project** to **HTML**.
4. Upload `FWP-Browser.zip`.
5. Enable:

   > This file will be played in the browser

6. Set the viewport dimensions to:

   ```text
   900 × 700
   ```

---

# 2. Windows Portable Build

This creates a Windows application folder containing the `.exe` file and all required supporting files.

The resulting ZIP can be uploaded to platforms such as **itch.io** or **Game Jolt**.

## Build Steps

Open an **Administrator Command Prompt** and run:

```bash
cd D:\WORK\fwp-puzzles

rmdir /s /q dist

npm run build-win
```

## Package Steps

1. Navigate to:

   ```text
   D:\WORK\fwp-puzzles\dist\win-unpacked\
   ```

2. Open PowerShell in that folder.

3. Run:

   ```powershell
   Compress-Archive -Path * -DestinationPath FWP-Windows.zip
   ```

4. Move `FWP-Windows.zip` to your preferred location, such as the Desktop.

## Upload Steps

Upload `FWP-Windows.zip` as a **Windows download**.

> **Note:** A final ZIP size of approximately **180 MB** is normal for an Electron application.

---

# 3. Microsoft Store AppX Build

This creates an `.appx` package that can be uploaded to Microsoft Partner Center.

## Build Steps

Open an **Administrator Command Prompt** and run:

```bash
cd D:\WORK\fwp-puzzles

rmdir /s /q dist

npm run build-store
```

The expected output is:

```text
dist\Daily-Puzzle-Challenges.appx
```

## Upload and Publish Steps

1. Open Microsoft Partner Center using **Microsoft Edge**.
2. Create a new product.
3. Select **App** as the product type.

   > Avoid selecting **Game** if it causes Microsoft Entra permission issues with a personal account.

4. Set the category to:

   ```text
   Entertainment
   ```

5. Complete the following sections:

   - Age ratings
   - Privacy information
   - Store listing

6. Go to **Manage Packages**.
7. Upload the `.appx` package.

## Handling Package Identity Errors

If Microsoft rejects the package because of an invalid identity or publisher value:

1. Copy the exact values shown in Microsoft's error message.
2. Update the corresponding values in the `appx` section of `package.json`, such as:

   - `identityName`
   - `publisher`
   - `displayName`

3. Rebuild the AppX package.
4. Upload the newly generated package.

---

# Troubleshooting Guide

## Build Errors

### Error: `A required privilege is not held by the client`

**Cause:**  
Windows is restricting the creation of symbolic links.

**Fix:**

1. Open **Windows Settings**.
2. Go to:

   ```text
   Privacy & Security → For developers
   ```

3. Enable **Developer Mode**.
4. Restart the computer.
5. Run the build again.

---

### Error: `ffmpeg.dll was not found`

This may occur when running the generated `.exe`.

**Cause:**  
The Electron portable target may leave required supporting files outside the standalone executable.

**Fix:**

In `package.json`, under the `win` configuration, change:

```json
"target": "portable"
```

to:

```json
"target": "dir"
```

Then rebuild the application.

Instead of distributing a single `.exe`, zip the contents of the generated `win-unpacked` folder.

---

### Issue: The app window keeps changing size

This may happen when clicking different widget tabs.

**Cause:**  
The widget changes its height dynamically, causing Electron to resize the window.

**Fix:**

In `main.js`, set the following values to fixed dimensions:

- `minWidth`
- `maxWidth`
- `minHeight`
- `maxHeight`

For example:

```text
900 × 900
```

Also set:

```javascript
resizable: false
```

This prevents the application window from changing size.

---

### Error: `configuration.appx has an unknown property 'assets'`

**Cause:**  
Electron Builder v24 does not support the `assets` array in `package.json`.

**Fix:**

1. Remove the `assets` block from `package.json`.
2. Create the following folder in the project root:

   ```text
   build/appx/
   ```

3. Place the required renamed tile icons inside that folder.

---

## Microsoft Store Errors

### Error: `The user account does not have the necessary Microsoft Entra Identity permissions`

**Possible cause:**  
Creating the product as a **Game** may trigger Xbox-related backend services that can cause permission issues for some account setups.

**Possible fixes:**

1. Close Chrome and try Microsoft Partner Center in **Microsoft Edge**.
2. If the issue continues, recreate the product as an **App**.
3. Use the **Entertainment** category if appropriate for the application.

---

### Error: `PublisherDisplayName... doesn't match your publisher display name`

**Cause:**  
The value in `package.json` does not exactly match the publisher display name in Microsoft Partner Center.

**Fix:**

Update:

```json
"publisherDisplayName"
```

so that it exactly matches the name shown in Partner Center.

Example:

```json
"publisherDisplayName": "Fun With Puzzles Apps"
```

---

### Error: `Invalid package identity name...`

Example:

```text
expected: FunWithPuzzlesApps.5456532179A21
```

**Cause:**  
Each Microsoft Partner Center product receives its own unique identity value.

**Fix:**

1. Copy the exact expected identity value from the error message.
2. Paste it into:

   ```json
   "identityName"
   ```

3. Rebuild the package.

If the expected identity starts with a number, keep that value for `identityName`, but use a valid letter-starting value for `applicationId`, for example:

```json
"applicationId": "DailyPuzzleChallenges"
```

---

### Error: `10.1.1.11 On Device Tiles... The available product tile icons include a default image`

**Cause:**  
The generated AppX package contains one or more default tile images instead of custom application tiles.

**Fix:**

1. Create:

   ```text
   build/appx/
   ```

2. Copy `icon.png` into this folder four times.
3. Rename the copies as follows:

   ```text
   Square150x150Logo.png
   Square44x44Logo.png
   StoreLogo.png
   Wide310x150Logo.png
   ```

4. Rebuild the AppX package.

---

### Error: `Package with Violation... two packages with the full name... which have different contents`

**Cause:**  
A new package with the same full package identity was uploaded while an older conflicting package still exists.

**Fix:**

1. Open **Manage Packages** in Microsoft Partner Center.
2. Remove the old conflicting package.
3. Keep only the correct package version.
4. Submit again.

---

# Platform-Specific Notes

## itch.io: Not Appearing in Search Results

**Possible cause:**  
HTML projects may not always appear in the same search listings as standard downloadable games.

**Things to check:**

1. Confirm that **Classification** is set to **Games**.
2. Check the available **Kind of project** setting.
3. Add relevant tags, such as:

   - `puzzle`
   - `daily`
   - `casual`

4. Save the project page again after making changes.

---

## Game Jolt and Google Play

If the platform does not support your desired Android distribution workflow:

- Publish the Android application through **Google Play**.
- On the other platform, provide a link to the Google Play listing in the project description where permitted.

---

## Quick Build Reference

### Browser Build

```text
index.html
    ↓
ZIP the file
    ↓
FWP-Browser.zip
    ↓
Upload as an HTML/browser project
```

### Windows Portable Build

```text
npm run build-win
    ↓
dist\win-unpacked\
    ↓
Compress the contents
    ↓
FWP-Windows.zip
```

### Microsoft Store Build

```text
npm run build-store
    ↓
dist\Daily-Puzzle-Challenges.appx
    ↓
Upload to Partner Center
```
