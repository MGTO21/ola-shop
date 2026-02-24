import { NextRequest, NextResponse } from 'next/server'

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://127.0.0.1:9000';
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

export async function GET(request: NextRequest) {
    try {
        // Read all cookies
        const cookieHeader = request.headers.get('cookie') || '';

        // Parse cookies into object
        const parsedCookies: Record<string, string> = {};
        cookieHeader.split(';').forEach(c => {
            const idx = c.indexOf('=');
            if (idx > 0) {
                const key = c.substring(0, idx).trim();
                const val = c.substring(idx + 1).trim();
                parsedCookies[key] = val;
            }
        });

        // Try multiple token sources
        const authToken = parsedCookies['medusa_auth_token'] ||
            parsedCookies['_medusa_jwt'] ||
            parsedCookies['connect.sid'] || '';

        // Also check Authorization header from client
        const clientAuthHeader = request.headers.get('authorization') || '';

        console.log('[Customer Me] Token found:', authToken ? `YES (${authToken.length} chars)` : 'NO');
        console.log('[Customer Me] Client auth header:', clientAuthHeader ? 'YES' : 'NO');

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'x-publishable-api-key': PUBLISHABLE_API_KEY || '',
        };

        // Set Authorization header - prefer explicit client header, fallback to cookie token
        if (clientAuthHeader) {
            headers['Authorization'] = clientAuthHeader;
        } else if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        // Always forward cookies (for session-based auth)
        if (cookieHeader) {
            headers['cookie'] = cookieHeader;
        }

        console.log('[Customer Me] Calling:', `${MEDUSA_BACKEND_URL}/store/customers/me`);

        const response = await fetch(`${MEDUSA_BACKEND_URL}/store/customers/me`, {
            method: 'GET',
            headers,
        });

        console.log(`[Customer Me] Backend Status: ${response.status}`);

        const responseText = await response.text();

        if (!response.ok) {
            console.error(`[Customer Me] Backend Error:`, responseText);
            return NextResponse.json(
                { message: 'Unauthorized', detail: responseText },
                { status: response.status }
            );
        }

        const data = JSON.parse(responseText);
        return NextResponse.json(data);

    } catch (error: any) {
        console.error('[Customer Me] Fatal Error:', error.message);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
