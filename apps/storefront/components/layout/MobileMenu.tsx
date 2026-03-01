"use client"

import Link from "next/link"
import Image from "next/image"
import { X, Globe, Home, Sparkles, Flame, Shirt, ShoppingBag, Info, Phone, User, Heart, ShoppingCart } from "lucide-react"
import { useLanguage } from "@/lib/context/LanguageContext"

interface MobileMenuProps {
    onClose: () => void
}

export function MobileMenu({ onClose }: MobileMenuProps) {
    const { language, setLanguage, t, dir } = useLanguage()

    const menuGroups = [
        {
            title: language === 'ar' ? 'التسوق' : 'Shop',
            items: [
                { name: t.nav.home, href: "/", icon: Home },
                { name: t.nav.cosmetics, href: "/products?category=cosmetics", icon: FlowerIcon },
                { name: t.nav.perfumes, href: "/products?category=perfumes", icon: Sparkles },
                { name: t.nav.fashion, href: "/products?category=fashion", icon: Shirt },
                { name: t.nav.accessories, href: "/products?category=accessories", icon: ShoppingBag },
                { name: t.nav.sudanese, href: "/products?category=sudanese", icon: Flame, color: "text-emerald-600" },
            ]
        },
        {
            title: language === 'ar' ? 'حسابي' : 'Account',
            items: [
                { name: t.nav.account, href: "/account", icon: User },
                { name: t.header.wishlist_label, href: "/account?tab=wishlist", icon: Heart },
                { name: t.header.cart_label, href: "/cart", icon: ShoppingCart },
            ]
        },
        {
            title: language === 'ar' ? 'عن المتجر' : 'About Us',
            items: [
                { name: t.nav.about, href: "/about", icon: Info },
                { name: t.nav.contact, href: "/contact", icon: Phone },
            ]
        }
    ]

    return (
        <div className={`fixed inset-0 z-[100] md:hidden ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
            {/* Backdrop with high blur */}
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

            {/* Menu Panel */}
            <div className={`fixed ${language === 'ar' ? 'right-0' : 'left-0'} top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out`}>

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-rose-50/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 relative">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="font-bold text-xl text-rose-600">Ola Shop</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm bg-white">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Navigation Scroll Area */}
                <nav className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                    <div className="space-y-8">
                        {menuGroups.map((group, gIdx) => (
                            <div key={gIdx} className="space-y-3">
                                <h3 className="text-[10px] uppercase tracking-[0.2em] text-rose-400 font-black px-2">
                                    {group.title}
                                </h3>
                                <ul className="space-y-1">
                                    {group.items.map((item, iIdx) => {
                                        const Icon = item.icon
                                        return (
                                            <li key={iIdx}>
                                                <Link
                                                    href={item.href}
                                                    onClick={onClose}
                                                    className={`flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-rose-50 text-gray-700 hover:text-rose-600 transition-all active:scale-95 group ${item.color || ''}`}
                                                >
                                                    <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-white shadow-sm transition-colors">
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <span className="font-bold text-base">{item.name}</span>
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        ))}
                    </div>
                </nav>

                {/* Footer Actions */}
                <div className="p-5 border-t border-gray-100 bg-gray-50/50">
                    <button
                        onClick={() => {
                            setLanguage(language === 'ar' ? 'en' : 'ar')
                            onClose()
                        }}
                        className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-rose-200 transition-all font-bold group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                                <Globe className="w-5 h-5" />
                            </div>
                            <span className="text-gray-700">{t.header.language_label}</span>
                        </div>
                        <span className="text-xs font-black px-3 py-1 bg-rose-600 text-white rounded-full">
                            {language === 'ar' ? 'EN' : 'عربي'}
                        </span>
                    </button>

                    <div className="mt-4 text-center">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            © {new Date().getFullYear()} Ola Shop Sudan
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function FlowerIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M12 7.5V2M12 7.5C10.5 7.5 8 6 8 4.5S9.5 2 12 2s4 1 4 2.5S13.5 7.5 12 7.5zM12 16.5V22M12 16.5c1.5 0 4 1.5 4 3s-1.5 2.5-4 2.5-4-1-4-2.5 1.5-3 4-3zM7.5 12H2M7.5 12C7.5 10.5 6 8 4.5 8S2 9.5 2 12s1 4 2.5 4 3-1.5 3-4.5zM16.5 12H22M16.5 12c0 1.5 1.5 4 3 4s2.5-1.5 2.5-4-1-4-2.5-4-3 1.5-4 4.5z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    )
}
