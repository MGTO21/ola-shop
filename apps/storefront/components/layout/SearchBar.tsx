"use client"

import { Search } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { debounce } from "@/lib/utils"

export function SearchBar() {
    const [query, setQuery] = useState("")
    const router = useRouter()

    const handleSearch = debounce((value: string) => {
        if (value.trim()) {
            router.push(`/products?q=${encodeURIComponent(value)}`)
        }
    }, 500)

    return (
        <div className="relative w-full">
            <input
                type="text"
                placeholder="Search for products... | ابحث عن المنتجات..."
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value)
                    handleSearch(e.target.value)
                }}
                className="w-full px-3 py-1.5 pl-8 pr-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        </div>
    )
}
