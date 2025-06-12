import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "@/components/themes/theme-provider";
import {Analytics} from "@vercel/analytics/next";
import {getLocale} from "gt-next/server";
import {GTProvider} from "gt-next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Crystal's Photo Gallery",
  description: "A chill little gallery of my photos."
};

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html suppressHydrationWarning lang={await getLocale()}>
    <head>
      <link rel="icon" href="/icon.png"/>
    </head>
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <GTProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem>
  
          {children}
          <Analytics/>
        </ThemeProvider>
      </GTProvider>
    </body>
    </html>
  );
}
