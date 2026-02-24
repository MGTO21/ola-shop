import { notFound } from "next/navigation"
import { getProduct, getRelatedProducts } from "@/lib/medusa"
import { WhatsAppButton } from "@/components/shared/WhatsAppButton"
import { ProductDetails } from "@/components/product/ProductDetails"

export const revalidate = 3600

interface ProductPageProps {
    params: Promise<{
        id: string
    }>
}

export async function generateMetadata(props: ProductPageProps): Promise<any> {
    const params = await props.params
    const product = await getProduct(params.id)
    if (!product) return { title: "Product Not Found" }

    return {
        title: `${product.title} | Ola Shop`,
        description: product.description || `Buy ${product.title} at Ola Shop Sudanese store.`,
        openGraph: {
            images: [product.thumbnail],
        },
    }
}

export default async function ProductPage(props: ProductPageProps) {
    const params = await props.params
    const product = await getProduct(params.id)

    if (!product) {
        notFound()
    }

    const categoryIds = product.categories?.map((c: any) => c.id)
    let relatedProducts = await getRelatedProducts(product.id, categoryIds)
    // Filter out the current product from related products
    relatedProducts = relatedProducts.filter((p: any) => p.id !== product.id)

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 py-8">
                <ProductDetails product={product} relatedProducts={relatedProducts} />
            </main>
            <WhatsAppButton />
        </div>
    )
}
