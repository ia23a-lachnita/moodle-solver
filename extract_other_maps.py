import json
import os

# Extract MoodleBridge.js.map
map_path = r'C:\Users\xursc\projects\moodle-solver\reverse-engineered-extension\quiz-solver-moodle-v3.0.2\MoodleBridge.js.map'

with open(map_path, 'r', encoding='utf-8') as f:
    sourcemap = json.load(f)

sources = sourcemap['sources']
sources_content = sourcemap['sourcesContent']

print(f"MoodleBridge Total sources: {len(sources)}")

output_dir = r'C:\Users\xursc\projects\moodle-solver\recovered-src'
os.makedirs(output_dir, exist_ok=True)

for i, (src, content) in enumerate(zip(sources, sources_content)):
    if content is None:
        print(f"  [{i}] {src} - NO CONTENT (None)")
        continue
    lines = content.count('\n') + 1
    size = len(content)
    print(f"  [{i}] {src} - {lines} lines, {size} chars")
    
    rel_path = src.replace('../', '')
    full_path = os.path.join(output_dir, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Saved: {rel_path}")

# Extract popup.js.map
map_path2 = r'C:\Users\xursc\projects\moodle-solver\reverse-engineered-extension\quiz-solver-moodle-v3.0.2\popup\popup.js.map'

with open(map_path2, 'r', encoding='utf-8') as f:
    sourcemap = json.load(f)

sources = sourcemap['sources']
sources_content = sourcemap['sourcesContent']

print(f"\nPopup Total sources: {len(sources)}")

for i, (src, content) in enumerate(zip(sources, sources_content)):
    if content is None:
        print(f"  [{i}] {src} - NO CONTENT (None)")
        continue
    lines = content.count('\n') + 1
    size = len(content)
    print(f"  [{i}] {src} - {lines} lines, {size} chars")
    
    rel_path = src.replace('../', '')
    full_path = os.path.join(output_dir, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Saved: {rel_path}")

print(f"\nAll sources saved to {output_dir}")