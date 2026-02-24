import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://127.0.0.1:9000';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { phone, firstName, lastName, password } = body;

        console.log("[Storefront Signup] Forwarding to backend:", { phone, firstName });

        const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

        // Forward to backend signup API (Medusa v2 Customer Registration)
        const backendResponse = await fetch(`${BACKEND_URL}/auth/customer/emailpass/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-publishable-api-key': PUBLISHABLE_KEY
            },
            body: JSON.stringify({
                email: phone, // In Ola-Shop, phone is the identity/email
                password,
                first_name: firstName,
                last_name: lastName
            })
        });

        const data = await backendResponse.json().catch(() => ({}));

        if (!backendResponse.ok) {
            console.error("[Storefront Signup] Backend error:", data);
            return NextResponse.json(
                { error: data.message || "فشل إنشاء الحساب" },
                { status: backendResponse.status }
            );
        }

        console.log("[Storefront Signup] Success! Customer ID:", data.customer?.id);

        const response = NextResponse.json({
            success: true,
            customer: data.customer,
            token: data.token,
            message: data.message
        });

        if (data.token) {
            response.cookies.set('medusa_auth_token', data.token, {
                httpOnly: false, // Changed to false so client JS can read it for redirect logic
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
