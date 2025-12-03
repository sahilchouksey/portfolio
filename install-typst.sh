#!/bin/bash
set -e

echo "Installing typst binary..."

# Create bin directory if it doesn't exist
mkdir -p bin

# Download typst
wget -q https://github.com/typst/typst/releases/download/v0.14.0/typst-x86_64-unknown-linux-musl.tar.xz -O typst.tar.xz

# Extract
tar -xf typst.tar.xz

# Move binary
mv typst-x86_64-unknown-linux-musl/typst bin/typst
chmod +x bin/typst

# Cleanup
rm -rf typst-x86_64-unknown-linux-musl typst.tar.xz

echo "✓ Typst installed successfully at ./bin/typst"
./bin/typst --version
