import { NextRequest, NextResponse } from 'next/server'

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://127.0.0.1:9000';
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_3b9ce0ab55a6f2cfa25747f441ddfdbdea53c45ab496005d3b8a0ff6a5bd693f";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const resource = searchParams.get('resource')
        const id = searchParams.get('id')
        const action = searchParams.get('action')

        let url = `${MEDUSA_BACKEND_URL}/store/${resource}`
        if (id) url += `/${id}`
        if (action) url += `/${action}`

        const paramsStr = searchParams.toString()
        if (paramsStr) {
            const forwardParams = new URLSearchParams(searchParams.toString())
            forwardParams.delete('resource')
            forwardParams.delete('id')
            forwardParams.delete('action')
            const finalParams = forwardParams.toString()
            if (finalParams) {
                url += (url.includes('?') ? '&' : '?') + finalParams
            }
        }

        const headers: Record<string, string> = {
            'x-publishable-api-key': PUBLISHABLE_API_KEY
        }

        // Forward Auth and Cookies
        const authHeader = request.headers.get('Authorization')
        if (authHeader) headers['Authorization'] = authHeader

        const cookieHeader = request.headers.get('cookie')
        if (cookieHeader) headers['cookie'] = cookieHeader

        console.log(`[Store Proxy] GET ${url}`)

        const response = await fetch(url, {
            headers
        })

        const responseText = await response.text()
        let data: any = {}
        try { data = JSON.parse(responseText) } catch { }

        if (!response.ok) {
            console.error(`[Store Proxy] GET ${url} failed:`, { status: response.status, data })
        }

        return NextResponse.json(data, { status: response.status })
    } catch (e: any) {
        console.error("Store Proxy GET Error:", e);
        return NextResponse.json({ error: 'Proxy failed', details: e.message }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const resource = searchParams.get('resource')
        const id = searchParams.get('id')
        const action = searchParams.get('action')

        let body: any = {}
        try {
            body = await request.json()
        } catch (e) { }

        let url = `${MEDUSA_BACKEND_URL}/store/${resource}`
        if (id) url += `/${id}`
        if (action) url += `/${action}`

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'x-publishable-api-key': PUBLISHABLE_API_KEY
        }

        // Forward Auth, Cookies and Idempotency
        const authHeader = request.headers.get('Authorization')
        if (authHeader) headers['Authorization'] = authHeader

        const cookieHeader = request.headers.get('cookie')
        if (cookieHeader) headers['cookie'] = cookieHeader

        const idempotencyKey = request.headers.get('Idempotency-Key')
        if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey

        console.log(`[Store Proxy] POST ${url}`, { idempotencyKey })

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
        })

        const responseText = await response.text()
        let data: any = {}
        try { data = JSON.parse(responseText) } catch { }

        if (!response.ok) {
            console.error(`[Store Proxy] POST ${url} failed:`, { status: response.status, data })
        }

        return NextResponse.json(data, { status: response.status })
    } catch (e: any) {
        console.error("Store Proxy POST Error:", e);
        return NextResponse.json({ error: 'Proxy failed', details: e.message }, { status: 500 })
    }
}
