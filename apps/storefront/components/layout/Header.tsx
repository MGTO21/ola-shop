'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingCart, Menu, X, User, Globe, Gift, Heart } from 'lucide-react'
import { MobileMenu } from './MobileMenu'
import { SearchOverlay } from './SearchOverlay'
import { useLanguage } from '@/lib/context/LanguageContext'

export function Header() {
    const { language, setLanguage, t, dir } = useLanguage()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [cartTotal, setCartTotal] = useState(0)
    const [cartCount, setCartCount] = useState(0)
    const [showShippingBar, setShowShippingBar] = useState(false)
    const [cartShaking, setCartShaking] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    // LOGIC: Fetch Cart & Listen for Updates
    const fetchCart = async () => {
        try {
            const cartId = localStorage.getItem('cart_id')
            if (cartId) {
                const res = await fetch(`/api/cart-proxy?id=${cartId}`)
                if (!res.ok) {
                    if (res.status === 404) localStorage.removeItem('cart_id')
                    return
                }
                const data = await res.json()
                if (data && data.items) {
                    const count = data.items.reduce((acc: number, item: any) => acc + item.quantity, 0)
                    setCartCount(count)
                    setCartTotal(data.total || 0)
                }
            } else {
                setCartCount(0)
                setCartTotal(0)
            }
        } catch (e) {
            console.error("Cart Logic:", e)
            setCartCount(0)
        }
    }

    const triggerPopup = () => {
        setShowShippingBar(true)
        setCartShaking(true)
        setTimeout(() => setCartShaking(false), 800) // Stop shake
        setTimeout(() => setShowShippingBar(false), 4000) // Hide after 4s
    }

    useEffect(() => {
        fetchCart()

        // Listen for custom trigger from AddToCart buttons
        const handleCartUpdate = () => {
            fetchCart()
            triggerPopup()
        }

        window.addEventListener('cart-updated', handleCartUpdate)
        return () => window.removeEventListener('cart-updated', handleCartUpdate)
    }, []) // Remove dependency to avoid loops

    const FREE_SHIPPING_THRESHOLD = 500000
    const progress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
    const remaining = Math.max(FREE_SHIPPING_THRESHOLD - cartTotal, 0)

    // Force show popup if we just hit the goal
    useEffect(() => {
        if (remaining === 0 && cartTotal > 0 && !showShippingBar) {
            triggerPopup()
        }
    }, [remaining])

    const categories = [
        { name: t.nav.sudanese, href: '/products?category=sudanese' },
        { name: t.nav.accessories, href: '/products?category=accessories' },
        { name: t.nav.fashion, href: '/products?category=fashion' },
        { name: t.nav.perfumes, href: '/products?category=perfumes' },
        { name: t.nav.cosmetics, href: '/products?category=cosmetics' },
        { name: t.nav.home, href: '/' },
    ]

    const BG_IMAGE_URL = "/header-bg.jpg"

    const [wishlistCount, setWishlistCount] = useState(0)

    const updateWishlistCount = () => {
        const savedUser = localStorage.getItem('ola_user')
        if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
            try {
                const user = JSON.parse(savedUser)
                setWishlistCount(user.metadata?.wishlist?.length || 0)
            } catch (e) {
                console.error("Error parsing user for wishlist:", e)
                setWishlistCount(0)
            }
        } else {
            setWishlistCount(0)
        }
    }

    useEffect(() => {
        updateWishlistCount()
        window.addEventListener('wishlist-updated', updateWishlistCount)
        window.addEventListener('storage', updateWishlistCount) // Listen for cross-tab or direct storage changes
        return () => {
            window.removeEventListener('wishlist-updated', updateWishlistCount)
            window.removeEventListener('storage', updateWishlistCount)
        }
    }, [])

    return (
        <header className={`sticky top-0 z-40 transition-all duration-300 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
            {/* 1. TOP ANNOUNCEMENT BAR (HIDDEN ON MOBILE TO SAVE SPACE) */}
            <div className="hidden md:flex bg-rose-700 text-white py-1 px-4 font-bold justify-end items-center h-8 shadow-sm relative z-50">
                <span className="flex items-center gap-2 font-sans text-xs">
                    <span dir="ltr" className="font-mono text-white inline-block text-sm">+249 121 013 939</span> :{t.header.customer_service}
                </span>
            </div>

            {/* 2. MAIN NAVBAR: Glassmorphism Design */}
            <div className="relative bg-white/80 backdrop-blur-md border-b border-rose-100 shadow-sm transition-all duration-300 h-16 md:h-24">
                <div className="container mx-auto h-full px-4 flex items-center justify-between gap-4">

                    {/* LEFT (based on dir): Mobile Menu */}
                    <div className="flex items-center md:hidden min-w-[40px]">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 text-gray-700 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                            aria-label={t.header.menu_label}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>

                    {/* BRANDING: Unified Logo & Name */}
                    <div className="flex-1 md:flex-none flex justify-center md:justify-start overflow-hidden">
                        <Link href="/" className="flex items-center gap-2 md:gap-4 max-w-full group">
                            <div className="relative w-9 h-9 md:w-12 md:h-12 lg:w-16 lg:h-16 flex-shrink-0">
                                <Image
                                    src="/logo.png"
                                    alt="Ola Shop Logo"
                                    fill
                                    className="object-contain group-hover:scale-105 transition-transform"
                                    priority
                                />
                            </div>
                            <div className="flex flex-col -gap-1 truncate">
                                <span className="text-lg md:text-2xl lg:text-3xl font-black bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent font-serif leading-tight">
                                    Ola Shop
                                </span>
                                <span className="hidden xs:block text-[8px] md:text-[10px] text-rose-400 font-bold tracking-[0.2em] uppercase truncate">
                                    {t.header.ola_store}
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* DESKTOP NAV */}
                    <nav className="hidden md:flex flex-1 items-center justify-center gap-4 lg:gap-8 px-4">
                        {categories.map((cat) => (
                            <Link
                                key={cat.name}
                                href={cat.href}
                                className="text-gray-800 hover:text-rose-600 font-bold text-sm lg:text-base transition-colors whitespace-nowrap"
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </nav>

                    {/* ACTION ICONS */}
                    <div className="flex items-center gap-1 md:gap-2 lg:gap-3 relative z-30">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="p-2 text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90 relative z-30"
                            title={t.header.search_label}
                        >
                            <Search className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        <button
                            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                            className="p-2 text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90 flex items-center justify-center relative z-30"
                            title={language === 'ar' ? 'English' : 'العربية'}
                        >
                            <Globe className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        <Link
                            href="/account?tab=wishlist"
                            className="relative p-2 text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90 z-30"
                            title={t.account.wishlist}
                        >
                            <Heart className="w-5 h-5 md:w-6 md:h-6" />
                            {wishlistCount > 0 && (
                                <span className="absolute top-1 right-1 bg-rose-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold border-2 border-white shadow-sm">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        <Link
                            href="/cart"
                            className={`relative p-2 text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90 z-30 ${cartShaking ? 'animate-bounce' : ''}`}
                            title={t.header.cart_label}
                        >
                            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                            <span className="absolute top-1 right-1 bg-rose-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold border-2 border-white shadow-sm">
                                {cartCount}
                            </span>
                        </Link>

                        <Link
                            href="/account"
                            className="hidden md:flex p-2 text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90 z-30"
                            title={t.account.title}
                        >
                            <User className="w-6 h-6" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* POPUP FREE SHIPPING BAR (Slides Down) */}
            <div
                className={`absolute left-0 right-0 z-10 transition-all duration-700 ease-out transform ${showShippingBar
                    ? 'translate-y-0 opacity-100 visible shadow-xl pointer-events-auto'
                    : '-translate-y-full opacity-0 invisible pointer-events-none'
                    }`}
                style={{ top: '100%' }}
            >
                <div className="bg-white/95 backdrop-blur-md border-t border-b border-rose-100 p-3">
                    <div className="container mx-auto max-w-4xl">
                        <div className="flex items-center justify-between mb-1 text-xs md:text-sm font-bold text-gray-800">
                            <span>{progress.toFixed(0)}%</span>
                            <div className="flex items-center gap-2">
                                <span>{t.header.free_shipping_text.replace('{threshold}', '500,000')}</span>
                                <Gift className="w-4 h-4 text-rose-600 animate-pulse" />
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden shadow-inner">
                            <div className="bg-gradient-to-l from-rose-500 to-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                        </div>
                        {remaining > 0 ? (
                            <p className="text-center text-[10px] md:text-xs text-gray-700 mt-1">
                                {t.header.remaining_for_free_shipping.replace('{amount}', remaining.toLocaleString())}
                            </p>
                        ) : (
                            <p className="text-center text-xs font-bold text-emerald-600 mt-1 animate-bounce">
                                {t.header.congrats_free_shipping}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            {isMobileMenuOpen && <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />}
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </header>
    )
}
