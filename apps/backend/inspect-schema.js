const { Client } = require('pg');

const dbConfig = {
    connectionString: process.env.DATABASE_URL || "postgres://postgres:Abc996050@127.0.0.1:5432/medusa_db"
};

async function inspectSchema() {
    const client = new Client(dbConfig);
    try {
        await client.connect();
        console.log("--- Tables ---");
        const res = await client.query(
            "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public' AND (tablename LIKE '%user%' OR tablename LIKE '%auth%')"
        );
        console.log(res.rows.map(r => r.tablename));

        for (const table of res.rows.map(r => r.tablename)) {
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

inspectSchema();
