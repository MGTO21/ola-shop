const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

async function inspect() {
    console.log("--- Medusa v2 Inventory & Location Diagnostic ---");
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    const tables = [
        'inventory_item',
        'stock_location',
        'inventory_level',
        'product_variant_inventory_item',
        'sales_channel_stock_location',
        'fulfillment_set',
        'service_zone',
        'shipping_option',
        'sales_channel'
    ];

    for (const table of tables) {
        console.log(`\n[Table: ${table}]`);
        try {
            const countRes = await client.query(`SELECT COUNT(*) FROM "${table}"`);
            console.log(`Count: ${countRes.rows[0].count}`);

            const schemaRes = await client.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = $1
                ORDER BY ordinal_position;
            `, [table]);

            if (schemaRes.rows.length > 0) {
                const dataRes = await client.query(`SELECT * FROM "${table}" LIMIT 3`);
                console.log("Sample Data:");
                console.table(dataRes.rows);
            }
        } catch (e) {
            console.log(`⚠️ Error or Table '${table}' does not exist: ${e.message}`);
        }
    }

    // Specific check for the error: "Item X is not stocked at location undefined"
    // This often means there's no inventory level for the item, or no location linked to the sales channel.
    console.log("\n--- Specific Checks ---");

    try {
        console.log("\nChecking for items without inventory levels:");
        const res = await client.query(`
            SELECT pvii.variant_id, pvii.inventory_item_id
            FROM product_variant_inventory_item pvii
            LEFT JOIN inventory_level il ON pvii.inventory_item_id = il.inventory_item_id
            WHERE il.id IS NULL;
        `);
        console.table(res.rows);
    } catch (e) { console.log(e.message); }

    try {
        console.log("\nChecking for Sales Channels without Stock Locations:");
        const res = await client.query(`
            SELECT sc.id, sc.name, scsl.stock_location_id
            FROM sales_channel sc
            LEFT JOIN sales_channel_stock_location scsl ON sc.id = scsl.sales_channel_id
            WHERE scsl.stock_location_id IS NULL;
        `);
        console.table(res.rows);
    } catch (e) { console.log(e.message); }

    await client.end();
}

inspect().catch(err => console.error(err));
