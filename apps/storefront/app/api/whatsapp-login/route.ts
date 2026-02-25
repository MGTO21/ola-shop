import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://127.0.0.1:9000';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { phone, password } = body;

        console.log("[Storefront Login] Forwarding to backend:", { phone });

        const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

        // Forward to backend login API (Medusa v2 Customer Auth)
        const backendResponse = await fetch(`${BACKEND_URL}/auth/customer/emailpass`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-publishable-api-key': PUBLISHABLE_KEY
            },
            body: JSON.stringify({ email: phone, password }) // Medusa expects 'email' key even for phone-based login
        });

        const data = await backendResponse.json().catch(() => ({}));

        if (!backendResponse.ok) {
            console.error("[Storefront Login] Backend error:", data);
            return NextResponse.json(
                { error: data.message || "فشل تسجيل الدخول" },
                { status: backendResponse.status }
            );
        }

        console.log("[Storefront Login] Success! Customer ID:", data.customer?.id);

        // Set cookie with the token
        const response = NextResponse.json({
            success: true,
            customer: data.customer,
            token: data.token, // Include token in body so client can read it
            message: data.message
        });

        if (data.token) {
            // Medusa v2 detached auth often doesn't return the full customer object in the auth response
            // We fetch it manually here to ensure the storefront has what it needs
            try {
                const meRes = await fetch(`${BACKEND_URL}/store/customers/me`, {
                    headers: {
                        'Authorization': `Bearer ${data.token}`,
                        'x-publishable-api-key': PUBLISHABLE_KEY
                    }
                });
                if (meRes.ok) {
                    const meData = await meRes.json();
                    if (meData.customer) {
                        data.customer = meData.customer;
                        console.log("[Storefront Login] Hydrated customer data from /me");
                    }
                }
            } catch (e) {
                console.error("[Storefront Login] Failed to hydrate customer:", e);
            }

            response.cookies.set('medusa_auth_token', data.token, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            });
        }

        return response;

    } catch (error: any) {
        console.error("[Storefront Login] Fatal error:", error.message);
        return NextResponse.json(
            { error: "خطأ في الاتصال بالسيرفر" },
            { status: 500 }
        );
    }
}
