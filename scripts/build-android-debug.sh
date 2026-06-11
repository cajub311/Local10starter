#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ -z "${JAVA_HOME:-}" && -d /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home ]]; then
  export JAVA_HOME="/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home"
fi

if [[ -z "${JAVA_HOME:-}" ]]; then
  echo "JAVA_HOME is not set. Install Java 21 or set JAVA_HOME before building." >&2
  exit 1
fi

npm run build
npx cap sync android

(cd android && ./gradlew assembleDebug)

mkdir -p dist/android
cp android/app/build/outputs/apk/debug/app-debug.apk dist/android/Local10-Hub-debug.apk

echo
echo "Built Android APK:"
ls -lh dist/android/Local10-Hub-debug.apk

if command -v shasum >/dev/null 2>&1; then
  shasum -a 256 dist/android/Local10-Hub-debug.apk
fi
