import Medusa from "@medusajs/medusa-js"

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_3b9ce0ab55a6f2cfa25747f441ddfdbdea53c45ab496005d3b8a0ff6a5bd693f"

// In the browser, we use the relative proxy to avoid CORS/Cookie/Mixed Content issues
// On the server, we use the full backend URL for direct communication
const baseUrl = typeof window !== "undefined" ? "/api" : MEDUSA_BACKEND_URL

if (typeof window !== "undefined") {
    console.log(`[Medusa] Initializing in Browser. BaseUrl: "${baseUrl}" (Proxying through Nginx/Next.js). Key: Present`)
}

export const medusaClient = new Medusa({
    baseUrl: baseUrl,
    maxRetries: 3,
    publishableApiKey: PUBLISHABLE_API_KEY,
} as any)


// Helper function to get products
export async function getProducts(params?: {
    limit?: number
    offset?: number
    category_id?: string[]
    collection_id?: string[]
    q?: string
    region_id?: string
    fields?: string
}) {
    try {
        // Medusa v2 list products schema doesn't always accept region_id as a top-level query param
        const queryParams: any = {
            fields: params?.fields || "*variants.calculated_price",
            region_id: 'reg_01KC1R1XZRG584Y15RKTAR51N5',
            ...params
        }
        if (queryParams.region_id) delete queryParams.region_id

        // @ts-ignore - medusa-js types might not fully reflect v2 params yet
        const response = await medusaClient.products.list(queryParams)
        return response.products
    } catch (error) {
        console.error("Error fetching products:", error)
        return []
    }
}

// Helper function to get single product
export async function getProduct(id: string, queryParams?: any) {
    const region_id = 'reg_01KC1R1XZRG584Y15RKTAR51N5';
    // Explicit Medusa v2 field paths to ensure all price and category data is returned
    const fields = queryParams?.fields || "*,variants.*,variants.calculated_price.*,variants.prices.*,categories.*";
    const decodedId = decodeURIComponent(id);

    console.log(`[MedusaServer] getProduct initiated for: "${id}" (Decoded: "${decodedId}")`);

    try {
        // 1. Try direct retrieve for IDs (prod_...)
        if (id.startsWith('prod_')) {
            try {
                // @ts-ignore
                const response = await medusaClient.products.retrieve(id, {
                    fields
                });
                if (response.product) {
                    const p = response.product;
                    const v = p.variants?.[0];
                    console.log(`[MedusaServer] Found by ID: "${p.title}" | Variant 1 Price: ${v?.calculated_price?.calculated_amount} | Prices Array: ${v?.prices?.length}`);
                    return p;
                }
            } catch (e: any) {
                console.warn(`[MedusaServer] Retrieve by ID failed: ${e.message}`);
            }
        }

        // 2. Try list by handle (Very aggressive)
        const handlesToTry = [id, decodedId].filter((v, i, a) => a.indexOf(v) === i);

        for (const h of handlesToTry) {
            console.log(`[MedusaServer] Searching by handle: "${h}"`);
            const { products } = await medusaClient.products.list({
                handle: h,
                fields
                // region_id omitted for list just like home page to ensure robust return
            });

            if (products && products.length > 0) {
                const p = products[0];
                const v = p.variants?.[0];
                console.log(`[MedusaServer] Found by handle: "${p.title}" | Prices Array: ${v?.prices?.length}`);
                return p;
            }
        }

        // 3. Last ditch search
        const { products: searchResults } = await medusaClient.products.list({
            q: decodedId,
            fields
        });

        if (searchResults && searchResults.length > 0) {
            const bestMatch = searchResults.find((p: any) => p.handle === decodedId || p.title === decodedId) || searchResults[0];
            console.log(`[MedusaServer] Found by search: "${bestMatch.title}"`);
            return bestMatch;
        }

        console.error(`[MedusaServer] Product NOT FOUND in any attempt: "${id}"`);
        return null;

    } catch (error: any) {
        console.error(`[MedusaServer] Critical error in getProduct("${id}"):`, error.message);
        return null;
    }
}

// Helper function to get collections
export async function getCollections() {
    try {
        const response = await medusaClient.collections.list()
        return response.collections
    } catch (error) {
        console.error("Error fetching collections:", error)
        return []
    }
}

// Helper function to get related products
export async function getRelatedProducts(productId: string, categoryIds?: string[]) {
    try {
        const params: any = {
            limit: 4,
            fields: "*variants.calculated_price",
        }

        if (categoryIds && categoryIds.length > 0) {
            params.category_id = categoryIds
        }

        const response = await medusaClient.products.list(params)
        // Filter out the current product
        return response.products.filter((p: any) => p.id !== productId)
    } catch (error) {
        console.error("Error fetching related products:", error)
        return []
    }
}

// Helper function to get regions
export async function getRegions() {
    try {
        const response = await medusaClient.regions.list()
        return response.regions
    } catch (error) {
        console.error("Error fetching regions:", error)
        return []
    }
}

// Helper function to update customer metadata
export async function updateCustomerMetadata(customerId: string, metadata: any) {
    try {
        const response = await fetch('/api/customer/update-metadata', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customerId, metadata })
        })
        const data = await response.json()
        return data.success ? data.customer : null
    } catch (error) {
        console.error("Error updating customer metadata:", error)
        return null
    }
}

export default medusaClient
