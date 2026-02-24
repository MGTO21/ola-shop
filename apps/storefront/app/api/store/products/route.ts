import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const REGION_ID = 'reg_c28fa86514644f729b89ca85c6ed5387';
        const expansion = '*variants.calculated_price';

        // Append region_id and fields if not already present
        if (!searchParams.has('region_id')) searchParams.set('region_id', REGION_ID);
        if (!searchParams.has('fields')) searchParams.set('fields', expansion);

        const query = searchParams.toString();
        const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
        const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

        const res = await fetch(`${BACKEND_URL}/store/products?${query}`, {
            headers: {
                "Content-Type": "application/json",
                "x-publishable-api-key": PUBLISHABLE_KEY || "",
            },
            next: { revalidate: 60 } // Cache for 60s
        });

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch products" }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Products Proxy Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
