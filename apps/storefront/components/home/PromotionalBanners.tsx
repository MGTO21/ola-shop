'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'

interface Banner {
    id: string
    image: string
    title: string
    titleEn: string
    link: string
    enabled: boolean
}

interface BannersConfig {
    topBanner: Banner
    middleBanner: Banner
    bottomBanner: Banner
}

export function PromotionalBanners() {
    const { t, dir, language } = useLanguage()
    const [banners, setBanners] = useState<BannersConfig | null>(null)
    const [dismissedBanners, setDismissedBanners] = useState<string[]>([])

    useEffect(() => {
        fetch('/config/hero-sections.json')
            .then(res => res.json())
            .then(data => setBanners(data.promotionalBanners))
            .catch(err => console.error('Failed to load banners:', err))

        // Load dismissed banners from localStorage
        const dismissed = localStorage.getItem('dismissedBanners')
        if (dismissed) {
            setDismissedBanners(JSON.parse(dismissed))
        }
    }, [])

    const dismissBanner = (bannerId: string) => {
        const updated = [...dismissedBanners, bannerId]
        setDismissedBanners(updated)
        localStorage.setItem('dismissedBanners', JSON.stringify(updated))
    }

    const renderBanner = (banner: Banner | undefined, position: 'top' | 'middle' | 'bottom') => {
        if (!banner || !banner.enabled || dismissedBanners.includes(banner.id)) {
            return null
        }

        const heightClass = position === 'top'
            ? 'h-48 md:h-64 lg:h-80 xl:h-96'
            : 'h-32 md:h-48 lg:h-64'

        const bannerTitle = language === 'ar' ? banner.title : banner.titleEn

        return (
            <div className={`relative group overflow-hidden rounded-xl shadow-lg ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
                <Link href={banner.link} className="block">
                    <div className={`relative ${heightClass} overflow-hidden`}>
                        <Image
                            src={banner.image}
                            alt={bannerTitle}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                                // Fallback gradient
                                const target = e.target as HTMLElement
                                target.style.background = 'linear-gradient(135deg, #FF6B9D 0%, #C2185B 100%)'
                            }}
                        />
                        <div className={`absolute inset-0 bg-gradient-to-${language === 'ar' ? 'l' : 'r'} from-black/50 to-transparent`}></div>

                        <div className={`relative h-full flex items-center px-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                            <div className="text-white">
                                <h3 className="text-2xl md:text-3xl font-bold mb-1">
                                    {bannerTitle}
                                </h3>
                            </div>
                        </div>
                    </div>
                </Link>

                <button
                    onClick={() => dismissBanner(banner.id)}
                    className={`absolute top-2 ${language === 'ar' ? 'left-2' : 'right-2'} bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-colors z-10`}
                    aria-label="Dismiss banner"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        )
    }

    if (!banners) return null

    return (
        <div className="space-y-6">
            {renderBanner(banners.topBanner, 'top')}
            {renderBanner(banners.middleBanner, 'middle')}
            {renderBanner(banners.bottomBanner, 'bottom')}
        </div>
    )
}
