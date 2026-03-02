const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const dbUrl = process.env.DATABASE_URL;

async function checkApiKey() {
    const client = new Client({ connectionString: dbUrl });
    await client.connect();
    try {
        const res = await client.query("SELECT id, title FROM api_key WHERE type = 'publishable' LIMIT 1");
        console.log("\n--- Publishable API Keys ---");
        console.table(res.rows);
    } catch (e) {
        console.error("Error fetching keys:", e.message);
    } finally {
        await client.end();
    }
}

checkApiKey();
