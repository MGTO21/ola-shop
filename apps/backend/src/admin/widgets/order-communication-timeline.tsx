import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { MessageSquare, Mail, CheckCheck, Clock, Send } from "lucide-react"

const OrderCommunicationTimelineWidget = () => {
    // Mock data for communication audit trail
    const timeline = [
        {
            time: "منذ ١٠ دقائق",
            channel: "WhatsApp",
            event: "طلب في الطريق (Out for Delivery)",
            status: "Delivered",
            icon: <MessageSquare className="w-4 h-4" />
        },
        {
            time: "منذ ساعة",
            channel: "Email",
            event: "تأكيد الطلب (Order Confirmation)",
            status: "Sent",
            icon: <Mail className="w-4 h-4" />
        },
        {
            time: "منذ ساعة",
            channel: "System",
            event: "إنشاء الفاتورة (Invoice Created)",
            status: "Success",
            icon: <CheckCheck className="w-4 h-4" />
        }
    ]

    return (
    return (
        <Container className="p-6 border-rose-100 bg-rose-50/5">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shadow-sm">
                    <Send className="w-5 h-5" />
                </div>
                <div>
                    <Heading level="h2" className="text-rose-950 font-black">سجل الاتصالات الموحد</Heading>
                    <Text className="text-ui-fg-subtle font-medium text-rose-800/70">تتبع الرسائل التلقائية المرسلة للعميل عبر WhatsApp والبريد</Text>
                </div>
            </div>

            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-rose-100 before:to-transparent">
                {timeline.map((item, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        {/* Dot */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-rose-50 shadow-md text-rose-400 group-[.is-active]:text-rose-600 z-10 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            {item.icon}
                        </div>
                        {/* Card */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-1">
                                <time className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {item.time}
                                </time>
                                <Badge color={item.status === "Delivered" ? "green" : "blue"}>{item.status}</Badge>
                            </div>
                            <div className="text-rose-950 font-black mb-1">{item.event}</div>
                            <div className="text-xs font-bold text-rose-600 flex items-center gap-1">
                                القناة: {item.channel === "WhatsApp" ? "واتساب" : item.channel === "Email" ? "البريد" : "النظام"}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Container>
    )
}

export const config = defineWidgetConfig({
    zone: "order.details.after",
})

export default OrderCommunicationTimelineWidget
