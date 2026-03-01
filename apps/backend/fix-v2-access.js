const { Client } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

/**
 * FINAL FIX FOR MEDUSA V2 PRICE 0 & DATA LINKAGE
 * 
 * This script repairs the mapping between API Keys, Sales Channels, and Regions.
 */

const dbUrl = process.env.DATABASE_URL;

async function run() {
    const client = new Client({
        connectionString: dbUrl,
    });

    try {
        await client.connect();
        console.log("--- ⛓️ Medusa v2 Data Linkage Fix (Revised) ---");

        // 1. Get the Storefront API Key
        // Based on inspection, table is 'api_key', we look for title 'Storefront'
        const apiRes = await client.query("SELECT id, title FROM api_key WHERE title = 'Storefront' OR title LIKE '%Store%' LIMIT 1;");
        if (apiRes.rows.length === 0) {
            console.error("❌ No Storefront API Key found!");
            return;
        }
        const apiKeyId = apiRes.rows[0].id;
        console.log(`Found API Key: ${apiRes.rows[0].title} (${apiKeyId})`);

        // 2. Get the Default Sales Channel
        const scRes = await client.query("SELECT id, name FROM sales_channel LIMIT 1;");
        if (scRes.rows.length === 0) {
            console.error("❌ No Sales Channel found!");
            return;
        }
        const salesChannelId = scRes.rows[0].id;
        console.log(`Using Sales Channel: ${scRes.rows[0].name} (${salesChannelId})`);

        // 3. Link API Key to Sales Channel
        // Link table: publishable_api_key_sales_channel (matches inspection)
        try {
            await client.query(`
                INSERT INTO publishable_api_key_sales_channel (publishable_key_id, sales_channel_id, id)
                VALUES ($1, $2, $3)
                ON CONFLICT (publishable_key_id, sales_channel_id) DO NOTHING;
            `, [apiKeyId, salesChannelId, `pksc_${Date.now()}`]);
            console.log(`✅ Linked API Key to Sales Channel.`);
        } catch (e) {
            // If ON CONFLICT fails due to no unique constraint on those two, try simple insert
            try {
                await client.query(`
                    INSERT INTO publishable_api_key_sales_channel (publishable_key_id, sales_channel_id, id)
                    VALUES ($1, $2, $3);
                `, [apiKeyId, salesChannelId, `pksc_${Date.now()}`]);
                console.log(`✅ Linked API Key to Sales Channel (Direct).`);
            } catch (e2) {
                console.log(`ℹ️ Link might already exist or error: ${e2.message}`);
            }
        }

        // 4. Set Default Region and Sales Channel in Store
        const regionRes = await client.query("SELECT id FROM region LIMIT 1;");
        if (regionRes.rows.length > 0) {
            const regionId = regionRes.rows[0].id;
            await client.query(`
                UPDATE store 
                SET default_region_id = $1, default_sales_channel_id = $2 
                WHERE id = (SELECT id FROM store LIMIT 1);
            `, [regionId, salesChannelId]);
            console.log(`✅ Updated Store with default Region (${regionId}) and Sales Channel.`);
        }

        console.log("\n--- ✨ Fix Complete! ---");
        console.log("Please restart your Medusa backend.");

    } catch (err) {
        console.error("❌ Error during fix:", err.message);
    } finally {
        await client.end();
    }
}

run();
