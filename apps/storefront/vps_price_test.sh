#!/bin/bash
# VPS PRICE TEST: Region ID Hypothesis

echo "🧪 Testing Region ID..."

# 1. Update medusa.ts to TEST params
cat > apps/storefront/lib/medusa.ts << 'EOF'
import Medusa from "@medusajs/medusa-js"

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://46.224.43.113:9000"
export const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_dd569b1e6fb86fd087430d2af1b3ec2ea78f7d181709ffc6324fe2b77aa4c4e3"

const baseUrl = typeof window !== "undefined" ? "/api" : MEDUSA_BACKEND_URL

const config: any = {
    baseUrl: baseUrl,
    maxRetries: 3,
}
if (PUBLISHABLE_API_KEY && !PUBLISHABLE_API_KEY.includes("pk_test")) {
    config.publishableApiKey = PUBLISHABLE_API_KEY
}

export const medusaClient = new Medusa(config)

export async function getProducts(params: any = {}) {
    console.log("DEBUG [getProducts] RAW Params:", JSON.stringify(params))
    try {
        const queryParams = { ...params }
        
        // 1. Fetch Regions first to get a valid ID (Simulating Context)
        const regionsMsg = await medusaClient.regions.list()
        const region = regionsMsg.regions[0]
        
        if (region) {
             console.log("DEBUG [getProducts] Injecting Region:", region.id, region.currency_code)
             queryParams.region_id = region.id
             // Ensure currency_code is NOT set if region_id is set (medusa rules sometimes)
             delete queryParams.currency_code
        }

        console.log("DEBUG [getProducts] FINAL Params:", JSON.stringify(queryParams))

        // @ts-ignore
        const response = await medusaClient.products.list(queryParams)
        
        if (response.products.length > 0) {
            const p = response.products[0]
            // @ts-ignore
            console.log("DEBUG [getProducts] First Item:", p.title)
            // @ts-ignore
            console.log("DEBUG [getProducts] Prices Length:", p.variants?.[0]?.prices?.length)
            // @ts-ignore
            console.log("DEBUG [getProducts] Calculated Price:", JSON.stringify(p.variants?.[0]?.calculated_price))
        }

        return response.products
    } catch (error) {
        console.error("DEBUG [getProducts] ERROR:", error)
        return []
    }
}

export async function getProduct(id: string, queryParams: any = {}) {
    // Same login for single product
    try {
         const regionsMsg = await medusaClient.regions.list()
         const region = regionsMsg.regions[0]
         
         const listParams = {
            id: id,
            limit: 1,
            ...queryParams
         }
         
         if (region) {
             listParams.region_id = region.id
             delete listParams.currency_code
         }

        // @ts-ignore
        const response = await medusaClient.products.list(listParams)
        return response.products[0] || null
    } catch (error) {
        return null
    }
}

export async function getCollections() {
    try {
        const response = await medusaClient.collections.list()
        return response.collections
    } catch (error) {
        return []
    }
}

export async function getRegions() {
    try {
        const response = await medusaClient.regions.list()
        return response.regions
    } catch (error) {
        return []
    }
}

export default medusaClient
EOF

echo "🔄 Rebuilding..."
cd apps/storefront
npm run build
pm2 restart storefront

echo "✅ TEST APPLIED."
echo "⏳ Waiting 15 seconds..."
sleep 15
echo "📜 LOGS (Check for 'Prices Length' or 'Calculated Price'):"
pm2 logs storefront --lines 100 --nostream
