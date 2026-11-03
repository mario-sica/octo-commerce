import { NextResponse, type NextRequest } from "next/server";
import { getPdpProducts } from "@/lib/data";

const PDP_SLUGS = new Set(getPdpProducts().map((product) => product.slug));

/**
 * Product pages exist only for products with PDP content (today the Countertop Blender). With
 * `cacheComponents` the page shell streams before `notFound()` runs, so an unknown slug would show
 * the not-found page with status 200. Rewriting it here, before rendering, to Next's built-in
 * `/_not-found` route returns the same page with a real 404 (spec, Assumption 12).
 */
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (PDP_SLUGS.has(slug)) return NextResponse.next();
  return NextResponse.rewrite(new URL("/_not-found", request.url));
}

export const config = { matcher: "/products/:slug" };
