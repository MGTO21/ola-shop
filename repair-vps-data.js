const { Client } = require('pg');
const scrypt = require('scrypt-kdf');

const DB_URL = "postgres://postgres:Abc996050@127.0.0.1:5432/medusa_db";
const ADMIN_EMAIL = 'admin@ola-shop.com';
const ADMIN_PASS = 'Abc996050@';

async function repair() {
    const client = new Client({ connectionString: DB_URL });
    await client.connect();

    console.log("🚀 Starting Robust VPS Data Repair...");
    console.log("Checking scrypt-kdf exports:", Object.keys(scrypt));

    try {
        // 1. Generate Hash using the correct function
        console.log("🛠️  Generating Hash...");
        let hashBase64;

        // Try 'kdf' which is common in many scrypt-kdf versions
        if (typeof scrypt.kdf === 'function') {
            const kdfRes = await scrypt.kdf(Buffer.from(ADMIN_PASS), { logN: 15, r: 8, p: 1 });
            hashBase64 = kdfRes.toString('base64');
        } else if (typeof scrypt.hash === 'function') {
            const kdfRes = await scrypt.hash(Buffer.from(ADMIN_PASS), { logN: 15, r: 8, p: 1 });
            hashBase64 = kdfRes.toString('base64');
        } else {
            throw new Error("Could not find hash or kdf function in scrypt-kdf library");
        }

        // 2. Fix Admin User in 'auth_identity'
        console.log("🛠️  Repairing Admin Auth Identity...");
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

        // 3. Ensure Region Exists (Critical for Cart)
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

        // 4. Update Admin User table (if needed for some Medusa flows)
        console.log("🛠️  Checking Admin User record...");
        const userCheck = await client.query("SELECT id FROM \"user\" WHERE email = $1", [ADMIN_EMAIL]);
        if (userCheck.rows.length === 0) {
            console.log("   Creating admin user record...");
            await client.query(
                "INSERT INTO \"user\" (id, email, first_name, last_name) VALUES ($1, $2, $3, $4)",
                ['user_admin_ola', ADMIN_EMAIL, 'Admin', 'Ola']
            );
        }

        console.log("\n✨ Repair Completed! Please restart the backend.");

    } catch (e) {
        console.error("❌ Repair Failed:", e.message);
        console.log("Stack Trace:", e.stack);
    } finally {
        await client.end();
    }
}

repair();
