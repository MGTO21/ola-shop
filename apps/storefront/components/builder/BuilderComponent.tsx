"use client"
import { BuilderComponent as BuilderContent, Builder } from "@builder.io/react"
import { useEffect, useState } from "react"
import "@/lib/builder" // init
import { Hero } from "@/components/home/Hero"
import { FeaturedProducts } from "@/components/home/FeaturedProducts"
import { Categories } from "@/components/home/Categories"
import { ProductGrid } from "@/components/product/ProductGrid"

// Register components with Builder.io
Builder.registerComponent(Hero, {
    name: "Hero",
    inputs: []
})

Builder.registerComponent(ProductGrid, {
    name: "ProductGrid",
    inputs: [
        { name: 'title', type: 'string', defaultValue: 'جديد المنتجات' },
        { name: 'categoryId', type: 'string' },
        { name: 'limit', type: 'number', defaultValue: 4 }
    ]
})

Builder.registerComponent(FeaturedProducts, {
    name: "FeaturedProducts",
    inputs: [
        { name: 'title', type: 'string', defaultValue: 'منتجات مختارة' }
    ]
})

Builder.registerComponent(Categories, {
    name: "Categories",
    inputs: []
})

export default function RenderBuilderContent({ model, content }: { model: string, content: any }) {
    const [isLive, setIsLive] = useState(false)

    useEffect(() => {
        setIsLive(true)
    }, [])

    if (!isLive) return null

    return (
        <BuilderContent
            model={model}
            content={content}
        />
    )
}
