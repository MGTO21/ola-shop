"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { ProductCard } from "@/components/product/ProductCard"
import { Heart, ShoppingBag, ArrowLeft, Loader2 } from "lucide-react"

export default function WishlistPage() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchWishlist = async () => {
            const savedUser = localStorage.getItem('ola_user')
            if (!savedUser) {
                setLoading(false)
                return
            }

            const user = JSON.parse(savedUser)
            const wishlistIds = user.metadata?.wishlist || []

            if (wishlistIds.length === 0) {
                setLoading(false)
                return
            }

            try {
                const productPromises = wishlistIds.map((id: string) =>
                    fetch(`/api/store-proxy?resource=products&id=${id}`).then(res => res.json())
                )
                const results = await Promise.all(productPromises)
                setProducts(results.map(r => r.product).filter(Boolean))
            } catch (e) {
                console.error("Wishlist fetch error:", e)
            } finally {
                setLoading(false)
            }
        }

        fetchWishlist()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-arabic" dir="rtl">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                            <Heart className="w-8 h-8 text-rose-600 fill-rose-600" /> المفضلة
                        </h1>
                        <p className="text-gray-500 font-bold mt-1">المنتجات التي قمت بحفظها لشرائها لاحقاً</p>
                    </div>
                    <Link href="/products" className="bg-white text-gray-900 px-6 py-3 rounded-2xl font-black border-2 border-gray-100 hover:border-gray-900 transition-all flex items-center gap-2 w-fit">
                        <ArrowLeft className="w-5 h-5" /> مواصلة التسوق
                    </Link>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                        <Loader2 className="w-12 h-12 text-rose-600 animate-spin mb-4" />
                        <p className="font-bold text-gray-400 text-lg">جاري تحميل قائمة أمنياتك...</p>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 px-6">
                        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-300">
                            <Heart className="w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">قائمة المفضلة فارغة</h2>
                        <p className="text-gray-500 font-bold mb-8 max-w-md mx-auto">لم تقم بإضافة أي منتجات للمفضلة بعد. ابدأ باستكشاف منتجاتنا المميزة وأضف ما يعجبك هنا!</p>
                        <Link href="/products" className="bg-rose-600 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-lg shadow-rose-200 hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center gap-3">
                            <ShoppingBag className="w-6 h-6" /> تصفح المنتجات
                        </Link>
                    </div>
                )}
            </main>
        </div>
    )
}
