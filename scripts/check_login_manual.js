async function test() {
    const url = 'http://localhost:9000/admin/auth'; // Endpoint is /admin/auth or /auth/user/emailpass?
    // Storefront admin-auth.ts uses: ${BACKEND_URL}/auth/user/emailpass
    // Wait, admin-auth.ts line 17 says: ${BACKEND_URL}/auth/user/emailpass
    // But my curl test used: /admin/auth
    // Medusa v2 Auth Module usually mounts at /auth/...
    // I will test BOTH to be sure which one is valid for this user.

    const endpoints = [
        'http://localhost:9000/admin/auth',
        'http://localhost:9000/auth/user/emailpass'
    ];

    const creds = {
        email: 'admin@ola-shop.com',
        password: 'Abc996050@'
    };

    for (const ep of endpoints) {
        console.log(`\n--- Testing ${ep} ---`);
        try {
            const res = await fetch(ep, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(creds)
            });
            console.log("Status:", res.status);
            const text = await res.text();
            console.log("Response:", text.substring(0, 200));
        } catch (e) {
            console.error("Fetch Error:", e.message);
        }
    }
}
test();
