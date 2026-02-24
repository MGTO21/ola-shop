const fs = require('fs');
const path = require('path');

console.log("--- ENV DEBUGGER ---");
console.log("CWD:", process.cwd());
console.log("MEDUSA_ADMIN_EMAIL:", process.env.MEDUSA_ADMIN_EMAIL);
console.log("MEDUSA_ADMIN_PASSWORD:", process.env.MEDUSA_ADMIN_PASSWORD ? "SET (Length: " + process.env.MEDUSA_ADMIN_PASSWORD.length + ")" : "NOT SET");
if (process.env.MEDUSA_ADMIN_PASSWORD) {
    console.log("PASSWORD STARTS WITH:", process.env.MEDUSA_ADMIN_PASSWORD.substring(0, 2));
}

// Check for .env files in common locations
const locations = [
    './.env',
    './.env.local',
    './.env.production',
    '../.env',
    '../../.env',
    '/root/ola-shop-v2/.env'
];

locations.forEach(loc => {
    const fullPath = path.resolve(loc);
    if (fs.existsSync(fullPath)) {
        console.log(`✅ Found file at: ${fullPath}`);
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('MEDUSA_ADMIN_PASSWORD')) {
            console.log(`   👉 Contains MEDUSA_ADMIN_PASSWORD`);
        }
    } else {
        console.log(`❌ No file at: ${fullPath}`);
    }
});
