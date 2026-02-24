import { Suspense } from "react"
import { Hero } from "@/components/home/Hero"
import { FeaturedProducts } from "@/components/home/FeaturedProducts"
import { Categories } from "@/components/home/Categories"
import { MobileAppDownload } from "@/components/home/MobileAppDownload"
import VideoCarousel from "@/components/home/VideoCarousel"
import { PromotionalBanners } from "@/components/home/PromotionalBanners"
import { CategoryHeroSections } from "@/components/home/CategoryHeroSections"
import { CustomerReviews } from "@/components/home/CustomerReviews"
import { ProductCardSkeleton } from "@/components/ui/Skeletons"

export default async function Home() {
    return (
        <main className="min-h-screen bg-transparent">

            <div className="container mx-auto px-4 py-8 space-y-12">
                {/* Top Promotional Banner */}
                <PromotionalBanners />

                {/* Categories Overview */}
                <Categories />

                {/* 5 Category Hero Sections with Featured Products */}
                <CategoryHeroSections />

                {/* TikTok Video Section */}
                <VideoCarousel />

                {/* General Featured Products */}
                <Suspense fallback={
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => <ProductCardSkeleton key={i} />)}
                    </div>
                }>
                    <FeaturedProducts />
                </Suspense>

                {/* Customer Reviews */}
                <CustomerReviews />

                {/* Mobile App Download */}
                {/* <MobileAppDownload /> */}
            </div>
        </main>
    )
}
