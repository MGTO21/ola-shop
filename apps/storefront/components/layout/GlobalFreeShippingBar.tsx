"use client"
import { useEffect, useState } from "react"
import { Gift } from "lucide-react"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/lib/context/LanguageContext"

export function GlobalFreeShippingBar() {
    const { t, dir, language } = useLanguage()
    const pathname = usePathname()
    const [total, setTotal] = useState(0)
    const [hasItems, setHasItems] = useState(false)
    const [tempVisible, setTempVisible] = useState(false)
    const THRESHOLD = 500000

    const checkCart = async (isUpdateEvent = false) => {
        const cartId = localStorage.getItem("cart_id")
        if (!cartId) {
            setHasItems(false)
            return
        }
        try {
            const res = await fetch(`/api/cart-proxy?id=${cartId}`)
            if (res.ok) {
                const cart = await res.json()
                setTotal(cart.total || 0)
                const itemsRequest = (cart.items && cart.items.length > 0)
                setHasItems(itemsRequest)

                // Trigger popup only on update events (like Add to Cart), not initial load
                if (isUpdateEvent && itemsRequest) {
                    setTempVisible(true)
                    // Clear any existing timer if we could, but simple timeout is fine for now
                    setTimeout(() => setTempVisible(false), 10000)
                }
            }
        } catch (e) { console.error(e) }
    }

    // Initial Check
    useEffect(() => {
        checkCart(false)
    }, [])

    // Event Listener for Add to Cart / Updates
    useEffect(() => {
        const handleUpdate = () => checkCart(true)
        window.addEventListener("cart-updated", handleUpdate)
        window.addEventListener("storage", handleUpdate)
        return () => {
            window.removeEventListener("cart-updated", handleUpdate)
            window.removeEventListener("storage", handleUpdate)
        }
    }, [])

    // Visibility Logic: 
    // 1. Must have items.
    // 2. Visible if: On Cart Page OR Temporarily Triggered.
    const isCartPage = pathname === '/cart'
    const isVisible = hasItems && (isCartPage || tempVisible)

    if (!isVisible) return null

    const progress = Math.min(100, Math.max(0, (total / THRESHOLD) * 100))
    const remaining = Math.max(0, THRESHOLD - total)
    const isFree = total >= THRESHOLD

    return (
        <div className={`w-full bg-white border-b border-gray-100 shadow-sm transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'} ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
            <div className="container mx-auto px-4 py-3">
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-sm font-bold text-gray-800">
                        <div className="flex items-center gap-2">
                            <Gift className="w-5 h-5 text-rose-500" />
                            <span>{language === 'ar' ? `شحن مجاني للطلبات فوق ${THRESHOLD.toLocaleString()} جنيه` : `Free shipping for orders over SDG ${THRESHOLD.toLocaleString()}`}</span>
                        </div>
                        <span className="text-rose-600">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-l from-emerald-500 to-emerald-400 transition-all duration-500 ease-out ${language === 'en' ? 'origin-left' : ''}`} style={{ width: `${progress}%` }}></div>
                    </div>
                    {!isFree ? (
                        <p className="text-xs text-center text-gray-500 mt-0.5">
                            {t.header.remaining_for_free_shipping.replace("{amount}", remaining.toLocaleString())}
                        </p>
                    ) : (
                        <p className="text-xs text-center text-emerald-600 font-bold mt-0.5 animate-bounce">
                            {t.header.congrats_free_shipping}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
