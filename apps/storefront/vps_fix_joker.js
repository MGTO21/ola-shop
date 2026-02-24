const fs = require('fs');
const BACKEND_URL = "http://localhost:9000";

// Get Cookie
function getEnv(key) {
    const paths = ['.env.local', 'ola-shop-v2/apps/storefront/.env.local'];
    for (const p of paths) {
        if (fs.existsSync(p)) {
            const content = fs.readFileSync(p, 'utf8');
            const match = content.match(new RegExp(`^${key}="(.*)"$`, 'm')) || content.match(new RegExp(`^${key}=(.*)$`, 'm'));
            if (match) return match[1].trim();
        }
    }
    return null;
}
const COOKIE = getEnv("MEDUSA_ADMIN_COOKIE");
if (!COOKIE) { console.log("❌ No Cookie"); process.exit(1); }

async function run() {
    const headers = { "Cookie": COOKIE, "Content-Type": "application/json" };
    const TARGET_ID = "cus_01KF868HF6CQCCCFT0HTXETBM4"; // FROM SCREENSHOT

    console.log(`🔍 Targeting Customer: ${TARGET_ID}`);

    // Update Metadata
    const u = await fetch(`${BACKEND_URL}/admin/customers/${TARGET_ID}`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            metadata: {
                whatsapp_verified: false,
                manual_verification_status: "pending",
                whatsapp_phone: "+249907490423"
            }
        })
    });

    if(u.ok) console.log("✅ Metadata Updated Successfully!");
    else {
        console.log("❌ Update Failed: " + u.status);
        const txt = await u.text();
        console.log("Response: ", txt);
    }
}
run();
