const utils = require('./node_modules/@medusajs/utils');
console.log(Object.keys(utils).filter(k => k.toLowerCase().includes('hash') || k.toLowerCase().includes('crypt')));
