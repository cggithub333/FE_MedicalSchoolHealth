#!/bin/bash

# Get the path to the folder where this script is located (i.e. test/)
BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
TARGET_DIR="$BASE_DIR/target"

# Remove old target folder if it exists
rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"

# Find and copy all .json files, skipping anything inside the target/ folder itself
find "$BASE_DIR" -type f -name "*.json" ! -path "$TARGET_DIR/*" | while read -r json_file; do
    cp "$json_file" "$TARGET_DIR"
done

echo "✅ JSON files have been collected into: $TARGET_DIR"