import { NextResponse } from 'next/server';
import { getAdminToken } from "@/lib/admin-auth";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { customerId, otp } = await request.json();
        console.log(`[Verify-OTP] Request for: ${customerId}, Code: ${otp}`);

        const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000';

        // 1. Get Admin Token
        const adminToken = await getAdminToken();
        if (!adminToken) {
            console.error("[Verify-OTP] Failed to get Admin Token");
            return NextResponse.json({ error: "Auth Error" }, { status: 500 });
        }
        const authHeader = `Bearer ${adminToken}`;

        // 2. Get Customer Metadata
        const getRes = await fetch(`${BACKEND_URL}/admin/customers/${customerId}`, {
            headers: { 'Authorization': authHeader }
        });

        if (!getRes.ok) {
            console.error(`[Verify-OTP] Fetch Customer Failed: ${getRes.status}`);
            return NextResponse.json({ error: "Customer Not Found" }, { status: 404 });
        }

        const customerData = await getRes.json();
        const savedOtp = customerData.customer?.metadata?.otp_code;

        console.log(`[Verify-OTP] Customer OTP: ${savedOtp} vs Input: ${otp}`);

        if (String(savedOtp) === String(otp)) {
            // Correct OTP

            // Update Metadata
            await fetch(`${BACKEND_URL}/admin/customers/${customerId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
                body: JSON.stringify({
                    metadata: {
                        whatsapp_verified: true,
                        whatsapp_verified_at: new Date().toISOString()
                    } // Do not clear OTP immediately strictly, but good practice.
                })
            });

            // Group Logic
            const VERIFIED_GROUP_ID = "cusgroup_verified";
            const UNVERIFIED_GROUP_ID = "cusgroup_unverified";
            const REQUESTING_GROUP_ID = "cusgroup_requesting";

            // Add to Verified
            await fetch(`${BACKEND_URL}/admin/customer-groups/${VERIFIED_GROUP_ID}/customers/batch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
                body: JSON.stringify({ customer_ids: [{ id: customerId }] })
            });

            // Remove from others
            await fetch(`${BACKEND_URL}/admin/customer-groups/${UNVERIFIED_GROUP_ID}/customers/batch`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
                body: JSON.stringify({ customer_ids: [{ id: customerId }] })
            });

            await fetch(`${BACKEND_URL}/admin/customer-groups/${REQUESTING_GROUP_ID}/customers/batch`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
                body: JSON.stringify({ customer_ids: [{ id: customerId }] })
            });

            console.log(`[Verify-OTP] Success!`);
            return NextResponse.json({ success: true });
        } else {
            console.warn(`[Verify-OTP] Invalid Code`);
            return NextResponse.json({ error: "Invalid Code" }, { status: 400 });
        }

    } catch (error: any) {
        console.error("[Verify-OTP] Fatal Error:", error.message);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
