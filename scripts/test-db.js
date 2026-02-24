const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgres://postgres:password@127.0.0.1:5432/ola_shop'
});
client.connect()
  .then(() => { console.log('✅ SUCCESS! Connection works!'); client.end(); })
  .catch(err => { console.error('❌ FAILURE:', err.message); client.end(); });
