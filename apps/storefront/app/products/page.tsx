'use client'

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { medusaClient } from "@/lib/medusa"
import { ProductCard } from "@/components/product/ProductCard"
import { ProductFilters } from "@/components/product/ProductFilters"
import { ProductCardSkeleton } from "@/components/ui/Skeletons"
import { useLanguage } from "@/lib/context/LanguageContext"

function ProductsContent() {
    const { t, dir, language } = useLanguage()
    const searchParams = useSearchParams()
    const categoryHandle = searchParams.get("category")
    const subcategoryHandle = searchParams.get("subcategory")

    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true)
                const query: any = {
                    limit: 100,
                    region_id: 'reg_c28fa86514644f729b89ca85c6ed5387',
                    fields: '*variants.calculated_price,*categories'
                }

                const response = await medusaClient.products.list(query)
                let filtered = response.products || []

                if (categoryHandle) {
                    filtered = filtered.filter((p: any) =>
                        p.categories?.some((c: any) => c.handle === categoryHandle || c.name === categoryHandle)
                    )
                }

                if (subcategoryHandle) {
                    filtered = filtered.filter((p: any) =>
                        p.categories?.some((c: any) => c.handle === subcategoryHandle || c.name === subcategoryHandle)
                    )
                }

                setProducts(filtered)
            } catch (error: any) {
                console.error("[Products Page] Error fetching products:", error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [categoryHandle, subcategoryHandle])

    if (loading) {
        return (
            <div className={`min-h-screen flex flex-col ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
                <div className="container mx-auto px-4 py-8">
                    <div className={`mb-8 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                        <div className="h-10 bg-gray-100 rounded-xl w-48 mb-2 animate-pulse" />
                        <div className="h-4 bg-gray-50 rounded w-24 animate-pulse" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <ProductCardSkeleton key={i} />)}
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className={`min-h-screen flex flex-col ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-16">
                        <p className="text-red-500 text-lg mb-4">{t.products.error_loading_products}</p>
                        <p className="text-gray-600 text-sm">{error}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`min-h-screen flex flex-col ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
            <div className="container mx-auto px-4 py-8">
                <div className={`mb-8 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    <h1 className="text-3xl font-bold mb-2">
                        {categoryHandle ? categoryHandle : t.products.all_products}
                    </h1>
                    <p className="text-gray-600">
                        {t.products.found_products.replace('{count}', products.length.toString())}
                    </p>
                </div>

                <ProductFilters />

                {products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg mb-4">{t.products.no_products_found}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center font-arabic">
                <p>جاري التحميل...</p>
            </div>
        }>
            <ProductsContent />
        </Suspense>
    )
}
