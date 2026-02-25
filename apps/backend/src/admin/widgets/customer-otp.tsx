import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminCustomer } from "@medusajs/framework/types"
import { Container, Heading, Button, Text, toast } from "@medusajs/ui"
import { useState } from "react"

const CustomerOTPWidget = ({ data }: DetailWidgetProps<AdminCustomer>) => {
  const [loading, setLoading] = useState(false)
  const phone = data.phone || ""

  const handleSendOTP = async () => {
    if (!phone) {
      toast.error("رقم الهاتف غير مسجل لهذا العميل")
      return
    }

    setLoading(true)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    try {
      // Save OTP to customer metadata using Medusa Admin API
      const response = await fetch(`/admin/customers/${data.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metadata: {
            otp_code: otp,
            otp_sent_at: new Date().toISOString()
          }
        })
      })

      if (!response.ok) throw new Error("Failed to save OTP")

      const msg = encodeURIComponent(`كود التحقق الخاص بك في متجر العُلا هو: ${otp}\n\nصالح لمدة 10 دقائق.`)

      navigator.clipboard.writeText(otp).then(() => {
        toast.success(`تم إنشاء الرمز [${otp}] ونسخه وتحديثه في السيرفر`)
        window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${msg}`, '_blank')
      })
    } catch (e) {
      console.error("OTP Save Error:", e)
      toast.error("فشل في حفظ الرمز في السيرفر")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="p-4 mb-4 bg-rose-50 border-2 border-rose-200 overflow-hidden text-right">
      <div className="flex justify-between items-center direction-rtl">
        <Button
          onClick={handleSendOTP}
          isLoading={loading}
          variant="primary"
          className="bg-rose-600 hover:bg-rose-700 font-bold"
        >
          إنشاء وحفظ وإرسال الرمز
        </Button>
        <div className="text-right">
          <Heading level="h2" className="text-rose-900 font-black">📱 مرسل الأكواد السريع</Heading>
          <Text className="text-rose-700 font-medium">إنشاء وإرسال أكواد التحقق (OTP) عبر واتساب</Text>
        </div>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "customer.details.side.before"
})

export default CustomerOTPWidget
