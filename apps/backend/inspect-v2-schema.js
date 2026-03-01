const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

async function inspect() {
    console.log("--- Medusa v2 Schema Inspection ---");
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    // Tables we are interested in
    const tables = [
        'api_key',
        'region',
        'sales_channel',
        'publishable_api_key_sales_channel',
        'store',
        'sales_channel_region'
    ];

    for (const table of tables) {
        console.log(`\n[Table: ${table}]`);
        try {
            const res = await client.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = $1
                ORDER BY ordinal_position;
            `, [table]);

            if (res.rows.length === 0) {
                console.log(`❌ Table '${table}' does not exist.`);
                continue;
            }

            // Print columns in a readable format
            res.rows.forEach(col => {
                console.log(`- ${col.column_name} (${col.data_type})`);
            });
        } catch (e) {
            console.log(`⚠️ Error inspecting ${table}: ${e.message}`);
        }
    }

    await client.end();
}

inspect().catch(err => console.error(err));
