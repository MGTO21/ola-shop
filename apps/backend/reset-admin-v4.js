const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const dbConfig = {
    connectionString: process.env.DATABASE_URL || "postgres://postgres:Abc996050@127.0.0.1:5432/medusa_db"
};

async function resetAdminPassword() {
    const client = new Client(dbConfig);
    const email = "admin@ola-shop.com";
    const password = "Abc996050@";

    try {
        console.log("🔄 Connecting directly to PostgreSQL...");
        await client.connect();

        console.log(`🔄 Hashing new password for ${email}...`);
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // In Medusa v2, credentials for emailpass are in provider_identity
        // The password hash is stored inside provider_metadata JSONB
        console.log(`🔄 Updating provider_metadata in 'provider_identity' table...`);

        const metadata = JSON.stringify({ password: password_hash });

        const res = await client.query(
            "UPDATE provider_identity SET provider_metadata = $1 WHERE entity_id = $2 AND provider = 'emailpass'",
            [metadata, email]
        );

        if (res.rowCount > 0) {
            console.log(`✅ Success: Admin password updated in the database!`);
            console.log("💡 You can now try to login or send OTP.");
        } else {
            console.log(`❌ Error: Admin user ${email} not found in provider_identity.`);

            // Check if there's any admin at all
            const check = await client.query("SELECT entity_id FROM provider_identity WHERE provider = 'emailpass'");
            console.log("Available accounts:", check.rows.map(r => r.entity_id));
        }

    } catch (err) {
        console.error("❌ Critical Error:", err.message);
    } finally {
        await client.end();
    }
}

resetAdminPassword();
