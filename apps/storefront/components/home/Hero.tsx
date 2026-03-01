'use client'
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/context/LanguageContext"

export function Hero() {
    const { t, dir, language } = useLanguage()

    return (
        <section className={`relative overflow-hidden py-12 md:py-24 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
            {/* Elegant Background with Abstract Shapes */}
            <div className="absolute inset-0 bg-[#fffbfc]"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-100/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-50/50 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 animate-pulse-slow"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 rounded-full mb-6 border border-rose-100 shadow-sm animate-fade-in">
                        <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                        <span className="text-[10px] md:text-xs font-black text-rose-600 uppercase tracking-[0.2em]">
                            {language === 'ar' ? 'وصل حديثاً' : 'New Arrivals'}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-6 leading-[1.1] tracking-tight">
                        {language === 'ar' ? 'مختارات فاخرة من' : 'Exquisite Selections from'}
                        <span className="block bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent mt-2 py-1">
                            {language === 'ar' ? 'متجر العُلا' : 'Ola Shop'}
                        </span>
                    </h1>

                    <p className="text-lg md:text-2xl text-gray-600 mb-10 leading-relaxed font-medium max-w-2xl mx-auto">
                        {t.home.hero_subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center">
                        <Link
                            href="/products"
                            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-2xl transition-all font-black text-lg overflow-hidden shadow-xl shadow-gray-200 hover:scale-105 active:scale-95"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="relative z-10">{t.home.shop_now}</span>
                            <ArrowRight className={`relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1 ${language === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                        </Link>

                        <Link
                            href="/about"
                            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl hover:border-rose-200 hover:bg-rose-50/30 transition-all font-black text-lg shadow-sm hover:scale-105 active:scale-95"
                        >
                            {t.nav.about}
                        </Link>
                    </div>

                    {/* Trust Indicators: Elevated Cards */}
                    <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
                        {[
                            { icon: "✨", title: language === 'ar' ? 'أصلي 100%' : '100% Authentic', desc: language === 'ar' ? 'ضمان الجودة' : 'Quality Guaranteed' },
                            { icon: "🚚", title: language === 'ar' ? 'توصيل سريع' : 'Fast Delivery', desc: language === 'ar' ? 'لجميع الولايات' : 'To all states' },
                            { icon: "💬", title: language === 'ar' ? 'دعم فني 24/7' : '24/7 Support', desc: language === 'ar' ? 'نحن هنا لمتسقبلكم' : 'Always here for you' }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-white shadow-sm hover:shadow-md transition-all group hover:-translate-y-1">
                                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">
                                    {item.icon}
                                </div>
                                <h4 className="font-black text-gray-900 text-base md:text-lg mb-1">{item.title}</h4>
                                <p className="text-gray-400 text-xs md:text-sm font-bold">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
