"use client"

import Image from "next/image"
import { useState, useEffect, useMemo } from "react"
import { Star, ShoppingCart, Heart, Check, Loader2, Minus, Plus, Share2, ShieldCheck, Truck, ShieldAlert } from "lucide-react"
import { formatPrice, getImageUrl, calculateDiscountPercentage } from "@/lib/utils"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/context/LanguageContext"
import { ProductCard } from "./ProductCard"

interface ProductDetailsProps {
    product: any
    relatedProducts?: any[]
}

export function ProductDetails({ product, relatedProducts = [] }: ProductDetailsProps) {
    const { t, dir, language } = useLanguage()
    const router = useRouter()
    const [quantity, setQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState(0)
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [isAdding, setIsAdding] = useState(false)
    const [isAdded, setIsAdded] = useState(false)

    // DIAGNOSTIC LOG (Client Side)
    useEffect(() => {
        if (product) {
            console.log(`[ProductDebug] Data for: "${product.title}"`, product);
            const v = product.variants?.[0];
            if (v) {
                console.log(`[ProductDebug] Variant 1 - Calc Amount: ${v.calculated_price?.calculated_amount}, Prices Array Length: ${v.prices?.length}`);
            }
        }
    }, [product]);

    // PRICE LOGIC (Medusa V2 Compatible) - Multi-variant failsafe
    const { price, originalPrice, variant } = useMemo(() => {
        let price = 0
        let originalPrice = 0
        let variant = product?.variants?.[0]

        if (product?.variants?.length > 0) {
            for (const v of product.variants) {
                const calcPrice = v.calculated_price;
                const hasCalculated = calcPrice?.calculated_amount !== undefined && calcPrice?.calculated_amount !== null;

                if (hasCalculated && Number(calcPrice.calculated_amount) > 0) {
                    price = Number(calcPrice.calculated_amount)
                    originalPrice = Number(calcPrice.original_amount) || price
                    variant = v
                    break;
                } else if (v.prices?.length > 0) {
                    const sdgPrice = v.prices.find((p: any) => p.currency_code?.toLowerCase() === 'sdg')
                    const priceObj = sdgPrice || v.prices[0]
                    if (priceObj.amount && Number(priceObj.amount) > 0) {
                        price = Number(priceObj.amount)
                        originalPrice = price
                        variant = v
                        break;
                    }
                }
            }
        }
        return { price, originalPrice, variant }
    }, [product]);

    const numPrice = Number(price)
    const numOriginal = Number(originalPrice)
    const hasDiscount = numOriginal > numPrice && numPrice > 0
    const discountPercentage = hasDiscount ? calculateDiscountPercentage(numOriginal, numPrice) : 0

    const images = product.images || []
    const mainImage = images[selectedImage]?.url || product.thumbnail

    const handleAddToCart = async () => {
        if (!variant?.id) {
            toast.error(t.products.not_available)
            return
        }

        setIsAdding(true)
        try {
            const cartId = localStorage.getItem('cart_id')
            const res = await fetch(`/api/cart-proxy?id=${cartId || ''}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    variant_id: variant.id,
                    quantity: quantity
                })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Failed")

            const newCartId = data.cart?.id || data.id
            if (newCartId) {
                localStorage.setItem('cart_id', newCartId)
                window.dispatchEvent(new CustomEvent('cart-updated'))
                setIsAdded(true)
                toast.success(t.products.added_to_cart)
                setTimeout(() => setIsAdded(false), 2000)
            }

        } catch (error) {
            console.error("Error adding to cart:", error)
            toast.error(t.products.add_to_cart_error)
        } finally {
            setIsAdding(false)
        }
    }

    useEffect(() => {
        const savedUser = localStorage.getItem('ola_user')
        if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
            try {
                const user = JSON.parse(savedUser)
                const wishlist = user.metadata?.wishlist || []
                setIsWishlisted(wishlist.includes(product.id))
            } catch (e) {
                console.error("Error parsing user in ProductDetails:", e)
            }
        }
    }, [product.id])

    const toggleWishlist = async () => {
        const savedUser = localStorage.getItem('ola_user')
        if (!savedUser || savedUser === 'undefined' || savedUser === 'null') {
            toast.error(t.products.wishlist_login_required)
            return
        }

        let user;
        try {
            user = JSON.parse(savedUser)
        } catch (e) {
            console.error("Failed to parse user for wishlist toggle:", e)
            return
        }

        const currentWishlist = user.metadata?.wishlist || []
        let newWishlist = []

        if (currentWishlist.includes(product.id)) {
            newWishlist = currentWishlist.filter((id: string) => id !== product.id)
        } else {
            newWishlist = [...currentWishlist, product.id]
        }

        setIsWishlisted(!isWishlisted)

        try {
            const res = await fetch('/api/customer/update-metadata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId: user.id,
                    metadata: { wishlist: newWishlist }
                })
            })
            if (res.ok) {
                const data = await res.json()
                localStorage.setItem('ola_user', JSON.stringify(data.customer))
                window.dispatchEvent(new CustomEvent('wishlist-updated'))
                toast.success(isWishlisted ? t.products.wishlist_remove : t.products.wishlist_add)
            }
        } catch (err) {
            console.error("Wishlist sync failed", err)
            setIsWishlisted(currentWishlist.includes(product.id))
            toast.error(t.products.wishlist_error)
        }
    }

    const shareProduct = () => {
        if (navigator.share) {
            navigator.share({
                title: product.title,
                text: product.description,
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        }
    }

    return (
        <div className={`pt-10 pb-20 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

                    {/* --- Image Gallery (Col 7) --- */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="relative aspect-[4/5] bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-gray-100 shadow-xl group cursor-zoom-in">
                            <Image
                                src={getImageUrl(mainImage)}
                                alt={product.title}
                                fill
                                className="object-contain p-6 md:p-10 transition-transform duration-700 hover:scale-105"
                                priority
                            />

                            {/* Actions Overlay */}
                            <div className={`absolute top-6 ${language === 'ar' ? 'left-6' : 'right-6'} flex flex-col gap-3`}>
                                <button
                                    onClick={toggleWishlist}
                                    className={`w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-md transition-all shadow-lg active:scale-90 ${isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/80 text-gray-400 hover:text-rose-500'}`}
                                >
                                    <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-white' : ''}`} />
                                </button>
                                <button
                                    onClick={shareProduct}
                                    className="w-12 h-12 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-gray-400 hover:text-blue-500 transition-all shadow-lg active:scale-90"
                                >
                                    <Share2 className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Badge */}
                            {hasDiscount && (
                                <div className={`absolute bottom-8 ${language === 'ar' ? 'right-8' : 'left-8'} bg-rose-600 text-white text-sm font-black px-6 py-2 rounded-full shadow-2xl`}>
                                    {discountPercentage}% {t.products.discount_label}
                                </div>
                            )}

                            {/* Trust Corner */}
                            <div className={`absolute bottom-8 ${language === 'ar' ? 'left-8' : 'right-8'} flex items-center gap-2 bg-emerald-50/90 backdrop-blur-sm border border-emerald-100 px-4 py-2 rounded-2xl shadow-sm`}>
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-tighter">منتج أصلي 100%</span>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto py-2 px-1 scrollbar-none snap-x">
                                {images.map((img: any, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all snap-start ${selectedImage === idx ? 'border-rose-500 ring-4 ring-rose-50' : 'border-gray-100 hover:border-gray-200'}`}
                                    >
                                        <Image src={getImageUrl(img.url)} alt={product.title} fill className="object-cover p-1" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* --- Product Info (Col 5) --- */}
                    <div className="lg:col-span-5 flex flex-col pt-2 lg:pt-6">
                        <nav className="flex items-center gap-2 mb-6 text-sm font-bold text-gray-400">
                            <span className="hover:text-rose-500 cursor-pointer">{t.nav.home}</span>
                            <span>/</span>
                            <span className="hover:text-rose-500 cursor-pointer">{language === 'ar' ? 'المنتجات' : 'Products'}</span>
                        </nav>

                        <div className="mb-8">
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">{product.title}</h1>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    <span className="text-sm font-black text-amber-700">4.9 (128 تقييم)</span>
                                </div>
                                <span className="text-gray-300">|</span>
                                <span className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    {t.products.available_label || (language === 'ar' ? 'متوفر حالياً' : 'In Stock')}
                                </span>
                            </div>

                            <div className="p-8 bg-gradient-to-br from-gray-50/50 to-white rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -mr-10 -mt-10" />
                                <div className="flex items-baseline gap-4 mb-2">
                                    <span className="text-5xl font-black text-rose-600 tracking-tighter" dir="ltr">
                                        {formatPrice(numPrice)}
                                    </span>
                                    {hasDiscount && (
                                        <span className="text-2xl text-gray-300 line-through font-bold" dir="ltr">
                                            {formatPrice(numOriginal)}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    {language === 'ar' ? 'الأسعار شاملة ضريبة القيمة المضافة' : 'Price Includes VAT'}
                                </p>
                            </div>
                        </div>

                        {/* Variant Selectors (Coming Soon for V2) */}
                        <div className="space-y-8 mb-10">
                            {/* Quantity Selector */}
                            <div className="flex flex-col gap-4">
                                <label className="text-sm font-black text-gray-400 uppercase tracking-widest">{t.products.select_quantity}</label>
                                <div className="flex items-center bg-white rounded-2xl border border-gray-100 p-1 w-fit shadow-lg shadow-gray-100/50">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-900 hover:bg-rose-500 hover:text-white transition-all active:scale-90"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <span className="w-14 text-center font-black text-2xl">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-900 hover:bg-rose-500 hover:text-white transition-all active:scale-90"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-1 gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isAdding || isAdded}
                                    className={`relative h-20 rounded-3xl transition-all font-black text-xl flex items-center justify-center gap-4 shadow-2xl overflow-hidden group active:scale-95 ${isAdded ? 'bg-emerald-600 text-white' : 'bg-gray-900 text-white hover:bg-rose-600 hover:shadow-rose-100'}`}
                                >
                                    {isAdded ? (
                                        <> <Check className="w-7 h-7" /> {t.products.added_label} </>
                                    ) : isAdding ? (
                                        <> <Loader2 className="w-7 h-7 animate-spin" /> {t.products.adding_label} </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-7 h-7 group-hover:animate-bounce" />
                                            {t.products.add_to_cart_label || t.products.add_to_cart}
                                        </>
                                    )}
                                    <div className="absolute inset-0 bg-white/20 translate-y-20 group-hover:translate-y-0 transition-transform duration-500 skew-y-12" />
                                </button>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center justify-center gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <Truck className="w-5 h-5 text-rose-500" />
                                        <span className="text-xs font-black text-gray-600">{t.products.cod_label}</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <ShieldAlert className="w-5 h-5 text-rose-500" />
                                        <span className="text-xs font-black text-gray-600">{t.products.guarantee_label || 'ضمان العلا'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Short Description */}
                        <div className="mt-auto pt-8 border-t border-gray-50">
                            <p className="text-gray-500 text-sm leading-relaxed font-bold">
                                {language === 'ar'
                                    ? 'استمتع بجودة استثنائية وتصميم فريد مع متجر العلا. نضمن لك دائماً أفضل الأسعار والتوصيل الأسرع في كافة أنحاء السودان.'
                                    : 'Enjoy exceptional quality and unique design with Ola Shop. We always guarantee you the best prices and fastest delivery across all of Sudan.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- Description & Details Tabs --- */}
                <div className="mt-20 lg:mt-32">
                    <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-gray-100 shadow-2xl shadow-gray-100/20">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-3 h-10 bg-rose-600 rounded-full" />
                            <h2 className="text-3xl font-black text-gray-900">{t.products.details_label}</h2>
                        </div>

                        <div className="prose prose-rose max-w-none">
                            <p className="text-xl text-gray-600 leading-[1.8] font-medium whitespace-pre-line">
                                {product.description || t.products.no_description}
                            </p>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-50">
                            <div className="space-y-2">
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">{language === 'ar' ? 'العلامة التجارية' : 'Brand'}</h4>
                                <p className="text-lg font-black text-gray-900">{product.metadata?.brand || 'Ola Style'}</p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">{language === 'ar' ? 'الخامة' : 'Material'}</h4>
                                <p className="text-lg font-black text-gray-900">{product.metadata?.material || (language === 'ar' ? 'قطن غابردين' : 'Premium Cotton')}</p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">{language === 'ar' ? 'التصنيف' : 'Category'}</h4>
                                <p className="text-lg font-black text-gray-900">{product.categories?.[0]?.name || 'Default'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Related Products --- */}
                {relatedProducts.length > 0 && (
                    <div className="mt-32">
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-4">
                                <div className="w-3 h-10 bg-blue-600 rounded-full" />
                                <h2 className="text-3xl font-black text-gray-900">
                                    {language === 'ar' ? 'منتجات قد تعجبك' : 'Suggested Products'}
                                </h2>
                            </div>
                            <button className="text-rose-600 font-black hover:underline transition-all">
                                {language === 'ar' ? 'مشاهدة الكل' : 'View all'}
                            </button>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                            {relatedProducts.map((p: any) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
