import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("insforge-auth-token")?.value

    // Protect dashboard routes
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
        if (!token) {
            const url = req.nextUrl.clone()
            url.pathname = "/auth/login"
            return NextResponse.redirect(url)
        }
    }

    // Redirect authenticated users away from auth pages
    if (req.nextUrl.pathname.startsWith("/auth") && token) {
        const url = req.nextUrl.clone()
        url.pathname = "/dashboard"
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard/:path*", "/auth/:path*", "/setup-gym"]
}
