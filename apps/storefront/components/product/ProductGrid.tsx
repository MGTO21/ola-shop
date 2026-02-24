"use client"
import React, { useEffect, useState } from "react"
import { ProductCard } from "./ProductCard"
import { getProducts } from "@/lib/medusa"
import { Loader2 } from "lucide-react"

interface ProductGridProps {
    title?: string
    categoryId?: string
    limit?: number
}

export function ProductGrid({ title, categoryId, limit = 4 }: ProductGridProps) {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetch() {
            const data = await getProducts({
                category_id: categoryId ? [categoryId] : undefined,
                limit
            })
            setProducts(data)
            setLoading(false)
        }
        fetch()
    }, [categoryId, limit])

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-rose-600" /></div>

    return (
        <section className="py-12 px-4 container mx-auto" dir="rtl">
            {title && <h2 className="text-3xl font-black mb-8 text-gray-900 border-r-4 border-rose-600 pr-4">{title}</h2>}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.map(p => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </section>
    )
}
