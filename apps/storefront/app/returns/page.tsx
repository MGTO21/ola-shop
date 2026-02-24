import { RefreshCcw, ShieldAlert, CheckCircle2, XCircle, HelpCircle } from "lucide-react"

export default function ReturnsPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA] font-arabic" dir="rtl">
            {/* Hero */}
            <header className="bg-white border-b py-20 px-4 text-center">
                <div className="container mx-auto">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 rounded-full mb-6">
                        <RefreshCcw className="w-8 h-8 text-rose-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 font-playfair">سياسة الاستبدال والاسترجاع</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
                        رضاكِ هو غايتنا. إذا لم تكوني راضية تماماً عن مشترياتكِ، نحن هنا للمساعدة.
                    </p>
                </div>
            </header>

            <main className="container mx-auto px-4 py-20">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Return Conditions */}
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-gray-900 border-r-4 border-emerald-500 pr-4">شروط الاسترجاع</h2>
                        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-gray-900">المدة الزمنية</h3>
                                        <p className="text-gray-600 text-sm">يمكنك طلب الاستبدال أو الاسترجاع خلال 3 أيام من تاريخ استلام الطلب.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-gray-900">حالة المنتج</h3>
                                        <p className="text-gray-600 text-sm">يجب أن يكون المنتج في حالته الأصلية، غير مستخدم، وبكامل تغليفه الأصلي.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-gray-900">إثبات الشراء</h3>
                                        <p className="text-gray-600 text-sm">يجب إرفاق فاتورة الشراء الأصلية أو رقم الطلب الإلكتروني.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Non-returnable Items */}
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-gray-900 border-r-4 border-rose-500 pr-4">منتجات لا ترد ولا تستبدل</h2>
                        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <XCircle className="w-6 h-6 text-rose-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-gray-900">مستحضرات التجميل المفتوحة</h3>
                                        <p className="text-gray-600 text-sm">لأسباب صحية، لا يمكن استرجاع أي مكياج أو أدوات تجميل تم فتح غلافها أو تجربتها.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <XCircle className="w-6 h-6 text-rose-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-gray-900">الملابس الداخلية والملابس الشخصية</h3>
                                        <p className="text-gray-600 text-sm">حفاظاً على سلامتكِ، هذه المنتجات لا تخضع لسياسة الاستبدال إلا في حال وجود عيب مصنعي.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <XCircle className="w-6 h-6 text-rose-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-gray-900">المنتجات المستخدمة</h3>
                                        <p className="text-gray-600 text-sm">أي منتج يظهر عليه أثر الاستخدام لا يمكن قبوله للاسترجاع.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Return Process */}
                <div className="mt-20 bg-rose-50 p-10 md:p-16 rounded-[3rem] text-center max-w-4xl mx-auto">
                    <h2 className="text-3xl font-black text-gray-900 mb-8">كيفية تقديم طلب استرجاع؟</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-rose-600 font-bold shadow-sm">1</div>
                            <p className="font-bold">تواصل معنا عبر واتساب</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-rose-600 font-bold shadow-sm">2</div>
                            <p className="font-bold">إرسال صور المنتج والسبب</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-rose-600 font-bold shadow-sm">3</div>
                            <p className="font-bold">سيتم التواصل معك للتنسيق</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
