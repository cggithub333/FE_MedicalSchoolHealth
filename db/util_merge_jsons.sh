#!/bin/bash

# Define paths
BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
TARGET_DIR="$BASE_DIR/target"
OUTPUT_FILE="$TARGET_DIR/artifact.json"
BACKUP_DIR="$TARGET_DIR/json_backup"

# Check if target folder exists
if [ ! -d "$TARGET_DIR" ]; then
    echo "❌ Target directory not found at $TARGET_DIR"
    echo "💡 Please run gather_jsons.sh first."
    exit 1
fi

# Check for jq (required)
if ! command -v jq &> /dev/null; then
    echo "❌ 'jq' is required but not installed. Install it with: sudo apt install jq"
    exit 1
fi

# Start merging with an empty JSON object
echo "{}" > "$OUTPUT_FILE"

# Iterate over each JSON file and merge it into artifact.json
for file in "$TARGET_DIR"/*.json; do
    # Skip artifact.json itself
    [[ "$file" == "$OUTPUT_FILE" ]] && continue

    # Merge current file into artifact.json
    jq -s '.[0] * .[1]' "$OUTPUT_FILE" "$file" > "$OUTPUT_FILE.tmp" && mv "$OUTPUT_FILE.tmp" "$OUTPUT_FILE"
done

echo "✅ Merged JSON saved to: $OUTPUT_FILE"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Move all json files except artifact.json into json_backup/
for file in "$TARGET_DIR"/*.json; do
    [[ "$file" == "$OUTPUT_FILE" ]] && continue
    mv "$file" "$BACKUP_DIR/"
done

echo "📦 All source JSON files moved to: $BACKUP_DIR"
