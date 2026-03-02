const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function listTables() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    try {
        const res = await client.query(`
            SELECT tablename 
            FROM pg_catalog.pg_tables 
            WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'
            AND (tablename LIKE '%product%' OR tablename LIKE '%sales_channel%')
        `);
        console.log("--- Relevant Tables ---");
        console.table(res.rows);
    } catch (e) {
        console.error("Error:", e.message);
    } finally {
        await client.end();
    }
}

listTables();
