import Image from "next/image"
import Link from "next/link"
import { Heart, Sparkles, ShieldCheck, Truck, Star } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#FFF5F7] font-arabic" dir="rtl">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <Image
                    src="/about-hero.jpg"
                    alt="عن متجر العُلا"
                    fill
                    className="object-cover brightness-50"
                    priority
                />
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-lg">
                        قصة متجر العُلا
                    </h1>
                    <p className="text-xl md:text-2xl text-pink-100 max-w-2xl mx-auto font-medium leading-relaxed">
                        جمالك يبدأ من هنا.. حيث تجتمع الأصالة مع الحداثة لنقدم لكِ الأفضل دائماً
                    </p>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20 container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                            <Image
                                src="/about-story.jpg"
                                alt="بدايتنا"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-600 rounded-full font-bold text-sm">
                                <Sparkles className="w-4 h-4" />
                                <span>من نحن</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 border-r-4 border-rose-500 pr-4">
                                شغفنا بالجمال لا حدود له
                            </h2>
                            <p className="text-gray-700 leading-loose text-lg font-medium">
                                بدأ متجر العُلا برؤية واحدة: توفير منتجات التجميل والعطور الأصلية لكل امرأة في السودان بكل سهولة وموثوقية. نحن نؤمن أن الجمال حق للجميع، ولذلك نسعى جاهدين لاختيار أرقى العلامات التجارية العالمية والسودانية الأصيلة.
                            </p>
                            <p className="text-gray-700 leading-loose text-lg">
                                من قلب مدينة بورتسودان، انطلقنا لنصل إلى كل منزل في السودان، محملين بأفضل مستحضرات العناية بالبشرة، المكياج، والعطور الفاخرة التي تعكس شخصيتك المتفردة.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-white shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="container mx-auto px-4 relative z-10 text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-playfair">قيمنا الأساسية</h2>
                    <div className="w-24 h-1 bg-rose-500 mx-auto rounded-full" />
                </div>

                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "الجودة والأصالة",
                            desc: "نضمن لكِ منتجات أصلية 100% مستوردة من مصادرها الموثوقة عالمياً ومحلياً.",
                            icon: ShieldCheck,
                            color: "bg-emerald-50 text-emerald-600"
                        },
                        {
                            title: "خدمة ملكية",
                            desc: "عملاؤنا هم محور اهتمامنا، نسعى دائماً لتقديم تجربة تسوق راقية وسهلة.",
                            icon: Heart,
                            color: "bg-rose-50 text-rose-600"
                        },
                        {
                            title: "توصيل سريع",
                            desc: "نلتزم بأسرع مدة توصيل ممكنة لضمان وصول الجمال إليكِ في وقت قياسي.",
                            icon: Truck,
                            color: "bg-pink-50 text-pink-600"
                        }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                            <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-6 mx-auto`}>
                                <item.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                            <p className="text-gray-600 leading-relaxed font-medium">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 text-center">
                <div className="container mx-auto px-4 bg-gradient-to-r from-rose-600 to-pink-500 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-8">هل أنتِ مستعدة لبدء رحلة الجمال؟</h2>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-3 bg-white text-rose-600 px-10 py-5 rounded-full font-black text-xl hover:bg-gray-100 transition-all shadow-xl hover:scale-105 active:scale-95"
                    >
                        تسوقي الآن <Star className="w-6 h-6 fill-current animate-pulse" />
                    </Link>
                </div>
            </section>
        </div>
    )
}
