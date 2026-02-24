import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { DetailWidgetProps, AdminCustomer } from "@medusajs/framework/types";
import { Container, Heading, Text, Button, clx } from "@medusajs/ui";

const WhatsAppChatWidget = ({ data }: DetailWidgetProps<AdminCustomer>) => {
    const phone = data.phone || data.metadata?.whatsapp_normalized || "";
    const hasPhone = !!phone;
    const cleanPhone = String(phone).replace(/\D/g, "");

    const templates = [
        { label: "مرحباً", text: `مرحباً ${data.first_name || ""}، معك متجر العُلا. كيف يمكننا مساعدتك اليوم؟` },
        { label: "تحديث الطلب", text: `مرحباً ${data.first_name || ""}، نحن بصدد معالجة طلبك الأخير من متجر العُلا.` },
        { label: "التوصيل", text: `مرحباً ${data.first_name || ""}، سيصلك مندوب التوصيل خلال اليوم لاستلام طلبك من متجر العُلا.` }
    ];

    return (
        <Container className="p-0 overflow-hidden border-rose-100 shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-rose-50 to-white">
                <div className="text-left">
                    <Heading level="h2" className="text-rose-600 font-black">التواصل الذكي عبر واتساب</Heading>
                    <Text className="text-ui-fg-subtle" size="small">
                        إرسال رسائل سريعة لـ {data.first_name || "العميل"}
                    </Text>
                </div>
                {hasPhone && (
                    <div className="flex gap-2">
                        {templates.map((tpl) => (
                            <a
                                key={tpl.label}
                                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(tpl.text)}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Button size="small" variant="secondary" className="border-rose-200 text-rose-700 hover:bg-rose-50 font-bold">
                                    {tpl.label}
                                </Button>
                            </a>
                        ))}
                    </div>
                )}
            </div>
            {!hasPhone && (
                <div className="px-6 py-4 text-center bg-gray-50">
                    <Text className="text-ui-fg-muted font-bold">رقم الهاتف غير متاح لهذا العميل</Text>
                </div>
            )}
        </Container>
    );
};

export const config = defineWidgetConfig({
    zone: ["customer.details.before"],
});

export default WhatsAppChatWidget;
