"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { MessageCircle, Sparkles, Phone, Eye, EyeOff, Loader2, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { PUBLISHABLE_API_KEY } from "@/lib/medusa"

export default function LoginPage() {
    const [phone, setPhone] = useState("")
    const [countryCode, setCountryCode] = useState("+249")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [activeBg, setActiveBg] = useState(0)
    const bgs = ["/auth/bg1.jpg", "/auth/bg2.jpg"]

    // Ken Burns Effect Loop
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveBg((prev) => (prev + 1) % bgs.length)
        }, 8000)
        return () => clearInterval(interval)
    }, [])

    // Pre-fill from URL
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search)
            const phoneParam = params.get('phone')
            if (phoneParam) {
                if (phoneParam.startsWith('+249')) {
                    setCountryCode('+249')
                    setPhone(phoneParam.replace('+249', ''))
                } else if (phoneParam.startsWith('+20')) {
                    setCountryCode('+20')
                    setPhone(phoneParam.replace('+20', ''))
                } else if (!phoneParam.startsWith('+')) {
                    setPhone(phoneParam)
                }
            }
        }
    }, [])

    const normalizePhone = (p: string, code: string) => {
        let normalized = p.replace(/\D/g, '')
        if (normalized.startsWith('0')) normalized = normalized.substring(1)
        const cleanCode = code.replace('+', '')
        if (normalized.startsWith(cleanCode)) {
            normalized = normalized.substring(cleanCode.length)
        }
        return '+' + cleanCode + normalized
    }

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        const fullPhone = normalizePhone(phone, countryCode)
        // We need to keep the '+' for consistent matching with backend
        const phoneWithPlus = fullPhone

        try {
            console.log("[Login] Attempting login for phone:", phoneWithPlus)

            const res = await fetch(`/api/whatsapp-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone: phoneWithPlus, password })
            })

            const data = await res.json().catch(() => ({}))
            console.log("[Login] Response:", { status: res.status, data })

            if (res.ok && data.success) {
                console.log("[Login] Success! Customer:", data.customer?.id)
                // The /api/whatsapp-login route already sets the httpOnly cookie
                // We just need to make sure the client-side session is updated

                // If the backend returns a token in the body as well, we can use it to sync
                if (data.token) {
                    document.cookie = `medusa_auth_token=${data.token}; path=/; SameSite=Lax`
                }

                // Save user info for fast UI display - Safety Guard: only save if it's an object
                if (data.customer && typeof data.customer === 'object') {
                    localStorage.setItem("ola_user", JSON.stringify(data.customer))
                } else {
                    localStorage.removeItem("ola_user")
                }

                // Give cookie a moment to settle
                await new Promise(r => setTimeout(r, 300))
                window.location.href = "/account"
            } else {
                const errorMsg = data.error || data.message || "فشل تسجيل الدخول"
                alert(errorMsg)
            }
        } catch (error) {
            console.error("[Login] Error:", error)
            alert("فشل تسجيل الدخول. يرجى التحقق من اتصالك")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen flex flex-col font-arabic overflow-hidden" dir="rtl">
            {/* Background Animation */}
            <div className="absolute inset-0 z-0">
                {bgs.map((bg, idx) => (
                    <div
                        key={bg}
                        className={cn(
                            "absolute inset-0 transition-opacity duration-[3000ms] ease-in-out",
                            activeBg === idx ? "opacity-100 scale-110" : "opacity-0 scale-100"
                        )}
                        style={{
                            backgroundImage: `url(${bg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                ))}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-pink-900/40 via-transparent to-pink-900/60" />
            </div>

            <main className="flex-1 flex items-center justify-center p-4 relative z-10">
                <div className="w-full max-w-md animate-in fade-in zoom-in duration-700">
                    {/* Pink Glass Card */}
                    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-2xl p-8 md:p-10 relative overflow-hidden group">
                        {/* Decorative Glow */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-pink-500/30 blur-[60px] rounded-full group-hover:bg-pink-400/40 transition-all duration-1000" />
                        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-500/30 blur-[60px] rounded-full group-hover:bg-rose-400/40 transition-all duration-1000" />

                        {/* Brand Header */}
                        <div className="text-center mb-8">
                            <Link href="/">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl mb-4 border border-white/30 hover:scale-110 transition-transform cursor-pointer overflow-hidden">
                                    <Image src="/logo_beauty.jpg" alt="Logo" width={80} height={80} className="object-cover" />
                                </div>
                            </Link>
                            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
                                مرحباً بك مجدداً
                            </h1>
                            <p className="text-pink-100/80 font-medium font-sans">Ola Shop • جمالكِ يبدأ من هنا</p>
                        </div>

                        {/* LOGIN FORM */}
                        <form onSubmit={handleLoginSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="group">
                                    <label className="block text-sm font-bold text-pink-50 mb-2 mr-1">رقم الواتساب</label>
                                    <div className="flex gap-2" dir="ltr">
                                        <select
                                            value={countryCode}
                                            onChange={(e) => setCountryCode(e.target.value)}
                                            className="w-24 bg-white/10 border border-white/20 rounded-2xl px-3 py-4 text-white font-bold focus:ring-2 focus:ring-pink-400 focus:bg-white/20 transition-all appearance-none text-center"
                                        >
                                            <option value="+249" className="text-black">🇸🇩 +249</option>
                                            <option value="+20" className="text-black">🇪🇬 +20</option>
                                            <option value="+966" className="text-black">🇸🇦 +966</option>
                                            <option value="+971" className="text-black">🇦🇪 +971</option>
                                        </select>
                                        <div className="relative flex-1">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-200/50" />
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white font-bold placeholder:text-pink-100/30 focus:ring-2 focus:ring-pink-400 focus:bg-white/20 transition-all"
                                                placeholder="912345678"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-bold text-pink-50 mb-2 mr-1">كلمة المرور</label>
                                    <div className="relative">
                                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-200/50" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-white/10 border border-white/20 rounded-2xl pr-12 pl-12 py-4 text-white font-bold placeholder:text-pink-100/30 focus:ring-2 focus:ring-pink-400 focus:bg-white/20 transition-all"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-200/50 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-pink-900/30 transition-all active:scale-95 flex items-center justify-center gap-3 group"
                            >
                                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                    <>تـسـجيـل الـدخـول <Sparkles className="w-5 h-5 group-hover:animate-pulse" /></>
                                )}
                            </button>

                            <div className="text-center pt-2">
                                <a
                                    href="https://wa.me/249912345678"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-pink-100/70 hover:text-white text-sm font-bold transition-all bg-white/5 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 hover:border-pink-500/30"
                                >
                                    <MessageCircle className="w-4 h-4 text-green-400" />
                                    <span>Contact us at our WhatsApp</span>
                                </a>
                            </div>
                        </form>
                    </div>

                    {/* Footer Info */}
                    <div className="text-center mt-12 space-y-4">
                        <Link
                            href="/whatsapp-signup"
                            className="inline-block bg-white/10 backdrop-blur-md border border-pink-500/30 px-8 py-3 rounded-2xl text-white hover:text-pink-300 font-bold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] group"
                        >
                            ليس لديك حساب؟ <span className="underline underline-offset-4 decoration-pink-500/50 font-black group-hover:text-pink-200">اشتركي الآن</span>
                        </Link>
                        <div className="flex justify-center gap-6 mt-4">
                            <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest">شروط الخدمة</span>
                            <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest">سياسة الخصوصية</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
