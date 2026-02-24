"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Heading, Text, Button, Input, Label } from "@medusajs/ui"

const SUDAN_CITIES = [
    "الخرطوم", "أم درمان", "الخرطوم بحري", "بورتسودان", "كسلا",
    "الأبيض", "كوستي", "ود مدني", "القضارف", "نيالا", "الفاشر",
    "عطبرة", "الدمازين", "الجنينة", "ربك", "سنار", "المناقل",
    "النهود", "الدامر", "حلفا الجديدة", "الدويم", "شندي", "سواكن",
    "دنقلا", "كريمة", "مروي"
]

function SetupForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const customerId = searchParams.get("id")

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        city: "",
        email: "",
        birthday: ""
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)

    useEffect(() => {
        if (!customerId) return;

        // Fetch existing data
        fetch('/api/customer/get-basic-info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: customerId })
        })
            .then(res => res.json())
            .then(data => {
                if (data.customer) {
                    setFormData(prev => ({
                        ...prev,
                        first_name: data.customer.first_name || "",
                        last_name: data.customer.last_name || "",
                        phone: data.customer.phone || "",
                        email: data.customer.email || "",
                        city: data.customer.metadata?.city || ""
                    }))
                }
            })
            .catch(console.error)
            .finally(() => setFetching(false))
    }, [customerId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!formData.city) {
            setError("الرجاء اختيار المدينة")
            return
        }
        if (!formData.first_name) {
            setError("الاسم الأول مطلوب")
            return
        }

        setLoading(true)

        try {
            const res = await fetch("/api/customer/complete-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerId,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    city: formData.city,
                    email: formData.email,
                    birthday: formData.birthday
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "حدث خطأ ما")
            }

            // Save basic info to localStorage for immediate UI update
            if (typeof window !== 'undefined') {
                localStorage.setItem("ola_user", JSON.stringify({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    phone: formData.phone,
                    city: formData.city
                }));
            }

            router.push("/account")

        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (fetching) return <div className="flex h-screen items-center justify-center text-pink-600">جاري تحميل البيانات...</div>

    return (
        <div className="flex justify-center items-center min-h-[80vh] bg-pink-50/30" dir="rtl">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-pink-100 text-right">
                <div className="text-center mb-6">
                    <Heading level="h1" className="text-2xl text-pink-700 font-bold">إكمال الملف الشخصي</Heading>
                    <Text className="text-gray-500 text-sm mt-2">
                        مرحباً بك في متجر العُلا 🌸
                        <br />
                        الرجاء تأكيد بيانات الشحن الخاصة بك.
                    </Text>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm font-medium border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* Phone (Read Only) */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-gray-700 font-bold">رقم الهاتف (تم التحقق منه)</Label>
                        <Input
                            value={formData.phone}
                            readOnly
                            disabled
                            className="bg-gray-100 text-gray-500 cursor-not-allowed text-left"
                            dir="ltr"
                        />
                    </div>

                    {/* Names */}
                    <div className="flex gap-2">
                        <div className="w-1/2 flex flex-col gap-2">
                            <Label className="text-gray-700 font-bold">الاسم الأول <span className="text-red-500">*</span></Label>
                            <Input
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="w-1/2 flex flex-col gap-2">
                            <Label className="text-gray-700 font-bold">اسم العائلة</Label>
                            <Input
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* City (Required) */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-gray-700 font-bold">المدينة <span className="text-red-500">*</span></Label>
                        <select
                            className="w-full p-2 border border-gray-200 rounded-md bg-white text-sm focus:border-pink-500 outline-none text-right"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            required
                        >
                            <option value="">اختر مدينتك...</option>
                            {SUDAN_CITIES.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    {/* Email (Optional) */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-gray-700 font-bold">البريد الإلكتروني (اختياري)</Label>
                        <Input
                            placeholder="name@example.com"
                            type="email"
                            dir="ltr"
                            className="text-left"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    {/* Birthday (Optional) */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-gray-700 font-bold">تاريخ الميلاد (اختياري)</Label>
                        <Input
                            type="date"
                            value={formData.birthday}
                            onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                            className="text-right"
                        />
                    </div>

                    <Button
                        type="submit"
                        isLoading={loading}
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white mt-4 font-bold py-2"
                    >
                        حفظ ومتابعة ←
                    </Button>

                </form>
            </div>
        </div>
    )
}

export default function ProfileSetupPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center text-pink-600">جاري تحميل البيانات...</div>}>
            <SetupForm />
        </Suspense>
    )
}
