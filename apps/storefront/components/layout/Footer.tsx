'use client'
import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, MessageCircle } from "lucide-react"
import { useLanguage } from "@/lib/context/LanguageContext"

export function Footer() {
    const { t, dir, language } = useLanguage()

    return (
        <footer className={`bg-gradient-to-r from-pink-950 to-rose-900 text-gray-300 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">{t.footer.about_title}</h3>
                        <p className="text-sm mb-4 leading-relaxed">
                            {t.footer.about_text}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">{t.footer.links_title}</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="hover:text-white transition-colors">{t.nav.about}</Link></li>
                            <li><Link href="/products" className="hover:text-white transition-colors">{t.footer.all_products}</Link></li>
                            <li><Link href="/shipping" className="hover:text-white transition-colors">{t.footer.shipping_policy}</Link></li>
                            <li><Link href="/returns" className="hover:text-white transition-colors">{t.footer.returns_policy}</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">{t.nav.contact}</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">{t.footer.categories_title}</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/products?category=cosmetics" className="hover:text-white transition-colors">{t.nav.cosmetics}</Link></li>
                            <li><Link href="/products?category=perfumes" className="hover:text-white transition-colors">{t.nav.perfumes}</Link></li>
                            <li><Link href="/products?category=fashion" className="hover:text-white transition-colors">{t.nav.fashion}</Link></li>
                            <li><Link href="/products?category=accessories" className="hover:text-white transition-colors">{t.nav.accessories}</Link></li>
                            <li><Link href="/products?category=sudanese" className="hover:text-white transition-colors">{t.nav.sudanese}</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">{t.footer.contact_title}</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <span>📍</span>
                                <span>{t.footer.location}</span>
                            </li>
                            <li className="flex items-start gap-2" dir="ltr">
                                <span dir={dir}>📞</span>
                                <a href="tel:+249121013939" className="hover:text-white transition-colors font-mono">
                                    +249 121 013 939
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <span>✉️</span>
                                <a href="mailto:support@ola-shop.com" className="hover:text-white transition-colors">
                                    support@ola-shop.com
                                </a>
                            </li>
                        </ul>

                        {/* Social Media */}
                        <div className="mt-6">
                            <h4 className="text-white font-medium mb-3">{t.footer.follow_us}</h4>
                            <div className="flex gap-3">
                                <a href="https://facebook.com/olashop" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors">
                                    <Facebook className="w-4 h-4" />
                                </a>
                                <a href="https://instagram.com/olashop" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors">
                                    <Instagram className="w-4 h-4" />
                                </a>
                                <a href="https://twitter.com/olashop" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors">
                                    <Twitter className="w-4 h-4" />
                                </a>
                                <a href="https://youtube.com/@olashop" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors">
                                    <Youtube className="w-4 h-4" />
                                </a>
                                <a href="https://wa.me/249121013939" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                                    <MessageCircle className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                    <p>&copy; {new Date().getFullYear()} {t.footer.ola_store}. {t.footer.rights}</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">{t.footer.privacy}</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">{t.footer.terms}</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
