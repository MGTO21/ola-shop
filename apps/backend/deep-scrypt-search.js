const fs = require('fs');
const path = require('path');

function findScryptInPackages(dir) {
    const packages = fs.readdirSync(dir);
    for (const pkg of packages) {
        const pkgPath = path.join(dir, pkg);
        if (pkg.startsWith('@medusajs') && fs.statSync(pkgPath).isDirectory()) {
            const subPackages = fs.readdirSync(pkgPath);
            for (const subPkg of subPackages) {
                const subPkgPath = path.join(pkgPath, subPkg);
                if (fs.statSync(subPkgPath).isDirectory()) {
                    checkDir(subPkgPath);
                }
            }
        }
    }
}

function checkDir(dir) {
    try {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                if (!fullPath.includes('node_modules')) checkDir(fullPath);
            } else if (item.endsWith('.js') || item.endsWith('.d.ts')) {
                const content = fs.readFileSync(fullPath, 'utf8');
                if (content.includes('class Scrypt') || (item.toLowerCase().includes('scrypt') && content.includes('exports'))) {
                    console.log("📍 MATCH FOUND:", fullPath);
                }
            }
        }
    } catch (e) { }
}

const nmPath = path.join(process.cwd(), 'node_modules');
console.log("🔍 Scanning @medusajs packages for Scrypt...");
findScryptInPackages(nmPath);
console.log("🏁 Scan complete.");
