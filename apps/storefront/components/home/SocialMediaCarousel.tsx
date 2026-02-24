"use client"

import { useRef, useEffect } from "react"
import { Play, Volume2, VolumeX } from "lucide-react"
import { useState } from "react"

const socialVideos = [
    {
        id: 1,
        thumbnail: "/images/video-thumb-1.jpg",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-applying-makeup-in-front-of-a-mirror-39735-large.mp4",
        username: "@olashop_sd",
        description: "New arrival! ✨ #makeup #beauty"
    },
    {
        id: 2,
        thumbnail: "/images/video-thumb-2.jpg",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-applying-face-cream-39738-large.mp4",
        username: "@olashop_sd",
        description: "Skincare routine 🧴 #skincare"
    },
    {
        id: 3,
        thumbnail: "/images/video-thumb-3.jpg",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-applying-eyeshadow-39732-large.mp4",
        username: "@olashop_sd",
        description: "Eye look tutorial 👁️ #tutorial"
    },
    {
        id: 4,
        thumbnail: "/images/video-thumb-4.jpg",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-putting-on-lipstick-39739-large.mp4",
        username: "@olashop_sd",
        description: "Perfect red lip 💄 #lipstick"
    }
]

export function SocialMediaCarousel() {
    const [muted, setMuted] = useState(true)

    return (
        <section className="py-12 bg-gray-50" dir="rtl">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8 font-arabic">
                    <h2 className="text-2xl font-bold text-gray-900">
                        الأكثر تداولاً على وسائل التواصل
                    </h2>
                    <button
                        onClick={() => setMuted(!muted)}
                        className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors"
                        title={muted ? "تشغيل الصوت" : "كتم الصوت"}
                    >
                        {muted ? <VolumeX className="w-5 h-5 text-gray-500" /> : <Volume2 className="w-5 h-5 text-rose-600" />}
                    </button>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
                    {socialVideos.map((video) => (
                        <div
                            key={video.id}
                            className="flex-shrink-0 w-64 h-[400px] bg-black rounded-xl overflow-hidden relative snap-center group shadow-lg"
                        >
                            <video
                                src={video.videoUrl}
                                className="w-full h-full object-cover"
                                autoPlay
                                loop
                                muted={muted}
                                playsInline
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 p-4 flex flex-col justify-end">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs border-2 border-white">
                                        O
                                    </div>
                                    <span className="text-white text-sm font-medium shadow-black drop-shadow-md">
                                        {video.username}
                                    </span>
                                </div>
                                <p className="text-white text-sm line-clamp-2 drop-shadow-md">
                                    {video.description}
                                </p>
                            </div>

                            {/* Play Icon (visual cue) */}
                            <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm p-1.5 rounded-full">
                                <Play className="w-4 h-4 text-white fill-white" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
