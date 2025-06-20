#!/bin/bash
echo "✅ Hello from db.sh!"
# Change to script's directory
cd "$(dirname "$0")" || exit
rm -f db.json
merge_jsons() {
  local outfile="db.json"
  local files=(*.json)
  if [ ${#files[@]} -eq 0 ]; then
    echo "❌ No .json files found in the current directory."
    return 1
  fi
  echo "{" > "$outfile"
  local count=0
  local total=${#files[@]}
  for file in "${files[@]}"; do
    [[ "$file" == "$outfile" ]] && continue  # skip db.json itself
    local name="${file%.json}"
    local content
    content=$(<"$file")
    echo -n "  \"$name\": $content" >> "$outfile"
    count=$((count + 1))
    if [ $count -lt $total ]; then
      echo "," >> "$outfile"
    else
      echo "" >> "$outfile"
    fi
  done
  echo "}" >> "$outfile"
  echo "✅ Merged $count files into $outfile"
}
merge_jsons
npx json-server --watch db.json --port 3000