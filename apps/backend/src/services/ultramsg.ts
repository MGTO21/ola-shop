import axios from 'axios'

export class UltramsgService {
    private instanceId: string
    private token: string
    private baseUrl: string

    constructor() {
        this.instanceId = process.env.ULTRAMSG_INSTANCE_ID || 'instance160494'
        this.token = process.env.ULTRAMSG_TOKEN || 'ha5a1yfuw5dggis5'
        this.baseUrl = `https://api.ultramsg.com/${this.instanceId}`
    }

    /**
     * Send WhatsApp message
     */
    async sendMessage(to: string, body: string) {
        try {
            console.log(`[Ultramsg] Sending message to ${to}`)

            const response = await axios.post(
                `${this.baseUrl}/messages/chat`,
                {
                    token: this.token,
                    to: to,
                    body: body,
                    priority: 10
                }
            )

            console.log(`[Ultramsg] Message sent successfully:`, response.data)
            return response.data
        } catch (error: any) {
            console.error('[Ultramsg] Send message error:', error.response?.data || error.message)
            throw error
        }
    }

    /**
     * Send OTP code
     */
    async sendOTP(phone: string, code: string) {
        const message = `🔐 كود التحقق الخاص بك في متجر العُلا:

${code}

الكود صالح لمدة 10 دقائق.
لا تشارك هذا الكود مع أي شخص.

متجر العُلا - جمالك يبدأ من هنا 🌹`

        return this.sendMessage(phone, message)
    }

    /**
     * Send order confirmation
     */
    async sendOrderConfirmation(phone: string, orderNumber: string, total: string) {
        const message = `✅ تم استلام طلبك بنجاح!

رقم الطلب: ${orderNumber}
المبلغ الإجمالي: ${total} جنيه

سنتواصل معك قريباً لتأكيد التوصيل.

شكراً لتسوقك من متجر العُلا! 🌹`

        return this.sendMessage(phone, message)
    }

    /**
     * Send order status update
     */
    async sendOrderStatus(phone: string, orderNumber: string, status: string) {
        const statusMessages: Record<string, string> = {
            'pending': '⏳ طلبك قيد المراجعة',
            'confirmed': '✅ تم تأكيد طلبك',
            'processing': '📦 جاري تجهيز طلبك',
            'shipped': '🚚 تم شحن طلبك',
            'delivered': '🎉 تم توصيل طلبك',
            'cancelled': '❌ تم إلغاء طلبك'
        }

        const statusText = statusMessages[status] || status
        const message = `${statusText}

رقم الطلب: ${orderNumber}

متجر العُلا 🌹`

        return this.sendMessage(phone, message)
    }

    /**
     * Send promotional message
     */
    async sendPromotion(phone: string, title: string, description: string, link?: string) {
        let message = `🎁 ${title}

${description}`

        if (link) {
            message += `

🔗 ${link}`
        }

        message += `

متجر العُلا - جمالك يبدأ من هنا 🌹`

        return this.sendMessage(phone, message)
    }

    /**
     * Send admin notification
     */
    async notifyAdmin(message: string) {
        const adminPhone = process.env.ULTRAMSG_PHONE || '249121013939'
        return this.sendMessage(adminPhone, `🔔 إشعار إداري:

${message}`)
    }

    /**
     * Check instance status
     */
    async getStatus() {
        try {
            const response = await axios.get(
                `${this.baseUrl}/instance/status`,
                {
                    params: { token: this.token }
                }
            )
            return response.data
        } catch (error: any) {
            console.error('[Ultramsg] Status check error:', error.response?.data || error.message)
            throw error
        }
    }

    /**
     * Get instance info
     */
    async getInfo() {
        try {
            const response = await axios.get(
                `${this.baseUrl}/instance/me`,
                {
                    params: { token: this.token }
                }
            )
            return response.data
        } catch (error: any) {
            console.error('[Ultramsg] Info check error:', error.response?.data || error.message)
            throw error
        }
    }
}

export default UltramsgService
