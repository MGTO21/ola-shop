"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
    ShoppingBag,
    Trash2,
    Plus,
    Minus,
    ArrowRight,
    Loader2,
    ShieldCheck,
    Truck,
    ChevronLeft
} from "lucide-react"
import { formatPrice, getImageUrl } from "@/lib/utils"
import { STORE_CONFIG } from "@/lib/config"
import { toast } from "sonner"
import { useLanguage } from "@/lib/context/LanguageContext"

export default function CartPage() {
    const { t, dir, language } = useLanguage()
    const router = useRouter()
    const [cart, setCart] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState<string | null>(null)

    const fetchCart = async () => {
        try {
            const cartId = localStorage.getItem("cart_id")
            if (!cartId) {
                setLoading(false)
                return
            }

            const res = await fetch(`/api/cart-proxy?id=${cartId}`)
            if (res.ok) {
                const data = await res.json()
                setCart(data)
            }
        } catch (e) {
            console.error("Failed to fetch cart:", e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCart()
    }, [])

    const updateQuantity = async (lineItemId: string, currentQuantity: number, delta: number) => {
        const newQuantity = currentQuantity + delta
        if (newQuantity < 1) return

        const cartId = localStorage.getItem("cart_id")
        if (!cartId || !lineItemId || lineItemId === "undefined") {
            console.error("[Cart] Missing ID", { cartId, lineItemId })
            return
        }

        setUpdatingId(lineItemId)
        try {
            const res = await fetch(`/api/cart-proxy?id=${cartId}&line_item_id=${lineItemId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quantity: newQuantity })
            })

            if (res.ok) {
                // Re-fetch the full cart to get accurate updated state
                await fetchCart()
                window.dispatchEvent(new CustomEvent('cart-updated'))
                toast.success(t.cart.update_quantity_success)
            } else {
                const data = await res.json().catch(() => ({}))
                console.error("Update failed:", data)
                toast.error(t.cart.update_quantity_error)
                await fetchCart()
            }
        } catch (e) {
            console.error("Update quantity failed:", e)
            toast.error(t.cart.update_quantity_error)
            await fetchCart()
        } finally {
            setUpdatingId(null)
        }
    }

    const removeItem = async (lineItemId: string) => {
        setUpdatingId(lineItemId)
        try {
            const cartId = localStorage.getItem("cart_id")
            if (!cartId) return

            const res = await fetch(`/api/cart-proxy?id=${cartId}&line_item_id=${lineItemId}`, {
                method: "DELETE"
            })

            // Refresh cart regardless (Medusa v2 may return 200 with {deleted: true})
            await fetchCart()
            window.dispatchEvent(new CustomEvent('cart-updated'))
            toast.success(t.cart.remove_item_success)
        } catch (e) {
            console.error("Remove item failed:", e)
            toast.error(t.cart.remove_item_error)
        } finally {
            setUpdatingId(null)
        }
    }

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center bg-white ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
                <Loader2 className="w-10 h-10 text-rose-600 animate-spin" />
            </div>
        )
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className={`min-h-screen bg-gray-50 py-20 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
                <div className="container mx-auto px-4 text-center">
                    <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 max-w-2xl mx-auto">
                        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-600">
                            <ShoppingBag className="w-12 h-12" />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 mb-4">{t.cart.empty_title}</h1>
                        <p className="text-gray-500 font-bold mb-8">{t.cart.empty_text}</p>
                        <Link href="/products" className="inline-flex items-center gap-2 bg-rose-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-rose-200 hover:scale-105 active:scale-95 transition-all">
                            {t.cart.continue_shopping} {language === 'ar' ? <ChevronLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const subtotal = cart.items.reduce((acc: number, item: any) => acc + (item.unit_price * item.quantity), 0)
    const FREE_SHIPPING_THRESHOLD = STORE_CONFIG.FREE_SHIPPING_THRESHOLD
    const needsMoreForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0)

    return (
        <div className={`min-h-screen bg-gray-50 pb-20 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
            <div className="bg-white border-b border-gray-100 py-6 mb-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                        <ShoppingBag className="w-8 h-8 text-rose-600" /> {t.cart.title}
                        <span className="text-sm font-bold bg-rose-50 text-rose-600 px-3 py-1 rounded-full">
                            {t.cart.items_count.replace('{count}', cart.items.length.toString())}
                        </span>
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Items List */}
                    <div className="flex-1 space-y-4">
                        {needsMoreForFreeShipping > 0 ? (
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                                    <Truck className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-700">
                                        {t.cart.shipping_threshold_text.replace('{amount}', formatPrice(needsMoreForFreeShipping))}
                                    </p>
                                    <div className="w-full bg-gray-100 h-2 rounded-full mt-2 overflow-hidden">
                                        <div
                                            className="bg-rose-500 h-full transition-all duration-1000"
                                            style={{ width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-emerald-50 p-6 rounded-3xl shadow-sm border border-emerald-100 flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <p className="text-emerald-700 font-bold">{t.cart.free_shipping_congrats}</p>
                            </div>
                        )}

                        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                            <div className="divide-y divide-gray-50">
                                {cart.items.map((item: any) => (
                                    <div key={item.id} className="p-6 flex flex-col md:flex-row items-center gap-6 group hover:bg-gray-50/50 transition-colors">
                                        {/* Product Image */}
                                        <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                                            <Image
                                                src={getImageUrl(item.thumbnail)}
                                                alt={item.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className={`flex-1 text-center ${language === 'ar' ? 'md:text-right' : 'md:text-left'}`}>
                                            <h3 className="text-lg font-black text-gray-900 mb-1">{item.title}</h3>
                                            <p className="text-sm text-gray-500 font-bold mb-4">{item.variant_title || t.cart.original_product}</p>
                                            <div className="text-xl font-black text-rose-600">
                                                {formatPrice(item.unit_price * item.quantity)}
                                                <span className={`text-xs text-gray-400 font-bold ${language === 'ar' ? 'mr-2' : 'ml-2'}`}>
                                                    ({formatPrice(item.unit_price)} {t.cart.unit_price_label})
                                                </span>
                                            </div>
                                        </div>

                                        {/* Quantity & Actions */}
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="flex items-center bg-gray-100 rounded-2xl p-1 border border-gray-200">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity, -1)}
                                                    disabled={updatingId === item.id || item.quantity <= 1}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-600 hover:text-rose-600 shadow-sm disabled:opacity-50 transition-all font-black text-xl"
                                                >
                                                    -
                                                </button>
                                                <span className="w-12 text-center font-black text-gray-900 text-lg">
                                                    {updatingId === item.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity, 1)}
                                                    disabled={updatingId === item.id}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-600 hover:text-rose-600 shadow-sm disabled:opacity-50 transition-all font-black text-xl"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                disabled={updatingId === item.id}
                                                className="text-gray-400 hover:text-red-500 font-bold text-sm flex items-center gap-2 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" /> {t.cart.remove}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="lg:w-[400px]">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-32">
                            <h2 className="text-xl font-black text-gray-900 mb-8 pb-4 border-b border-gray-50">{t.cart.summary_title}</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center font-bold text-gray-600">
                                    <span>{t.cart.subtotal}</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center font-bold text-gray-600">
                                    <span>{t.cart.shipping}</span>
                                    {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                                        <span className="text-emerald-600 font-black">{t.cart.shipping_free}</span>
                                    ) : (
                                        <span>{t.checkout.shipping_calculated_later}</span>
                                    )}
                                </div>
                                <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                                    <span className="text-xl font-black text-gray-900">{t.cart.total}</span>
                                    <span className="text-3xl font-black text-rose-600">{formatPrice(subtotal)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push('/checkout')}
                                className="w-full bg-rose-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-rose-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                {t.cart.checkout} <ArrowRight className={`w-6 h-6 ${language === 'ar' ? 'rotate-180' : ''}`} />
                            </button>

                            <div className="mt-8 pt-8 space-y-4 border-t border-gray-50">
                                <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                    {t.cart.secure_checkout_text}
                                </div>
                                <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                                    <ArrowRight className={`w-5 h-5 text-blue-500 ${language === 'ar' ? 'rotate-180' : ''}`} />
                                    {t.cart.return_policy_text}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
