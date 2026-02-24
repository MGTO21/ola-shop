import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, city, birthday, first_name, last_name, calling_phone, secondary_phone } = body;

        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
        const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

        // Extract token from cookies
        const cookieHeader = req.headers.get("cookie") || "";
        const tokenMatch = cookieHeader.match(/medusa_auth_token=([^;]+)/);
        const token = tokenMatch ? tokenMatch[1] : null;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized: Missing session token" }, { status: 401 });
        }

        const headers = {
            "Content-Type": "application/json",
            "x-publishable-api-key": PUBLISHABLE_KEY || "",
            "Authorization": `Bearer ${token}`
        };

        // 1. Fetch current customer (Store API)
        const currentRes = await fetch(`${backendUrl}/store/customers/me?fields=*metadata`, {
            headers
        });

        if (!currentRes.ok) {
            console.error("[Profile] Fetch failed:", await currentRes.text());
            return NextResponse.json({ error: "Customer not found or session expired" }, { status: 404 });
        }

        const currentData = await currentRes.json();
        const currentMetadata = currentData.customer.metadata || {};

        // 2. Prepare Update Payload
        const payload: any = {
            metadata: {
                ...currentMetadata,
                city: city || currentMetadata.city || "",
                birthday: birthday || currentMetadata.birthday || "",
                calling_phone: calling_phone || currentMetadata.calling_phone || "",
                secondary_phone: secondary_phone || currentMetadata.secondary_phone || "",
                is_profile_complete: true,
            },
        };

        if (first_name) payload.first_name = first_name;
        if (last_name) payload.last_name = last_name;

        console.log(`[Profile] Updating via Store API...`);

        const response = await fetch(`${backendUrl}/store/customers/me`, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("[Profile] Medusa Update Error:", data);
            return NextResponse.json({ error: data.message || "Failed to update profile" }, { status: response.status });
        }

        return NextResponse.json({ success: true, customer: data.customer });

    } catch (error) {
        console.error("[Profile] Internal Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
