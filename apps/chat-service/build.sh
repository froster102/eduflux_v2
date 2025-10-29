#!/bin/bash
set -e

echo "Cleaning previous build..."
rm -rf ./build
mkdir -p ./build

echo "Bundling with esbuild..."
bunx esbuild ./src/main.ts --bundle --platform=node --target=node24 --outfile=./build/server.js

# echo "Creating executable with pkg..."
# bunx pkg ./build/server.js --targets node20-linux-x64 --output ./build/server

echo "Build complete! file is at build/server.js"
