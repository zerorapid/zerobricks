import json

with open('/Users/Jayapalreddy/.gemini/antigravity/scratch/zerobricks/public/animation.json', 'r') as f:
    data = json.load(f)
    layers = data.get('layers', [])
    for layer in layers:
        if layer.get('nm') == 'error':
            print(json.dumps(layer, indent=2))
