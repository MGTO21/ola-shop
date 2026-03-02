const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function run() {
    console.log("--- 👁️ Medusa v2: Product Visibility Fix ---");
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    try {
        // 1. Get Default Sales Channel
        const scRes = await client.query("SELECT id, name FROM sales_channel LIMIT 1");
        if (scRes.rows.length === 0) {
            console.error("❌ No Sales Channel found!");
            return;
        }
        const scId = scRes.rows[0].id;
        console.log(`Using Sales Channel: ${scRes.rows[0].name} (${scId})`);

        // 2. Get All Products
        const prodRes = await client.query("SELECT id, title, status FROM product");
        console.log(`Found ${prodRes.rows.length} products.`);

        for (const product of prodRes.rows) {
            console.log(`Processing product: ${product.title} (${product.id})`);

            // Ensure status is published
            if (product.status !== 'published') {
                await client.query("UPDATE product SET status = 'published' WHERE id = $1", [product.id]);
                console.log(`  ✅ Set status to 'published'.`);
            }

            // Link to Sales Channel
            // In Medusa v2, the table is usually product_sales_channel
            try {
                await client.query(`
                    INSERT INTO product_sales_channel (product_id, sales_channel_id)
                    VALUES ($1, $2)
                    ON CONFLICT DO NOTHING
                `, [product.id, scId]);
                console.log(`  ✅ Linked to Sales Channel.`);
            } catch (e) {
                // Try alternate table name if first fails
                try {
                    await client.query(`
                        INSERT INTO sales_channel_product (product_id, sales_channel_id)
                        VALUES ($1, $2)
                        ON CONFLICT DO NOTHING
                    `, [product.id, scId]);
                    console.log(`  ✅ Linked to Sales Channel (alternate table).`);
                } catch (e2) {
                    console.log(`  ℹ️ Could not link to sales channel: ${e2.message}`);
                }
            }
        }

        console.log("\n--- ✨ Visibility Fix Complete ---");
        console.log("Please restart your Medusa backend.");

    } catch (err) {
        console.error("❌ Error:", err.message);
    } finally {
        await client.end();
    }
}

run();
