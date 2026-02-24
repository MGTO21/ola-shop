import { NextResponse } from 'next/server';
import { getAdminToken } from "@/lib/admin-auth";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customerId, phone } = body;
        console.log(`[Send-OTP] Request for phone: ${phone}, ID: ${customerId}`);

        if (!customerId) {
            console.error("[Send-OTP] Customer ID missing in body");
            return NextResponse.json({ error: "Customer ID missing" }, { status: 400 });
        }

        const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || 'http://127.0.0.1:9000';
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 1. Get Admin Token
        const adminToken = await getAdminToken();
        if (!adminToken) {
            console.error("[Send-OTP] Failed to get Admin Token. Check credentials.");
            return NextResponse.json({ error: "Authentication Failed: Could not login to Admin API" }, { status: 500 });
        }

        // 2. Update OTP in Metadata (Medusa v2 Admin API)
        const metadataUpdateUrl = `${BACKEND_URL}/admin/customers/${customerId}`;
        console.log(`[Send-OTP] Updating metadata at: ${metadataUpdateUrl}`);

        const metaRes = await fetch(metadataUpdateUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({
                metadata: {
                    otp_code: otp,
                    otp_sent_at: new Date().toISOString()
                }
            })
        });

        if (!metaRes.ok) {
            const errBody = await metaRes.json().catch(() => ({ message: "Unknown error" }));
            console.error(`[Send-OTP] Metadata Update Failed: ${metaRes.status}`, JSON.stringify(errBody));
            return NextResponse.json({ error: `Failed to update OTP: ${errBody.message || metaRes.status}` }, { status: 500 });
        }

        console.log(`[Send-OTP] SUCCESS! OTP [${otp}] saved for customer ${customerId}`);

        return NextResponse.json({ success: true, message: "OTP Sent" });

    } catch (error: any) {
        console.error("[Send-OTP] Fatal Error:", error.message);
        return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
    }
}
