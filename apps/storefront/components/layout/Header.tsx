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
        <header className={`sticky top-0 z-40 relative transition-all duration-300 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>

            {/* MAIN NAVBAR CONTAINER */}
            <div className="relative z-20 shadow-xl overflow-hidden h-[120px] md:h-[180px] border-b border-rose-200">

                {/* BACKGROUND */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[#FFF0F5]"></div>
                    <Image
                        src={BG_IMAGE_URL}
                        alt="Header Texture"
                        fill
                        sizes="100vw"
                        className="object-cover opacity-100"
                        priority
                    />
                </div>

                <div className="relative z-10 w-full flex flex-col h-full">
                    {/* Top Bar */}
                    <div className={`bg-rose-700/95 text-white py-0.5 px-4 font-bold flex ${language === 'ar' ? 'justify-end' : 'justify-start'} items-center h-6 shadow-sm backdrop-blur-md relative z-50`}>
                        <span className="flex items-center gap-2 font-sans text-[10px]">
                            <span dir="ltr" className="font-mono text-white inline-block text-xs">+249 121 013 939</span> :{t.header.customer_service}
                        </span>
                    </div>

                    {/* Main Header Content */}
                    <div className="container mx-auto px-4 py-2 relative flex-1 flex items-center justify-between">

                        {/* 1. LOGO: EDGE-TO-EDGE FIX */}
                        {/* Increased scale, changed origin, full height */}
                        <div className="absolute top-0 bottom-0 left-0 z-[100] h-full aspect-square flex items-center bg-transparent">
                            <Link href="/" className="relative block w-full h-full transform hover:scale-110 transition-transform duration-300">
                                <Image
                                    src="/logo.png"
                                    alt="Ola Shop Logo"
                                    fill
                                    sizes="(max-width: 768px) 80px, 120px"
                                    // Using object-cover to Fill, scale-125 to zoom in and remove whitespace borders
                                    className="object-cover md:object-contain object-left scale-125 origin-left"
                                    priority
                                />
                            </Link>
                        </div>

                        {/* 2. CENTER: Text Brand (Hidden on small mobile to prevent overlap) */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-[80px] md:px-0">
                            <div className="flex flex-col items-center pointer-events-auto transform translate-y-1 text-center">
                                <h1 className="text-2xl md:text-5xl font-black bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent font-serif tracking-tight drop-shadow-sm leading-none">
                                    Ola Shop
                                </h1>
                                <span className={`hidden xs:block text-[10px] md:text-lg text-gray-900 font-black tracking-[0.2em] uppercase mt-1 drop-shadow-md`}>
                                    {t.header.ola_store}
                                </span>
                            </div>
                        </div>

                        {/* 3. RIGHT: Icons */}
                        <div className="ml-auto flex items-center gap-4 z-50">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="flex items-center justify-center text-black hover:text-rose-600 transition-colors p-2 hover:bg-white/40 rounded-full"
                                title={t.header.search_label}
                                aria-label={t.header.search_label}
                            >
                                <Search className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                                className="flex items-center justify-center text-black hover:text-rose-600 transition-colors p-2 hover:bg-white/40 rounded-full"
                                title={t.header.language_label}
                                aria-label={t.header.language_label}
                            >
                                <Globe className="w-6 h-6" />
                            </button>
                            <Link href="/account" className="hidden md:block text-black hover:text-rose-600 transition-colors p-2 hover:bg-white/40 rounded-full" title={t.header.login_label} aria-label={t.header.login_label}><User className="w-6 h-6" /></Link>

                            <Link href="/account?tab=wishlist" className="relative text-black hover:text-rose-600 transition-colors p-2 hover:bg-white/40 rounded-full" title={t.header.wishlist_label} aria-label={`${t.header.wishlist_label} (${wishlistCount})`}>
                                <Heart className="w-6 h-6" />
                                {wishlistCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full shadow-md font-bold border-white border">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>

                            <Link href="/cart" className={`relative text-black hover:text-rose-600 transition-colors p-2 hover:bg-white/40 rounded-full ${cartShaking ? 'animate-bounce text-rose-600' : ''}`} title={t.header.cart_label} aria-label={`${t.header.cart_label} (${cartCount})`}>
                                <ShoppingCart className="w-6 h-6" />
                                {/* DYNAMIC CART COUNT */}
                                <span className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full shadow-md font-bold border-white border">
                                    {cartCount}
                                </span>
                            </Link>

                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-black p-1" aria-label={t.header.menu_label}>
                                <Menu className="w-7 h-7" />
                            </button>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className="hidden md:flex justify-center border-t border-rose-900/10 bg-white/40 backdrop-blur-sm h-10 shadow-sm relative z-40">
                        <ul className="flex items-center gap-6 h-full">
                            {categories.map((cat) => (
                                <li key={cat.name}>
                                    <Link href={cat.href} className={`text-gray-900 hover:text-rose-700 font-extrabold text-base transition-all hover:tracking-wide ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>

            {/* POPUP FREE SHIPPING BAR (Slides Down) */}
            <div
                className={`absolute left-0 right-0 z-10 transition-all duration-700 ease-out transform ${showShippingBar ? 'translate-y-0 opacity-100 shadow-xl' : '-translate-y-full opacity-0'
                    }`}
                style={{ top: '100%' }}
            >
                <div className="bg-white/90 backdrop-blur-md border-t border-b border-rose-100 p-3">
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
