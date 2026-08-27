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
    
    // Fix `const { id } = req.params; ... service.call(id)` to use `id as string`
    // More robustly: simply find req.params destructured variables and cast them at the site.
    // Or just cast id directly where it's used.
    // Replace `(id)` with `(id as string)`
    // Replace `(id,` with `(id as string,`
    
    // Quick and dirty regex for all specific service method calls
    content = content.replace(/get[a-zA-Z0-9]+ById\(id\)/g, match => match.replace('(id)', '(id as string)'));
    content = content.replace(/delete[a-zA-Z0-9]+\(id\)/g, match => match.replace('(id)', '(id as string)'));
    content = content.replace(/update[a-zA-Z0-9]+\(id, /g, match => match.replace('(id, ', '(id as string, '));
    content = content.replace(/update[a-zA-Z0-9]+Status\(id, /g, match => match.replace('(id, ', '(id as string, '));
    content = content.replace(/assign[a-zA-Z0-9]+\(id, /g, match => match.replace('(id, ', '(id as string, '));
    content = content.replace(/return[a-zA-Z0-9]+\(id, /g, match => match.replace('(id, ', '(id as string, '));
    content = content.replace(/add[a-zA-Z0-9]+\(id, /g, match => match.replace('(id, ', '(id as string, '));
    content = content.replace(/mark[a-zA-Z0-9]+\(id\)/g, match => match.replace('(id)', '(id as string)'));
    content = content.replace(/acknowledge[a-zA-Z0-9]+\(id, /g, match => match.replace('(id, ', '(id as string, '));
    
    // req.user!.id -> req.user!.employeeId for policy controller
    if (file.includes('policy.controller.ts') || file.includes('recruitment.controller.ts')) {
        content = content.replace(/req\.user!\.id/g, 'req.user!.employeeId as string');
    }

    fs.writeFileSync(file, content, 'utf8');
});

const clientFiles = walk('./client/src');
clientFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove unused imports
    content = content.replace(/import\s+React[,\s]*(\{.*?\})?\s+from\s+'react';?/g, "import { $1 } from 'react';");
    content = content.replace(/import\s+\{\s*\}\s+from\s+'react';?/g, "");
    content = content.replace(/import React from 'react';?/g, "");
    content = content.replace(/CalendarDays,/g, "");
    content = content.replace(/Badge,/g, "");
    content = content.replace(/toast,/g, "");
    
    if (file.includes('EmployeeFormPage.tsx')) {
        content = content.replace(/status: formData\.get\('status'\) as string/g, "status: formData.get('status') as any");
    }
    
    if (file.includes('LeaveApplicationPage.tsx')) {
        content = content.replace(/leaveType: formData\.get\('leaveType'\) as string/g, "leaveType: formData.get('leaveType') as any");
    }
    
    if (file.includes('PolicyListPage.tsx')) {
        content = content.replace(/variant="default"/g, "variant=\"primary\""); // Button variant mismatch
    }
    
    if (file.includes('TravelListPage.tsx')) {
        content = content.replace(/accessor: 'purpose'/g, "accessor: 'travelPurpose'");
        content = content.replace(/accessor: 'advanceAmount'/g, "accessor: 'advanceRequested'");
    }

    fs.writeFileSync(file, content, 'utf8');
});
