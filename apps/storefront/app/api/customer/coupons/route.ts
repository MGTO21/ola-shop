import { NextRequest, NextResponse } from 'next/server';

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

export async function GET(request: NextRequest) {
    try {
        // Fetch active promotions/coupons available to the storefront
        // In Medusa v2, we query the /store/promotions endpoint if accessible, 
        // or check customer-specific discounts.
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'x-publishable-api-key': PUBLISHABLE_API_KEY || '',
        };

        const response = await fetch(`${MEDUSA_BACKEND_URL}/store/promotions?is_active=true`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            // Some versions might not have /store/promotions yet, fallback or return empty
            return NextResponse.json({ promotions: [] });
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        return NextResponse.json({ promotions: [] });
    }
}
