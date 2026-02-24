import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password } = body
        const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://46.224.43.113:9000"

        const res = await fetch(`${BACKEND_URL}/store/auth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        const data = await res.json()
        if (!res.ok) return NextResponse.json(data, { status: res.status })
        return NextResponse.json(data)
    } catch (e) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 })
    }
}
