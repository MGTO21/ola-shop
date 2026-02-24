import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { metadata } = body;

        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
        const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

        // Extract token from cookies
        const cookieHeader = req.headers.get("cookie") || "";
        const tokenMatch = cookieHeader.match(/medusa_auth_token=([^;]+)/);
        const token = tokenMatch ? tokenMatch[1] : null;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const headers = {
            "Content-Type": "application/json",
            "x-publishable-api-key": PUBLISHABLE_KEY || "",
            "Authorization": `Bearer ${token}`
        };

        // 1. Fetch current customer
        const currentRes = await fetch(`${backendUrl}/store/customers/me?fields=*metadata`, {
            headers
        });

        if (!currentRes.ok) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        }

        const currentData = await currentRes.json();
        const currentMetadata = currentData.customer.metadata || {};

        // 2. Merge Metadata
        const mergedMetadata = {
            ...currentMetadata,
            ...metadata
        };

        console.log(`[Metadata] Updating via Store API...`);

        // 3. Update in Medusa
        const response = await fetch(`${backendUrl}/store/customers/me`, {
            method: "POST",
            headers,
            body: JSON.stringify({ metadata: mergedMetadata }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("[Metadata] Store Update Error:", data);
            return NextResponse.json({ error: data.message || "Failed to update metadata" }, { status: response.status });
        }

        return NextResponse.json({ success: true, customer: data.customer });

    } catch (error: any) {
        console.error("[Metadata] Internal Error:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
