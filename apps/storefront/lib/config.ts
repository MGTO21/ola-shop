// Global Storefront Configuration
export const STORE_CONFIG = {
    // Free shipping threshold in SDG
    // Medusa stores prices in smallest units (piastres), so we multiply by 100
    // Example: 500,000 SDG = 50,000,000
    FREE_SHIPPING_THRESHOLD: 500000 * 100,

    // Currency settings
    CURRENCY_CODE: "SDG",
    CURRENCY_SYMBOL: "SDG",
}
