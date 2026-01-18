const fs = require('fs');
const path = require('path');

const errorsDir = path.join(__dirname, '_errors');
const assetsDir = path.join(__dirname, 'assets');
const cssPath = path.join(assetsDir, 'ghost-theme.css');

const cssContent = fs.readFileSync(cssPath, 'utf8');

const files = fs.readdirSync(errorsDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(errorsDir, file);
    let htmlContent = fs.readFileSync(filePath, 'utf8');

    // Remove the external link to ghost-theme.css
    // Regex matches <link ... href="../assets/ghost-theme.css" ... > or similar
    const linkRegex = /<link\s+rel=["']stylesheet["']\s+href=["']\.\.\/assets\/ghost-theme\.css["']\s*>/i;
    
    if (linkRegex.test(htmlContent)) {
        console.log(`Inlining CSS for ${file}`);
        
        // Construct the style block
        const styleBlock = `
    <style>
        ${cssContent}
    </style>`;

        // Replace the link tag with the style block
        htmlContent = htmlContent.replace(linkRegex, styleBlock);
        
        fs.writeFileSync(filePath, htmlContent);
    } else {
        // If the exact link format isn't found (maybe already absolute or different quote style), 
        // try a broader match or just insert into head if missing.
        // For now, let's assume the previous script's output format is consistent.
        console.log(`Skipping ${file} (Link not found or already inlined)`);
        
        // Safety check: if no style tag but link is missing, we might want to insert it.
        // But the previous step put it there. 
        // Let's check if it has the CSS content roughly.
        if (!htmlContent.includes('background: radial-gradient')) {
             console.log(`WARNING: CSS seems missing in ${file}`);
        }
    }
});

console.log('Done processing files.');
