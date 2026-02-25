const cartId = "cart_01KJA0YYG6JC9F37KSYZS46QFC";
const BACKEND_URL = "http://127.0.0.1:9000";
const PUBLISHABLE_KEY = "pk_3b9ce0ab55a6f2cfa25747f441ddfdbdea53c45ab496005d3b8a0ff6a5bd693f";

async function diag() {
    console.log(`Checking Cart: ${cartId}`);

    // Check Cart
    const cartRes = await fetch(`${BACKEND_URL}/store/carts/${cartId}`, {
        headers: { 'x-publishable-api-key': PUBLISHABLE_KEY }
    });
    console.log(`Cart Status: ${cartRes.status}`);
    const cartData = await cartRes.json();
    console.log("Cart Region:", cartData.cart?.region_id);

    // Check Shipping Options
    const optRes = await fetch(`${BACKEND_URL}/store/shipping-options?cart_id=${cartId}`, {
        headers: { 'x-publishable-api-key': PUBLISHABLE_KEY }
    });
    console.log(`Options Status: ${optRes.status}`);
    const optData = await optRes.json();
    console.log("Available Options:", JSON.stringify(optData.shipping_options, null, 2));
}

diag();
