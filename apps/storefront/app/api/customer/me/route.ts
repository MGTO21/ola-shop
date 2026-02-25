import { NextRequest, NextResponse } from 'next/server'

// Use server-side URL for server-side fetches
const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://127.0.0.1:9000';
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

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
        let finalAuth = '';
        if (clientAuthHeader) {
            finalAuth = clientAuthHeader;
        } else if (authToken) {
            finalAuth = `Bearer ${authToken}`;
        }

        if (finalAuth) {
            headers['Authorization'] = finalAuth;
            console.log('[Customer Me] Final Auth Header set. Starts with:', finalAuth.substring(0, 15) + '...');
        } else {
            console.warn('[Customer Me] No authentication found (No cookie, no header)');
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
            console.error(`[Customer Me] Backend Status: ${response.status}. Error:`, responseText);
            // Pass the detailed error back to client for easier debugging
            return NextResponse.json(
                {
                    message: 'Unauthorized',
                    status: response.status,
                    detail: responseText,
                    hint: response.status === 401 ? 'Check if JWT_SECRET matches or if user is linked to customer' : 'Backend error'
                },
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
