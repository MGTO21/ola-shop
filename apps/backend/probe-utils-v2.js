const utils = require('@medusajs/utils');

console.log("--- FULL @medusajs/utils EXPORTS ---");
const allKeys = Object.keys(utils).sort();
console.log(JSON.stringify(allKeys, null, 2));

console.log("\nSearching for any key with 'Crypt' or 'Pass' or 'Hash'...");
console.log(allKeys.filter(k => /crypt|pass|hash/i.test(k)));
