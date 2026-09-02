const fs = require('fs');

const filePaths = [
    'client/src/api/recruitment.ts',
    'client/src/api/assets.ts',
    'client/src/api/travel.ts'
];

filePaths.forEach(path => {
    const content = fs.readFileSync(path, 'utf8');
    // Just rewrite to update timestamp
    fs.writeFileSync(path, content + '\n// updated');
});
