import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { SITE } from "@/lib/site";
import { SwRegister } from "@/components/sw-register";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "JavaScript",
    "JavaScript fundamentals",
    "data types",
    "hoisting",
    "TDZ",
    "type coercion",
    "destructuring",
    "optional chaining",
    "nullish coalescing",
    "interview preparation",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
    url: "/",
  },
  twitter: { card: "summary", title: SITE.name, description: SITE.description },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: SITE.shortName },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        {/* Dark is the default; switch to light before first paint if the reader chose it. */}
        <Script id="theme" strategy="beforeInteractive">
          {`try{if(localStorage.getItem("theme")==="light")document.documentElement.classList.remove("dark")}catch(e){}`}
        </Script>
        {children}
        <SwRegister />
      </body>
    </html>
  );
}
