"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { medusaClient } from "@/lib/medusa"
import { Gift, CreditCard, Package, LogOut, User, MapPin, Loader2, Truck, ShoppingCart, Star, Ticket, PlusCircle, MinusCircle, AlertCircle } from "lucide-react"
import { formatPrice, getImageUrl } from "@/lib/utils"
import { useLanguage } from "@/lib/context/LanguageContext"

export default function AccountPage() {
    const { t, language, dir, setLanguage } = useLanguage()
    const router = useRouter()
    const [customer, setCustomer] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const [verifying, setVerifying] = useState(false)
    const [otpCode, setOtpCode] = useState("")
    const [otpSent, setOtpSent] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [activeTab, setActiveTab] = useState("profile")
    const [isEditing, setIsEditing] = useState(false)
    const [profileForm, setProfileForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        city: "",
        birthday: "",
        calling_phone: "",
        secondary_phone: ""
    })

    const [orders, setOrders] = useState<any[]>([])
    const [wishlistProducts, setWishlistProducts] = useState<any[]>([])
    const [coupons, setCoupons] = useState<any[]>([])
    const [loadingData, setLoadingData] = useState(false)

    const isVerified = customer?.metadata?.whatsapp_verified === true

    const handleSendOTP = async () => {
        setVerifying(true)
        setError("")
        try {
            const res = await fetch("/api/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ customerId: customer.id, phone: customer.phone })
            })
            if (res.ok) {
                setOtpSent(true)
            } else {
                setError(t.account.connection_error)
            }
        } catch (e) {
            setError(t.account.connection_error)
        } finally {
            setVerifying(false)
        }
    }

    const handleVerifyOTP = async () => {
        if (otpCode.length !== 6) return
        setVerifying(true)
        setError("")
        try {
            const res = await fetch("/api/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ customerId: customer.id, phone: customer.phone, otp: otpCode })
            })
            const data = await res.json()
            if (data.success) {
                setSuccess(t.account.verification_success)
                setCustomer({ ...customer, metadata: { ...customer.metadata, whatsapp_verified: true } })
            } else {
                // Check if OTP expired or is just invalid
                if (data.message === "Expired" || data.expired) {
                    setError(t.errors.otp_expired)
                } else {
                    setError(t.errors.invalid_otp)
                }
            }
        } catch (e) {
            setError(t.account.connection_error)
        } finally {
            setVerifying(false)
        }
    }

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                // Safely read token from cookie (handles = in JWT base64)
                const getCookie = (name: string): string => {
                    const cookies = document.cookie.split('; ')
                    for (const cookie of cookies) {
                        const idx = cookie.indexOf('=')
                        if (idx > 0 && cookie.substring(0, idx) === name) {
                            return cookie.substring(idx + 1)
                        }
                    }
                    return ''
                }
                const token = getCookie('medusa_auth_token')

                if (!token) {
                    console.warn("[Account] No auth token found, redirecting to login")
                    router.push("/login")
                    return
                }

                const response = await fetch('/api/customer/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include',
                })

                if (!response.ok) {
                    console.error("[Account] Auth failed:", response.status)
                    document.cookie = 'medusa_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
                    router.push("/login")
                    return
                }

                const data = await response.json()
                if (data.customer) {
                    setCustomer(data.customer)
                    // If OTP was already sent (exists in metadata), show the input field
                    if (data.customer.metadata?.otp_code) {
                        setOtpSent(true)
                    }
                } else {
                    router.push("/login")
                }
            } catch (error: any) {
                console.error("[Account] Error:", error.message)
                router.push("/login")
            } finally {
                setLoading(false)
            }
        }
        fetchCustomer()
    }, [router])


    const handleLogout = async () => {
        try {
            await medusaClient.auth.deleteSession()

            // Clear all possible cookie permutations
            const cookies = [
                "medusa_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
                "medusa_auth_token=; path=/account; expires=Thu, 01 Jan 1970 00:00:00 GMT",
                `medusa_auth_token=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT`
            ]
            cookies.forEach(c => document.cookie = c)

            // Optional: Clear cart on logout if desired, or keep it
            // localStorage.removeItem("cart_id")

            router.push("/")
            setTimeout(() => {
                window.location.reload() // Force hard refresh to clear all states
            }, 100)
        } catch (error) {
            console.error("Logout failed:", error)
            document.cookie = "medusa_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
            window.location.href = "/"
        }
    }

    const fetchOrders = async () => {
        setLoadingData(true)
        try {
            const res = await fetch("/api/customer/orders")
            if (res.ok) {
                const data = await res.json()
                setOrders(data.orders || [])
            } else {
                const err = await res.json()
                console.error("[Account] Failed to fetch orders:", err.error || res.statusText)
            }
        } catch (e: any) {
            console.error("[Account] Order Fetch Exception:", e.message)
        } finally {
            setLoadingData(false)
        }
    }

    const fetchWishlist = async () => {
        const wishlistIds = customer?.metadata?.wishlist || []
        if (!Array.isArray(wishlistIds) || wishlistIds.length === 0) return;

        setLoadingData(true)
        const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';
        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || '/api';

        try {
            const query = new URLSearchParams()
            wishlistIds.forEach((id: string) => query.append("id[]", id))
            query.append("fields", "*variants,*variants.prices") // Ensure prices are fetched

            const res = await fetch(`/api/store-proxy?resource=products&${query.toString()}`)
            if (res.ok) {
                const data = await res.json()
                setWishlistProducts(data.products || [])
            }
        } catch (e) {
            console.error("Failed to fetch wishlist:", e)
        } finally {
            setLoadingData(false)
        }
    }

    const fetchCoupons = async () => {
        setLoadingData(true)
        try {
            const res = await fetch("/api/customer/coupons")
            if (res.ok) {
                const data = await res.json()
                setCoupons(data.promotions || [])
            }
        } catch (e) {
            console.error("Failed to fetch coupons:", e)
        } finally {
            setLoadingData(false)
        }
    }

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setVerifying(true)
        setError("")
        try {
            const res = await fetch("/api/customer/complete-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerId: customer?.id,
                    ...profileForm
                })
            })
            const data = await res.json()
            if (res.ok) {
                setSuccess(t.account.update_success)
                setCustomer(data.customer || { ...customer, ...profileForm, metadata: { ...customer?.metadata || {}, ...profileForm } })
                setIsEditing(false)
            } else {
                // If it's a 400, show validation message
                if (res.status === 400) {
                    setError(language === 'ar' ? "يرجى التأكد من صحة البيانات المدخلة" : "Please check your input data")
                } else {
                    setError(data.error || t.account.update_error)
                }
            }
        } catch (e) {
            setError(t.account.connection_error)
        } finally {
            setVerifying(false)
        }
    }

    // --- EFFECTS (MUST BE ABOVE EARLY RETURNS) ---

    useEffect(() => {
        if (activeTab === "orders") fetchOrders()
        if (activeTab === "wishlist") fetchWishlist()
        if (activeTab === "coupons" && coupons.length === 0) fetchCoupons()
    }, [activeTab, customer])

    useEffect(() => {
        if (customer) {
            setProfileForm({
                first_name: customer.first_name || "",
                last_name: customer.last_name || "",
                email: customer.email && !customer.email.includes("@ola-shop.com") ? customer.email : "",
                city: customer.metadata?.city || "",
                birthday: customer.metadata?.birthday || "",
                calling_phone: customer.metadata?.calling_phone || "",
                secondary_phone: customer.metadata?.secondary_phone || ""
            })
        }
    }, [customer])


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 text-rose-600 animate-spin" />
            </div>
        )
    }

    if (!customer) return null // Valid interaction will redirect

    return (
        <div className={`min-h-screen flex flex-col bg-gray-50 pb-20 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-72 space-y-4">
                        <div className="bg-white p-8 rounded-3xl shadow-sm md:sticky md:top-24 border border-gray-100">
                            <div className="relative group mx-auto mb-4 w-24 h-24">
                                <div className="absolute inset-0 bg-rose-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                <div className="relative w-24 h-24 bg-gradient-to-br from-rose-50 to-rose-100 rounded-full flex items-center justify-center text-rose-600 font-black text-3xl uppercase border-2 border-white shadow-inner">
                                    {customer.first_name ? customer.first_name.charAt(0) : <User className="w-10 h-10" />}
                                </div>
                                {isVerified && (
                                    <div className="absolute -bottom-1 -left-1 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-lg" title={t.account.profile}>
                                        <Truck className="w-4 h-4" />
                                    </div>
                                )}
                            </div>

                            <div className="text-center mb-8">
                                <h2 className="font-black text-2xl text-gray-900 leading-tight">
                                    {customer.first_name} {customer.last_name}
                                </h2>
                                <p className="text-gray-500 font-bold mt-1" dir="ltr">{customer.phone}</p>
                            </div>

                            <nav className="space-y-2">
                                {[
                                    { id: "profile", label: t.account.profile, icon: User },
                                    { id: "loyalty", label: t.account.loyalty, icon: Star },
                                    { id: "coupons", label: t.account.coupons, icon: Ticket },
                                    { id: "orders", label: t.account.orders, icon: Package },
                                    { id: "addresses", label: t.account.addresses, icon: MapPin },
                                    { id: "wishlist", label: t.account.wishlist, icon: Gift },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-right transition-all duration-300 ${activeTab === tab.id
                                            ? "bg-rose-600 text-white shadow-lg shadow-rose-200 translate-x-1"
                                            : "text-gray-600 hover:bg-rose-50 hover:text-rose-600"
                                            }`}
                                    >
                                        <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : ""}`} />
                                        <span className="font-bold">{tab.label}</span>
                                    </button>
                                ))}

                                <hr className="my-4 border-gray-100" />

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-right text-red-500 hover:bg-red-50 transition-all font-bold"
                                >
                                    <LogOut className="w-5 h-5" /> {t.account.logout}
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1 space-y-6">
                        {/* WhatsApp Verification Banner (Sticky Reminder) */}
                        {!isVerified && (
                            <div className="bg-gradient-to-l from-emerald-600 to-green-500 rounded-3xl p-8 text-white shadow-xl shadow-emerald-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
                                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner">
                                    <Truck className="w-10 h-10 animate-bounce-subtle" />
                                </div>

                                <div className="flex-1 text-center md:text-right">
                                    <h3 className="text-2xl font-black mb-2 leading-tight">{t.account.verify_whatsapp}</h3>
                                    <p className="text-white/80 font-medium">{t.account.verify_whatsapp_desc}</p>
                                </div>

                                <div className="relative z-10 w-full md:w-auto">
                                    {!otpSent ? (
                                        <button
                                            onClick={handleSendOTP}
                                            disabled={verifying}
                                            className="w-full md:w-auto px-10 py-4 bg-white text-emerald-600 rounded-2xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all text-lg"
                                        >
                                            {verifying ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : t.account.send_code}
                                        </button>
                                    ) : (
                                        <div className="flex bg-white/20 p-2 rounded-2xl backdrop-blur-md border border-white/30">
                                            <input
                                                type="text"
                                                placeholder="000000"
                                                maxLength={6}
                                                dir="ltr"
                                                value={otpCode}
                                                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                                                className="w-32 bg-transparent text-white placeholder:text-white/50 text-center font-black text-2xl tracking-[0.2em] outline-none"
                                            />
                                            <button
                                                onClick={handleVerifyOTP}
                                                disabled={verifying || otpCode.length !== 6}
                                                className="px-8 py-3 bg-white text-emerald-600 rounded-xl font-black hover:bg-emerald-50 transition-colors"
                                            >
                                                {verifying ? <Loader2 className="w-5 h-5 animate-spin" /> : t.account.confirm_code}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Content Switching based on Tab */}
                        {activeTab === "profile" && (
                            <div className="space-y-6">
                                {/* Dashboard Cards Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Free Shipping Tracker */}
                                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 shadow-inner">
                                                    <Truck className="w-7 h-7" />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-gray-900 text-lg">{t.cart.shipping_free}</h4>
                                                    <p className="text-sm text-gray-500 font-bold">{t.cart.shipping_threshold_text.replace('{amount}', formatPrice(500000))}</p>
                                                </div>
                                            </div>
                                            <div className="text-2xl font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-xl">٠٪</div>
                                        </div>
                                        <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden mb-6 shadow-inner">
                                            <div className="bg-gradient-to-l from-rose-600 to-rose-400 h-full rounded-full transition-all duration-1000" style={{ width: '0%' }}></div>
                                        </div>
                                        <p className="text-gray-600 font-bold text-sm bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                                            {t.cart.shipping_threshold_text.replace('{amount}', formatPrice(500000))}
                                        </p>
                                    </div>

                                    {/* Loyalty Points */}
                                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-xl shadow-gray-200 flex flex-col justify-between relative overflow-hidden">
                                        <Gift className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 -rotate-12" />
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                                                <div className="font-black text-2xl text-rose-500">O</div>
                                            </div>
                                            <div className="bg-rose-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-rose-500 shadow-lg shadow-rose-900/40">VIP</div>
                                        </div>
                                        <div>
                                            <h4 className="text-white/60 font-bold uppercase tracking-wider text-xs mb-1">{t.account.loyalty}</h4>
                                            <div className="text-5xl font-black mb-4 flex items-baseline gap-2">
                                                {customer?.metadata?.loyalty_points || 0} <span className="text-rose-500 text-xl font-bold">{t.account.points_earned}</span>
                                            </div>
                                            <p className="text-white/40 text-sm font-medium">{t.account.earn_info}</p>
                                        </div>

                                        {/* Loyalty History Preview */}
                                        {customer?.metadata?.loyalty_history && customer.metadata.loyalty_history.length > 0 && (
                                            <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">آخر العمليات</p>
                                                {customer.metadata.loyalty_history.slice(0, 3).map((h: any, i: number) => (
                                                    <div key={i} className="flex justify-between items-center text-[10px] font-bold">
                                                        <span className="text-white/80">{h.description}</span>
                                                        <span className="text-emerald-400">+{h.points}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Detailed Profile Information Form */}
                                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-6">
                                        <h3 className="text-2xl font-black flex items-center gap-3">
                                            <User className="w-7 h-7 text-rose-600" /> {t.account.profile_info}
                                        </h3>
                                        {!isEditing && (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="bg-rose-50 text-rose-600 px-6 py-2.5 rounded-2xl font-black hover:bg-rose-100 transition-colors"
                                            >
                                                {t.account.edit}
                                            </button>
                                        )}
                                    </div>

                                    {(error || success) && (
                                        <div className={`p-4 rounded-2xl mb-8 flex items-center gap-3 font-bold ${error ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                                            <div className={`w-2 h-2 rounded-full ${error ? "bg-red-500" : "bg-emerald-500"} animate-pulse`}></div>
                                            {error || success}
                                        </div>
                                    )}

                                    <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        {/* Name Fields */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">{t.account.first_name}</label>
                                            <input
                                                type="text"
                                                value={profileForm.first_name}
                                                onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                                                disabled={!isEditing}
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl px-5 py-4 font-bold transition-all outline-none disabled:opacity-70"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">{t.account.last_name}</label>
                                            <input
                                                type="text"
                                                value={profileForm.last_name}
                                                onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                                                disabled={!isEditing}
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl px-5 py-4 font-bold transition-all outline-none disabled:opacity-70"
                                            />
                                        </div>

                                        {/* Phone (Immutable in this form for now) */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">{t.account.phone}</label>
                                            <div className="w-full bg-gray-100 rounded-2xl px-5 py-4 font-bold text-gray-400 cursor-not-allowed flex items-center justify-between" dir="ltr">
                                                {customer.phone}
                                                <Truck className="w-4 h-4 text-emerald-500" />
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">{t.account.email}</label>
                                            <input
                                                type="email"
                                                value={profileForm.email}
                                                placeholder="example@email.com"
                                                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                                disabled={!isEditing}
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl px-5 py-4 font-bold transition-all outline-none disabled:opacity-70"
                                            />
                                        </div>

                                        {/* Calling Phone */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">{t.account.calling_phone}</label>
                                            <input
                                                type="tel"
                                                value={profileForm.calling_phone}
                                                placeholder="+249..."
                                                dir="ltr"
                                                onChange={(e) => setProfileForm({ ...profileForm, calling_phone: e.target.value })}
                                                disabled={!isEditing}
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl px-5 py-4 font-bold transition-all outline-none disabled:opacity-70"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">{t.account.secondary_phone_optional}</label>
                                            <input
                                                type="tel"
                                                value={profileForm.secondary_phone}
                                                placeholder="+249..."
                                                dir="ltr"
                                                onChange={(e) => setProfileForm({ ...profileForm, secondary_phone: e.target.value })}
                                                disabled={!isEditing}
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl px-5 py-4 font-bold transition-all outline-none disabled:opacity-70"
                                            />
                                        </div>

                                        {/* City Select */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">{t.account.city}</label>
                                            <select
                                                value={profileForm.city}
                                                onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                                                disabled={!isEditing}
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl px-5 py-4 font-bold transition-all outline-none disabled:opacity-70 appearance-none shadow-sm"
                                            >
                                                <option value="">{t.account.select_city}</option>
                                                {t.checkout.cities.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                                <option value="other">أخرى</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">{t.account.birthday}</label>
                                            <input
                                                type="date"
                                                value={profileForm.birthday}
                                                onChange={(e) => setProfileForm({ ...profileForm, birthday: e.target.value })}
                                                disabled={!isEditing}
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl px-5 py-4 font-bold transition-all outline-none disabled:opacity-70 shadow-sm"
                                            />
                                        </div>

                                        {isEditing && (
                                            <div className="md:col-span-2 flex gap-4 mt-8">
                                                <button
                                                    type="submit"
                                                    disabled={verifying}
                                                    className="flex-1 bg-gray-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:opacity-50"
                                                >
                                                    {verifying ? <Loader2 className="w-7 h-7 animate-spin mx-auto" /> : t.account.save}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditing(false)}
                                                    className="px-8 bg-gray-100 text-gray-600 rounded-2xl font-black hover:bg-gray-200 transition-all"
                                                >
                                                    {t.account.cancel}
                                                </button>
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </div>
                        )}

                        {activeTab === "loyalty" && (
                            <div className="space-y-6">
                                {/* Points Card */}
                                <div className="bg-gradient-to-br from-rose-600 to-rose-700 rounded-3xl p-8 text-white shadow-xl shadow-rose-200 relative overflow-hidden">
                                    <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div className="text-center md:text-right">
                                            <p className="text-white/80 font-bold mb-1 uppercase tracking-widest text-xs">{t.account.points_balance}</p>
                                            <h3 className="text-5xl font-black mb-2">{customer?.metadata?.loyalty_points || 0}</h3>
                                            <p className="text-rose-100 font-bold">{t.account.points_earned}</p>
                                        </div>
                                        <div className="h-16 w-px bg-white/20 hidden md:block"></div>
                                        <div className="text-center md:text-right">
                                            <p className="text-white/80 font-bold mb-1 uppercase tracking-widest text-xs">{t.account.tier_label}</p>
                                            <h4 className="text-2xl font-black">{customer?.metadata?.loyalty_tier || "المستوى الأول (Level 1)"}</h4>
                                            <p className="text-rose-100 font-bold">{t.home.browse_categories}</p>
                                        </div>
                                        <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                                            <Star className="w-10 h-10 text-white animate-pulse" />
                                        </div>
                                    </div>
                                </div>

                                {/* Points Info */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center">
                                        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-600">
                                            <ShoppingCart className="w-6 h-6" />
                                        </div>
                                        <h5 className="font-black text-gray-900 mb-1">{t.account.how_to_earn}</h5>
                                        <p className="text-sm text-gray-500 font-medium">{t.account.earn_info}</p>
                                    </div>
                                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center">
                                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600">
                                            <CreditCard className="w-6 h-6" />
                                        </div>
                                        <h5 className="font-black text-gray-900 mb-1">{t.account.how_to_redeem}</h5>
                                        <p className="text-sm text-gray-500 font-medium">{t.account.redeem_info}</p>
                                    </div>
                                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center">
                                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                                            <Gift className="w-6 h-6" />
                                        </div>
                                        <h5 className="font-black text-gray-900 mb-1">{t.account.exclusive_gifts}</h5>
                                        <p className="text-sm text-gray-500 font-medium">{t.account.gifts_info}</p>
                                    </div>
                                </div>

                                {/* History */}
                                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                    <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-gray-900">
                                        <Package className="w-6 h-6 text-rose-600" /> {t.account.points_history}
                                    </h3>
                                    {customer?.metadata?.loyalty_history?.length > 0 ? (
                                        <div className="space-y-4">
                                            {customer.metadata.loyalty_history.map((item: any, idx: number) => (
                                                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.type === 'earned' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                                            {item.type === 'earned' ? <PlusCircle className="w-5 h-5" /> : <MinusCircle className="w-5 h-5" />}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-sm text-gray-900">{item.description}</p>
                                                            <p className="text-[10px] text-gray-400 font-bold">{new Date(item.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`font-black ${item.type === 'earned' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        {item.type === 'earned' ? '+' : '-'}{item.points}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-50 rounded-2xl p-12 text-center text-gray-400 font-bold">
                                            {t.account.points_history_empty}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "coupons" && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 mb-1">{t.account.coupons}</h3>
                                        <p className="text-gray-500 font-medium">{t.home.browse_categories}</p>
                                    </div>
                                    <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                                        <Ticket className="w-8 h-8" />
                                    </div>
                                </div>

                                {loadingData ? (
                                    <div className="bg-white rounded-3xl p-20 flex flex-col items-center justify-center text-gray-400 border border-gray-100">
                                        <Loader2 className="w-10 h-10 animate-spin mb-4 text-rose-600" />
                                        <p className="font-bold">{t.account.loading_coupons}</p>
                                    </div>
                                ) : coupons.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {coupons.map((coupon) => (
                                            <div key={coupon.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:border-rose-100 transition-all group flex">
                                                <div className="w-4 bg-rose-600 group-hover:bg-rose-700 transition-colors"></div>
                                                <div className="flex-1 p-6 relative">
                                                    <div className="absolute top-4 left-4 bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">Active</div>
                                                    <h4 className="font-black text-gray-900 text-lg mb-1">{coupon.code}</h4>
                                                    <p className="text-sm text-gray-500 font-bold mb-4">{coupon.description || 'خصم خاص لعملائنا المميزين'}</p>
                                                    <div className="flex items-center justify-between mt-4 pb-2 border-b border-gray-50">
                                                        <span className="text-xs text-gray-400 font-black">قيمة الخصم</span>
                                                        <span className="font-black text-rose-600">{coupon.type === 'percentage' ? `${coupon.value}%` : `${coupon.value / 100} SDG`}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(coupon.code);
                                                            alert(t.account.code_copied);
                                                        }}
                                                        className="w-full mt-4 py-3 bg-gray-50 hover:bg-rose-50 text-gray-600 hover:text-rose-600 rounded-xl font-black text-xs transition-all"
                                                    >
                                                        {t.account.copy_code}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-3xl p-16 shadow-sm border border-gray-100 text-center space-y-6">
                                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                                            <Ticket className="w-12 h-12" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-gray-900 mb-2">{t.account.no_coupons}</h3>
                                            <p className="text-gray-500 font-medium">{t.footer.about_text}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "orders" && (
                            <div className="space-y-4">
                                {loadingData ? (
                                    <div className="bg-white rounded-3xl p-20 flex flex-col items-center justify-center text-gray-400 border border-gray-100">
                                        <Loader2 className="w-10 h-10 animate-spin mb-4 text-rose-600" />
                                        <p className="font-bold">{t.account.loading_orders}</p>
                                    </div>
                                ) : orders.length > 0 ? (
                                    orders.map((order) => (
                                        <div key={order.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:border-rose-100 transition-all group">
                                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-50">
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.account.order_number}</span>
                                                    <h4 className="font-black text-lg text-gray-900" dir="ltr">#{order.display_id || order.id.slice(-8)}</h4>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">{t.account.order_date}</span>
                                                        <span className="font-bold text-gray-600">{new Date(order.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}</span>
                                                    </div>
                                                    <div className={`px-4 py-1.5 rounded-full text-xs font-black border uppercase tracking-tighter ${order.fulfillment_status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        order.fulfillment_status === 'shipped' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                            order.fulfillment_status === 'fulfilled' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                                order.status === 'pending' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                                    'bg-gray-50 text-gray-600 border-gray-100'
                                                        }`}>
                                                        {
                                                            order.fulfillment_status === 'delivered' ? 'تم التسليم' :
                                                                order.fulfillment_status === 'shipped' ? 'تم الشحن' :
                                                                    order.fulfillment_status === 'fulfilled' ? 'جاهز للشحن' :
                                                                        order.status === 'pending' ? 'جاري المعالجة' :
                                                                            'مكتمل'
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="flex -space-x-4 space-x-reverse flex-1">
                                                    {order.items?.slice(0, 3).map((item: any) => (
                                                        <div key={item.id} title={item.title} className="w-14 h-14 rounded-xl border-2 border-white shadow-sm overflow-hidden bg-gray-50 transform group-hover:-translate-y-1 transition-transform">
                                                            <img src={getImageUrl(item.thumbnail)} alt={item.title} className="w-full h-full object-cover" />
                                                        </div>
                                                    ))}
                                                    {order.items?.length > 3 && (
                                                        <div className="w-14 h-14 rounded-xl border-2 border-white shadow-sm bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-black">
                                                            +{order.items.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-left" dir="ltr">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">{t.account.order_total}</span>
                                                    <span className="text-xl font-black text-rose-600">{formatPrice(order.total)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white rounded-3xl p-20 shadow-sm border border-gray-100 text-center space-y-6">
                                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                                            <Package className="w-12 h-12" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-gray-900 mb-2">{t.account.no_orders}</h3>
                                            <p className="text-gray-500 font-medium">{t.home.hero_subtitle}</p>
                                        </div>
                                        <button onClick={() => router.push('/products')} className="px-10 py-4 bg-rose-600 text-white rounded-2xl font-black shadow-lg shadow-rose-200 hover:scale-105 active:scale-95 transition-all text-lg">
                                            تصفح المنتجات
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "addresses" && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-black flex items-center gap-3">
                                        <MapPin className="w-7 h-7 text-rose-600" /> عناوين التوصيل
                                    </h3>
                                    <button className="bg-rose-600 text-white px-6 py-2.5 rounded-2xl font-black flex items-center gap-2 hover:bg-rose-700 transition-all shadow-lg shadow-rose-100">
                                        <MapPin className="w-4 h-4" /> إضافة عنوان
                                    </button>
                                </div>
                                <div className="border-2 border-dashed border-gray-100 rounded-3xl p-12 text-center text-gray-400 font-bold">
                                    لم تتم إضافة أي عناوين بعد
                                </div>
                            </div>
                        )}

                        {activeTab === "wishlist" && (
                            <div className="space-y-6">
                                {loadingData ? (
                                    <div className="bg-white rounded-3xl p-20 flex flex-col items-center justify-center text-gray-400 border border-gray-100">
                                        <Loader2 className="w-10 h-10 animate-spin mb-4 text-rose-600" />
                                        <p className="font-bold">جاري تحميل قائمة الأمنيات...</p>
                                    </div>
                                ) : wishlistProducts.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {wishlistProducts.map((product) => (
                                            <div key={product.id} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex gap-4 hover:border-rose-100 transition-all hover:shadow-md group">
                                                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                                                    <img src={getImageUrl(product.thumbnail)} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between py-1">
                                                    <div>
                                                        <h4 className="font-black text-gray-900 group-hover:text-rose-600 transition-colors line-clamp-1">{product.title}</h4>
                                                        <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-tighter">{product.subtitle || 'Natural Beauty'}</p>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-rose-600 font-black" dir="ltr">{formatPrice(product.variants?.[0]?.calculated_price?.calculated_amount || product.variants?.[0]?.prices?.[0]?.amount || 0)}</span>
                                                        <button onClick={() => router.push(`/products/${product.handle || product.id}`)} className="text-[10px] font-black text-gray-400 hover:text-rose-600 underline">عرض</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center space-y-6">
                                        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-300">
                                            <Gift className="w-12 h-12" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-gray-900 mb-2">قائمة أمنياتك فارغة</h3>
                                            <p className="text-gray-500 font-medium">احفظي منتجاتك المفضلة هنا للرجوع إليها لاحقاً.</p>
                                        </div>
                                        <button onClick={() => router.push('/products')} className="px-10 py-4 bg-rose-600 text-white rounded-2xl font-black shadow-lg shadow-rose-200 hover:scale-105 transition-all">
                                            استكشاف المنتجات
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

