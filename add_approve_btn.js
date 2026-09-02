const fs = require('fs');

let content = fs.readFileSync('client/src/pages/assets/AssetListPage.tsx', 'utf8');

const target = `          {isAdminOrHR && (
             <button 
               className="p-1 text-gray-400 dark:text-gray-500 hover:text-navy-900`;

const approveBtn = `          {isAdminOrHR && row.status === 'RETURN_REQUESTED' && (
            <button 
              className="p-1 text-gray-400 dark:text-gray-500 hover:text-green-600 transition-colors" 
              title="Approve Return"
              onClick={() => approveReturnMutation.mutate(row.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </button>
          )}
`;

if(content.includes(target)) {
    content = content.replace(target, approveBtn + target);
    fs.writeFileSync('client/src/pages/assets/AssetListPage.tsx', content);
    console.log('Replaced successfully');
} else {
    console.log('Target not found');
}
