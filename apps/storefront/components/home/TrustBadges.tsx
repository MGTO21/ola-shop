'use client'
import { Shield, Truck, Headphones, Award } from "lucide-react"
import { useLanguage } from "@/lib/context/LanguageContext"

const iconMap: Record<number, any> = {
    0: Shield,
    1: Truck,
    2: Headphones,
    3: Award
}

export function TrustBadges() {
    const { t, dir, language } = useLanguage()
    const badges = t.home.trust_badges

    return (
        <section className={`py-12 bg-white border-y ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {badges.map((badge, index) => {
                        const Icon = iconMap[index] || Shield
                        return (
                            <div key={badge.title} className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center shadow-inner">
                                    <Icon className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm mb-1">{badge.title}</h3>
                                <p className="text-xs text-gray-500">{badge.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
