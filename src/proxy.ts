import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const OLD_HOST = "gestaometodos.vercel.app";
const NEW_HOST = "gestaodosmetodos.online";

export async function proxy(request: NextRequest) {
  if (request.nextUrl.hostname === OLD_HOST) {
    const url = request.nextUrl.clone();
    url.hostname = NEW_HOST;
    url.protocol = "https";
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
