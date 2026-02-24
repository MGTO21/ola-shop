'use client'

import { Star, Quote, Heart } from "lucide-react"
import { useLanguage } from "@/lib/context/LanguageContext"

export function CustomerReviews() {
    const { t, dir, language } = useLanguage()
    const reviews = t.home.reviews

    return (
        <section className={`py-24 bg-white relative overflow-hidden ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-rose-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-60" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-full font-bold text-sm mb-4">
                        <Heart className="w-4 h-4 fill-current" />
                        <span>{t.home.reviews_badge}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">{t.home.reviews_title}</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto font-medium">
                        {t.home.reviews_subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="group relative bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                        >
                            {/* Gradient Accent */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${review.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]`} />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex gap-1 text-yellow-400">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-current" />
                                        ))}
                                    </div>
                                    <Quote className="w-8 h-8 text-rose-100 group-hover:text-rose-200 transition-colors" />
                                </div>

                                <p className="text-gray-700 leading-relaxed font-medium mb-8 min-h-[100px]">
                                    {review.comment}
                                </p>

                                <div className="flex items-center gap-4 pt-6 border-t border-gray-50 group-hover:border-white/50">
                                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-rose-600 text-xl shadow-inner border border-white">
                                        {review.name.charAt(0)}
                                    </div>
                                    <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                                        <h4 className="font-bold text-gray-900">{review.name}</h4>
                                        <p className="text-xs text-rose-500 font-bold">{review.city}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
