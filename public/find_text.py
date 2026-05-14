import json

def find_text(obj, path=""):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k == 't' and isinstance(v, str):
                print(f"Path: {path} -> Text: {v}")
            find_text(v, f"{path}.{k}")
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            find_text(item, f"{path}[{i}]")

with open('/Users/Jayapalreddy/.gemini/antigravity/scratch/zerobricks/public/animation.json', 'r') as f:
    data = json.load(f)
    find_text(data)
