const crypto = require('crypto');
const { Client } = require('pg');

const dbConfig = {
    connectionString: "postgres://postgres:Abc996050@127.0.0.1:5432/medusa_db"
};

const email = "admin@ola-shop.com";
const password = "Abc996050@";

async function resetAdminV6() {
    console.log(`🔄 Generating Medusa v2 compatible Scrypt hash for: ${email}`);

    const salt = crypto.randomBytes(32);
    const logN = 15;
    const N = Math.pow(2, logN);
    const r = 8;
    const p = 1;
    const keyLen = 32;

    crypto.scrypt(password, salt, keyLen, { N, r, p }, async (err, derivedKey) => {
        if (err) {
            console.error("❌ Hashing failed:", err);
            return;
        }

        // Format: "scrypt" (6 bytes) + logN(2) + r(4) + p(4) + salt(32) + hash(32)
        const header = Buffer.from("scrypt");
        const params = Buffer.alloc(10);
        params.writeUInt16BE(logN, 0);
        params.writeUInt32BE(r, 2);
        params.writeUInt32BE(p, 6);

        const finalBuffer = Buffer.concat([header, params, salt, derivedKey]);
        const password_hash = finalBuffer.toString('base64');

        console.log("✅ New Hash Generated.");

        const client = new Client(dbConfig);
        try {
            await client.connect();
            const metadata = JSON.stringify({ password: password_hash });

            const res = await client.query(
                "UPDATE provider_identity SET provider_metadata = $1 WHERE entity_id = $2 AND provider = 'emailpass'",
                [metadata, email]
            );

            if (res.rowCount > 0) {
                console.log(`\n🏆 SUCCESS! Admin password for ${email} has been reset.`);
                console.log(`🚀 You can now login to the admin panel or send OTP.`);
            } else {
                console.log(`❌ ERROR: Admin user ${email} not found in provider_identity.`);
            }
        } catch (dbErr) {
            console.error("❌ Database Error:", dbErr.message);
        } finally {
            await client.end();
        }
    });
}

resetAdminV6();
