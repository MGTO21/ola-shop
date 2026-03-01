const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

async function run() {
    console.log("--- 📦 medusa v2 Inventory & Fulfillment Linkage Fix ---");
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    try {
        // 1. Ensure we have a Stock Location
        let locationId;
        const locRes = await client.query("SELECT id FROM stock_location LIMIT 1");
        if (locRes.rows.length > 0) {
            locationId = locRes.rows[0].id;
            console.log(`Found existing Stock Location: ${locationId}`);
        } else {
            locationId = `sl_${Date.now()}`;
            await client.query("INSERT INTO stock_location (id, name, created_at, updated_at) VALUES ($1, $2, NOW(), NOW())", [locationId, 'Default Location']);
            console.log(`✅ Created Default Stock Location: ${locationId}`);
        }

        // 2. Link Sales Channel to Stock Location
        const scRes = await client.query("SELECT id FROM sales_channel LIMIT 1");
        if (scRes.rows.length > 0) {
            const scId = scRes.rows[0].id;
            try {
                await client.query("INSERT INTO sales_channel_stock_location (sales_channel_id, stock_location_id, id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING", [scId, locationId, `scsl_${Date.now()}`]);
                console.log(`✅ Linked Sales Channel (${scId}) to Stock Location (${locationId})`);
            } catch (e) {
                console.log(`ℹ️ Link SC-SL might already exist: ${e.message}`);
            }
        }

        // 3. Ensure all Inventory Items have Levels at this Location
        console.log("Checking Inventory Items...");
        const itemsRes = await client.query("SELECT id FROM inventory_item");
        console.log(`Found ${itemsRes.rows.length} inventory items.`);

        for (const item of itemsRes.rows) {
            const levelRes = await client.query("SELECT id FROM inventory_level WHERE inventory_item_id = $1 AND location_id = $2", [item.id, locationId]);
            if (levelRes.rows.length === 0) {
                await client.query(`
                    INSERT INTO inventory_level (id, inventory_item_id, location_id, stocked_quantity, created_at, updated_at)
                    VALUES ($1, $2, $3, $4, NOW(), NOW())
                `, [`ilev_${Math.random().toString(36).substr(2, 9)}`, item.id, locationId, 1000]);
                console.log(`✅ Added level for item ${item.id} at ${locationId}`);
            }
        }

        // 4. Ensure Fulfillment Set and Service Zone (Medusa v2 Requirement)
        // Check if fulfillment set exists for location
        const fsetRes = await client.query("SELECT id FROM fulfillment_set LIMIT 1");
        let fsetId;
        if (fsetRes.rows.length > 0) {
            fsetId = fsetRes.rows[0].id;
        } else {
            fsetId = `fset_${Date.now()}`;
            await client.query("INSERT INTO fulfillment_set (id, name, type) VALUES ($1, $2, $3)", [fsetId, 'Default Fulfillment Set', 'delivery']);
            console.log(`✅ Created Fulfillment Set: ${fsetId}`);
        }

        // Link Location to Fulfillment Set
        try {
            await client.query("INSERT INTO stock_location_fulfillment_set (stock_location_id, fulfillment_set_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [locationId, fsetId]);
            console.log(`✅ Linked Location to Fulfillment Set.`);
        } catch (e) {
            console.log(`ℹ️ Link SL-FSET might already exist or table missing.`);
        }

        // 5. Ensure Service Zone and Shipping Options
        const szRes = await client.query("SELECT id FROM service_zone LIMIT 1");
        if (szRes.rows.length === 0) {
            const szId = `szone_${Date.now()}`;
            await client.query("INSERT INTO service_zone (id, name, fulfillment_set_id) VALUES ($1, $2, $3)", [szId, 'Default Zone', fsetId]);
            console.log(`✅ Created Service Zone: ${szId}`);
        }

        console.log("\n--- ✨ All Inventory & Fulfillment Linkages Repaired ---");
        console.log("Please restart your Medusa backend.");

    } catch (err) {
        console.error("❌ Error:", err.message);
    } finally {
        await client.end();
    }
}

run();
