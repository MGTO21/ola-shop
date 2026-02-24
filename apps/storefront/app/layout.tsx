import type { Metadata } from "next"
import { Poppins, Playfair_Display, Cairo } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { GlobalFreeShippingBar } from "@/components/layout/GlobalFreeShippingBar"
import { PurchasePopup } from "@/components/layout/PurchasePopup"

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-poppins",
    display: "swap",
})

const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-playfair",
    display: "swap",
})

const cairo = Cairo({
    subsets: ["arabic"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-cairo",
    display: "swap",
})

export const metadata: Metadata = {
    title: "Ola Shop - Premium Beauty & Cosmetics | متجر العلا",
    description: "Discover authentic beauty products, makeup, skincare, and fragrances. Fast delivery across Sudan.",
    keywords: ["beauty", "cosmetics", "makeup", "skincare", "fragrance", "Sudan", "Port Sudan"],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta httpEquiv="Permissions-Policy" content="accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()" />
            </head>
            <body className={`${poppins.variable} ${playfair.variable} ${cairo.variable} font-sans antialiased`}>
                <Providers>
                    <Header />
                    <GlobalFreeShippingBar />
                    <PurchasePopup />
                    {children}
                    <Footer />
                </Providers>
            </body>
        </html>
    )
}
