const fs = require('fs');
const path = require('path');

const walk = function(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.ts') || file.endsWith('.tsx')) results.push(file);
        }
    });
    return results;
};

const serverFiles = walk('./server/src/modules');
serverFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace const { id } = req.params; with const id = req.params.id as string;
    content = content.replace(/const\s+\{\s*id\s*\}\s*=\s*req\.params;?/g, "const id = req.params.id as string;");
    
    // Also some might have const { id } = req.query; -> shouldn't happen for id usually, but let's be careful.
    
    fs.writeFileSync(file, content, 'utf8');
});

const clientFiles = walk('./client/src');
clientFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    content = content.replace(/import\s+\{\s*\{\s*(.*?)\s*\}\s*\}\s*from\s*'react';?/g, "import { $1 } from 'react';");
    content = content.replace(/import\s+\{\s*undefined\s*\}\s*from\s*'react';?/g, "");
    
    fs.writeFileSync(file, content, 'utf8');
});
