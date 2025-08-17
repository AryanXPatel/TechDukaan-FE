import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { AppProviders } from "@/components/app-providers";
import { Toaster } from "@/components/ui/toaster";
import { FloatingWhatsApp } from "@/components/whatsapp/floating-whatsapp";
import { FeatureProvidersWrapper } from "@/components/feature-providers-wrapper";
import { CompareTrayRoot } from "@/components/compare/tray-root";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "TechDukaan - Quality Refurbished Laptops",
  description:
    "Premium refurbished business laptops with warranty. Save up to 60% on enterprise-grade hardware.",
  generator: "Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
/* Skip link */
.skip-link {
  position: absolute;
  left: -999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
.skip-link:focus-visible {
  left: 8px;
  top: 8px;
  width: auto;
  height: auto;
  background: #111;
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  z-index: 1000;
}
/* High contrast mode */
:root[data-contrast="high"] {
  --ring: #000000;
  filter: contrast(1.1);
}
:root[data-contrast="high"] *:focus-visible {
  outline: 2px dashed #000 !important;
  outline-offset: 2px;
}
/* Ensure clear focus indicators */
*:focus-visible {
  outline-offset: 2px;
}
        `}</style>
      </head>
      <body>
        <a href="#page-content" className="skip-link">
          Skip to content
        </a>
        <AppProviders>
          <FeatureProvidersWrapper>
            <SiteHeader />
            <div id="page-content" tabIndex={-1}>
              {children}
            </div>
            <SiteFooter />
            <Toaster />
            <FloatingWhatsApp />
            <CompareTrayRoot />
          </FeatureProvidersWrapper>
        </AppProviders>
      </body>
    </html>
  );
}
