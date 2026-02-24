"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/context/LanguageContext"

const purchases = [
    { name: "سارة أ.", city: "بورتسودان", product: "عطر ليالي الشرق", time: "منذ دقيقة" },
    { name: "منى م.", city: "عطبرة", product: "مجموعة العناية بالبشرة", time: "منذ دقيقتين" },
    { name: "مريم ت.", city: "بورتسودان", product: "سيروم الهيالورونيك", time: "منذ ٣ دقائق" },
    { name: "أمل خ.", city: "عطبرة", product: "كريم الترطيب العميق", time: "منذ ٥ دقائق" }
]

export function PurchasePopup() {
    const { t, dir, language } = useLanguage()
    const [current, setCurrent] = useState(0)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const showPopup = () => {
            setIsVisible(true)
            setTimeout(() => {
                setIsVisible(false)
                setCurrent((prev) => (prev + 1) % purchases.length)
            }, 5000) // Stay for 5 seconds
        }

        // Initial show after 5s
        const initialTimer = setTimeout(showPopup, 5000)

        // Repeat every 60s
        const interval = setInterval(showPopup, 60000)

        return () => {
            clearTimeout(initialTimer)
            clearInterval(interval)
        }
    }, [])

    if (!isVisible) return null

    const purchase = t.popups.purchases[current]
    const timeLabels = [
        t.popups.purchase_time.one_min,
        t.popups.purchase_time.two_mins,
        t.popups.purchase_time.three_mins,
        t.popups.purchase_time.five_mins
    ]
    const timeLabel = timeLabels[current % timeLabels.length]

    return (
        <div
            className={cn(
                "fixed bottom-6 z-[60] animate-in duration-500",
                language === 'ar' ? "left-6 slide-in-from-left-full" : "right-6 slide-in-from-right-full",
                "max-w-[320px] w-full",
                language === 'ar' ? 'font-arabic' : 'font-sans'
            )}
            dir={dir}
        >
            <div className="bg-white/90 backdrop-blur-md border border-pink-100 rounded-2xl p-4 shadow-2xl flex items-center gap-4 relative group">
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <X className="w-3 h-3" />
                </button>

                <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-6 h-6 text-rose-500" />
                </div>

                <div className="flex-1 overflow-hidden">
                    <p className={`text-sm font-bold text-gray-900 truncate ${language === 'en' ? 'text-left' : 'text-right'}`}>
                        {t.popups.purchase_prefix} {purchase.name} {t.popups.purchase_from} {purchase.city}
                    </p>
                    <p className={`text-xs text-gray-600 truncate mb-1 ${language === 'en' ? 'text-left' : 'text-right'}`}>
                        {t.popups.purchase_bought} {purchase.product}
                    </p>
                    <p className={`text-[10px] text-pink-500 font-medium ${language === 'en' ? 'text-left' : 'text-right'}`}>
                        {timeLabel}
                    </p>
                </div>
            </div>
        </div>
    )
}
