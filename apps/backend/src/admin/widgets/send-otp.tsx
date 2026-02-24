import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { DetailWidgetProps, AdminCustomer } from "@medusajs/framework/types";
import { useState } from "react";

const SendOtpWidget = ({ data }: DetailWidgetProps<AdminCustomer>) => {
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async () => {
        if (!data.phone) {
            alert("Customer has no phone number.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("https://ola-shop.com/api/send-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ phone: data.phone }),
            });

            if (response.ok) {
                alert("Success: OTP sent successfully!");
            } else {
                const err = await response.json();
                alert("Failed: " + (err.message || "Could not send OTP"));
            }
        } catch (e) {
            alert("Error: Network error sending OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="shadow-elevation-card-rest bg-ui-bg-base w-full rounded-lg p-4 mb-4 border border-rose-100 bg-rose-50/10">
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-y-1 text-right order-2">
                    <h1 className="text-rose-600 text-large-semi font-black text-lg">
                        إدارة التحقق عبر واتساب
                    </h1>
                    <p className="text-ui-fg-subtle text-small-regular font-medium">
                        حالة الحساب: {data.groups?.some(g => g.id === 'cusgroup_verified') ?
                            <span className="text-green-600 font-bold">✓ مُحقق</span> :
                            <span className="text-orange-600 font-bold">⚠️ غير مُحقق</span>}
                    </p>
                    <p className="text-ui-fg-subtle text-small-regular font-medium">
                        رقم الهاتف: {data.phone || "غير مسجل"}
                    </p>
                    <div className="mt-2 p-2 bg-white/50 rounded border border-rose-100 text-xs text-rose-800">
                        <p className="font-bold">معلومات تقنية:</p>
                        <p>كود OTP الأخير: {data.metadata?.otp_code as string || "لا يوجد"}</p>
                        <p>تاريخ التحقق: {String(data.metadata?.whatsapp_verified) === "true" ? "مكتمل" : "قيد الانتظار"}</p>
                    </div>
                </div>
                <div className="flex items-center gap-x-2 order-1">
                    <button
                        onClick={handleSendOtp}
                        disabled={loading}
                        className="btn btn-secondary btn-small"
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#e11d48',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '13px',
                            boxShadow: '0 2px 4px rgba(225, 29, 72, 0.2)'
                        }}
                    >
                        {loading ? "جاري الإرسال..." : "إعادة إرسال الكود"}
                    </button>
                    <a
                        href={`https://wa.me/${data.phone?.replace('+', '').replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-small"
                        style={{
                            padding: '8px 16px',
                            backgroundColor: 'white',
                            color: '#e11d48',
                            border: '1px solid #e11d48',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '13px',
                            textDecoration: 'none',
                            display: 'inline-block'
                        }}
                    >
                        فتح واتساب
                    </a>
                </div>
            </div>
        </div>
    );
};

export const config = defineWidgetConfig({
    zone: "customer.details.before",
});

export default SendOtpWidget;
