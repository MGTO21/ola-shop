const utils = require('@medusajs/utils');

console.log("--- PROBING @medusajs/utils ---");
console.log("Keys found:", Object.keys(utils).filter(k => k.toLowerCase().includes('scrypt') || k.toLowerCase().includes('hash') || k.toLowerCase().includes('auth')));

if (utils.Scrypt) {
    console.log("Scrypt found! Type:", typeof utils.Scrypt);
    if (typeof utils.Scrypt === 'object') {
        console.log("Scrypt keys:", Object.keys(utils.Scrypt));
    }
} else {
    console.log("Scrypt NOT found in root exports.");
}

// Try to find the helper
if (utils.AuthenticationUtils) {
    console.log("AuthenticationUtils found!");
    console.log("AuthenticationUtils keys:", Object.keys(utils.AuthenticationUtils));
}
