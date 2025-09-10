import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { JsonLd } from "@/components/seo/JsonLd";
import { baseMetadata, generateWebsiteJsonLd, generateOrganizationJsonLd } from "@/lib/seo";
import "./globals.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd data={generateWebsiteJsonLd()} />
        <JsonLd data={generateOrganizationJsonLd()} />
      </head>
      <body className={inter.className}>
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
