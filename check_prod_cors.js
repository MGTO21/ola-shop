const axios = require('axios');

async function checkCors() {
    const url = 'https://ola-shop.com/admin/feature-flags';
    console.log(`Checking CORS for: ${url}`);

    try {
        const response = await axios.options(url, {
            headers: {
                'Origin': 'https://www.ola-shop.com',
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Request-Headers': 'x-medusa-locale'
            }
        });

        console.log('Status:', response.status);
        console.log('Access-Control-Allow-Origin:', response.headers['access-control-allow-origin']);
        console.log('Access-Control-Allow-Methods:', response.headers['access-control-allow-methods']);
        console.log('Access-Control-Allow-Headers:', response.headers['access-control-allow-headers']);
        console.log('Access-Control-Allow-Credentials:', response.headers['access-control-allow-credentials']);
    } catch (e) {
        console.error('CORS Check Failed:');
        if (e.response) {
            console.error('Status:', e.response.status);
            console.error('Headers:', e.response.headers);
        } else {
            console.error(e.message);
        }
    }
}

checkCors();
