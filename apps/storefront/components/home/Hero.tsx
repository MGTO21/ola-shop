'use client'
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/context/LanguageContext"

export function Hero() {
    const { t, dir, language } = useLanguage()

    return (
        <section className={`relative bg-gradient-to-br from-primary/10 via-purple/5 to-secondary/10 py-8 md:py-12 backdrop-blur-sm ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md"></div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-xl mx-auto text-center">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                        {language === 'ar' ? 'مختارات فاخرة من' : 'Exquisite Selections from'}
                        <span className="block text-primary mt-2">{language === 'ar' ? 'متجر العُلا' : 'Ola Shop'}</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
                        {t.home.hero_subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-bold text-lg shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {t.home.shop_now}
                            <ArrowRight className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                        </Link>

                        <Link
                            href="/about"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition-all font-bold text-lg shadow-sm hover:shadow-primary/10 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {t.nav.about}
                        </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm md:text-base text-gray-700 font-bold border-t border-gray-100 pt-8">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">✓</span>
                            <span>{language === 'ar' ? 'أصلي 100%' : '100% Authentic'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🚚</span>
                            <span>{language === 'ar' ? 'توصيل سريع' : 'Fast Delivery'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xl">💬</span>
                            <span>{language === 'ar' ? 'دعم فني 24/7' : '24/7 Support'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
