import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // For /store/* requests, forward the auth token from cookies to Authorization header
    if (path.startsWith('/store/')) {
        const token = request.cookies.get('medusa_auth_token')?.value

        if (token) {
            // Clone the request headers and add Authorization
            const requestHeaders = new Headers(request.headers)
            requestHeaders.set('Authorization', `Bearer ${token}`)

            // Create a new request with the modified headers
            const response = NextResponse.next({
                request: {
                    headers: requestHeaders,
                }
            })

            return response
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/store/:path*']
}
