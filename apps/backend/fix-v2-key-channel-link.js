const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function run() {
    console.log("--- 🔑 Medusa v2: API Key & Sales Channel Linkage Fix ---");
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    try {
        // 1. Get the Storefront API Key
        const apiRes = await client.query("SELECT id, title FROM api_key WHERE type = 'publishable' OR title LIKE '%Store%' LIMIT 1");
        if (apiRes.rows.length === 0) {
            console.error("❌ No Publishable API Key found!");
            return;
        }
        const apiKeyId = apiRes.rows[0].id;
        console.log(`Found API Key: ${apiRes.rows[0].title} (${apiKeyId})`);

        // 2. Get the Default Sales Channel
        const scRes = await client.query("SELECT id, name FROM sales_channel LIMIT 1");
        if (scRes.rows.length === 0) {
            console.error("❌ No Sales Channel found!");
            return;
        }
        const scId = scRes.rows[0].id;
        console.log(`Using Sales Channel: ${scRes.rows[0].name} (${scId})`);

        // 3. Check and Link
        const linkRes = await client.query("SELECT * FROM publishable_api_key_sales_channel WHERE publishable_key_id = $1 AND sales_channel_id = $2", [apiKeyId, scId]);

        if (linkRes.rows.length === 0) {
            const linkId = `pksc_${Math.random().toString(36).substr(2, 9)}`;
            await client.query(`
                INSERT INTO publishable_api_key_sales_channel (id, publishable_key_id, sales_channel_id)
                VALUES ($1, $2, $3)
            `, [linkId, apiKeyId, scId]);
            console.log(`✅ Linked API Key to Sales Channel.`);
        } else {
            console.log(`ℹ️ Link already exists.`);
        }

        // 4. Final verification: Check if product is in that channel
        const prodLinkRes = await client.query("SELECT * FROM product_sales_channel WHERE sales_channel_id = $1", [scId]);
        console.log(`Products in this channel: ${prodLinkRes.rows.length}`);

        console.log("\n--- ✨ Linkage Repair Complete ---");
        console.log("Please restart your Medusa backend.");

    } catch (err) {
        console.error("❌ Error:", err.message);
    } finally {
        await client.end();
    }
}

run();
