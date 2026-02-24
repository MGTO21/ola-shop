"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { MessageCircle, User, Globe, Phone, Loader2, Sparkles, Heart, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { PUBLISHABLE_API_KEY } from "@/lib/medusa"

export default function WhatsappSignupPage() {
    const [loading, setLoading] = useState(false)
    const [activeBg, setActiveBg] = useState(0)
    const bgs = ["/auth/bg1.jpg", "/auth/bg2.jpg"]
    const [error, setError] = useState("")

    // Form State
    const [country, setCountry] = useState("+249")
    const [phone, setPhone] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    // Ken Burns Effect Loop
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveBg((prev) => (prev + 1) % bgs.length)
        }, 8500)
        return () => clearInterval(interval)
    }, [])

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        if (phone.length < 9 || !firstName || !password) return

        if (password !== confirmPassword) {
            setError("كلمات المرور غير متطابقة")
            return
        }

        setLoading(true)
        setError("")

        const cleanPhone = phone.replace(/^0+/, "")
        const fullPhone = `${country}${cleanPhone}`

        try {
            // Call our API route which handles proper registration
            const signupRes = await fetch("/api/whatsapp-signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    phone: fullPhone,
                    firstName,
                    lastName: lastName || "User",
                    password
                }),
            })

            const signupData = await signupRes.json()

            if (!signupRes.ok) {
                setError(signupData.error || "عذراً، لم نتمكن من إنشاء الحساب. ربما الرقم مسجل مسبقاً")
                setLoading(false)
                return
            }

            console.log("[Signup] Account created successfully, logging in...")


            if (signupData.token) {
                console.log("[Signup] Registration success, setting cookie directly...");

                // Use the token returned by the signup API directly
                document.cookie = `medusa_auth_token=${signupData.token}; path=/; SameSite=Lax`;

                await new Promise(r => setTimeout(r, 500));
                window.location.href = "/account";
            } else {
                // Fallback if no token returned (should not happen with new API)
                window.location.href = "/login?phone=" + fullPhone;
            }
        } catch (e) {
            console.error("[Signup] Error:", e)
            setError("خطأ في الاتصال بالسيرفر")
        } finally {
            setLoading(false)
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
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    />
                ))}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-900/40 via-transparent to-pink-900/60" />
            </div>

            <main className="flex-1 flex items-center justify-center p-4 relative z-10">
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[3rem] shadow-2xl p-8 md:p-10 relative overflow-hidden group">
                        {/* Glows */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-rose-500/30 blur-[50px] rounded-full" />
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500/30 blur-[50px] rounded-full" />

                        {/* Brand Header */}
                        <div className="text-center mb-8">
                            <Link href="/">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl mb-4 border border-white/30 hover:rotate-6 transition-all cursor-pointer overflow-hidden shadow-xl shadow-pink-500/10">
                                    <Image src="/logo_beauty.jpg" alt="Logo" width={80} height={80} className="object-cover" />
                                </div>
                            </Link>
                            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
                                انضمي لعالم العُلا
                            </h1>
                            <div className="flex items-center justify-center gap-2 text-pink-200/80 font-bold mb-1">
                                <Heart className="w-4 h-4 fill-current text-rose-400" />
                                <span>متجر العُلا</span>
                                <Heart className="w-4 h-4 fill-current text-rose-400" />
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-rose-500/20 border border-rose-500/30 text-rose-100 text-sm rounded-2xl text-center font-bold animate-pulse">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSignup} className="space-y-5">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-black text-pink-100/60 uppercase tracking-widest mr-1">الاسم الأول</label>
                                    <div className="relative">
                                        <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-200/50" />
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full bg-white/10 border border-white/20 rounded-2xl pr-10 pl-4 py-4 text-white font-bold placeholder:text-white/20 focus:ring-2 focus:ring-pink-400 transition-all shadow-inner"
                                            placeholder="سارة"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-black text-pink-100/60 uppercase tracking-widest mr-1">الاسم الأخير</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white font-bold placeholder:text-white/20 focus:ring-2 focus:ring-pink-400 transition-all shadow-inner"
                                        placeholder="أحمد"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-black text-pink-100/60 uppercase tracking-widest mr-1">رقم الواتساب</label>
                                <div className="flex gap-2" dir="ltr">
                                    <div className="relative w-28">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-200/50" />
                                        <select
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            className="w-full bg-white/10 border border-white/20 rounded-2xl pl-9 pr-2 py-4 text-white font-bold focus:ring-2 focus:ring-pink-400 transition-all appearance-none text-sm text-center"
                                        >
                                            <option value="+249" className="text-black">🇸🇩 +249</option>
                                            <option value="+20" className="text-black">🇪🇬 +20</option>
                                            <option value="+966" className="text-black">🇸🇦 +966</option>
                                            <option value="+971" className="text-black">🇦🇪 +971</option>
                                        </select>
                                    </div>
                                    <div className="relative flex-1">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-200/50" />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full bg-white/10 border border-white/20 rounded-2xl pl-10 pr-4 py-4 text-white font-bold placeholder:text-white/20 focus:ring-2 focus:ring-pink-400 transition-all"
                                            placeholder="912345678"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-black text-pink-100/60 uppercase tracking-widest mr-1">كلمة المرور</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white font-bold placeholder:text-white/20 focus:ring-2 focus:ring-pink-400 transition-all shadow-inner pl-12"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-200/50 hover:text-pink-100 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-black text-pink-100/60 uppercase tracking-widest mr-1">تأكيد كلمة المرور</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white font-bold placeholder:text-white/20 focus:ring-2 focus:ring-pink-400 transition-all shadow-inner pl-12"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-200/50 hover:text-pink-100 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || phone.length < 9 || !firstName || !password}
                                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-rose-900/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                    <>إكمال الانضمام <Sparkles className="w-5 h-5" /></>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="text-center mt-12 space-y-4">
                        <Link href="/login" className="text-white font-bold hover:text-pink-300 transition-colors">
                            لديكِ حساب بالفعل؟ <span className="underline underline-offset-4 decoration-pink-500/50">سجلي دخولكِ</span>
                        </Link>
                        <p className="text-white/30 text-[10px] uppercase font-black tracking-widest leading-loose">
                            بالمتابعة فإنكِ توافقين على استلام رسائل <br /> إرشادية وعروض جمالية
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
