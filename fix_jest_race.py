import re

path = 'server/package.json'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('"test": "jest"', '"test": "jest --runInBand"')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
