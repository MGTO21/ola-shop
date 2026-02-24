export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white font-arabic py-24 px-4" dir="rtl">
            <div className="container mx-auto max-w-4xl prose prose-rose lg:prose-lg">
                <h1 className="text-4xl font-black text-gray-900 mb-12 text-center">شروط الخدمة</h1>

                <p className="text-lg leading-loose text-gray-700 mb-8 text-center italic">
                    أهلاً بكِ في متجر العُلا. باستخدامكِ لهذا الموقع، فإنكِ توافقين على الشروط التالية:
                </p>

                <h2 className="text-2xl font-bold text-rose-600 mb-4 mt-12">١. الاستخدام العام</h2>
                <p>يجب أن تكون المعلومات المقدمة عند التسجيل صحيحة ودقيقة. أنتِ مسؤولة عن الحفاظ على سرية معلومات حسابكِ وكلمة المرور.</p>

                <h2 className="text-2xl font-bold text-rose-600 mb-4 mt-12">٢. المنتجات والأسعار</h2>
                <p>نحرص على دقة عرض المنتجات وأسعارها. ومع ذلك، قد تحدث أخطاء تقنية غير مقصودة. في حال كان السعر غير صحيح، سنقوم بالتواصل معكِ لتأكيد السعر الصحيح أو إلغاء الطلب.</p>

                <h2 className="text-2xl font-bold text-rose-600 mb-4 mt-12">٣. الطلب والتأكيد</h2>
                <p>يعتبر الطلب مؤكداً فقط بعد تواصل فريقنا معكِ عبر واتساب أو تأكيد الطلب إلكترونياً. نحتفظ بالحق في رفض أو إلغاء أي طلب لأي سبب كان.</p>

                <h2 className="text-2xl font-bold text-rose-600 mb-4 mt-12">٤. الملكية الفكرية</h2>
                <p>جميع المحتويات الموجودة على متجر العُلا من صور ونصوص وشعارات هي ملكية خاصة لمؤسسة العُلا ولا يجوز استخدامها دون إذن رسمي.</p>

                <h2 className="text-2xl font-bold text-rose-600 mb-4 mt-12">٥. التعديلات</h2>
                <p>نحتفظ بالحق في تعديل هذه الشروط في أي وقت. استمراركِ في استخدام المتجر يعني موافقتكِ على الشروط المحدثة.</p>

                <div className="mt-20 p-8 bg-rose-50 rounded-[2rem] border border-rose-100 text-center text-rose-900 font-bold">
                    نشكركِ على اختياركِ متجر العُلا. تسوقاً ممتعاً!
                </div>
            </div>
        </div>
    )
}
