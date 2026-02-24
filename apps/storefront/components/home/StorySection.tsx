'use client'
import React from 'react'
import { Play, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'

export default function StorySection() {
    const { t, dir, language } = useLanguage()

    return (
        <section className={`container mx-auto px-4 my-24 max-w-6xl ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
            <div className="mb-10 text-center">
                <span className="bg-pink-100 text-pink-800 text-xs font-bold px-3 py-1 rounded-full border border-pink-200 uppercase tracking-wide">
                    {t.home.story_badge}
                </span>
                <h2 className="text-4xl font-bold mt-4 text-gray-900">
                    {t.home.story_title}
                </h2>
                <p className="text-gray-500 mt-2">
                    {t.home.story_subtitle}
                </p>
            </div>
            <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer">
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <style jsx>{`
                        @keyframes ken-burns-slow { 
                            0% { transform: scale(1.0); } 
                            50% { transform: scale(1.10); } 
                            100% { transform: scale(1.0); } 
                        }
                        .animate-ken-burns { animation: ken-burns-slow 25s ease-in-out infinite; }
                    `}</style>
                    <img
                        src="https://images.unsplash.com/photo-1605218427339-93b584e03fb8?q=80&w=2600&auto=format&fit=crop"
                        alt={t.home.story_title}
                        className="w-full h-full object-cover animate-ken-burns"
                    />
                </div>
                <div className={`absolute inset-0 bg-gradient-to-${language === 'ar' ? 'l' : 'r'} from-black/80 via-black/40 to-transparent`}></div>
                <div className={`absolute inset-0 flex flex-col md:flex-row items-center justify-between p-8 md:p-16 ${language === 'ar' ? 'md:flex-row-reverse' : ''}`}>
                    <div className={`flex-1 text-white z-10 max-w-lg text-center ${language === 'ar' ? 'md:text-right' : 'md:text-left'} space-y-6`}>
                        <div className="inline-block border border-white/30 backdrop-blur-sm px-4 py-1 rounded-full text-sm tracking-widest uppercase">
                            {t.home.ritual_badge}
                        </div>
                        <h2 className="text-4xl md:text-6xl leading-tight">
                            {language === 'ar' ? 'الدلكة' : 'Sudanese'} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-100 italic">
                                {language === 'ar' ? 'السودانية' : 'Dilka'}
                            </span>
                        </h2>
                        <p className="text-lg text-gray-200 font-light leading-relaxed">
                            {t.home.ritual_description}
                        </p>
                        <button className="bg-white text-rose-900 px-8 py-4 rounded-full font-bold hover:bg-rose-50 transition-colors flex items-center gap-2 mx-auto md:mx-0 shadow-lg hover:shadow-xl">
                            {t.home.shop_ritual}
                            <ArrowRight className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                    <div className="flex-1 flex justify-center items-center mt-8 md:mt-0">
                        <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                            <Play className={`w-10 h-10 text-white fill-current ${language === 'ar' ? 'mr-1' : 'ml-1'}`} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
