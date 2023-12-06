import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROUTE_PROTECTED_REGEX =
  /\/(?!.)|\/settings(?!.)|\/admin(?!.)|\/admin\/.*/i;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const headers = new Headers(req.headers);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    headers.set("user", JSON.stringify(user));

    if (pathname.startsWith("/admin") && user.user_metadata.role != "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (ROUTE_PROTECTED_REGEX.test(pathname)) {
      return NextResponse.next({
        request: {
          headers,
        },
      });
    } else {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } else {
    headers.delete("user");
    if (ROUTE_PROTECTED_REGEX.test(pathname)) {
      return NextResponse.redirect(new URL("/login", req.url));
    } else {
      return NextResponse.next();
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
