const fs = require('fs');

function fix(file, replaces) {
    if(!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    replaces.forEach(r => {
        content = content.replace(r[0], r[1]);
    });
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
    }
}

// Server Fixes
fix('./server/src/modules/policies/policy.controller.ts', [
    [/req\.user\?\.id/, 'req.user?.userId']
]);

// Client Fixes
// Remove React refers to a UMD global
const path = require('path');
const walk = function(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        if (fs.statSync(file).isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.ts') || file.endsWith('.tsx')) results.push(file);
        }
    });
    return results;
};

// Add import React back to all tsx
const clientFiles = walk('./client/src');
clientFiles.forEach(file => {
    if (file.endsWith('.tsx')) {
        let content = fs.readFileSync(file, 'utf8');
        if (!content.includes("import React")) {
            content = "import React from 'react';\n" + content;
            fs.writeFileSync(file, content, 'utf8');
        }
    }
});

// EmployeeFormPage.tsx
fix('./client/src/pages/employees/EmployeeFormPage.tsx', [
    [/status: formData\.get\('status'\) as string,/g, "status: formData.get('status') as any,"],
    [/status: formData\.get\('status'\) as string/g, "status: formData.get('status') as any"] // just in case
]);

// LeaveApplicationPage.tsx
fix('./client/src/pages/leave/LeaveApplicationPage.tsx', [
    [/leaveType: formData\.get\('leaveType'\) as string/g, "leaveType: formData.get('leaveType') as any"]
]);

// PolicyListPage.tsx
fix('./client/src/pages/policies/PolicyListPage.tsx', [
    [/variant="primary"/g, 'variant="default"'],
    [/variant="default"/g, 'variant="outline"'] // wait Button doesn't have primary, it has outline, secondary etc.
]);

// TravelListPage.tsx
fix('./client/src/pages/travel/TravelListPage.tsx', [
    [/accessor: 'purpose'/g, "accessor: ((row: any) => row.travelPurpose) as any"],
    [/accessor: 'advanceAmount'/g, "accessor: ((row: any) => row.advanceRequested) as any"]
]);
