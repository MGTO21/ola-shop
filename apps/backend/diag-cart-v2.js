const fetch = require('node-fetch');

const BACKEND_URL = 'http://localhost:9000';
const PUBLISHABLE_KEY = 'apk_01KC1N6KBJBZ9WV15XWTM77NQ6';
const REGION_ID = 'reg_01KC1R1XZRG584Y15RKTAR51N5';

async function testCreateCart() {
    console.log("--- 🛒 Medusa v2: Cart Creation Diagnostic ---");

    // 1. Get a valid variant ID first
    console.log("Fetching a valid variant...");
    const prodRes = await fetch(`${BACKEND_URL}/store/products?limit=1`, {
        headers: { 'x-publishable-api-key': PUBLISHABLE_KEY }
    });
    const prodData = await prodRes.json();

    if (!prodData.products || prodData.products.length === 0) {
        console.error("❌ No products found in database! Please add a product in Admin first.");
        return;
    }

    const variantId = prodData.products[0].variants[0].id;
    console.log(`Using Variant ID: ${variantId}`);

    // 2. Attempt to create cart
    console.log("\nAttempting to create cart via POST /store/carts...");
    const cartBody = {
        region_id: REGION_ID,
        items: [{ variant_id: variantId, quantity: 1 }]
    };

    console.log("Request Body:", JSON.stringify(cartBody, null, 2));

    try {
        const res = await fetch(`${BACKEND_URL}/store/carts`, {
            method: 'POST',
            headers: {
                'x-publishable-api-key': PUBLISHABLE_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cartBody)
        });

        const status = res.status;
        const text = await res.text();
        console.log(`\nResponse Status: ${status}`);

        try {
            const data = JSON.parse(text);
            console.log("Response Data:", JSON.stringify(data, null, 2));
            if (res.ok) {
                console.log("\n✅ SUCCESS! Cart created.");
            } else {
                console.log("\n❌ FAILED. Medusa returned an error.");
            }
        } catch (e) {
            console.log("Response (non-JSON):", text);
        }
    } catch (err) {
        console.error("\n❌ Network Error:", err.message);
    }
}

testCreateCart();
