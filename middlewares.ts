import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware() {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const {pathname} = req.nextUrl

        if(
            pathname.startsWith("/api/auth") ||
            pathname == "/login" ||
            pathname == "/register"
        ){
            return true
        }

        // Public routes
        if(
            pathname == "/" ||
            pathname == "/about" ||
            pathname == "/contact" ||
            pathname == "/pricing" ||
            pathname == "/blog" ||
            pathname == "/blog/[slug]" ||
            pathname.startsWith("/blog/category/") ||
            pathname.startsWith("/blog/tag/") ||
            pathname.startsWith("/blog/author/")
        ){
            return true
        }

        // Sell route requires authentication (any logged-in user)
        if(pathname.startsWith("/sell")){
            return !!token
        }

        // Admin routes
        if(pathname.startsWith("/admin")){
            return token?.role === "admin"
        }

        //All other routes require authentication
        return !!token
      }
    },
  },
);

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};;