import { NextResponse } from 'next/server';
import { getAdminToken } from "@/lib/admin-auth";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { customerId, phone } = await request.json();
        console.log(`[Send-OTP] Request for: ${phone} (${customerId})`);

        if (!customerId) return NextResponse.json({ error: "Customer ID missing" }, { status: 400 });

        const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000';
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 1. Get Admin Token
        const adminToken = await getAdminToken();
        if (!adminToken) {
            console.error("[Send-OTP] Failed to get Admin Token");
            return NextResponse.json({ error: "Authentication Failed: Could not login to Admin API" }, { status: 500 });
        }

        const authHeader = `Bearer ${adminToken}`;

        // 2. Update OTP
        const metaRes = await fetch(`${BACKEND_URL}/admin/customers/${customerId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
            body: JSON.stringify({
                metadata: {
                    otp_code: otp,
                    otp_sent_at: new Date().toISOString()
                }
            })
        });

        if (!metaRes.ok) {
            const errText = await metaRes.text();
            console.error(`[Send-OTP] Metadata Update Failed: ${metaRes.status} ${errText}`);
            return NextResponse.json({ error: `Failed to update OTP: ${metaRes.status} - ${errText}` }, { status: 500 });
        }

        console.log(`[Send-OTP] OTP Updated: ${otp}`);

        // 3. Add to Requesting Group
        const REQUESTING_GROUP_ID = "cusgroup_requesting";
        const groupRes = await fetch(`${BACKEND_URL}/admin/customer-groups/${REQUESTING_GROUP_ID}/customers/batch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
            body: JSON.stringify({ customer_ids: [{ id: customerId }] })
        });

        if (!groupRes.ok) {
            console.error(`[Send-OTP] Group Update Failed: ${groupRes.status}`);
        } else {
            console.log(`[Send-OTP] Added to Requesting Group`);
        }

        return NextResponse.json({ success: true, message: "OTP Sent" });

    } catch (error: any) {
        console.error("[Send-OTP] Fatal Error:", error.message);
        return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
    }
}
