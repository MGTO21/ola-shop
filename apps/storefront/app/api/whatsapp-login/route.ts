import { NextRequest, NextResponse } from 'next/server';

// Use server-side URL for server-side fetches
const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://127.0.0.1:9000';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { phone, password } = body;

        console.log("[Storefront Login] Forwarding to backend:", { phone });

        const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

        // Forward to backend login API (Custom Store Auth)
        const backendResponse = await fetch(`${BACKEND_URL}/store/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-publishable-api-key': PUBLISHABLE_KEY
            },
            body: JSON.stringify({ phone, password })
        });

        const data = await backendResponse.json().catch(() => ({}));

        if (!backendResponse.ok) {
            console.error("[Storefront Login] Backend error:", data);
            return NextResponse.json(
                { error: data.message || "فشل تسجيل الدخول" },
                { status: backendResponse.status }
            );
        }

        if (data.token) {
            // Medusa v2 detached auth often doesn't return the full customer object in the auth response
            // We fetch it manually here to ensure the storefront has what it needs
            try {
                const meRes = await fetch(`${BACKEND_URL}/store/customers/me`, {
                    headers: {
                        'Authorization': `Bearer ${data.token}`,
                        'x-publishable-api-key': PUBLISHABLE_KEY
                    },
                    cache: 'no-store'
                });
                if (meRes.ok) {
                    const meData = await meRes.json();
                    if (meData.customer) {
                        data.customer = meData.customer;
                        console.log("[Storefront Login] Hydrated customer data successfully for ID:", data.customer.id);
                    } else {
                        console.warn("[Storefront Login] /me returned 200 but no customer object found");
                    }
                } else {
                    const errorText = await meRes.text();
                    console.warn(`[Storefront Login] Hydration failed. Status: ${meRes.status}. Detail:`, errorText);
                }
            } catch (e) {
                console.error("[Storefront Login] Failed to hydrate customer:", e);
            }
        }

        // Create response AFTER we've tried to hydrate the customer data
        const response = NextResponse.json({
            success: true,
            customer: data.customer,
            token: data.token,
            message: data.message
        });

        if (data.token) {
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
