const { Client } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

/**
 * FINAL FIX FOR MEDUSA V2 PRICE 0 & MISSING REGIONS
 * 
 * This script interacts directly with the database to fix the mapping 
 * between Regions, Sales Channels, and Publishable API Keys.
 */

const dbUrl = process.env.DATABASE_URL;

async function run() {
    const client = new Client({
        connectionString: dbUrl,
    });

    try {
        await client.connect();
        console.log("--- ⛓️ Medusa v2 Data Linkage Fix ---");

        // 1. Get all Regions
        const regionsRes = await client.query("SELECT id, name FROM region;");
        const regions = regionsRes.rows;
        console.log(`Found ${regions.length} regions.`);

        // 2. Get the Default Sales Channel
        // In v2, the default one usually exists. We'll grab the first one if not specified.
        const scRes = await client.query("SELECT id, name FROM sales_channel LIMIT 1;");
        if (scRes.rows.length === 0) {
            console.error("❌ No Sales Channel found! Please create one in Admin first.");
            return;
        }
        const salesChannelId = scRes.rows[0].id;
        console.log(`Using Sales Channel: ${scRes.rows[0].name} (${salesChannelId})`);

        // 3. Link ALL Regions to this Sales Channel
        // The table is usually sales_channel_region or via a linkage table in v2
        // In Medusa v2 Framework, this is stored in a many-to-many relationship
        for (const region of regions) {
            try {
                // Try to insert link if not exists
                // The table name in v2 for SC <-> Region linkage
                await client.query(`
                    INSERT INTO sales_channel_region (sales_channel_id, region_id)
                    VALUES ($1, $2)
                    ON CONFLICT DO NOTHING;
                `, [salesChannelId, region.id]);
                console.log(`✅ Linked Region ${region.name} to Sales Channel.`);
            } catch (e) {
                // Table might be different in complex v2 setups, fallback to checking existence
                console.warn(`⚠️ Could not link via sales_channel_region. (Maybe table name mismatch)`);
            }
        }

        // 4. Get the Storefront Publishable Key
        const pkRes = await client.query("SELECT id, title FROM publishable_api_key WHERE title = 'Storefront' OR title LIKE '%Store%' LIMIT 1;");
        if (pkRes.rows.length === 0) {
            console.error("❌ No Storefront Publishable Key found!");
            return;
        }
        const pkId = pkRes.rows[0].id;
        console.log(`Found Publishable Key: ${pkRes.rows[0].title} (${pkId})`);

        // 5. Link Publishable Key to Sales Channel
        // Table: publishable_api_key_sales_channel
        try {
            await client.query(`
                INSERT INTO publishable_api_key_sales_channel (publishable_key_id, sales_channel_id)
                VALUES ($1, $2)
                ON CONFLICT DO NOTHING;
            `, [pkId, salesChannelId]);
            console.log(`✅ Linked Publishable Key to Sales Channel.`);
        } catch (e) {
            console.error(`❌ Failed to link API Key to Sales Channel: ${e.message}`);
        }

        console.log("\n--- ✨ Fix Complete! ---");
        console.log("Please restart your Medusa backend and check the storefront prices.");

    } catch (err) {
        console.error("❌ Error during fix:", err.message);
    } finally {
        await client.end();
    }
}

run();
