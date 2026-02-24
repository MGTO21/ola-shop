"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Star, ShoppingCart, Heart, Check, Loader2 } from "lucide-react"
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
    let price = 0
    let originalPrice = 0
    let variant = product?.variants?.[0]

    // Iterate through variants to find the first one with a valid price
    if (product?.variants?.length > 0) {
        for (const v of product.variants) {
            const calcPrice = v.calculated_price;
            if (calcPrice?.calculated_amount && Number(calcPrice.calculated_amount) > 0) {
                price = Number(calcPrice.calculated_amount)
                originalPrice = Number(calcPrice.original_amount) || price
                variant = v
                console.log(`[ProductDebug] Found valid calculated price on variant: ${v.id} (${price})`);
                break;
            } else if (v.prices?.length > 0) {
                const sdgPrice = v.prices.find((p: any) => p.currency_code?.toLowerCase() === 'sdg')
                const priceObj = sdgPrice || v.prices[0]
                if (priceObj.amount && Number(priceObj.amount) > 0) {
                    price = Number(priceObj.amount)
                    originalPrice = price
                    variant = v
                    console.log(`[ProductDebug] Found valid manual price on variant: ${v.id} (${price})`);
                    break;
                }
            }
        }
    }

    const numPrice = Number(price)
    const numOriginal = Number(originalPrice)
    const hasDiscount = numOriginal > numPrice && numPrice > 0
    const discountPercentage = hasDiscount ? calculateDiscountPercentage(numOriginal, numPrice) : 0

    const images = product.images || []
    const mainImage = images[selectedImage]?.url || product.thumbnail

    const handleAddToCart = async () => {
        if (!variant?.id) {
            alert(t.products.not_available)
            return
        }

        setIsAdding(true)
        try {
            const cartId = localStorage.getItem('cart_id')

            // USE PROXY API
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

            // Update Cart ID if new
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

    // Check wishlist status on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('ola_user')
        if (savedUser) {
            const user = JSON.parse(savedUser)
            const wishlist = user.metadata?.wishlist || []
            setIsWishlisted(wishlist.includes(product.id))
        }
    }, [product.id])

    const toggleWishlist = async () => {
        const savedUser = localStorage.getItem('ola_user')
        if (!savedUser) {
            alert(t.products.wishlist_login_required)
            return
        }

        const user = JSON.parse(savedUser)
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
            // Revert optimistic update
            setIsWishlisted(currentWishlist.includes(product.id))
            toast.error(t.products.wishlist_error)
        }
    }

    return (
        <div className={`container mx-auto px-4 pb-20 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                {/* Image Section */}
                <div className="space-y-6">
                    <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-rose-50/30 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border border-rose-100/50 shadow-2xl group">
                        <Image
                            src={getImageUrl(mainImage)}
                            alt={product.title}
                            fill
                            className="object-contain p-8 md:p-12 transition-transform duration-700 group-hover:scale-110"
                            priority
                            unoptimized={false}
                        />
                        {hasDiscount && discountPercentage > 0 && (
                            <div className={`absolute top-6 ${language === 'ar' ? 'right-6' : 'left-6'} bg-rose-600/90 backdrop-blur-md text-white text-sm md:text-base font-bold px-4 py-2 rounded-full shadow-xl`}>
                                {discountPercentage}% {t.products.discount_label}
                            </div>
                        )}

                        {/* Soft corner gradient */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/5 to-transparent pointer-events-none" />
                    </div>

                    {/* Thumbnail Gallery */}
                    {images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none px-2 justify-center lg:justify-start">
                            {images.map((image: any, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] overflow-hidden border-2 transition-all duration-300 shadow-sm ${selectedImage === index ? "border-rose-500 scale-105 shadow-rose-200" : "border-rose-100 hover:border-rose-300"}`}
                                >
                                    <Image
                                        src={getImageUrl(image.url)}
                                        alt={`${product.title} ${index + 1}`}
                                        fill
                                        className="object-cover p-1"
                                        unoptimized
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="flex flex-col h-full py-2 lg:py-6">
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            {product.metadata?.brand && (
                                <span className="bg-rose-50 text-rose-600 px-4 py-1.5 rounded-full font-black text-sm uppercase tracking-wide border border-rose-100 shadow-sm">
                                    {product.metadata.brand}
                                </span>
                            )}
                            <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 shadow-sm">
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                <span className="text-sm font-black text-amber-700">4.8</span>
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black mb-6 text-gray-900 leading-[1.2] tracking-tight">{product.title}</h1>

                        <div className={`flex items-center gap-6 mb-8 p-6 bg-gradient-to-l from-rose-50/50 to-transparent rounded-[2rem] border-rose-500 shadow-sm ${language === 'ar' ? 'border-r-4' : 'border-l-4'}`}>
                            <div className="flex flex-col">
                                <span className={`text-4xl md:text-5xl font-black ${hasDiscount ? "text-rose-600" : "text-gray-900"}`}>
                                    {formatPrice(numPrice)}
                                </span>
                                {hasDiscount && (
                                    <span className="text-xl text-gray-400 line-through decoration-rose-500/40 mt-1">
                                        {formatPrice(numOriginal)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 mb-10">
                        {/* Quantity */}
                        <div className="flex flex-col gap-4">
                            <h3 className="font-black text-gray-600 text-sm uppercase tracking-widest">{t.products.select_quantity}</h3>
                            <div className="flex items-center gap-6 bg-gray-50/80 p-1 rounded-2xl border border-gray-100 w-fit shadow-inner">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center rounded-xl bg-white text-gray-900 shadow-sm hover:bg-rose-500 hover:text-white transition-all font-black text-2xl">-</button>
                                <span className="w-12 text-center font-black text-2xl text-gray-900">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center rounded-xl bg-white text-gray-900 shadow-sm hover:bg-rose-500 hover:text-white transition-all font-black text-2xl">+</button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 items-stretch">
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding || isAdded}
                                className={`flex-[3] py-5 md:py-6 text-white rounded-2xl transition-all font-black text-xl flex items-center justify-center gap-4 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 ${isAdded ? "bg-emerald-600" : "bg-gray-900 hover:bg-rose-700"}`}
                            >
                                {isAdded ? (
                                    <> <Check className="w-7 h-7" /> {t.products.added_label} </>
                                ) : isAdding ? (
                                    <> <Loader2 className="w-7 h-7 animate-spin" /> {t.products.adding_label} </>
                                ) : (
                                    <> <ShoppingCart className="w-7 h-7" /> {t.products.add_to_cart_label || t.products.add_to_cart} </>
                                )}
                            </button>
                            <button
                                onClick={toggleWishlist}
                                className={`flex-1 rounded-2xl flex items-center justify-center transition-all border-2 shadow-lg active:scale-95 ${isWishlisted ? "bg-rose-50 border-rose-500 shadow-rose-100" : "bg-white border-gray-100 hover:border-rose-200"}`}
                            >
                                <Heart className={`w-8 h-8 ${isWishlisted ? "fill-rose-500 text-rose-500" : "text-gray-300"}`} />
                            </button>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-8 mt-auto">
                        <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                                <Check className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-sm text-gray-700">{t.products.authentic_label}</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                                <Check className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-sm text-gray-700">{t.products.cod_label}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description Section */}
            <div className={`mt-16 bg-white p-8 md:p-12 rounded-[3rem] border border-rose-50 shadow-2xl shadow-rose-100/20 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-8 w-2 bg-rose-500 rounded-full" />
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">{t.products.details_label}</h2>
                </div>
                <div className="prose prose-rose max-w-none">
                    <p className="text-gray-600 leading-relaxed text-xl font-medium whitespace-pre-line">
                        {product.description || t.products.no_description}
                    </p>
                </div>
            </div>
            {/* related products section */}
            {relatedProducts.length > 0 && (
                <div className="mt-20 border-t border-gray-100 pt-16">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="h-8 w-2 bg-rose-500 rounded-full" />
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                                {language === 'ar' ? 'منتجات قد تعجبك' : 'Products You May Like'}
                            </h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {relatedProducts.map((p: any) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
