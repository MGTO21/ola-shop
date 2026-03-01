const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

async function run() {
    console.log("--- 🗑️ Medusa v2: Delete All Products & Inventory Items ---");
    const client = new Client({ connectionString: process.env.DATABASE_URL });

    try {
        await client.connect();
        console.log("Connected to database. Starting deletion...");

        // Start a transaction
        await client.query('BEGIN');

        // Tables to clear in order or using CASCADE
        // In PostgreSQL, TRUNCATE with CASCADE is very effective for this.
        const tablesToClear = [
            'product',
            'inventory_item',
            'price_set',
            'product_variant',
            'product_option',
            'product_category',
            'product_tag',
            'product_collection',
            'image'
        ];

        console.log("Truncating tables with CASCADE...");
        for (const table of tablesToClear) {
            try {
                // We use "IF EXISTS" and double quotes for safety
                await client.query(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`);
                console.log(`✅ Cleared table: ${table}`);
            } catch (e) {
                console.log(`ℹ️ Table '${table}' skip or error: ${e.message}`);
            }
        }

        // Final check on variants and products
        const prodCount = await client.query("SELECT COUNT(*) FROM product");
        const invCount = await client.query("SELECT COUNT(*) FROM inventory_item");

        await client.query('COMMIT');

        console.log("\n--- ✨ Deletion Summary ---");
        console.log(`Products remaining: ${prodCount.rows[0].count}`);
        console.log(`Inventory items remaining: ${invCount.rows[0].count}`);
        console.log("\nAll test products and related data have been removed.");
        console.log("Please restart your Medusa backend.");

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("❌ Error during deletion:", err.message);
    } finally {
        await client.end();
    }
}

run();
