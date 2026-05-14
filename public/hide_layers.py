import json

with open('/Users/Jayapalreddy/.gemini/antigravity/scratch/zerobricks/public/meow.json', 'r') as f:
    data = json.load(f)

for layer in data.get('layers', []):
    if layer.get('nm') in ['error', 'bubble']:
        layer['hd'] = True

with open('/Users/Jayapalreddy/.gemini/antigravity/scratch/zerobricks/public/cat-meow.json', 'w') as f:
    json.dump(data, f)
