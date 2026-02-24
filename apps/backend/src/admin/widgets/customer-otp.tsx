import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Text } from "@medusajs/ui"

const CustomerOTPWidget = () => {
  const handleSendOTP = () => {
    const phone = prompt("Enter customer phone (+249XXXXXXXXX):")
    if (!phone) return

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const msg = encodeURIComponent(`Your Ola Shop verification code: ${otp}\n\nValid for 10 minutes.`)

    navigator.clipboard.writeText(otp).then(() => {
      alert(`✅ OTP Generated: ${otp}\n\n📋 Copied to clipboard!\n\n🔗 Opening WhatsApp...`)
      window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${msg}`, '_blank')
    }).catch(() => {
      alert(`OTP: ${otp}`)
      window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${msg}`, '_blank')
    })
  }

  return (
    <Container className="p-4 mb-4 bg-rose-50 border-2 border-rose-200 overflow-hidden text-right">
      <div className="flex justify-between items-center direction-rtl">
        <Button onClick={handleSendOTP} variant="primary" className="bg-rose-600 hover:bg-rose-700 font-bold">
          إنشاء وإرسال كود التحقق
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
