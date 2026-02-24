const { Client } = require('pg');

const dbConfig = {
    connectionString: process.env.DATABASE_URL || "postgres://postgres:Abc996050@127.0.0.1:5432/medusa_db"
};

async function findPasswordColumn() {
    const client = new Client(dbConfig);
    try {
        await client.connect();
        console.log("🔍 Searching for password-related columns...");

        const res = await client.query(`
            SELECT table_name, column_name 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND (column_name LIKE '%pass%' OR column_name LIKE '%hash%')
        `);

        if (res.rows.length === 0) {
            console.log("❌ No password or hash columns found in the 'public' schema.");
        } else {
            console.log("✅ Found results:");
            console.table(res.rows);
        }

        // Also check provider_identity schema specifically
        console.log("\n--- Checking provider_identity in detail ---");
        const res2 = await client.query(
            "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'provider_identity'"
        );
        console.table(res2.rows);

    } catch (err) {
        console.error("❌ Error:", err.message);
    } finally {
        await client.end();
    }
}

findPasswordColumn();
