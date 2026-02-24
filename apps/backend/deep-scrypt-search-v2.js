const fs = require('fs');
const path = require('path');

function checkDir(dir) {
    if (!fs.existsSync(dir)) return;
    try {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                if (item === 'node_modules' || item.startsWith('@medusajs')) {
                    checkDir(fullPath);
                }
            } else if (item.endsWith('.js') || item.endsWith('.d.ts')) {
                const content = fs.readFileSync(fullPath, 'utf8');
                if (content.includes('class Scrypt') || content.includes('exports.Scrypt')) {
                    console.log("📍 MATCH FOUND:", fullPath);
                }
            }
        }
    } catch (e) { }
}

const rootPath = '/root/ola-shop-v2';
console.log("🔍 Scanning root node_modules for Scrypt...");
checkDir(path.join(rootPath, 'node_modules'));
console.log("🏁 Scan complete.");
