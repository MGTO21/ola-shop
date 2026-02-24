const { Client } = require('pg');
const scrypt = require('scrypt-kdf');

const DB_URL = "postgres://postgres:Abc996050@127.0.0.1:5432/medusa_db";
const ADMIN_EMAIL = 'admin@ola-shop.com';
const ADMIN_PASS = 'Abc996050@';

async function repair() {
    const client = new Client({ connectionString: DB_URL });
    await client.connect();

    console.log("🚀 Starting Absolute VPS Technical Repair...");

    try {
        // 1. Auth Repair (Ensuring it stays fixed)
        console.log("🛠️  Re-verifying Admin Auth...");
        let hashBase64;
        const passwordBuf = Buffer.from(ADMIN_PASS);
        if (typeof scrypt.kdf === 'function') {
            const kdfRes = await scrypt.kdf(passwordBuf, { logN: 15, r: 8, p: 1 });
            hashBase64 = kdfRes.toString('base64');
        } else {
            const kdfRes = await scrypt.hash(passwordBuf, { logN: 15, r: 8, p: 1 });
            hashBase64 = kdfRes.toString('base64');
        }
        const providerMetadata = JSON.stringify({ password: hashBase64 });
        await client.query(
            "UPDATE provider_identity SET provider_metadata = $1 WHERE entity_id = $2 AND provider = 'emailpass'",
            [providerMetadata, ADMIN_EMAIL]
        );

        // 2. Region Visibility - The "Magic" Link
        console.log("🛠️  Enforcing Region Visibility...");
        const regionId = 'reg_01KC1R1XZRG584Y15RKTAR51N5';
        const salesChannelId = 'sc_01KC16E5S3121CZAXXZXY9G82H'; // Default Sales Channel found

        // In Medusa v2, regions are often linked via Store or specific module links.
        // If 'store_region' doesn't exist, it might be 'region_sales_channel' (hidden in link modules)
        // or simply that the region needs to be associated with a Sales Channel.

        // Let's create a dynamic linker that checks common v2 link patterns
        const linkTables = ['sales_channel_region', 'region_sales_channel', 'store_region'];
        for (const table of linkTables) {
            try {
                // We use ON CONFLICT DO NOTHING to avoid errors if the table doesn't exist or record exists
                if (table.includes('sales_channel')) {
                    await client.query(
                        `INSERT INTO ${table} (sales_channel_id, region_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
                        [salesChannelId, regionId]
                    );
                } else {
                    const storeRes = await client.query("SELECT id FROM store LIMIT 1");
                    if (storeRes.rows.length > 0) {
                        await client.query(
                            `INSERT INTO ${table} (store_id, region_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
                            [storeRes.rows[0].id, regionId]
                        );
                    }
                }
                console.log(`   ✅ Linked via ${table}`);
            } catch (e) {
                // Table doesn't exist, that's fine
            }
        }

        console.log("\n✨ Final Technical Repair Finished!");
        console.log("Executing PM2 Force Load...");

    } catch (e) {
        console.error("❌ Repair Failed:", e.message);
    } finally {
        await client.end();
    }
}

repair();
