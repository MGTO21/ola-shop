import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const limit = searchParams.get('limit') || '20'

        // Connect to Backend from Server-Side (No CORS here)
        // Use Local Backend from Env
        const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000"
        const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

        const REGION_ID = 'reg_01KC1R1XZRG584Y15RKTAR51N5'
        const fields = '*variants.calculated_price'

        const res = await fetch(`${BACKEND_URL}/store/products?limit=${limit}&region_id=${REGION_ID}&fields=${fields}`, {
            headers: {
                ...(PUBLISHABLE_KEY ? { "x-publishable-api-key": PUBLISHABLE_KEY } : {}),
                "Content-Type": "application/json"
            },
            cache: 'no-store'
        })

        if (!res.ok) {
            return NextResponse.json({ products: [] })
        }

        const data = await res.json()
        return NextResponse.json(data)
    } catch (e) {
        return NextResponse.json({ products: [] })
    }
}
