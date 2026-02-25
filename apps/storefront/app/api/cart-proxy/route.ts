import { NextRequest, NextResponse } from 'next/server'

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://127.0.0.1:9000';
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

function getHeaders(request?: NextRequest): HeadersInit {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (PUBLISHABLE_API_KEY) {
        headers['x-publishable-api-key'] = PUBLISHABLE_API_KEY
    }

    if (request) {
        const auth = request.headers.get('Authorization')
        if (auth) headers['Authorization'] = auth
        const cookie = request.headers.get('cookie')
        if (cookie) headers['cookie'] = cookie
    }

    return headers
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const cartId = searchParams.get('id')
        if (!cartId) return NextResponse.json({ error: 'Cart ID is required' }, { status: 400 })

        // Medusa v2 uses fields instead of expand for selecting relations
        const response = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}?fields=*items,*region,*region.countries,*payment_collection,*payment_collection.payment_sessions`, {
            headers: getHeaders(request),
        })

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            return NextResponse.json({ error: errData.message || 'Failed' }, { status: response.status })
        }
        const data = await response.json()
        return NextResponse.json(data.cart || data)
    } catch (e: any) {
        console.error("Cart Proxy GET Error:", e);
        return NextResponse.json({ error: 'Error', details: e.message }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const cartId = searchParams.get('id')
        const lineItemId = searchParams.get('line_item_id')
        const path = searchParams.get('path')

        let body: any = {}
        try {
            body = await request.json()
        } catch (e) {
            // No body is fine for some endpoints
        }

        let url = `${MEDUSA_BACKEND_URL}/store/carts`
        let finalBody = body;

        if (cartId && path) {
            // e.g. complete, shipping-methods, etc.
            url = `${MEDUSA_BACKEND_URL}/store/carts/${cartId}/${path}`
        } else if (cartId && lineItemId) {
            // Medusa v2: POST to update a specific line item quantity
            url = `${MEDUSA_BACKEND_URL}/store/carts/${cartId}/line-items/${lineItemId}`
        } else if (cartId) {
            // Add new item to existing cart
            url = `${MEDUSA_BACKEND_URL}/store/carts/${cartId}/line-items`
        } else {
            // Create new cart, possibly with items
            // Medusa v2 requires region_id
            const defaultRegionId = 'reg_01KC1R1XZRG584Y15RKTAR51N5'

            if (body.variant_id) {
                finalBody = {
                    region_id: body.region_id || defaultRegionId,
                    items: [{ variant_id: body.variant_id, quantity: Number(body.quantity) || 1 }]
                };
            } else {
                finalBody = {
                    region_id: body.region_id || defaultRegionId,
                    ...body
                }
            }
        }

        console.log(`[Cart Proxy] POST ${url}`, finalBody)

        const response = await fetch(url, {
            method: 'POST',
            headers: getHeaders(request),
            body: Object.keys(finalBody).length > 0 ? JSON.stringify(finalBody) : undefined,
        })

        const responseText = await response.text()
        console.log(`[Cart Proxy] Response Status: ${response.status}`);

        if (!response.ok) {
            console.error(`[Cart Proxy] POST ${url} failed:`, { status: response.status, body: responseText })
            try {
                return NextResponse.json(JSON.parse(responseText), { status: response.status });
            } catch {
                return NextResponse.json({ error: 'Medusa API Error', details: responseText }, { status: response.status });
            }
        }

        // Parse the response
        let data: any = {}
        try {
            data = JSON.parse(responseText)
            console.log(`[Cart Proxy] Success: Cart ID ${data.cart?.id || 'N/A'}`);
        } catch {
            // empty or non-JSON response - that's ok for some endpoints
        }

        return NextResponse.json(data, { status: response.status })
    } catch (e: any) {
        console.error("Cart Proxy POST Error:", e.message);
        return NextResponse.json({ error: 'Mutation failed', details: e.message }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const cartId = searchParams.get('id')
        const lineItemId = searchParams.get('line_item_id')
        if (!cartId || !lineItemId) return NextResponse.json({ error: 'IDs required' }, { status: 400 })

        console.log(`[Cart Proxy] DELETE cart ${cartId} line-item ${lineItemId}`)

        const response = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}/line-items/${lineItemId}`, {
            method: 'DELETE',
            headers: getHeaders(request),
        })

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}))
            console.error(`[Cart Proxy] DELETE failed:`, { status: response.status, err: errData })
            return NextResponse.json({ error: errData.message || 'Delete failed' }, { status: response.status })
        }

        // Medusa v2 DELETE returns { deleted: true } or similar
        const data = await response.json().catch(() => ({ deleted: true }))
        return NextResponse.json(data, { status: 200 })
    } catch (e: any) {
        console.error("Cart Proxy DELETE Error:", e.message);
        return NextResponse.json({ error: 'Delete failed', details: e.message }, { status: 500 })
    }
}
