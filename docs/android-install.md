# Local 10 Hub Android Install

Local 10 Hub can be installed as a standalone Android app through the Capacitor wrapper in `android/`.

## Local Build

From the repo root:

```sh
npm run android:debug
```

The APK will be copied to:

```text
dist/android/Local10-Hub-debug.apk
```

Copy that APK to the phone, tap it, and allow install from the browser or file manager if Android asks.

## Updates

Android updates work when both of these stay true:

- `appId` / `applicationId` stays `com.cajub311.local10hub`
- each new APK has a higher `versionCode`

The GitHub Actions workflow sets `VERSION_CODE` from the workflow run number, so every GitHub-built APK can update the earlier GitHub-built APK.

## GitHub Download

This repo includes a GitHub Actions workflow:

```text
.github/workflows/android-debug-apk.yml
```

Push to `main`, or run **Build Android APK** manually from the GitHub Actions tab with `publish_release` enabled. It builds the app and creates or updates this release:

```text
https://github.com/cajub311/Local10starter/releases/tag/local10-android-debug
```

The direct APK asset will be:

```text
https://github.com/cajub311/Local10starter/releases/download/local10-android-debug/Local10-Hub-debug.apk
```

Android will warn because this is a personal APK outside the Play Store. That is expected for a debug build.
