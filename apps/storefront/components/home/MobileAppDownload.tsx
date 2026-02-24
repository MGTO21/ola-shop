'use client'
import { Apple, Smartphone } from "lucide-react"
import { useLanguage } from "@/lib/context/LanguageContext"

export function MobileAppDownload() {
    const { t, dir, language } = useLanguage()

    return (
        <section className={`py-16 bg-gradient-to-br from-primary via-purple to-secondary text-white ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
                        {t.home.app_download_title}
                    </h2>
                    <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed">
                        {t.home.app_download_text}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <a
                            href="#"
                            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-black text-white rounded-2xl hover:bg-gray-900 transition-all hover:scale-105 shadow-xl"
                        >
                            <Apple className="w-8 h-8" />
                            <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                                <div className="text-xs opacity-70">{language === 'ar' ? 'متوفر على' : 'Available on'}</div>
                                <div className="text-lg font-bold">App Store</div>
                            </div>
                        </a>

                        <a
                            href="#"
                            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all hover:scale-105 shadow-xl"
                        >
                            <Smartphone className="w-8 h-8" />
                            <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                                <div className="text-xs opacity-70">{language === 'ar' ? 'متاح على' : 'Available on'}</div>
                                <div className="text-lg font-bold">Google Play</div>
                            </div>
                        </a>
                    </div>

                    <div className="inline-block px-8 py-3 bg-white/10 backdrop-blur-md rounded-full text-sm md:text-base font-bold border border-white/20 animate-pulse">
                        {language === 'ar' ? '🔥 تجربة التسوق عبر التطبيق أسرع وأسهل!' : '🔥 Shopping via the app is faster and easier!'}
                    </div>
                </div>
            </div>
        </section>
    )
}
