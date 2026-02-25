import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://127.0.0.1:9000';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { phone, firstName, lastName, password } = body;

        console.log("[Storefront Signup] Forwarding to backend:", { phone, firstName });

        const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

        // Forward to backend signup API (Custom Store Auth)
        const backendResponse = await fetch(`${BACKEND_URL}/store/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-publishable-api-key': PUBLISHABLE_KEY
            },
            body: JSON.stringify({ phone, firstName, lastName, password })
        });

        const data = await backendResponse.json().catch(() => ({}));

        if (!backendResponse.ok) {
            console.error("[Storefront Signup] Backend error:", data);
            return NextResponse.json(
                { error: data.message || "فشل إنشاء الحساب" },
                { status: backendResponse.status }
            );
        }

        // Medusa v2 Registration often returns { actor_id: "cus_...", ... } or { customer: { id: "cus_..." }, ... }
        // We log it to confirm the structure
        console.log("[Storefront Signup] Backend Data:", JSON.stringify(data));

        const customerId = data.customer?.id || data.actor_id;
        console.log("[Storefront Signup] Success! Customer ID:", customerId);

        const response = NextResponse.json({
            success: true,
            customer: data.customer || { id: customerId },
            token: data.token,
            message: data.message
        });

        if (data.token) {
            response.cookies.set('medusa_auth_token', data.token, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/'
            });
        }

        return response;

    } catch (error: any) {
        console.error("[Storefront Signup] Fatal error:", error.message);
        return NextResponse.json(
            { error: "خطأ في الاتصال بالسيرفر" },
            { status: 500 }
        );
    }
}
