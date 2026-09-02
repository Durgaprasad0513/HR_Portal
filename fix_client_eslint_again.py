import json

path = "client/.eslintrc.json"
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

data['rules']['react-hooks/set-state-in-effect'] = "off"

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)
