"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Check, Truck, CreditCard, ChevronRight, Loader2, AlertCircle, ChevronLeft } from "lucide-react"
import { formatPrice, getImageUrl } from "@/lib/utils"
import { useLanguage } from "@/lib/context/LanguageContext"

export default function CheckoutPage() {
    const { t, dir, language } = useLanguage()
    const router = useRouter()
    const [cart, setCart] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [placingOrder, setPlacingOrder] = useState(false)
    const [step, setStep] = useState(1) // 1: Info, 2: Success
    const [error, setError] = useState("")

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        city: "الخرطوم",
        address: ""
    })

    useEffect(() => {
        const savedUser = localStorage.getItem("ola_user")
        if (savedUser) {
            const user = JSON.parse(savedUser)
            setFormData(prev => ({
                ...prev,
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                phone: user.metadata?.calling_phone || user.phone || prev.phone,
                city: user.metadata?.city || prev.city
            }))
        }
    }, [])

    const [couponCode, setCouponCode] = useState("")
    const [applyingCoupon, setApplyingCoupon] = useState(false)
    const [couponError, setCouponError] = useState("")

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setApplyingCoupon(true)
        setCouponError("")
        try {
            const cartId = cart.id;
            const res = await fetch(`/api/store-proxy?resource=carts&id=${cartId}&action=promotions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ promo_codes: [couponCode] })
            })
            const data = await res.json()
            if (res.ok) {
                setCart(data.cart)
                setCouponCode("")
            } else {
                setCouponError(data.message || t.checkout.coupon_error)
            }
        } catch (e) {
            setCouponError(t.checkout.coupon_error)
        } finally {
            setApplyingCoupon(false)
        }
    }

    useEffect(() => {
        const fetchCart = async () => {
            const cartId = localStorage.getItem("cart_id")
            if (!cartId) {
                router.push("/")
                return
            }

            try {
                // We use the proxy route for consistent cookie/session handling
                const res = await fetch(`/api/cart-proxy?id=${cartId}`)
                if (res.ok) {
                    const data = await res.json()
                    setCart(data)

                    // Pre-fill from user if available
                    const savedUser = localStorage.getItem("ola_user")
                    if (savedUser) {
                        const userData = JSON.parse(savedUser)
                        setFormData(prev => ({
                            ...prev,
                            first_name: userData.first_name || "",
                            last_name: userData.last_name || "",
                            phone: userData.phone || ""
                        }))
                    }
                } else {
                    router.push("/")
                }
            } catch (e) {
                console.error("Cart fetch failed", e)
                router.push("/")
            } finally {
                setLoading(false)
            }
        }
        fetchCart()
    }, [router])

    const handlePlaceOrder = async () => {
        if (!formData.first_name || !formData.phone || !formData.address) {
            setError(t.checkout.required_fields_error)
            return
        }

        setPlacingOrder(true)
        setError("")

        try {
            const cartId = cart.id
            const savedUser = localStorage.getItem("ola_user")
            const userData = savedUser ? JSON.parse(savedUser) : null
            const email = userData?.email || cart.email || `${formData.phone.replace(/\+/g, '')}.checkout@ola-shop.com`

            // Use a stable idempotency key for the same cart
            const idempotencyKey = `checkout-auth-${cartId}`

            const token = localStorage.getItem('medusa_auth_token') || ''

            // Helper to get headers with optional auth
            const getAuthHeaders = (extra: Record<string, string> = {}) => {
                const h = new Headers({
                    "Content-Type": "application/json",
                    ...extra
                })
                if (token) h.append("Authorization", `Bearer ${token}`)
                return h
            }

            // Step 1: Update cart with shipping address & email

            console.log("[Checkout] Step 1: Updating cart address...")
            const cartUpdateRes = await fetch(`/api/store-proxy?resource=carts&id=${cartId}`, {
                method: "POST",
                headers: getAuthHeaders({ "Idempotency-Key": `upd-${cartId}` }),
                body: JSON.stringify({
                    email,
                    shipping_address: {
                        first_name: formData.first_name,
                        last_name: formData.last_name || formData.first_name,
                        address_1: formData.address,
                        city: formData.city,
                        country_code: "sd",
                        phone: formData.phone
                    }
                })
            })
            if (!cartUpdateRes.ok) {
                const errData = await cartUpdateRes.json().catch(() => ({}))
                console.error("[Checkout] Cart update failed:", errData)
                throw new Error(errData.message || t.messages.error)
            }

            // Step 2: Add Shipping Method
            console.log("[Checkout] Step 2: Adding shipping method...")
            const shippingOptionsRes = await fetch(`/api/store-proxy?resource=shipping-options&cart_id=${cartId}`, {
                headers: getAuthHeaders()
            })
            if (!shippingOptionsRes.ok) throw new Error(t.messages.error)

            const shippingOptionsData = await shippingOptionsRes.json()
            const shippingOptions = shippingOptionsData.shipping_options || []
            const optionId = shippingOptions[0]?.id || "so_01KHTXJ1EB2KTA78986WCTES68";

            const shipMethodRes = await fetch(`/api/store-proxy?resource=carts&id=${cartId}&action=shipping-methods`, {
                method: "POST",
                headers: getAuthHeaders({ "Idempotency-Key": `ship-${cartId}` }),
                body: JSON.stringify({ option_id: optionId })
            })
            if (!shipMethodRes.ok) throw new Error(t.messages.error)

            // Step 3: Get or Create Payment Collection
            console.log("[Checkout] Step 3: Getting payment collection...")
            const cartCheckRes = await fetch(`/api/cart-proxy?id=${cartId}`, {
                headers: getAuthHeaders()
            })
            if (!cartCheckRes.ok) throw new Error(t.messages.error)

            const cartCheck = await cartCheckRes.json()
            let collectionId = cartCheck.payment_collection?.id || (cartCheck.payment_collections?.[0]?.id)

            if (!collectionId) {
                const collectionRes = await fetch(`/api/store-proxy?resource=payment-collections`, {
                    method: "POST",
                    headers: getAuthHeaders({ "Idempotency-Key": `pc-${cartId}` }),
                    body: JSON.stringify({ cart_id: cartId })
                })
                if (collectionRes.ok) {
                    const collectionData = await collectionRes.json()
                    collectionId = collectionData.payment_collection?.id || collectionData.id
                } else {
                    throw new Error(t.messages.error)
                }
            }

            if (collectionId) {
                // Step 4: Create Payment Session
                console.log("[Checkout] Step 4: Creating payment session...")
                const sessionRes = await fetch(`/api/store-proxy?resource=payment-collections&id=${collectionId}&action=payment-sessions`, {
                    method: "POST",
                    headers: getAuthHeaders({ "Idempotency-Key": `ps-${cartId}` }),
                    body: JSON.stringify({ provider_id: "pp_system_default" })
                })
                if (!sessionRes.ok) {
                    // 409 might mean it already exists, which is often OK
                    if (sessionRes.status !== 409) {
                        throw new Error(t.messages.error)
                    }
                }
            }

            // Step 5: Complete Cart → Creates Order
            console.log("[Checkout] Step 5: Completing cart...")
            const completeRes = await fetch(`/api/store-proxy?resource=carts&id=${cartId}&action=complete`, {
                method: "POST",
                headers: getAuthHeaders({ "Idempotency-Key": idempotencyKey })
            })

            const completeData = await completeRes.json().catch(() => ({}))
            console.log("[Checkout] Complete response:", { status: completeRes.status, data: completeData })

            if (completeRes.ok || completeRes.status === 409 || completeData.type === "order" || completeData.order) {
                const orderData = completeData.order || completeData.order_subscription?.order || completeData;
                console.log("[Checkout] Success! Order ID:", orderData?.id)

                // Loyalty Points Logic
                if (userData && (orderData?.summary?.total || orderData?.total)) {
                    try {
                        const totalAmount = orderData.summary?.total || orderData.total || 0
                        const earnedPoints = Math.floor(totalAmount / 10000) // 1 point per 10,000 SDG

                        if (earnedPoints > 0) {
                            console.log(`[Checkout] Earned ${earnedPoints} points from total ${totalAmount}`)
                            const currentPoints = userData.metadata?.loyalty_points || 0
                            const newPoints = currentPoints + earnedPoints
                            const history = userData.metadata?.loyalty_history || []
                            const newHistory = [
                                {
                                    date: new Date().toISOString(),
                                    points: earnedPoints,
                                    type: 'earned',
                                    description: t.checkout.loyalty_earned_desc.replace('{id}', orderData.display_id || orderData.id)
                                },
                                ...history
                            ]

                            await fetch('/api/customer/update-metadata', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    customerId: userData.id,
                                    metadata: {
                                        loyalty_points: newPoints,
                                        loyalty_history: newHistory
                                    }
                                })
                            }).then(async r => {
                                if (r.ok) {
                                    const d = await r.json()
                                    if (d.customer) {
                                        localStorage.setItem("ola_user", JSON.stringify(d.customer))
                                        console.log("[Checkout] Loyalty points updated in local storage")
                                    }
                                }
                            })
                        }
                    } catch (lyErr) {
                        console.error("Loyalty update failed:", lyErr)
                    }
                }

                setStep(2)
                localStorage.removeItem("cart_id")
                window.dispatchEvent(new Event("cart-updated"))
            } else {
                console.error("[Checkout] Complete failed:", completeData)
                throw new Error(completeData.message || t.messages.error)
            }

        } catch (e: any) {
            console.error("Checkout failed:", e)
            setError(e.message || t.messages.error)
        } finally {
            setPlacingOrder(false)
        }
    }


    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
                <Loader2 className="w-10 h-10 text-rose-600 animate-spin" />
            </div>
        )
    }

    if (step === 2) {
        return (
            <div className={`min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                    <Check className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">{t.checkout.success_title}</h1>
                <p className="text-gray-500 mb-8 max-w-sm">{t.checkout.success_message.replace('{name}', formData.first_name)}</p>
                <a href="/" className="bg-rose-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-700 transition">{t.checkout.back_to_home}</a>
            </div>
        )
    }

    const subtotal = cart?.items?.reduce((sum: number, item: any) => sum + (item.unit_price * item.quantity), 0) || 0

    return (
        <div className={`min-h-screen bg-gray-50 pb-20 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
            <Header />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-black mb-8 text-gray-900">{t.checkout.title}</h1>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Form */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
                        <h3 className="font-black text-xl mb-6 flex items-center gap-3">
                            <Truck className="w-6 h-6 text-rose-600" /> {t.checkout.delivery_info}
                        </h3>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 font-bold flex items-center gap-2">
                                <AlertCircle className="w-5 h-5" /> {error}
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 whitespace-nowrap">{t.checkout.first_name}</label>
                                    <input
                                        type="text"
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl p-4 font-bold outline-none transition-all"
                                    />
                                </div>
                                <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 whitespace-nowrap">{t.checkout.last_name}</label>
                                    <input
                                        type="text"
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl p-4 font-bold outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 whitespace-nowrap">{t.checkout.phone}</label>
                                <input
                                    type="text"
                                    dir="ltr"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className={`w-full bg-gray-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl p-4 font-bold outline-none transition-all ${language === 'ar' ? 'text-right' : 'text-left'}`}
                                />
                            </div>
                            <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 whitespace-nowrap">{t.checkout.city}</label>
                                <select
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl p-4 font-bold outline-none transition-all appearance-none"
                                >
                                    {t.checkout.cities.map((city) => (
                                        <option key={city.id} value={city.id}>{city.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 whitespace-nowrap">{t.checkout.address}</label>
                                <textarea
                                    rows={3}
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder={language === 'ar' ? "الشارع، رقم المنزل، علامة مميزة..." : "Street, House No, Landmark..."}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl p-4 font-bold outline-none transition-all"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
                        <h3 className={`font-black text-xl mb-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t.checkout.order_summary}</h3>
                        <div className="space-y-4 mb-8">
                            {cart.items.map((item: any) => (
                                <div key={item.id} className="flex justify-between items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gray-50 overflow-hidden border border-gray-100 relative shrink-0">
                                            <img src={getImageUrl(item.thumbnail)} alt="" className="object-cover" />
                                        </div>
                                        <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                                            <p className="font-black text-gray-900 text-sm line-clamp-1">{item.title}</p>
                                            <p className="text-xs text-gray-400 font-bold">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <span className="font-black text-gray-900 whitespace-nowrap">{formatPrice(item.unit_price * item.quantity)}</span>
                                </div>
                            ))}

                            <div className="border-t border-gray-50 pt-6 space-y-4">
                                {/* Coupon Section */}
                                <div className="bg-gray-50 p-4 rounded-2xl">
                                    <label className={`block text-[10px] font-black text-gray-400 uppercase mb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                        {t.checkout.have_coupon}
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            placeholder={t.checkout.coupon_placeholder}
                                            className="flex-1 bg-white border-2 border-transparent focus:border-rose-500 rounded-xl px-4 py-2 font-bold outline-none uppercase text-sm"
                                        />
                                        <button
                                            onClick={handleApplyCoupon}
                                            disabled={applyingCoupon || !couponCode}
                                            className="bg-gray-900 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-black transition-all disabled:opacity-50"
                                        >
                                            {applyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : t.checkout.apply_coupon}
                                        </button>
                                    </div>
                                    {couponError && <p className={`text-red-500 text-[10px] mt-1 font-bold ${language === 'ar' ? 'text-right' : 'text-left'}`}>{couponError}</p>}
                                    {cart.promotions?.length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            {cart.promotions.map((p: any) => (
                                                <div key={p.id} className={`text-emerald-600 text-[10px] font-bold flex items-center gap-1 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                                    <Check className="w-3 h-3" /> {t.checkout.coupon_applied.replace('{code}', p.code)}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between font-bold text-gray-500">
                                        <span>{t.cart.subtotal}</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>
                                    {cart.discount_total > 0 && (
                                        <div className="flex justify-between font-bold text-emerald-600">
                                            <span>{t.checkout.discount_label}</span>
                                            <span>-{formatPrice(cart.discount_total)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-bold text-gray-500">
                                        <span>{t.cart.shipping}</span>
                                        {cart.shipping_total === 0 ? (
                                            <span className="text-emerald-600">{t.cart.shipping_free}</span>
                                        ) : (
                                            <span>{formatPrice(cart.shipping_total)}</span>
                                        )}
                                    </div>
                                    <div className="flex justify-between text-2xl font-black pt-4 border-t border-gray-50">
                                        <span className="text-gray-900">{t.cart.total}</span>
                                        <span className="text-rose-600">{formatPrice(cart.total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`bg-rose-50 p-6 rounded-3xl flex items-center gap-4 mb-8 ${language === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-600 shadow-sm shrink-0">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-black text-rose-900">{t.checkout.cod_label}</p>
                                <p className="text-xs text-rose-700 font-bold">{t.checkout.cod_description}</p>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={placingOrder}
                            className="w-full bg-rose-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-rose-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {placingOrder ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    {t.checkout.place_order}
                                    {language === 'ar' ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
