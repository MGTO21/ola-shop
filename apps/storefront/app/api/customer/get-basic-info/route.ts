import { NextResponse } from 'next/server';
import { getAdminToken } from "@/lib/admin-auth";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const bodyText = await req.text();
        console.log(`[Info] Received Body: ${bodyText}`);

        let body: any = {};
        try { body = JSON.parse(bodyText); } catch (e) { }

        const { id, phone } = body;
        const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://127.0.0.1:9000';

        if (!id && !phone) {
            console.warn("[Info] Missing ID and Phone in body");
            return NextResponse.json({ error: "Missing ID or Phone" }, { status: 400 });
        }

        const ADMIN_TOKEN = await getAdminToken();
        if (!ADMIN_TOKEN) {
            console.error("[Info] Failed to obtain Admin Token");
            return NextResponse.json({ error: "Auth Error" }, { status: 500 });
        }

        const authHeader = `Bearer ${ADMIN_TOKEN}`;
        let customer: any = null;

        if (id) {
            const res = await fetch(`${BACKEND_URL}/admin/customers/${id}`, {
                headers: { Authorization: authHeader }
            });
            if (res.ok) {
                const data = await res.json();
                customer = data.customer;
            }
        } else if (phone) {
            const phoneDigits = phone.replace(/\D/g, '');
            console.log(`[Info] Searching for phone: ${phoneDigits}`);

            // Search by normalized phone field or metadata
            const searchRes = await fetch(`${BACKEND_URL}/admin/customers?q=${phoneDigits}`, {
                headers: { Authorization: authHeader }
            });

            if (searchRes.ok) {
                const searchData = await searchRes.json();
                customer = searchData.customers?.find((c: any) =>
                    c.phone?.includes(phoneDigits) ||
                    c.metadata?.whatsapp_normalized?.includes(phoneDigits) ||
                    c.metadata?.auth_identifier?.includes(phoneDigits)
                );
            }
        }

        if (!customer) {
            console.warn(`[Info] Customer not found for query:`, body);
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json({
            customer: {
                id: customer.id,
                email: customer.email,
                first_name: customer.first_name,
                auth_identifier: customer.metadata?.auth_identifier || customer.email
            }
        });
    } catch (e: any) {
        console.error("[Info] Proxy Error:", e.message);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
