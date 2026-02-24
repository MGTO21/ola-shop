'use client'
import Link from "next/link"
import { Sparkles, Droplet, Wind, Flower2, Scissors, Shirt, Watch, Heart } from "lucide-react"
import { useLanguage } from "@/lib/context/LanguageContext"

const categoriesList = [
    {
        name: "Cosmetics",
        nameAr: "مستحضرات تجميل",
        icon: Sparkles,
        color: "from-pink-500 to-rose-500",
        href: "/products?category=cosmetics",
    },
    {
        name: "Perfumes",
        nameAr: "عطور",
        icon: Flower2,
        color: "from-amber-500 to-orange-500",
        href: "/products?category=perfumes",
    },
    {
        name: "Fashion",
        nameAr: "أزياء",
        icon: Shirt,
        color: "from-purple-500 to-indigo-500",
        href: "/products?category=fashion",
    },
    {
        name: "Accessories",
        nameAr: "إكسسوارات",
        icon: Watch,
        color: "from-emerald-500 to-teal-500",
        href: "/products?category=accessories",
    },
    {
        name: "Sudanese Products",
        nameAr: "منتجات سودانية",
        icon: Heart,
        color: "from-green-600 to-emerald-600",
        href: "/products?category=sudanese",
    },
]

export function Categories() {
    const { t, dir, language } = useLanguage()

    return (
        <section className={`py-16 bg-white/80 backdrop-blur-md ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">
                    {t.home.browse_categories}
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                    {categoriesList.map((category) => {
                        const Icon = category.icon
                        return (
                            <Link
                                key={category.name}
                                href={category.href}
                                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 md:p-8 text-white card-hover"
                                style={{
                                    background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                                }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90 group-hover:opacity-100 transition-opacity`} />

                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                                        <Icon className="w-6 h-6 md:w-8 md:h-8" />
                                    </div>

                                    <h3 className="font-semibold text-lg md:text-xl mb-1">
                                        {language === 'ar' ? category.nameAr : category.name}
                                    </h3>

                                    {language === 'ar' && (
                                        <p className="text-xs opacity-80">
                                            {category.name}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <span className="px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-bold">
                        {t.home.home_badges.new}
                    </span>
                    <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-bold">
                        {t.home.home_badges.new_arrivals}
                    </span>
                    <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                        {t.home.home_badges.mix_save}
                    </span>
                    <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-bold">
                        {t.home.home_badges.gifts_sets}
                    </span>
                    <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
                        {t.home.home_badges.sudanese_beauty}
                    </span>
                </div>
            </div>
        </section>
    )
}
