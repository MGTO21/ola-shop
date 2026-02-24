// Media data helper - fetches videos and banners from warehouse admin
// This connects to the data saved in the warehouse admin interface

export interface Video {
    title: string
    url: string
    description?: string
    active: boolean
    order: number
    createdAt: string
}

export interface Banner {
    title: string
    imageUrl: string
    linkUrl?: string
    position: string
    description?: string
    active: boolean
    createdAt: string
}

const WAREHOUSE_ADMIN_URL = process.env.NEXT_PUBLIC_WAREHOUSE_ADMIN_URL || 'http://46.224.43.113:9000'

// Get videos from warehouse admin (via localStorage for now, will be Medusa API later)
export async function getVideos(): Promise<Video[]> {
    try {
        // For now, we'll use a static endpoint or fetch from Medusa metadata
        // In production, this will call: GET /api/media/videos

        // Temporary: Return sample data until API is set up
        // You can replace this with actual Medusa store metadata fetch
        const response = await fetch(`${WAREHOUSE_ADMIN_URL}/store/store`, {
            headers: {
                'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''
            }
        })

        if (response.ok) {
            const data = await response.json()
            return data.store?.metadata?.video_carousel || []
        }
    } catch (error) {
        console.error('Error fetching videos:', error)
    }

    // Fallback: Return empty array or sample data
    return []
}

// Get banners from warehouse admin
export async function getBanners(position?: string): Promise<Banner[]> {
    try {
        const response = await fetch(`${WAREHOUSE_ADMIN_URL}/store/store`, {
            headers: {
                'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''
            }
        })

        if (response.ok) {
            const data = await response.json()
            const allBanners: Banner[] = data.store?.metadata?.promo_banners || []

            // Filter by position if specified
            if (position) {
                return allBanners.filter(b => b.active && b.position === position)
            }

            return allBanners.filter(b => b.active)
        }
    } catch (error) {
        console.error('Error fetching banners:', error)
    }

    // Fallback: Return empty array
    return []
}

// Helper: Get video embed URL
export function getVideoEmbedUrl(url: string, autoplay: boolean = true): string {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.includes('youtu.be')
            ? url.split('/').pop()?.split('?')[0]
            : new URL(url).searchParams.get('v')

        const params = new URLSearchParams({
            autoplay: autoplay ? '1' : '0',
            mute: '1',
            loop: '1',
            controls: '0',
            showinfo: '0',
            rel: '0',
            modestbranding: '1'
        })

        return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
    }

    // Vimeo
    if (url.includes('vimeo.com')) {
        const videoId = url.split('/').pop()?.split('?')[0]
        const params = new URLSearchParams({
            autoplay: autoplay ? '1' : '0',
            muted: '1',
            loop: '1',
            controls: '0'
        })

        return `https://player.vimeo.com/video/${videoId}?${params.toString()}`
    }

    // TikTok
    if (url.includes('tiktok.com')) {
        // TikTok embed format: https://www.tiktok.com/embed/v2/VIDEO_ID
        let videoId = ''

        // Format: https://www.tiktok.com/@username/video/1234567890
        if (url.includes('/video/')) {
            videoId = url.split('/video/')[1]?.split('?')[0]
        }
        // Format: https://vm.tiktok.com/SHORTCODE/
        else if (url.includes('vm.tiktok.com')) {
            videoId = url.split('vm.tiktok.com/')[1]?.split('?')[0]
        }

        if (videoId) {
            return `https://www.tiktok.com/embed/v2/${videoId}`
        }
    }

    // Instagram
    if (url.includes('instagram.com')) {
        // Instagram embed format: https://www.instagram.com/p/POST_ID/embed/
        let postId = ''

        // Format: https://www.instagram.com/p/POST_ID/
        if (url.includes('/p/')) {
            postId = url.split('/p/')[1]?.split('/')[0]?.split('?')[0]
        }
        // Format: https://www.instagram.com/reel/REEL_ID/
        else if (url.includes('/reel/')) {
            postId = url.split('/reel/')[1]?.split('/')[0]?.split('?')[0]
        }

        if (postId) {
            return `https://www.instagram.com/p/${postId}/embed/`
        }
    }

    // Direct video URL
    return url
}

// Helper: Check if URL is a social media video
export function isSocialMediaVideo(url: string): boolean {
    return url.includes('tiktok.com') || url.includes('instagram.com')
}

// Helper: Get platform name from URL
export function getVideoPlatform(url: string): string {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube'
    if (url.includes('vimeo.com')) return 'Vimeo'
    if (url.includes('tiktok.com')) return 'TikTok'
    if (url.includes('instagram.com')) return 'Instagram'
    if (url.match(/\.(mp4|webm|ogg)$/i)) return 'Video File'
    return 'Unknown'
}

// Client-side only: Get data from localStorage (for testing)
export function getVideosFromLocalStorage(): Video[] {
    if (typeof window === 'undefined') return []

    try {
        const data = localStorage.getItem('videoCarousel')
        if (data) {
            const videos: Video[] = JSON.parse(data)
            return videos.filter(v => v.active).sort((a, b) => a.order - b.order)
        }
    } catch (error) {
        console.error('Error reading videos from localStorage:', error)
    }

    return []
}

export function getBannersFromLocalStorage(position?: string): Banner[] {
    if (typeof window === 'undefined') return []

    try {
        const data = localStorage.getItem('promoBanners')
        if (data) {
            const banners: Banner[] = JSON.parse(data)
            const activeBanners = banners.filter(b => b.active)

            if (position) {
                return activeBanners.filter(b => b.position === position)
            }

            return activeBanners
        }
    } catch (error) {
        console.error('Error reading banners from localStorage:', error)
    }

    return []
}
