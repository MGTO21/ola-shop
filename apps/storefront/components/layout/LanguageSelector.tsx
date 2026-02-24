"use client"

import { Globe } from "lucide-react"
import { useState } from "react"

export function LanguageSelector() {
    const [language, setLanguage] = useState<"en" | "ar">("en")

    const toggleLanguage = () => {
        const newLang = language === "en" ? "ar" : "en"
        setLanguage(newLang)
        // TODO: Implement actual language switching with next-intl
        document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr"
        document.documentElement.lang = newLang
    }

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
            aria-label="Toggle language"
        >
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">{language === "en" ? "AR" : "EN"}</span>
        </button>
    )
}
