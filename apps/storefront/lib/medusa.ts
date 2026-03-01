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
export async function getProduct(id: string) {
    const fields = "*variants.calculated_price"; // Same as getProducts
    const decodedId = decodeURIComponent(id);

    console.log(`[MedusaServer] getProduct initiated for: "${id}"`);

    try {
        // Use list instead of retrieve, as list handles prices more consistently for v2
        const queryParams: any = {
            fields,
            limit: 1
        }

        if (id.startsWith('prod_')) {
            queryParams.id = [id]
        } else {
            queryParams.handle = [id, decodedId]
        }

        const { products } = await medusaClient.products.list(queryParams)

        if (products && products.length > 0) {
            const p = products[0]
            console.log(`[MedusaServer] Found product: "${p.title}" | Price: ${p.variants?.[0]?.calculated_price?.calculated_amount}`);
            return p
        }

        console.error(`[MedusaServer] Product NOT FOUND: "${id}"`);
        return null;

    } catch (error: any) {
        console.error(`[MedusaServer] Error in getProduct("${id}"):`, error.message);
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
