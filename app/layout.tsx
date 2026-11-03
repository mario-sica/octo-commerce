import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getSite } from "@/lib/data";
import { openGraph, SITE_URL } from "@/lib/seo";
import "./globals.css";

const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.woff2",
  weight: "300 900",
  style: "normal",
  display: "swap",
  variable: "--font-satoshi",
});

const site = getSite();

/**
 * Site-wide defaults. Pages set their own title and description (data/site.json, product data);
 * a page title becomes "{title} — Octopus" through the template.
 */
export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: { default: site.home.title, template: `%s — ${site.name}` },
  description: site.home.description,
  applicationName: site.name,
  openGraph: openGraph({}),
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${satoshi.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="sr-only rounded-pill bg-background text-cta text-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex flex-1 flex-col focus-visible:outline-none"
        >
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
