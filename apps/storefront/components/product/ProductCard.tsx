'use client'

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Check, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { formatPrice, calculateDiscountPercentage, getImageUrl } from "@/lib/utils"
import { toast } from "sonner"
import { useLanguage } from "@/lib/context/LanguageContext"

interface ProductCardProps {
    product: any
}

export function ProductCard({ product }: ProductCardProps) {
    const { t, dir, language } = useLanguage()
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [imgSrc, setImgSrc] = useState(getImageUrl(product.thumbnail || product.images?.[0]?.url))
    const [isAdding, setIsAdding] = useState(false)
    const [isAdded, setIsAdded] = useState(false)

    // Check wishlist status on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('ola_user')
        if (savedUser) {
            const user = JSON.parse(savedUser)
            const wishlist = user.metadata?.wishlist || []
            setIsWishlisted(wishlist.includes(product.id))
        }
    }, [product.id])

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const savedUser = localStorage.getItem('ola_user')
        if (!savedUser) {
            toast.error(t.products.wishlist_login_required)
            return
        }

        const user = JSON.parse(savedUser)
        const currentWishlist = user.metadata?.wishlist || []
        let newWishlist = []
        let actionMessage = ""

        if (currentWishlist.includes(product.id)) {
            newWishlist = currentWishlist.filter((id: string) => id !== product.id)
            actionMessage = t.products.wishlist_remove
        } else {
            newWishlist = [...currentWishlist, product.id]
            actionMessage = t.products.wishlist_add
        }

        setIsWishlisted(!isWishlisted) // Optimistic update

        // Persist to backend
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
                toast.success(actionMessage)
            } else {
                // Revert optimistic update if API fails
                setIsWishlisted(currentWishlist.includes(product.id))
                toast.error(t.messages.error)
            }
        } catch (err) {
            console.error("Wishlist sync failed", err)
            // Revert optimistic update if API fails
            setIsWishlisted(currentWishlist.includes(product.id))
            toast.error(t.messages.error)
        }
    }

    // PRICE LOGIC
    const variant = product.variants?.[0]
    let price = 0
    let originalPrice = 0

    if (variant) {
        if (variant.calculated_price?.calculated_amount !== undefined && variant.calculated_price?.calculated_amount !== null && Number(variant.calculated_price.calculated_amount) > 0) {
            price = Number(variant.calculated_price.calculated_amount)
            originalPrice = Number(variant.calculated_price.original_amount) || price
        } else if (variant.prices && variant.prices.length > 0) {
            const sdgPrice = variant.prices.find((p: any) => p.currency_code?.toLowerCase() === 'sdg')
            const priceObj = sdgPrice || variant.prices[0]
            price = Number(priceObj.amount)
            originalPrice = price
        }
    }

    const numPrice = Number(price)
    const numOriginal = Number(originalPrice)
    const hasDiscount = numOriginal > numPrice && numPrice > 0
    const discountPercentage = hasDiscount ? calculateDiscountPercentage(numOriginal, numPrice) : 0
    const isNew = product.metadata?.is_new === true || product.metadata?.featured === true

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault()
        if (!variant?.id) {
            toast.error(t.products.add_to_cart_error)
            return
        }

        setIsAdding(true)
        try {
            const cartId = localStorage.getItem('cart_id')
            let res = await fetch(`/api/cart-proxy?id=${cartId || ''}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    variant_id: variant.id,
                    quantity: 1
                })
            })

            if (!res.ok && cartId) {
                localStorage.removeItem('cart_id')
                res = await fetch(`/api/cart-proxy`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        variant_id: variant.id,
                        quantity: 1
                    })
                })
            }

            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.error || "Failed")
            }

            const newCartId = data.cart?.id || data.id
            if (newCartId) {
                localStorage.setItem('cart_id', newCartId)
                window.dispatchEvent(new CustomEvent('cart-updated'))
                setIsAdded(true)
                toast.success(t.products.added_to_cart)
                setTimeout(() => setIsAdded(false), 2000)
            }
        } catch (err: any) {
            console.error("Error adding to cart:", err)
            toast.error(t.products.add_to_cart_error)
        } finally {
            setIsAdding(false)
        }
    }

    return (
        <div className={`group bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-rose-100/50 flex flex-col h-full ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
            <Link href={`/products/${product.id}`} className="block relative aspect-square bg-gradient-to-br from-gray-50/50 to-rose-50/30 p-2 md:p-4 overflow-hidden">
                {isNew && (
                    <div className={`absolute top-3 z-10 ${language === 'ar' ? 'right-3' : 'left-3'}`}>
                        <span className="bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                            {t.products.new_badge}
                        </span>
                    </div>
                )}

                {hasDiscount && (
                    <div className={`absolute top-3 z-10 ${language === 'ar' ? 'left-3' : 'right-3'}`}>
                        <span className="bg-rose-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                            {discountPercentage}%-
                        </span>
                    </div>
                )}

                <Image
                    src={imgSrc}
                    alt={product.title}
                    fill
                    unoptimized
                    className="object-contain group-hover:scale-110 transition-transform duration-700 p-4"
                    onError={() => setImgSrc("/logo.png")}
                />

                <div className="absolute inset-0 bg-rose-900/0 group-hover:bg-rose-900/5 transition-colors duration-500" />
            </Link>

            <div className="p-3 md:p-5 flex flex-col flex-1">
                <div className="mb-2 md:mb-4 flex-1">
                    <Link href={`/products/${product.id}`}>
                        <h3 className={`text-gray-900 font-bold text-sm md:text-lg line-clamp-2 min-h-[40px] md:min-h-[56px] hover:text-rose-600 transition-colors leading-tight ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                            {product.title}
                        </h3>
                    </Link>
                </div>

                <div className="flex flex-col gap-3">
                    <div className={`flex items-baseline gap-2 ${language === 'ar' ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
                        <span className="text-lg md:text-2xl font-black text-rose-600">
                            {formatPrice(numPrice)}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs md:text-sm text-gray-400 line-through decoration-rose-500/30">
                                {formatPrice(numOriginal)}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleWishlist}
                            className={`p-2.5 md:p-3 rounded-2xl transition-all shadow-sm border ${isWishlisted ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-gray-50 border-gray-100 text-gray-400 hover:text-rose-600 hover:bg-rose-50/50'}`}
                            title={isWishlisted ? t.products.wishlist_remove : t.products.wishlist_add}
                        >
                            <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
                        </button>
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            className="bg-gray-900 hover:bg-rose-700 text-white p-2.5 md:p-3 rounded-2xl transition-all shadow-lg hover:shadow-rose-200 flex-1 flex items-center justify-center gap-2 text-xs md:text-base font-bold select-none active:scale-95"
                            title={t.products.add_to_cart}
                        >
                            {isAdded ? (
                                <> <Check className="w-4 h-4" /> </>
                            ) : isAdding ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <> <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" /> <span className="hidden xs:inline">{t.products.add_to_cart}</span> </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
