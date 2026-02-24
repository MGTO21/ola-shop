import { MessageCircle, Mail, MapPin, Phone, Clock, Send } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white font-arabic" dir="rtl">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-rose-50 to-white py-24 px-4 overflow-hidden relative">
                <div className="absolute top-10 right-10 w-64 h-64 bg-rose-200/20 rounded-full blur-3xl animate-pulse" />
                <div className="container mx-auto max-w-4xl text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">تحدثي معنا</h1>
                    <p className="text-xl text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
                        فريق العُلا دائماً في خدمتكِ. سواء كان لديكِ استفسار عن طلبكِ أو ترغبين في استشارة جمالية، نحن هنا.
                    </p>
                </div>
            </section>

            <main className="container mx-auto px-4 py-20 -mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col gap-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 flex-shrink-0">
                                    <MessageCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">واتساب</h3>
                                    <p className="text-gray-600 text-sm mb-2">الرد المباشر والسريع</p>
                                    <a href="https://wa.me/249121013939" target="_blank" className="text-rose-600 font-black hover:underline" dir="ltr">+249 121 013 939</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 flex-shrink-0">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">البريد الإلكتروني</h3>
                                    <p className="text-gray-600 text-sm mb-2">للاستفسارات الرسمية</p>
                                    <a href="mailto:support@ola-shop.com" className="text-rose-600 font-black hover:underline">support@ola-shop.com</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">ساعات العمل</h3>
                                    <p className="text-gray-600 text-sm">يومياً من الساعة 10 صباحاً <br /> وحتى 10 مساءً</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-rose-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-700" />
                            <h3 className="text-xl font-bold mb-4 relative z-10">عنواننا</h3>
                            <div className="flex items-start gap-3 relative z-10">
                                <MapPin className="w-5 h-5 text-rose-300 flex-shrink-0 mt-1" />
                                <p className="text-rose-100 font-medium">بورتسودان، شارع الرئيسي، مقابل صيدلية السلام.</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl border border-gray-100">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">أرسلي لنا رسالة</h2>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 mr-2">الاسم بالكامل</label>
                                        <input type="text" className="w-full bg-gray-50 border-0 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-rose-500 transition-all" placeholder="أدخلي اسمكِ" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 mr-2">رقم الهاتف</label>
                                        <input type="tel" className="w-full bg-gray-50 border-0 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-rose-500 transition-all text-right" placeholder="0XXXXXXXXX" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 mr-2">الموضوع</label>
                                    <input type="text" className="w-full bg-gray-50 border-0 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-rose-500 transition-all" placeholder="عن ماذا تودين السؤال؟" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 mr-2">رسالتكِ</label>
                                    <textarea rows={5} className="w-full bg-gray-50 border-0 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-rose-500 transition-all resize-none" placeholder="اكتبي رسالتكِ هنا..."></textarea>
                                </div>
                                <button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-rose-900/20 transition-all flex items-center justify-center gap-3 group">
                                    إرسال الرسالة <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
