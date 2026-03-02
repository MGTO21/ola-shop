const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

async function checkRegions() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    try {
        const res = await client.query("SELECT id, name, currency_code FROM region");
        console.log("--- Regions in Database ---");
        console.table(res.rows);
    } catch (e) {
        console.error("Error fetching regions:", e.message);
    } finally {
        await client.end();
    }
}

checkRegions();
