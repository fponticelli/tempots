#!/bin/bash
set -e
cd "$(dirname "$0")/.."

echo "=== Tempo iOS Demo Setup ==="

# 1. Build JS bundle
echo "Building JS bundle..."
pnpm install
pnpm build
echo "Bundle built: dist/bundle.js"

# 2. Install XcodeGen if needed
if ! command -v xcodegen &> /dev/null; then
  echo "Installing XcodeGen via Homebrew..."
  brew install xcodegen
fi

# 3. Generate Xcode project
echo "Generating Xcode project..."
xcodegen generate

# 4. Open in Xcode
echo "Opening TempoDemo.xcodeproj..."
open TempoDemo.xcodeproj

echo ""
echo "=== Setup complete ==="
echo "Select an iOS Simulator target and press Cmd+R to run."
