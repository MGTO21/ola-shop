const cartId = "cart_01KJA0YYG6JC9F37KSYZS46QFC";
const BACKEND_URL = "http://127.0.0.1:9000";
const PUBLISHABLE_KEY = "pk_3b9ce0ab55a6f2cfa25747f441ddfdbdea53c45ab496005d3b8a0ff6a5bd693f";

async function checkShipping() {
    console.log(`Checking Cart: ${cartId}`);
    try {
        // 1. Get Cart
        const cartRes = await fetch(`${BACKEND_URL}/store/carts/${cartId}`, {
            headers: { 'x-publishable-api-key': PUBLISHABLE_KEY }
        });
        const cartData = await cartRes.json();
        console.log("Cart Status:", cartRes.status);
        console.log("Region ID:", cartData.cart?.region_id);
        console.log("Shipping Address:", cartData.cart?.shipping_address?.city);

        // 2. Get Shipping Options
        const optRes = await fetch(`${BACKEND_URL}/store/shipping-options?cart_id=${cartId}`, {
            headers: { 'x-publishable-api-key': PUBLISHABLE_KEY }
        });
        const optData = await optRes.json();
        console.log("Available Shipping Options:", JSON.stringify(optData.shipping_options, null, 2));

        if (optData.shipping_options?.length === 0) {
            console.error("CRITICAL: No shipping options available for this cart/region!");
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
}

checkShipping();
