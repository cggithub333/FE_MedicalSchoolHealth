#!/bin/bash
echo "✅ Hello from db.sh!"
# go into db folder:
cd db
rm target -r # remove if exists target;
# Change to script's directory
bash util_gather_jsons.sh
bash util_merge_jsons.sh
# run the artifact.json by jsonserver;
npx json-server --watch target/artifact.json --port 3333
# go back to root directory: