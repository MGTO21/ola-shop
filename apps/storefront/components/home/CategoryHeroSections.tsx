'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { getImageUrl, formatPrice } from '@/lib/utils'
import { ProductCard } from '@/components/product/ProductCard'

interface HeroSection {
    id: string
    category: string
    categoryName: string
    categoryNameEn: string
    posterImage: string
    posterTitle: string
    posterTitleEn: string
    posterSubtitle: string
    posterSubtitleEn: string
    enabled: boolean
    showFeaturedProducts: boolean
    backgroundColor: string
    order: number
}

interface MedusaProduct {
    id: string
    title: string
    thumbnail?: string
    images?: Array<{ url: string }>
    variants?: Array<{
        id: string
        calculated_price?: {
            calculated_amount: number
            original_amount: number
            currency_code: string
        }
        prices?: Array<{ amount: number }>
    }>
    metadata?: {
        category?: string
        featured?: boolean
    }
}

import { CategoryHeroSkeleton } from '@/components/ui/Skeletons'
import { useLanguage } from '@/lib/context/LanguageContext'
import { useRef } from 'react'
import { ArrowLeft, ArrowRight as ArrowRightIcon } from 'lucide-react'

export function CategoryHeroSections() {
    const { t, dir, language } = useLanguage()
    const [heroSections, setHeroSections] = useState<HeroSection[]>([])
    const [productsByCategory, setProductsByCategory] = useState<Record<string, MedusaProduct[]>>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Load hero sections config
        fetch('/config/hero-sections.json')
            .then(res => res.json())
            .then(data => {
                const sorted = data.heroSections
                    .filter((h: HeroSection) => h.enabled)
                    .sort((a: HeroSection, b: HeroSection) => a.order - b.order)
                setHeroSections(sorted)
            })
            .catch(err => console.error('Failed to load hero sections:', err))

        // Fetch products from Medusa
        const fetchProducts = async () => {
            try {
                const res = await fetch(`/api/products?limit=100`, {
                    headers: { 'Content-Type': 'application/json' }
                })
                const data = await res.json()
                const products = data.products || []

                const categoryKeywords = {
                    cosmetics: ['serum', 'lipstick', 'eyeshadow', 'foundation', 'mascara', 'blush', 'brush', 'moisturizer', 'gloss', 'eyeliner', 'cream', 'scrub', 'butter'],
                    perfumes: ['oud', 'musk', 'jasmine', 'amber', 'lavender', 'citrus', 'vanilla', 'sandalwood', 'floral', 'perfume', 'fragrance', 'breeze'],
                    fashion: ['hijab', 'abaya', 'tunic', 'dress', 'cardigan', 'pants', 'kimono', 'skirt', 'swimwear', 'prayer', 'scarf'],
                    accessories: ['necklace', 'bracelet', 'earrings', 'handbag', 'sunglasses', 'watch', 'ring', 'brooch', 'anklet', 'clutch', 'jewelry'],
                    sudanese: ['henna', 'dukhan', 'dilka', 'karkar', 'toob', 'bakhoor', 'frankincense', 'myrrh', 'traditional']
                }

                const grouped: Record<string, MedusaProduct[]> = {}
                products.forEach((product: MedusaProduct) => {
                    const titleLower = product.title.toLowerCase()
                    let assignedCategory = 'cosmetics'
                    for (const [category, keywords] of Object.entries(categoryKeywords)) {
                        if (keywords.some(keyword => titleLower.includes(keyword))) {
                            assignedCategory = category
                            break
                        }
                    }
                    if (!grouped[assignedCategory]) grouped[assignedCategory] = []
                    if (grouped[assignedCategory].length < 10) { // Limit to 10 for carousel
                        grouped[assignedCategory].push(product)
                    }
                })
                setProductsByCategory(grouped)
            } catch (err) {
                console.error('Failed to fetch products:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    if (loading) {
        return (
            <div className="space-y-12">
                {[1, 2].map(i => <CategoryHeroSkeleton key={i} />)}
            </div>
        )
    }

    if (heroSections.length === 0) return null

    return (
        <div className={`space-y-8 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
            {heroSections.map((hero) => {
                const categoryProducts = productsByCategory[hero.category] || []
                const catName = language === 'ar' ? hero.categoryName : hero.categoryNameEn
                const pTitle = language === 'ar' ? hero.posterTitle : hero.posterTitleEn
                const pSubtitle = language === 'ar' ? hero.posterSubtitle : hero.posterSubtitleEn

                return (
                    <section
                        key={hero.id}
                        className="relative overflow-hidden rounded-2xl shadow-xl"
                        style={{ backgroundColor: hero.backgroundColor }}
                    >
                        {/* Top Half - Poster/Banner */}
                        <div className="relative h-72 md:h-[400px] lg:h-[500px] overflow-hidden group">
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <Image
                                    src={hero.posterImage}
                                    alt={catName}
                                    fill
                                    unoptimized
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    onError={(e) => {
                                        const target = e.target as HTMLElement
                                        target.style.background = `linear-gradient(135deg, ${hero.backgroundColor} 0%, #FFE5F0 100%)`
                                    }}
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
                            </div>

                            {/* Content */}
                            <div className="relative h-full container mx-auto px-4 flex items-center">
                                <div className={`max-w-2xl text-white ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                    <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm mb-4 font-bold">
                                        {catName}
                                    </div>
                                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 leading-tight">
                                        {pTitle}
                                    </h2>
                                    <p className="text-lg md:text-xl mb-6 opacity-90">
                                        {pSubtitle}
                                    </p>
                                    <Link
                                        href={`/products?category=${hero.category}`}
                                        className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-pink-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        <span>{t.home.shop_now}</span>
                                        <ArrowRightIcon className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Half - Featured Products Carousel */}
                        {hero.showFeaturedProducts && categoryProducts.length > 0 && (
                            <div className="p-6 md:p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {t.home.featured_products}
                                    </h3>
                                    <Link
                                        href={`/products?category=${hero.category}&featured=true`}
                                        className="text-pink-600 hover:text-pink-700 font-semibold flex items-center gap-1"
                                    >
                                        <span>{language === 'ar' ? 'عرض الكل' : 'View All'}</span>
                                        <ArrowRightIcon className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
                                    </Link>
                                </div>

                                <CategoryProductCarousel products={categoryProducts} dir={dir} />
                            </div>
                        )}

                        {/* Empty State if no products */}
                        {hero.showFeaturedProducts && categoryProducts.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                <p>{language === 'ar' ? 'لا توجد منتجات مميزة في هذا القسم حالياً' : 'No featured products in this category currently'}</p>
                            </div>
                        )}
                    </section>
                )
            })}
        </div>
    )
}

function CategoryProductCarousel({ products, dir }: { products: MedusaProduct[], dir: string }) {
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 350
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    return (
        <div className="relative">
            <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory"
                dir={dir}
            >
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="flex-shrink-0 w-64 md:w-72 lg:w-80 snap-start"
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            {/* Scroll Buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 pointer-events-none hidden md:block">
                <div className="flex justify-between px-2">
                    <button
                        onClick={() => scroll(dir === 'rtl' ? 'right' : 'left')}
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center pointer-events-auto cursor-pointer hover:bg-rose-500 hover:text-white hover:scale-110 transition-all border border-gray-100"
                        aria-label="Previous"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scroll(dir === 'rtl' ? 'left' : 'right')}
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center pointer-events-auto cursor-pointer hover:bg-rose-500 hover:text-white hover:scale-110 transition-all border border-gray-100"
                        aria-label="Next"
                    >
                        <ArrowRightIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
