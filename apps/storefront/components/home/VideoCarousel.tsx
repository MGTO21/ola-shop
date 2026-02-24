'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/lib/context/LanguageContext'

export default function VideoCarousel() {
    const { t, dir, language } = useLanguage()

    useEffect(() => {
        // Load TikTok script
        const script = document.createElement('script')
        script.src = 'https://www.tiktok.com/embed.js'
        script.async = true
        document.body.appendChild(script)
    }, [])

    return (
        <section className={`py-8 bg-gradient-to-br from-pink-50 via-white to-purple-50 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
            <div className="container mx-auto px-4">
                {/* Split Video Area - TikTok Left, YouTube Right */}
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* TikTok Area */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-pink-100">
                            <div className="bg-gradient-to-r from-pink-500 to-rose-600 p-3 text-white text-center">
                                <h3 className="text-lg font-bold">{t.home.tiktok}</h3>
                                <p className="text-sm opacity-90" dir="ltr">@ola.beauty.sd</p>
                            </div>
                            <div className="h-[500px] md:h-[600px] bg-gray-50 flex items-center justify-center">
                                <blockquote
                                    className="tiktok-embed"
                                    cite="https://www.tiktok.com/@ola.beauty.sd"
                                    data-unique-id="ola.beauty.sd"
                                    data-embed-type="creator"
                                    style={{ maxWidth: '100%', minWidth: '288px' }}
                                >
                                    <section>
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href="https://www.tiktok.com/@ola.beauty.sd"
                                        >
                                            @ola.beauty.sd
                                        </a>
                                    </section>
                                </blockquote>
                            </div>
                        </div>

                        {/* YouTube Area */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-red-50">
                            <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 text-white text-center">
                                <h3 className="text-lg font-bold">{t.home.youtube}</h3>
                                <p className="text-sm opacity-90">{language === 'ar' ? 'متجر العُلا' : 'Ola Shop'}</p>
                            </div>
                            <div className="h-[500px] md:h-[600px] bg-gray-50 flex items-center justify-center">
                                <div className="text-center p-8">
                                    <svg className="w-24 h-24 mx-auto mb-6 text-red-500 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                    <p className="text-gray-900 font-bold text-2xl mb-2">{t.home.follow_us}</p>
                                    <p className="text-gray-500">{t.home.watch_tutorials}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
