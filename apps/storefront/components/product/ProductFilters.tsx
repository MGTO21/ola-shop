"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/context/LanguageContext"

const categories = [
    {
        id: "cosmetics",
        name: "Cosmetics",
        nameAr: "مستحضرات تجميل",
        subcategories: [
            { id: "lipstick", name: "Lipstick", nameAr: "أرواج" },
            { id: "foundation", name: "Foundation", nameAr: "كريم أساس" },
            { id: "mascara", name: "Mascara", nameAr: "ماسكرا" },
            { id: "eyeliner", name: "Eyeliner", nameAr: "آيلاينر" },
            { id: "blush", name: "Blush", nameAr: "بلاشر" },
            { id: "powder", name: "Powder", nameAr: "بودرة" },
            { id: "concealer", name: "Concealer", nameAr: "كونسيلر" }
        ]
    },
    {
        id: "perfumes",
        name: "Perfumes",
        nameAr: "عطور",
        subcategories: [
            { id: "men", name: "Men", nameAr: "رجالي" },
            { id: "women", name: "Women", nameAr: "نسائي" },
            { id: "unisex", name: "Unisex", nameAr: "للجنسين" },
            { id: "oud", name: "Oud", nameAr: "عود" },
            { id: "musk", name: "Musk", nameAr: "مسك" },
            { id: "gift-sets", name: "Gift Sets", nameAr: "أطقم هدايا" }
        ]
    },
    {
        id: "fashion",
        name: "Fashion",
        nameAr: "أزياء",
        subcategories: [
            { id: "men", name: "Men", nameAr: "رجالي" },
            { id: "women", name: "Women", nameAr: "نسائي" },
            { id: "kids", name: "Kids", nameAr: "أطفال" },
            { id: "shoes", name: "Shoes", nameAr: "أحذية" },
            { id: "bags", name: "Bags", nameAr: "حقائب" },
            { id: "traditional", name: "Traditional", nameAr: "تقليدي" }
        ]
    },
    {
        id: "accessories",
        name: "Accessories",
        nameAr: "إكسسوارات",
        subcategories: [
            { id: "watches", name: "Watches", nameAr: "ساعات" },
            { id: "jewelry", name: "Jewelry", nameAr: "مجوهرات" },
            { id: "sunglasses", name: "Sunglasses", nameAr: "نظارات شمسية" },
            { id: "belts", name: "Belts", nameAr: "أحزمة" },
            { id: "wallets", name: "Wallets", nameAr: "محافظ" }
        ]
    },
    {
        id: "sudanese",
        name: "Sudanese Products",
        nameAr: "منتجات سودانية",
        subcategories: [
            { id: "thob", name: "Thob", nameAr: "توب" },
            { id: "jalabiya", name: "Jalabiya", nameAr: "جلابية" },
            { id: "bakhoor", name: "Bakhoor", nameAr: "بخور" },
            { id: "spices", name: "Spices", nameAr: "بهارات" },
            { id: "handmade", name: "Handmade", nameAr: "عمل يدوي" },
            { id: "traditional-food", name: "Traditional Food", nameAr: "أكل شعبي" }
        ]
    }
]

export function ProductFilters() {
    const { t, dir, language } = useLanguage()
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentCategory = searchParams.get("category")
    const currentSubcategory = searchParams.get("subcategory")

    const handleCategoryClick = (categoryId: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (currentCategory === categoryId) {
            params.delete("category")
            params.delete("subcategory")
        } else {
            params.set("category", categoryId)
            params.delete("subcategory")
        }
        router.push(`/products?${params.toString()}`)
    }

    const handleSubcategoryClick = (subcategory: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (currentSubcategory === subcategory) {
            params.delete("subcategory")
        } else {
            params.set("subcategory", subcategory)
        }
        router.push(`/products?${params.toString()}`)
    }

    const activeCategory = categories.find(c => c.id === currentCategory)

    return (
        <div className={`space-y-6 mb-8 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
            {/* Main Categories */}
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={() => router.push("/products")}
                    className={cn(
                        "px-6 py-2 rounded-xl transition-all border font-bold",
                        !currentCategory
                            ? "bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-200"
                            : "bg-white text-gray-700 border-gray-200 hover:border-rose-300"
                    )}
                >
                    {t.products.all}
                </button>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={cn(
                            "px-6 py-2 rounded-xl transition-all border font-bold",
                            currentCategory === category.id
                                ? "bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-200"
                                : "bg-white text-gray-700 border-gray-200 hover:border-rose-300"
                        )}
                    >
                        {language === 'ar' ? category.nameAr : category.name}
                    </button>
                ))}
            </div>

            {/* Subcategories */}
            {activeCategory && (
                <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100">
                    <h3 className="text-sm font-bold text-rose-600 mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                        {language === 'ar' ? `أقسام ${activeCategory.nameAr}` : `${activeCategory.name} Sections`}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {activeCategory.subcategories.map((sub: any) => (
                            <button
                                key={sub.id}
                                onClick={() => handleSubcategoryClick(sub.id)}
                                className={cn(
                                    "px-4 py-2 text-sm rounded-lg transition-all font-medium",
                                    currentSubcategory === sub.id
                                        ? "bg-rose-600 text-white shadow-sm"
                                        : "bg-white text-gray-600 border border-gray-200 hover:border-rose-400 hover:text-rose-600"
                                )}
                            >
                                {language === 'ar' ? sub.nameAr : sub.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
