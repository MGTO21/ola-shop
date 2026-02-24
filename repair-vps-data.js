const { Client } = require('pg');
const scrypt = require('scrypt-kdf');

const DB_URL = "postgres://postgres:Abc996050@127.0.0.1:5432/medusa_db";
const ADMIN_EMAIL = 'admin@ola-shop.com';
const ADMIN_PASS = 'Abc996050@';

async function repair() {
    const client = new Client({ connectionString: DB_URL });
    await client.connect();

    console.log("🚀 Starting Decoupled VPS Data Repair...");

    try {
        // 1. Generate Hash
        console.log("🛠️  Generating Hash...");
        let hashBase64;
        if (typeof scrypt.kdf === 'function') {
            const kdfRes = await scrypt.kdf(Buffer.from(ADMIN_PASS), { logN: 15, r: 8, p: 1 });
            hashBase64 = kdfRes.toString('base64');
        } else if (typeof scrypt.hash === 'function') {
            const kdfRes = await scrypt.hash(Buffer.from(ADMIN_PASS), { logN: 15, r: 8, p: 1 });
            hashBase64 = kdfRes.toString('base64');
        } else {
            throw new Error("Could not find hash or kdf function in scrypt-kdf library");
        }

        // 2. Ensure base 'auth_identity' exists
        console.log("🛠️  Ensuring auth_identity exists...");
        const authId = 'authid_admin_production_v2';
        const authCheck = await client.query("SELECT id FROM auth_identity WHERE id = $1", [authId]);

        if (authCheck.rows.length === 0) {
            console.log("   Creating auth_identity entry...");
            await client.query("INSERT INTO auth_identity (id) VALUES ($1)", [authId]);
        }

        // 3. Upsert into 'provider_identity' (Where real credentials live)
        console.log("🛠️  Updating provider_identity...");
        const providerId = 'prov_admin_production_v2';
        const providerMetadata = JSON.stringify({ password: hashBase64 });

        // Use entity_id (email) to check for existence
        const provCheck = await client.query("SELECT id FROM provider_identity WHERE entity_id = $1 AND provider = 'emailpass'", [ADMIN_EMAIL]);

        if (provCheck.rows.length === 0) {
            console.log("   Creating new provider_identity...");
            await client.query(
                "INSERT INTO provider_identity (id, entity_id, provider, auth_identity_id, provider_metadata) VALUES ($1, $2, $3, $4, $5)",
                [providerId, ADMIN_EMAIL, 'emailpass', authId, providerMetadata]
            );
        } else {
            console.log("   Updating existing provider_identity hash...");
            await client.query(
                "UPDATE provider_identity SET provider_metadata = $1, auth_identity_id = $2 WHERE entity_id = $3 AND provider = 'emailpass'",
                [providerMetadata, authId, ADMIN_EMAIL]
            );
        }

        // 4. Ensure Region (Critical for Carts)
        console.log("🛠️  Checking Regions...");
        const regionCheck = await client.query("SELECT id FROM region LIMIT 1");
        if (regionCheck.rows.length === 0) {
            const regionId = 'reg_sudan_production';
            await client.query("INSERT INTO region (id, name, currency_code) VALUES ($1, $2, $3)", [regionId, 'Sudan', 'sdg']);
            console.log(`   ✅ Created Region: ${regionId}`);
        } else {
            console.log(`   ✅ Found ${regionCheck.rows.length} existing regions.`);
        }

        // 5. Ensure Admin User record exists
        console.log("🛠️  Ensuring 'user' record exists...");
        const userCheck = await client.query("SELECT id FROM \"user\" WHERE email = $1", [ADMIN_EMAIL]);
        if (userCheck.rows.length === 0) {
            await client.query("INSERT INTO \"user\" (id, email, first_name, last_name) VALUES ($1, $2, $3, $4)", ['user_admin_v2', ADMIN_EMAIL, 'Admin', 'Ola']);
            console.log("   ✅ Created user record.");
        }

        console.log("\n✨ VPS Repair Success! Now please run: pm2 restart medusa-backend");

    } catch (e) {
        console.error("❌ Repair Failed:", e.message);
        console.log("Trace:", e.stack);
    } finally {
        await client.end();
    }
}

repair();
