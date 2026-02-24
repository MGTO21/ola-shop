"use client"

import React, { useState, useEffect, useRef } from "react"
import { Search, X, Loader2, ArrowRight } from "lucide-react"
import { medusaClient } from "@/lib/medusa"
import { getImageUrl, formatPrice } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/lib/context/LanguageContext"

interface SearchOverlayProps {
    isOpen: boolean
    onClose: () => void
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const { language, t, dir } = useLanguage()
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    useEffect(() => {
        const fetchResults = async () => {
            if (query.length < 2) {
                setResults([])
                return
            }

            setLoading(true)
            try {
                const { products } = await medusaClient.products.list({
                    q: query,
                    limit: 6,
                    fields: "*variants.calculated_price"
                })
                setResults(products || [])
            } catch (err) {
                console.error("Search failed:", err)
            } finally {
                setLoading(false)
            }
        }

        const timer = setTimeout(fetchResults, 300)
        return () => clearTimeout(timer)
    }, [query])

    if (!isOpen) return null

    return (
        <div className={`fixed inset-0 z-[100] flex flex-col bg-white ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={dir}>
            {/* Header */}
            <div className="container mx-auto px-4 py-4 flex items-center gap-4 border-b border-gray-100">
                <div className="flex-1 relative">
                    <Search className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5`} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={t.header.search_placeholder}
                        className={`w-full bg-gray-50 border-none rounded-2xl py-4 ${language === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-lg focus:ring-2 focus:ring-rose-500 transition-all outline-none`}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {loading && (
                        <div className={`absolute ${language === 'ar' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2`}>
                            <Loader2 className="w-5 h-5 text-rose-500 animate-spin" />
                        </div>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="p-3 hover:bg-gray-100 rounded-2xl text-gray-500 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Results Body */}
            <div className="flex-1 overflow-y-auto bg-gray-50/50">
                <div className="container mx-auto px-4 py-8">
                    {query.length > 0 && results.length === 0 && !loading && (
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-lg">
                                {t.search.no_results.replace('{query}', query)}
                            </p>
                        </div>
                    )}

                    {results.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {results.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.id}`}
                                    onClick={onClose}
                                    className="bg-white p-4 rounded-[2rem] border border-gray-100 flex items-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all group"
                                >
                                    <div className="relative w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                                        <Image
                                            src={getImageUrl(product.thumbnail)}
                                            alt={product.title}
                                            fill
                                            className="object-contain p-2"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 truncate group-hover:text-rose-600 transition-colors text-right">
                                            {product.title}
                                        </h3>
                                        <p className="text-rose-600 font-black mt-1 text-right">
                                            {formatPrice(product.variants?.[0]?.calculated_price?.calculated_amount || 0)}
                                        </p>
                                    </div>
                                    <ArrowRight className={`w-5 h-5 text-gray-300 group-hover:text-rose-500 ${language === 'ar' ? 'rotate-0' : 'rotate-180'}`} />
                                </Link>
                            ))}
                        </div>
                    )}

                    {query.length === 0 && (
                        <div className="space-y-8">
                            <h4 className={`font-bold text-gray-400 uppercase tracking-widest text-sm ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                {t.search.suggested_categories}
                            </h4>
                            <div className={`flex flex-wrap gap-3 ${language === 'ar' ? 'justify-start' : 'justify-start'}`}>
                                {t.search.categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setQuery(cat)}
                                        className="bg-white px-6 py-3 rounded-full border border-gray-200 text-gray-600 font-bold hover:border-rose-500 hover:text-rose-500 transition-all shadow-sm"
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    )
}
