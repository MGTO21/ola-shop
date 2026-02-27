const fs = require('fs');
const path = require('path');
const { Redis } = require('ioredis');
const net = require('net');

async function diagnose() {
    console.log("\n🚀 === OLA SHOP MEGA DIAGNOSTIC v2.0 ===");
    console.log("Time:", new Date().toLocaleString());
    console.log("CWD:", process.cwd());
    console.log("__dirname:", __dirname);
    console.log("Node Version:", process.version);
    console.log("User:", process.env.USER || "root");

    console.log("\n--- 🌐 Environment Variables Check ---");
    const varsToCheck = ["DATABASE_URL", "REDIS_URL", "MEDUSA_BACKEND_URL", "PORT", "NODE_ENV", "STORE_CORS", "ADMIN_CORS"];
    varsToCheck.forEach(key => {
        let val = process.env[key];
        if (val && (key.includes("URL") || key.includes("SECRET"))) {
            console.log(`${key}: [PRESENT] (${val.substring(0, 15)}...)`);
        } else {
            console.log(`${key}: ${val || '❌ NOT SET'}`);
        }
    });

    console.log("\n--- 🔌 Port Availability (9000) ---");
    const port = process.env.PORT || 9000;
    const server = net.createServer().on('error', () => {
        console.log(`Port ${port}: ❌ BUSY (Something is already running here)`);
    });
    server.listen(port, '0.0.0.0', () => {
        console.log(`Port ${port}: ✅ FREE`);
        server.close();
    });

    console.log("\n--- 🧠 Redis Connection Test ---");
    if (process.env.REDIS_URL) {
        try {
            const redis = new Redis(process.env.REDIS_URL, { connectTimeout: 3000 });
            const pong = await redis.ping();
            console.log(`Redis Ping: ✅ ${pong}`);
            await redis.quit();
        } catch (err) {
            console.log(`Redis: ❌ FAILED (${err.message})`);
        }
    }

    console.log("\n--- 📁 Admin Build Autopsy ---");
    const backendRoot = path.join(process.cwd(), "apps/backend");
    const possiblePaths = [
        path.join(backendRoot, ".medusa/admin"),
        path.join(backendRoot, "dist/public/admin"),
        path.join(backendRoot, "dist/admin"),
        path.join(backendRoot, "admin-build"),
        "/root/ola-shop-v2/apps/backend/admin-build"
    ];

    possiblePaths.forEach(p => {
        if (fs.existsSync(p)) {
            const stats = fs.statSync(p);
            console.log(`📍 Path: ${p}`);
            console.log(`   - Type: ${stats.isDirectory() ? 'Directory' : 'File'}`);
            if (stats.isDirectory()) {
                const contents = fs.readdirSync(p);
                console.log(`   - Files: [${contents.join(', ')}]`);
                if (contents.includes('index.html')) {
                    const htmlPath = path.join(p, 'index.html');
                    const htmlContent = fs.readFileSync(htmlPath, 'utf8').substring(0, 100);
                    console.log(`   - index.html Check: ✅ READABLE (Start: ${htmlContent.replace(/\s+/g, ' ')}...)`);
                }
            }
        } else {
            console.log(`📍 Path: ${p} ❌ (NOT FOUND)`);
        }
    });

    console.log("\n--- 📄 Config Check (medusa-config.js) ---");
    const configPath = path.join(backendRoot, "medusa-config.js");
    if (fs.existsSync(configPath)) {
        console.log(`Found config at: ${configPath}`);
        const content = fs.readFileSync(configPath, 'utf8');
        const adminSection = content.match(/admin:\s*{[\s\S]*?}/);
        console.log("Admin Config in File:\n", adminSection ? adminSection[0] : "❌ NOT FOUND IN FILE");
    }

    console.log("\n--- 📝 Next steps ---");
    console.log("1. Copy ALL this output.");
    console.log("2. Check PM2 logs one last time (pm2 logs medusa-backend --lines 20).");
}

diagnose().catch(err => console.error("DIAGNOSTIC CRASHED:", err));
