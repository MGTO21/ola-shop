export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white font-arabic py-24 px-4" dir="rtl">
            <div className="container mx-auto max-w-4xl prose prose-rose lg:prose-lg">
                <h1 className="text-4xl font-black text-gray-900 mb-12 text-center">سياسة الخصوصية</h1>

                <p className="text-lg leading-loose text-gray-700 mb-8">
                    في متجر العُلا، نولي أهمية قصوى لخصوصية عملائنا. توضح هذه السياسة كيفية جمعنا واستخدامنا وحماية معلوماتك الشخصية.
                </p>

                <h2 className="text-2xl font-bold text-rose-600 mb-4 mt-12">١. المعلومات التي نجمعها</h2>
                <p>نجمع المعلومات التي تقدمينها مباشرة عند التسجيل أو الشراء، وتشمل: الاسم، رقم الهاتف (واتساب)، البريد الإلكتروني، وعنوان التوصيل.</p>

                <h2 className="text-2xl font-bold text-rose-600 mb-4 mt-12">٢. كيف نستخدم معلوماتك</h2>
                <ul className="list-disc pr-6 space-y-2">
                    <li>معالجة طلبات الشراء وتوصيل المنتجات.</li>
                    <li>التواصل معكِ عبر واتساب بخصوص حالة الطلب.</li>
                    <li>تحسين تجربة التسوق في متجرنا.</li>
                    <li>إرسال العروض والتحديثات الجمالية (في حال موافقتكِ).</li>
                </ul>

                <h2 className="text-2xl font-bold text-rose-600 mb-4 mt-12">٣. حماية البيانات</h2>
                <p>نستخدم بروتوكولات أمان متقدمة لحماية بياناتك من الوصول غير المصرح به. نحن لا نبيع أو نشارك معلوماتك الشخصية مع أطراف ثالثة لأغراض تسويقية.</p>

                <h2 className="text-2xl font-bold text-rose-600 mb-4 mt-12">٤. حقوقك</h2>
                <p>لديكِ الحق في الوصول إلى معلوماتك الشخصية أو تصحيحها أو طلب حذفها في أي وقت من خلال التواصل مع فريق الدعم لدينا.</p>

                <div className="mt-20 p-8 bg-rose-50 rounded-[2rem] border border-rose-100 italic text-center text-rose-900 font-bold">
                    آخر تحديث: يناير ٢٠٢٦
                </div>
            </div>
        </div>
    )
}
