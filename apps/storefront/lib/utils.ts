import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Format price with currency
export function formatPrice(amount: number, currency: string = "SDG"): string {
    // For SDG, we treat the amount as the final unit since the user inputs it that way
    const divisor = currency.toLowerCase() === 'sdg' ? 1 : 100;
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 0,
    }).format(amount / divisor)
}

// Calculate discount percentage
export function calculateDiscountPercentage(originalPrice: number, discountedPrice: number): number {
    if (originalPrice <= 0) return 0
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
}

// Get image URL (handle Medusa image URLs)
export function getImageUrl(url?: string | null): string {
    if (!url) return "/placeholder-product.jpg"

    // If it's already a relative path, keep it
    if (url.startsWith("/")) return url

    // If it's a data URI, keep it
    if (url.startsWith("data:")) return url

    // REWRITE LOGIC: Convert any backend IP/Port 9001 URL to our secure proxy
    // This catches http://46.224.43.113:9001, ola-shop.com:9001, localhost:9001, etc.
    if (
        url.includes("46.224.43.113") ||
        url.includes("ola-shop.com:9001") ||
        url.includes("localhost:9001")
    ) {
        const parts = url.split("/uploads/")
        if (parts.length > 1) {
            return `/api/uploads/${parts[1]}`
        }
    }

    // Default fallback: If it's still an absolute HTTP URL, try to force it to our proxy
    if (url.startsWith("http") && url.includes("/uploads/")) {
        const parts = url.split("/uploads/")
        return `/api/uploads/${parts[1]}`
    }

    return url
}

// Format date
export function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(date))
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null
    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
    }
}
