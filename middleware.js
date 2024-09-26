import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server"; 

export function middleware(req) {
  const { userId } = getAuth(req);

  const protectedRoutes = ["/create", "/profile"]; 
  const pathname = req.nextUrl.pathname;

  
  if (!userId && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/sign-in", req.url)); 
  }

  return NextResponse.next(); 
}

export const config = {
  matcher: ["/create", "/profile"], 
};
