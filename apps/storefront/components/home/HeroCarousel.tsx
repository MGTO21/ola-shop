"use client"
import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'

export default function HeroCarousel() {
    const [currentHero, setCurrentHero] = useState(0)

    const heroSlides = [
        { id: 1, title: "طبيعة مقطرة", img: "https://images.unsplash.com/photo-1605218427339-93b584e03fb8?q=80&w=2600&auto=format&fit=crop", sub: "فخامة سودانية" },
        { id: 2, title: "عود ملكي", img: "https://images.unsplash.com/photo-1594053468588-cde2449d95e4?q=80&w=2600&auto=format&fit=crop", sub: "روائح الخرطوم" },
        { id: 3, title: "أزياء عصرية", img: "https://images.unsplash.com/photo-1585487000160-adeb70ad3304?q=80&w=2600&auto=format&fit=crop", sub: "أناقة بلا حدود" },
    ]

    return (
        <section className="relative h-[70vh] bg-gray-900 overflow-hidden" dir="rtl">
            <style jsx>{`
        @keyframes ken-burns { 0% { transform: scale(1.0); } 50% { transform: scale(1.15); } 100% { transform: scale(1.0); } }
        .animate-ken-burns { animation: ken-burns 20s ease-in-out infinite; }
      `}</style>
            {heroSlides.map((slide, idx) => (
                <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ${currentHero === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                    <img src={slide.img} className="w-full h-full object-cover animate-ken-burns" />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>
            ))}
            <div className="absolute inset-0 flex items-center justify-center flex-col z-20">
                <div className="text-center bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 max-w-2xl mx-4 shadow-2xl">
                    <span className="text-rose-200 tracking-widest uppercase text-sm font-bold animate-fade-in">{heroSlides[currentHero].sub}</span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white my-4 font-serif">{heroSlides[currentHero].title}</h1>
                    <button className="mt-6 bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-pink-50 transition-colors flex items-center gap-2 mx-auto">
                        تسوق المجموعة <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-30">
                {heroSlides.map((control, idx) => (
                    <button key={control.id} onClick={() => setCurrentHero(idx)} className={`h-3 rounded-full transition-all duration-300 ${currentHero === idx ? 'bg-rose-500 w-8' : 'bg-white/50 w-3 hover:bg-white'}`} />
                ))}
            </div>
        </section>
    )
}
