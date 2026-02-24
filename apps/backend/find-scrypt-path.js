const fs = require('fs');
const path = require('path');

function searchForScrypt(dir, depth = 0) {
    if (depth > 3) return;
    try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                if (file === 'node_modules' || file.startsWith('@medusajs')) {
                    searchForScrypt(fullPath, depth + 1);
                }
            } else if (file.endsWith('.js') || file.endsWith('.d.ts')) {
                const content = fs.readFileSync(fullPath, 'utf8');
                if (content.includes('export class Scrypt') || content.includes('class Scrypt')) {
                    console.log("📍 Found Scrypt in:", fullPath);
                }
            }
        }
    } catch (e) { }
}

console.log("🔍 Searching node_modules for Scrypt definition...");
searchForScrypt(path.join(process.cwd(), 'node_modules'));
