const { Client } = require('pg');

const dbConfig = {
    connectionString: process.env.DATABASE_URL || "postgres://postgres:Abc996050@127.0.0.1:5432/medusa_db"
};

async function listAllTables() {
    const client = new Client(dbConfig);
    try {
        await client.connect();
        console.log("--- ALL TABLES (FULL LIST) ---");
        const res = await client.query(
            "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public' ORDER BY tablename ASC"
        );
        const tables = res.rows.map(r => r.tablename);
        console.log(JSON.stringify(tables, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

listAllTables();
