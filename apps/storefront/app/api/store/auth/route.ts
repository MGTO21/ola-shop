import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function DELETE(req: Request) {
    const response = NextResponse.json({ success: true, message: "Logged out" });
    
    // Clear Cookie
    response.cookies.set("medusa_auth_token", "", {
        path: "/",
        maxAge: -1,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });
    
    // Also clear legacy session if any
    response.cookies.set("_medusa_jwt", "", { maxAge: -1, path: "/" });

    return response;
}
