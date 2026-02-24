const { Client } = require('pg');
const { Scrypt } = require('@medusajs/utils');

const dbConfig = {
    connectionString: process.env.DATABASE_URL || "postgres://postgres:Abc996050@127.0.0.1:5432/medusa_db"
};

async function resetAdminPasswordV5() {
    const client = new Client(dbConfig);
    const email = "admin@ola-shop.com";
    const password = "Abc996050@";
    const hasher = new Scrypt();

    try {
        console.log("🔄 Connecting to PostgreSQL...");
        await client.connect();

        console.log(`🔄 Hashing password for ${email} using Scrypt (Medusa v2 style)...`);
        const password_hash = await hasher.hash(password);

        console.log(`🔄 Updating provider_identity...`);
        const metadata = JSON.stringify({ password: password_hash });

        const res = await client.query(
            "UPDATE provider_identity SET provider_metadata = $1 WHERE entity_id = $2 AND provider = 'emailpass'",
            [metadata, email]
        );

        if (res.rowCount > 0) {
            console.log(`✅ SUCCESS: Admin password updated to match Medusa v2 requirements!`);
        } else {
            console.log(`❌ ERROR: Could not find user ${email} in provider_identity.`);
        }

    } catch (err) {
        console.error("❌ Critical Error:", err.message);
        if (err.message.includes('module not found')) {
            console.log("💡 Tip: Try running 'npm install' in the backend folder.");
        }
    } finally {
        await client.end();
    }
}

resetAdminPasswordV5();
