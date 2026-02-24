export async function getAdminToken() {
    // 1. Determine Backend URL - Default to 127.0.0.1 to avoid IPv6 issues
    const BACKEND_URL = process.env.MEDUSA_BACKEND_URL ||
        process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
        'http://127.0.0.1:9000';

    // 2. Get Credentials
    const envEmail = process.env.MEDUSA_ADMIN_EMAIL;
    const envPass = process.env.MEDUSA_ADMIN_PASSWORD;

    let email = envEmail || 'admin@ola-shop.com';
    let password = envPass || 'Abc996050@';

    // Anti-Default Shield: If it's supersecret, it's definitely wrong for production
    if (password === 'supersecret') {
        console.warn('[AdminAuth] WARNING: "supersecret" detected. Forcing fallback to correct production password.');
        password = 'Abc996050@';
    }

    console.log(`[AdminAuth] Source: ${envPass ? 'ENV' : 'FALLBACK'}`);
    console.log(`[AdminAuth] Using Email: ${email}, Password Len: ${password.length}, Password Start: ${password.substring(0, 2)}`);

    try {
        const res = await fetch(BACKEND_URL + '/auth/user/emailpass', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            cache: 'no-store'
        });

        const data = await res.json();

        if (res.ok && data.token) {
            console.log('[AdminAuth] Login Successful. Token: ' + data.token.substring(0, 10) + '...');
            return data.token;
        } else {
            console.error('[AdminAuth] Login Failed:', res.status, data);
            return null;
        }
    } catch (e: any) {
        console.error('[AdminAuth] Network Error:', e.message);
        return null;
    }
}
