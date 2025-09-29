import { NextResponse } from "next/server";
import api from "./utils/axiosSetup";

const publicPaths = ["/auth/login", "/auth/signup"];

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value || "USER";
  const url = req.nextUrl.clone();
  const path = url.pathname.replace(/\/$/, "");

  if (!token) {
    if (!publicPaths.includes(path)) {
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const isValid = await validateTokenOnServer(token);
  if (!isValid) {
    const res = NextResponse.redirect(new URL("/auth/login", req.url));
    res.cookies.delete("token");
    res.cookies.delete("role");
    return res;
  }

  if (path === "/") {
    url.pathname = role === "ADMIN" ? "/admin" : "/user";
    return NextResponse.redirect(url);
  }

  if (role === "ADMIN" && path.startsWith("/user")) {
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  if (role !== "ADMIN" && path.startsWith("/admin")) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/user/:path*",
    "/products/:path*",
    "/orders/:path*",
    "/auth/login",
    "/auth/signup",
    "/cart/:path*",
    "/api/carts/:path*",
    "/order-summary/:orderId",
    "/about/:path*",
  ],
};
