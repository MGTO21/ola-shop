const axios = require('axios');

const BASE_URL = 'https://www.ola-shop.com';
const ADMIN_EMAIL = 'admin@ola-shop.com';
const ADMIN_PASS = 'Abc996050@';

async function runTests() {
    console.log("🚀 Starting Comprehensive VPS Health Check...\n");

    // 1. WhatsApp Login Test
    try {
        console.log("🧪 Testing WhatsApp Login...");
        const res = await axios.post(`${BASE_URL}/api/whatsapp-login`, {
            phone: "+249912345678", // A test number
            password: "any"
        }, { validateStatus: false });
        console.log(`   Result: Status ${res.status}`);
        if (res.status === 404) console.error("   ❌ ERROR: Nginx still routing to 404!");
    } catch (e) { console.error("   ❌ WhatsApp Login Failed:", e.message); }

    // 2. Admin Auth Internal Check
    try {
        console.log("\n🧪 Testing Medusa Backend Admin Auth (v2)...");
        const res = await axios.post(`http://127.0.0.1:9000/auth/user/emailpass`, {
            email: ADMIN_EMAIL,
            password: ADMIN_PASS
        }, { validateStatus: false });
        console.log(`   Result: Status ${res.status}`);
        if (res.status === 200) {
            console.log("   ✅ ADMIN AUTH SUCCESSFUL!");
            console.log("   Token starts with:", res.data.token?.substring(0, 10));
        }
        else console.error("   ❌ ADMIN AUTH FAILED - Check credentials or backend logs.");
    } catch (e) { console.error("   ❌ Backend Auth Failed:", e.message); }

    // 3. Send-OTP Route Check
    try {
        console.log("\n🧪 Testing Send-OTP API...");
        const res = await axios.post(`${BASE_URL}/api/send-otp`, {
            phone: "+249123456789"
        }, { validateStatus: false });
        console.log(`   Result: Status ${res.status}`);
        if (res.status === 500) console.error("   ❌ ERROR: send-otp is returning 500. Check logs!");
    } catch (e) { console.error("   ❌ Send-OTP Failed:", e.message); }

    // 4. Cart Creation & Product Check
    try {
        const PRODUCTION_REGION_ID = 'reg_01KC1R1XZRG584Y15RKTAR51N5';
        console.log("\n🧪 Testing Cart Creation...");
        const cartRes = await axios.post(`${BASE_URL}/api/cart-proxy`, {
            region_id: PRODUCTION_REGION_ID
        }, { validateStatus: false });
        console.log(`   Result: Status ${cartRes.status}`);

        console.log("\n🧪 Testing Product Fetching...");
        const prodRes = await axios.get(`${BASE_URL}/api/products?region_id=${PRODUCTION_REGION_ID}`, { validateStatus: false });
        console.log(`   Result: Found ${prodRes.data?.products?.length || 0} products.`);
    } catch (e) { console.error("   ❌ Cart/Product Tests Failed:", e.message); }

    console.log("\n🏁 Tests Finished. Check individual results above.");
}

runTests();
