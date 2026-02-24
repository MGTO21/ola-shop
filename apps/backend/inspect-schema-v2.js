const { Client } = require('pg');

const dbConfig = {
    connectionString: process.env.DATABASE_URL || "postgres://postgres:Abc996050@127.0.0.1:5432/medusa_db"
};

async function listAllTables() {
    const client = new Client(dbConfig);
    try {
        await client.connect();
        console.log("--- All Tables ---");
        const res = await client.query(
            "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'"
        );
        const tables = res.rows.map(r => r.tablename);
        console.log(tables);

        const interesting = tables.filter(t => t.includes('auth') || t.includes('emailpass') || t.includes('credential'));
        console.log("\n--- Interesting Tables for Auth ---");
        console.log(interesting);

        for (const table of interesting) {
            console.log(`\n--- Schema for ${table} ---`);
            const cols = await client.query(
                "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1",
                [table]
            );
            console.log(cols.rows);
        }
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

listAllTables();
