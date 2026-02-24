'use client'

import { ProductCard } from "@/components/product/ProductCard"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/context/LanguageContext"
import Link from "next/link"

interface FeaturedProductsClientProps {
    products: any[]
}

export function FeaturedProductsClient({ products }: FeaturedProductsClientProps) {
    const { t, dir, language } = useLanguage()

    if (!products || products.length === 0) {
        return (
            <section className={`py-16 bg-gray-50/80 backdrop-blur-md ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        {t.home.featured_products}
                    </h2>
                    <p className="text-center text-gray-500">
                        {language === 'ar' ? 'لا توجد منتجات متوفرة حالياً. يرجى العودة لاحقاً!' : 'No products available at the moment. Please check back later!'}
                    </p>
                </div>
            </section>
        )
    }

    return (
        <section className={`py-16 bg-white ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">
                        {t.home.featured_products}
                    </h2>
                    <Link href="/products" className="text-pink-600 hover:text-pink-700 font-bold flex items-center gap-2">
                        <span>{language === 'ar' ? 'عرض الكل' : 'View All'}</span>
                        <ArrowRight className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                    </Link>
                </div>

                <div className="relative">
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory" dir={dir}>
                        {products.map((product: any) => (
                            <div key={product.id} className="flex-shrink-0 w-64 md:w-72 lg:w-80 snap-start">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>

                    <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 pointer-events-none hidden md:block">
                        <div className="flex justify-between px-2">
                            <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center pointer-events-auto cursor-pointer hover:bg-white hover:scale-110 transition-all">
                                <ArrowLeft className={`w-6 h-6 text-gray-700 ${language === 'ar' ? '' : 'rotate-180'}`} />
                            </div>
                            <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center pointer-events-auto cursor-pointer hover:bg-white hover:scale-110 transition-all">
                                <ArrowRight className={`w-6 h-6 text-gray-700 ${language === 'ar' ? '' : 'rotate-180'}`} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
