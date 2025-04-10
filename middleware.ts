import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.nextauth.token;
    console.log("isLoggedIn is ", isLoggedIn);
    console.log("pathname is ", pathname);

    // 🔒 Redirect logged-in users away from /auth/sign-in
    if (pathname === "/auth/sign-in" && isLoggedIn) {
      return NextResponse.redirect(new URL("/chat", req.url));
    }
  },
  {
    secret: process.env.NEXT_AUTH_SECRET,
    pages: {
      signIn: "/auth/sign-in",
    },
  }
);

// Protect only these paths
export const config = {
  matcher: ["/chat", "/auth/sign-in"],
};
