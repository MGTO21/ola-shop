import { Truck, MapPin, Clock, Globe, ShieldCheck } from "lucide-react"

export default function ShippingPage() {
    const shippingZones = [
        {
            title: "توصيل بورتسودان",
            area: "داخل ولاية البحر الأحمر",
            time: "24 - 48 ساعة",
            price: "مجاني للطلبات فوق 500,000 ج.س",
            icon: Truck
        },
        {
            title: "توصيل الولايات",
            area: "עطبرة، كسلا، الشمالية، كوستي",
            time: "3 - 5 أيام عمل",
            price: "حسب الوزن والموقع",
            icon: Globe
        },
        {
            title: "توصيل الخارج",
            area: "مصر، السعودية، الإمارات",
            time: "7 - 10 أيام عمل",
            price: "يُحدد عند الطلب",
            icon: ShieldCheck
        }
    ]

    return (
        <div className="min-h-screen bg-white font-arabic" dir="rtl">
            {/* Header */}
            <header className="bg-rose-50 py-20 px-4 text-center">
                <div className="container mx-auto">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">الشحن والتوصيل</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
                        نحن في متجر العُلا نحرص على وصول منتجاتكِ بأمان وبأسرع وقت ممكن في كافة أنحاء السودان وخارجه.
                    </p>
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {shippingZones.map((zone, idx) => (
                        <div key={idx} className="bg-white border-2 border-rose-50 p-8 rounded-[2rem] hover:border-rose-300 transition-all shadow-sm hover:shadow-xl group">
                            <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-rose-600 transition-colors">
                                <zone.icon className="w-7 h-7 text-rose-600 group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{zone.title}</h3>
                            <p className="text-rose-600 font-bold text-sm mb-4">{zone.area}</p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm font-medium">{zone.time}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm font-medium">{zone.price}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Important Notes */}
                <div className="max-w-4xl mx-auto bg-rose-900 text-white rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-4">
                        <ShieldCheck className="w-8 h-8 text-rose-300" />
                        ملاحظات هامة حول الشحن
                    </h2>
                    <ul className="space-y-6 text-rose-100 text-lg">
                        <li className="flex gap-4">
                            <span className="text-rose-400 font-black">٠١</span>
                            <p>يتم تجهيز الطلب خلال 24 ساعة من تأكيد عملية الشراء عبر واتساب أو الموقع.</p>
                        </li>
                        <li className="flex gap-4">
                            <span className="text-rose-400 font-black">٠٢</span>
                            <p>في حال عدم الرد على طلب التأكيد خلال 48 ساعة، قد يتم إلغاء الطلب تلقائياً.</p>
                        </li>
                        <li className="flex gap-4">
                            <span className="text-rose-400 font-black">٠٣</span>
                            <p>نحن غير مسؤولين عن أي تأخير خارج عن إرادتنا (كظروف الطرق أو الأحوال الجوية).</p>
                        </li>
                        <li className="flex gap-4">
                            <span className="text-rose-400 font-black">٠٤</span>
                            <p>يرجى التأكد من كتابة العنوان ورقم الهاتف بدقة لضمان سرعة الوصول.</p>
                        </li>
                    </ul>
                </div>
            </main>
        </div>
    )
}
