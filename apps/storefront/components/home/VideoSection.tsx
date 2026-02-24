"use client"

import { useLanguage } from "@/lib/context/LanguageContext"

export function VideoSection() {
    const { t, dir, language } = useLanguage()

    return (
        <section className={`py-12 bg-rose-50 my-8 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.home.podcast_title}</h2>
                    <p className="text-rose-600">{t.home.podcast_subtitle}</p>
                </div>
                <div className="aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-black relative">
                    {/* Placeholder for YouTube Embed - User can replace ID */}
                    <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </section>
    )
}
