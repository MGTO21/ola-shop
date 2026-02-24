const { Client } = require('pg');

const dbConfig = {
    connectionString: process.env.DATABASE_URL || "postgres://postgres:Abc996050@127.0.0.1:5432/medusa_db"
};

async function checkAuthData() {
    const client = new Client(dbConfig);
    try {
        await client.connect();

        console.log("--- Contents of provider_identity ---");
        const res = await client.query(
            "SELECT * FROM provider_identity WHERE provider = 'emailpass'"
        );
        console.log(JSON.stringify(res.rows, null, 2));

        console.log("\n--- Contents of auth_identity ---");
        const res2 = await client.query("SELECT * FROM auth_identity");
        console.log(JSON.stringify(res2.rows, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

checkAuthData();
