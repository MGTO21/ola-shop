import { getProducts } from "@/lib/medusa"
import { FeaturedProductsClient } from "./FeaturedProductsClient"

export async function FeaturedProducts() {
    // Fetch featured products from Medusa
    const products = await getProducts({ limit: 20 })

    return <FeaturedProductsClient products={products} />
}
