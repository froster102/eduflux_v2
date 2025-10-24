#!/bin/bash
set -e

echo "Cleaning previous build..."
rm -rf ./build
mkdir -p ./build

echo "Bundling with esbuild..."
bunx esbuild ./src/main.ts --bundle --platform=node --target=node18 --outfile=./build/server.js

echo "Creating executable with pkg..."
bunx pkg ./build/server.js --targets node18-linux-x64 --output ./build/server

echo "Build complete! Executable is at build/server"
