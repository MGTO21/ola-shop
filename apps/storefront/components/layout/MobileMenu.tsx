"use client"

import Link from "next/link"
import { X, Globe } from "lucide-react"
import { useLanguage } from "@/lib/context/LanguageContext"

interface MobileMenuProps {
    onClose: () => void
}

export function MobileMenu({ onClose }: MobileMenuProps) {
    const { language, setLanguage, t, dir } = useLanguage()

    return (
        <div className={`fixed inset-0 z-50 md:hidden ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />

            {/* Menu */}
            <div className={`fixed ${language === 'ar' ? 'right-0' : 'left-0'} top-0 bottom-0 w-80 bg-white shadow-xl animate-in ${language === 'ar' ? 'slide-in-from-right' : 'slide-in-from-left'} duration-300`}>
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="font-bold text-lg">{t.nav.account}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="p-4">
                    <ul className="space-y-4">
                        <li>
                            <Link href="/" onClick={onClose} className="block py-2 hover:text-rose-600 transition-colors font-bold">
                                {t.nav.home}
                            </Link>
                        </li>
                        <li>
                            <Link href="/products?category=cosmetics" onClick={onClose} className="block py-2 hover:text-rose-600 transition-colors">
                                {t.nav.cosmetics}
                            </Link>
                        </li>
                        <li>
                            <Link href="/products?category=perfumes" onClick={onClose} className="block py-2 hover:text-rose-600 transition-colors">
                                {t.nav.perfumes}
                            </Link>
                        </li>
                        <li>
                            <Link href="/products?category=fashion" onClick={onClose} className="block py-2 hover:text-rose-600 transition-colors">
                                {t.nav.fashion}
                            </Link>
                        </li>
                        <li>
                            <Link href="/products?category=accessories" onClick={onClose} className="block py-2 hover:text-rose-600 transition-colors">
                                {t.nav.accessories}
                            </Link>
                        </li>
                        <li>
                            <Link href="/products?category=sudanese" onClick={onClose} className="block py-2 hover:text-rose-600 transition-colors font-bold text-emerald-700">
                                {t.nav.sudanese}
                            </Link>
                        </li>
                        <li className="border-t pt-4">
                            <button
                                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                                className="w-full flex items-center justify-between py-2 text-gray-700 hover:text-rose-600 font-bold"
                            >
                                <span className="flex items-center gap-2">
                                    <Globe className="w-5 h-5" />
                                    {t.header.language_label}
                                </span>
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {language === 'ar' ? 'English' : 'العربية'}
                                </span>
                            </button>
                        </li>
                        <li className="border-t pt-4">
                            <Link href="/about" onClick={onClose} className="block py-2 hover:text-rose-600 transition-colors">
                                {t.nav.about}
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" onClick={onClose} className="block py-2 hover:text-rose-600 transition-colors">
                                {t.nav.contact}
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}
