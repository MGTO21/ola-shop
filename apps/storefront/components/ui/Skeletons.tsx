import React from "react"

export const ProductCardSkeleton = () => (
    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 overflow-hidden flex flex-col h-full animate-pulse">
        <div className="aspect-square bg-gray-100 w-full" />
        <div className="p-4 flex-1 space-y-3">
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
            <div className="pt-4 flex items-center gap-2">
                <div className="h-10 bg-gray-100 rounded-xl flex-1" />
                <div className="h-10 w-10 bg-gray-100 rounded-xl" />
            </div>
        </div>
    </div>
)

export const CategoryHeroSkeleton = () => (
    <div className="py-12 animate-pulse">
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
                <div className="h-8 bg-gray-100 rounded w-48" />
                <div className="h-6 bg-gray-100 rounded w-24" />
            </div>
            <div className="flex gap-4 overflow-hidden">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex-shrink-0 w-64 md:w-72 lg:w-80 h-96 bg-gray-50 rounded-[2.5rem]" />
                ))}
            </div>
        </div>
    </div>
)

export const ProductDetailsSkeleton = () => (
    <div className="container mx-auto px-4 py-12 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-gray-100 rounded-[3rem]" />
            <div className="space-y-6">
                <div className="h-12 bg-gray-100 rounded w-3/4" />
                <div className="h-24 bg-gray-100 rounded w-full" />
                <div className="h-12 bg-gray-200 rounded w-1/2" />
                <div className="space-y-4 pt-8">
                    <div className="h-16 bg-gray-100 rounded-2xl" />
                    <div className="h-16 bg-gray-100 rounded-2xl" />
                </div>
            </div>
        </div>
    </div>
)
