import json

path = "package.json"
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

data['scripts']['lint'] = "npm run lint --prefix client && npm run lint --prefix server"
data['scripts']['verify'] = "npm run lint && npm run build --prefix client && npm run build --prefix server && npm run test --prefix server"

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)
