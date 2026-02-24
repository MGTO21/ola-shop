import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

export async function GET(request: NextRequest) {
    const requestId = Math.random().toString(36).substring(7);
    console.log(`[Orders API DEBUG][${requestId}] Request received!`);
    try {
        const cookieHeader = request.headers.get('cookie');
        const authHeader = request.headers.get('authorization');

        console.log(`[Orders API DEBUG][${requestId}] Auth: ${authHeader ? 'YES' : 'NO'}, Cookies: ${cookieHeader ? 'YES' : 'NO'}`);
        let authToken = '';
        if (cookieHeader) {
            const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
                const [key, value] = cookie.trim().split('=');
                if (key) acc[key.trim()] = value;
                return acc;
            }, {} as Record<string, string>);
            authToken = cookies['medusa_auth_token'] || '';
        }

        if (!authToken) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'x-publishable-api-key': PUBLISHABLE_API_KEY || '',
            'Authorization': `Bearer ${authToken}`,
            'cookie': cookieHeader || ''
        };

        // Medusa V2: Step 1 - Get the customer ID to confirm authentication and get identity
        console.log(`[Orders API][${requestId}] Stage 1: Fetching customer info...`);
        const meRes = await fetch(`${MEDUSA_BACKEND_URL}/store/customers/me?fields=id,email`, {
            method: 'GET',
            headers,
        });

        if (!meRes.ok) {
            const errText = await meRes.text();
            console.error(`[Orders API][${requestId}] /customers/me failed:`, errText);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const meData = await meRes.json();
        const customer = meData.customer;
        console.log(`[Orders API][${requestId}] Authenticated as: ${customer?.id} (${customer?.email})`);

        if (!customer?.id) {
            return NextResponse.json({ orders: [] });
        }

        // Step 2 - Fetch orders scoped to this customer
        // Medusa V2 /store/orders is automatically scoped to the logged-in user via Authorization header
        // We use proven fields or dot notation for nested objects
        const ordersUrl = `${MEDUSA_BACKEND_URL}/store/orders?fields=id,display_id,status,fulfillment_status,payment_status,created_at,currency_code,*summary,*items,*items.thumbnail`;
        console.log(`[Orders API][${requestId}] Stage 2: Fetching scoped orders...`);

        const ordersRes = await fetch(ordersUrl, {
            method: 'GET',
            headers,
        });

        if (!ordersRes.ok) {
            const errText = await ordersRes.text();
            console.error(`[Orders API][${requestId}] /store/orders failed:`, errText);

            // Final fallback to raw 'me' expansion if direct orders fails for some reason
            const fallbackUrl = `${MEDUSA_BACKEND_URL}/store/customers/me?fields=orders.*`;
            const fbRes = await fetch(fallbackUrl, { method: 'GET', headers });
            if (fbRes.ok) {
                const fbData = await fbRes.json();
                return new NextResponse(JSON.stringify({ orders: fbData.customer?.orders || [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }
            return NextResponse.json({ error: errText }, { status: ordersRes.status });
        }

        const data = await ordersRes.json();
        const rawOrders = data.orders || [];
        console.log(`[Orders API][${requestId}] Found ${rawOrders.length} orders`);

        if (rawOrders.length > 0) {
            console.log(`[Orders API] FULL ORDER #0 DETAIL:`, JSON.stringify(rawOrders[0], null, 2));
        }

        // Medusa V2: Map totals from summary if available
        // Note: In Medusa v2, summary contains detailed totals. We look for 'current_order_total'
        const orders = rawOrders.map((o: any) => {
            const s = o.summary || {};
            const t = s.totals || {};

            // Try current_order_total first (best for Medusa v2), then fallback to total
            const finalTotal = t.current_order_total ?? s.current_order_total ?? s.total ?? o.total ?? 0;
            const finalShipping = t.shipping_total ?? s.shipping_total ?? o.shipping_total ?? 0;
            const finalTax = t.tax_total ?? s.tax_total ?? o.tax_total ?? 0;
            const finalDiscount = t.discount_total ?? s.discount_total ?? o.discount_total ?? 0;

            console.log(`[Orders API] Mapping Order #${o.display_id}: total=${finalTotal}`);

            return {
                ...o,
                total: finalTotal,
                shipping_total: finalShipping,
                tax_total: finalTax,
                discount_total: finalDiscount
            };
        });

        return new NextResponse(JSON.stringify({ orders }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'x-customer-id': meData.customer?.id || 'none',
                'x-customer-email': meData.customer?.email || 'none'
            },
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
