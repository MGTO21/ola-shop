"use client"

import { MessageCircle } from "lucide-react"

export function WhatsAppButton() {
    return (
        <a
            href="https://wa.me/249121013939?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%85%D8%AA%D8%AC%D8%B1%20%D8%A7%D9%84%D8%B9%D9%8F%D9%84%D8%A7%D8%8C%20%D8%A3%D8%AD%D8%AA%D8%A7%D8%AC%20%D9%84%D9%84%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%A9"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-bounce"
            aria-label="تواصل معنا عبر واتساب"
        >
            <MessageCircle className="w-7 h-7" />
        </a>
    )
}
