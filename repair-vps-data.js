const { Client } = require('pg');
const scrypt = require('scrypt-kdf');

const DB_URL = "postgres://postgres:Abc996050@127.0.0.1:5432/medusa_db";
const ADMIN_EMAIL = 'admin@ola-shop.com';
const ADMIN_PASS = 'Abc996050@';

async function repair() {
    const client = new Client({ connectionString: DB_URL });
    await client.connect();

    console.log("🚀 Starting VPS Data Repair...");

    try {
        // 1. Fix Admin User in 'auth_identity' (Medusa v2 structure)
        console.log("🛠️  Repairing Admin Auth Identity...");

        // Medusa v2 hash parameters
        const passwordBuf = Buffer.from(ADMIN_PASS);
        const kdfRes = await scrypt.hash(passwordBuf, { logN: 15, r: 8, p: 1 });
        const hashBase64 = kdfRes.toString('base64');

        // Check if identity exists
        const identityCheck = await client.query("SELECT id FROM auth_identity WHERE identifier = $1", [ADMIN_EMAIL]);

        if (identityCheck.rows.length === 0) {
            console.log("   Creating missing admin identity...");
            await client.query(
                "INSERT INTO auth_identity (id, identifier, password_hash, provider) VALUES ($1, $2, $3, $4)",
                ['auth_admin_ola', ADMIN_EMAIL, hashBase64, 'emailpass']
            );
        } else {
            console.log("   Updating existing admin password...");
            await client.query(
                "UPDATE auth_identity SET password_hash = $1 WHERE identifier = $2",
                [hashBase64, ADMIN_EMAIL]
            );
        }

        // 2. Fix Region (Crucial for Carts)
        console.log("🛠️  Checking Regions...");
        const regionCheck = await client.query("SELECT id FROM region LIMIT 1");

        if (regionCheck.rows.length === 0) {
            console.log("   Creating default Sudan Region...");
            const regionId = 'reg_sudan_production';
            await client.query(
                "INSERT INTO region (id, name, currency_code, tax_rate) VALUES ($1, $2, $3, $4)",
                [regionId, 'Sudan', 'sdg', 0]
            );
            console.log(`   ✅ Created Region: ${regionId}`);
        } else {
            console.log(`   ✅ Found ${regionCheck.rows.length} existing regions.`);
        }

        console.log("\n✨ Repair Completed! Please restart the backend.");

    } catch (e) {
        console.error("❌ Repair Failed:", e.message);
    } finally {
        await client.end();
    }
}

repair();
