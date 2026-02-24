'use client'
import React from 'react'
import { Gift } from 'lucide-react'

interface FreeShippingBarProps { currentTotal: number }

export default function FreeShippingBar({ currentTotal }: FreeShippingBarProps) {
    const FREE_SHIPPING_THRESHOLD = 500000
    const progress = Math.min((currentTotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
    const remaining = Math.max(FREE_SHIPPING_THRESHOLD - currentTotal, 0)

    return (
        <div className="w-full bg-white border-b border-gray-100 p-4 sticky top-16 z-40 shadow-sm dir-rtl h-auto">
            <div className="container mx-auto max-w-4xl">
                {/* Title Row with Arabic Text */}
                <div className="flex items-center justify-between mb-2 text-sm">
                    <div className="flex items-center gap-2 font-bold text-gray-800 font-arabic">
                        <Gift className="w-5 h-5 text-rose-500" />
                        <span className="text-base">شحن مجاني للطلبات فوق 500,000 جنيه</span>
                    </div>
                    <span className="text-gray-500 font-sans">{progress.toFixed(0)}%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden border border-gray-200">
                    <div
                        className="bg-gradient-to-r from-rose-400 to-emerald-400 h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {/* Dynamic Remaining Text */}
                <p className="text-center text-sm text-gray-600 font-arabic font-medium">
                    {remaining > 0
                        ? <>متبقي <span className="font-bold text-rose-600 font-sans mx-1">{remaining.toLocaleString()}</span> جنيه للحصول على الشحن المجاني</>
                        : <span className="text-emerald-600 font-bold flex items-center justify-center gap-1">🎉 تهانينا! تم تفعيل الشحن المجاني!</span>}
                </p>
            </div>
        </div>
    )
}
