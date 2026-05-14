import json

with open('/Users/Jayapalreddy/.gemini/antigravity/scratch/zerobricks/public/animation.json', 'r') as f:
    content = f.read()
    start_pos = 0
    while True:
        index = content.lower().find('error', start_pos)
        if index == -1:
            break
        print(f"--- Occurrence at {index} ---")
        start = max(0, index - 100)
        end = min(len(content), index + 100)
        print(content[start:end])
        start_pos = index + 1
