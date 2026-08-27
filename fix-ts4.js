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
    
    // Fix all controller calls using req.params
    // E.g. getModuleLogs(req.params.module) -> getModuleLogs(req.params.module as string)
    // Replace all instances of `req.params.([a-zA-Z0-9_]+)` when inside a function call argument?
    // Let's just find and replace specific errors.
    
    // The errors were:
    // audit.controller.ts: `req.params.module` -> `req.params.module as string`
    if (file.includes('audit.controller.ts')) {
        content = content.replace(/req\.params\.module/g, 'req.params.module as string');
    }
    
    // notification.controller.ts:
    if (file.includes('notification.controller.ts')) {
        content = content.replace(/req\.params\.id/g, 'req.params.id as string');
    }
    
    // performance.controller.ts
    if (file.includes('performance.controller.ts')) {
        content = content.replace(/req\.params\.id/g, 'req.params.id as string');
    }
    
    // policy.controller.ts
    if (file.includes('policy.controller.ts')) {
        content = content.replace(/req\.params\.id/g, 'req.params.id as string');
    }

    // recruitment.controller.ts
    if (file.includes('recruitment.controller.ts')) {
        content = content.replace(/req\.params\.id/g, 'req.params.id as string');
        content = content.replace(/req\.params\.requisitionId/g, 'req.params.requisitionId as string');
    }

    // request.controller.ts
    if (file.includes('request.controller.ts')) {
        content = content.replace(/req\.params\.id/g, 'req.params.id as string');
    }

    // training.controller.ts
    if (file.includes('training.controller.ts')) {
        content = content.replace(/req\.params\.id/g, 'req.params.id as string');
    }
    
    fs.writeFileSync(file, content, 'utf8');
});

const clientFiles = walk('./client/src');
clientFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    if (file.endsWith('.tsx') && !content.includes("import React")) {
        content = "import React from 'react';\n" + content;
        changed = true;
    }
    
    if (file.endsWith('.ts') && content.includes("import React from 'react';\n")) {
        // remove it from main.tsx because it's already imported
        if (file.includes('main.tsx')) {
            // Wait main is tsx.
        }
    }
    
    if (file.includes('PolicyListPage.tsx')) {
        content = content.replace(/variant="primary"/g, 'variant="default"');
        content = content.replace(/<Badge variant="default">/g, '<Badge variant="info">'); // there is no primary badge
        changed = true;
    }

    if (file.includes('TravelListPage.tsx')) {
        content = content.replace(/accessor: \([a-zA-Z0-9\s:]+\) => /g, 'accessor: (row: any) => ');
        content = content.replace(/accessor: 'travelPurpose'/g, 'accessor: ((row: any) => row.travelPurpose) as any');
        content = content.replace(/accessor: 'destination'/g, 'accessor: ((row: any) => row.destination) as any');
        content = content.replace(/accessor: 'advanceRequested'/g, 'accessor: ((row: any) => row.advanceRequested) as any');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
    }
});
