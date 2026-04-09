import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

const htmlDir = 'D:/COLLEGE_KRMU/SEMESTER 2/MINOR PROJECT/NEURAL NINJAS + BACKEND/ProjexaAI';
const pagesDir = 'D:/COLLEGE_KRMU/SEMESTER 2/MINOR PROJECT/NEURAL NINJAS + BACKEND/myproject/client/src/pages';
if (!fs.existsSync(pagesDir)) fs.mkdirSync(pagesDir, { recursive: true });

const convertStyles = (styleStr) => {
    if (!styleStr) return '{}';
    const rules = styleStr.split(';').filter(s => s.trim());
    const objStr = rules.map(rule => {
        let [key, val] = rule.split(':');
        if (!key || val === undefined) return '';
        key = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
        val = val.trim().replace(/"/g, "'");
        return `"${key}": "${val}"`;
    }).filter(s => s).join(', ');
    return `{${objStr}}`;
};

const processHtml = (html) => {
    const $ = cheerio.load(html);
    
    const $main = $('.main-content');
    if ($main.length) {
        $main.find('.top-bar').remove();
        var jsx = $main.html();
    } else {
        var jsx = $('body').html(); // Fallback for pages without .main-content
    }
    
    if(!jsx) return '';

    // JSX replacements
    jsx = jsx.replace(/class=/g, 'className=');
    jsx = jsx.replace(/for=/g, 'htmlFor=');
    jsx = jsx.replace(/<!--[\s\S]*?-->/g, ''); // Remove comments
    
    // Convert style="x: y;" to style={{x: 'y'}}
    jsx = jsx.replace(/style="([^"]*)"/g, (match, p1) => {
        return `style={{${convertStyles(p1).slice(1, -1)}}}`;
    });
    
    // Ensure elements are closed
    jsx = jsx.replace(/<img([^>]*?)>/g, (match, p1) => {
        if(p1.trim().endsWith('/')) return match;
        return `<img${p1} />`;
    });
    jsx = jsx.replace(/<input([^>]*?)>/g, (match, p1) => {
        if(p1.trim().endsWith('/')) return match;
        return `<input${p1} />`;
    });
    jsx = jsx.replace(/<hr([^>]*?)>/g, (match, p1) => {
        if(p1.trim().endsWith('/')) return match;
        return `<hr${p1} />`;
    });
    jsx = jsx.replace(/<br([^>]*?)>/g, (match, p1) => {
        if(p1.trim().endsWith('/')) return match;
        return `<br${p1} />`;
    });

    // Fix html paths, e.g. href="dashboard.html" -> href="/dashboard"
    jsx = jsx.replace(/href="([^"]+)\.html"/g, (match, p1) => {
        if(p1 === 'index') return 'to="/"';
        return `to="/${p1}"`;
    });
    
    // We replace <a> with <Link> for internal links
    jsx = jsx.replace(/<a (\s*to="[^"]+"\s*[^>]*)>/g, '<Link $1>');
    jsx = jsx.replace(/<\/a>/g, '</Link>');
    jsx = jsx.replace(/<a /g, '<Link to="#" '); // naive fallback
    
    return jsx;
}

const files = {
    'index.html': 'Login',
    'dashboard.html': 'Dashboard',
    'smart-campus.html': 'SmartCampus',
    'academics.html': 'Academics',
    'people.html': 'People',
    'learning-lms.html': 'LearningLMS',
    'mental-health.html': 'MentalHealth',
    'predictive-learning.html': 'PredictiveLearning',
    'attendance.html': 'Attendance',
    'exams-results.html': 'ExamsResults',
    'fees-finance.html': 'FeesFinance',
    'communication.html': 'Communication',
    'requests.html': 'Requests',
    'reports.html': 'Reports',
    'documents.html': 'Documents',
    'settings.html': 'Settings',
    'profile.html': 'Profile',
    'admin/admin.html': 'Admin'
};

for (const [file, name] of Object.entries(files)) {
    const fullPath = path.join(htmlDir, file);
    if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        let innerJsx = processHtml(content);
        
        let fileContent = `import { Link } from 'react-router-dom';\n\nconst ${name} = () => {\n  return (\n    <>\n      ${innerJsx}\n    </>\n  );\n};\n\nexport default ${name};`;
        
        // Manual tweaks for Login since it doesn't have main-content but has script tag that needs removal
        if (name === 'Login') {
            innerJsx = innerJsx.replace(/<script.*?>.*?<\/script>/gs, '');
            fileContent = `import { Link } from 'react-router-dom';\n\nconst ${name} = () => {\n  return (\n    <>\n      ${innerJsx}\n    </>\n  );\n};\n\nexport default ${name};`;
        }

        fs.writeFileSync(path.join(pagesDir, `${name}.jsx`), fileContent);
        console.log(`Converted ${name}`);
    } else {
        console.log(`Missing file: ${file}`);
    }
}
