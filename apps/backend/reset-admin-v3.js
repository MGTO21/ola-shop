const { Client } = require('pg');
const bcrypt = require('bcryptjs');

// Database configuration
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

        console.log(`🔄 Generating new hash for ${email}...`);
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // In Medusa v2, the user table is typically "user"
        console.log(`🔄 Updating password_hash in 'user' table...`);

        const res = await client.query(
            'UPDATE "user" SET password_hash = $1 WHERE email = $2',
            [password_hash, email]
        );

        if (res.rowCount > 0) {
            console.log(`✅ Success: Password updated for ${email}. Row count: ${res.rowCount}`);
        } else {
            console.log(`❌ Error: User ${email} not found in the 'user' table.`);
            console.log("🔄 Checking for other possible table names...");

            // Fallback for some v2 configurations where it might be prefixed
            const res2 = await client.query(
                "SELECT tablename FROM pg_catalog.pg_tables WHERE tablename LIKE '%user%'"
            );
            console.log("Available user-related tables:", res2.rows.map(r => r.tablename).join(", "));
        }

    } catch (err) {
        console.error("❌ Critical Error:", err.message);
    } finally {
        await client.end();
    }
}

resetAdminPassword();
