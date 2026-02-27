const fs = require('fs');
const path = require('path');
const { Redis } = require('ioredis');

async function diagnose() {
    console.log("=== OLA SHOP MEGA DIAGNOSTIC ===");
    console.log("Time:", new Date().toISOString());
    console.log("CWD:", process.cwd());
    console.log("__dirname:", __dirname);
    console.log("Node Version:", process.version);

    console.log("\n--- Environment Variables (Filtered) ---");
    const safeEnv = ["DATABASE_URL", "REDIS_URL", "MEDUSA_BACKEND_URL", "PORT", "NODE_ENV", "STORE_CORS", "ADMIN_CORS"];
    safeEnv.forEach(key => {
        console.log(`${key}: ${process.env[key] ? (process.env[key].startsWith('redis') || process.env[key].startsWith('postgres') ? '[HIDDEN]' : process.env[key]) : 'NOT SET'}`);
    });

    console.log("\n--- Redis Connectivity Check ---");
    if (process.env.REDIS_URL) {
        try {
            const redis = new Redis(process.env.REDIS_URL, { connectTimeout: 2000 });
            await redis.ping();
            console.log("Redis Connection: SUCCESS");
            await redis.quit();
        } catch (err) {
            console.log("Redis Connection: FAILED -", err.message);
        }
    } else {
        console.log("Redis Connection: SKIPPED (No REDIS_URL)");
    }

    console.log("\n--- File System Search for Admin UI ---");
    const searchPaths = [
        path.join(process.cwd(), "apps/backend/dist"),
        path.join(process.cwd(), "apps/backend/.medusa"),
        path.join(process.cwd(), "apps/backend/admin-build"),
        path.join(process.cwd(), "dist"),
        process.cwd()
    ];

    searchPaths.forEach(searchPath => {
        if (fs.existsSync(searchPath)) {
            console.log(`Checking in: ${searchPath}`);
            findFile(searchPath, "index.html");
        } else {
            console.log(`Path Not Found: ${searchPath}`);
        }
    });

    console.log("\n--- Nginx Log Preview (First few lines of common paths) ---");
    const nginxPaths = ["/var/log/nginx/error.log", "/etc/nginx/sites-enabled/default"];
    nginxPaths.forEach(p => {
        if (fs.existsSync(p)) {
            console.log(`Found Nginx path: ${p}`);
        }
    });
}

function findFile(dir, targetFile) {
    try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                if (file !== 'node_modules' && file !== '.git') {
                    findFile(fullPath, targetFile);
                }
            } else if (file === targetFile) {
                console.log(`MATCH FOUND: ${fullPath}`);
            }
        }
    } catch (e) {
        // Silent
    }
}

diagnose().then(() => console.log("\n=== DIAGNOSTIC COMPLETE ==="));
