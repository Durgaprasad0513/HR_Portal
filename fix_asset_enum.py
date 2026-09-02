import re

def fix_enum(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # in schema
    content = content.replace("['ELECTRONICS', 'FURNITURE', 'VEHICLE', 'OTHER']", "['IT', 'NON_IT', 'VEHICLE_CAT']")
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_enum('server/src/modules/assets/asset.schema.ts')

def fix_test(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # in test
    content = content.replace("assetCategory: 'ELECTRONICS'", "assetCategory: 'IT'")
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_test('server/tests/gate2.test.ts')
