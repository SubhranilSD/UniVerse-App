import fs from 'fs';
import path from 'path';

const pagesDir = 'D:/COLLEGE_KRMU/SEMESTER 2/MINOR PROJECT/NEURAL NINJAS + BACKEND/myproject/client/src/pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

for (const file of files) {
    if (file === 'Dashboard.jsx' || file === 'SmartCampus.jsx' || file === 'Admin.jsx') continue;
    
    let content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
    
    if (!content.includes('PageTransition')) {
        content = content.replace(/import { Link } from 'react-router-dom';/, 
            `import { Link } from 'react-router-dom';\nimport PageTransition from '../components/PageTransition';`);
            
        content = content.replace(/return \(\s*<>\s*/, 'return (\n    <PageTransition>\n      ');
        
        // Use regex for end
        content = content.replace(/<\/>\s*\);\s*};/, '</PageTransition>\n  );\n};');
        
        fs.writeFileSync(path.join(pagesDir, file), content);
    }
}
console.log('Done!');
