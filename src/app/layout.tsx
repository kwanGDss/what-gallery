import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { JsonLd } from "@/components/seo/JsonLd";
import { baseMetadata, generateWebsiteJsonLd, generateOrganizationJsonLd } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/gh/projectnoonnu/2405-3@1.1/Cafe24Lovingu.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
        <JsonLd data={generateWebsiteJsonLd()} />
        <JsonLd data={generateOrganizationJsonLd()} />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
