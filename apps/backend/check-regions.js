const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the same directory
dotenv.config({ path: path.join(__dirname, '.env') });

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    console.error("❌ DATABASE_URL not found in .env file!");
    process.exit(1);
}

async function checkRegions() {
    console.log(`Connecting to: ${dbUrl.split('@')[1] || dbUrl}`);
    const client = new Client({ connectionString: dbUrl });
    await client.connect();
    try {
        const res = await client.query("SELECT id, name, currency_code FROM region");
        console.log("\n--- Regions in Database ---");
        console.table(res.rows);
    } catch (e) {
        console.error("Error fetching regions:", e.message);
    } finally {
        await client.end();
    }
}

checkRegions();
