import json

# Update server/package.json
path = "server/package.json"
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

data['scripts']['test'] = "jest"
data['scripts']['test:watch'] = "jest --watch"

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

# Update root package.json
path = "package.json"
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

if 'scripts' not in data:
    data['scripts'] = {}

data['scripts']['verify'] = "npm run build --prefix client && npm run build --prefix server && npm run test --prefix server"
data['scripts']['test'] = "npm run test --prefix server"

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)
