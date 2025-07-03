import type {Metadata} from "next";
import {DM_Sans} from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "@/components/themes/theme-provider";
import {Analytics} from "@vercel/analytics/next";
import {getLocale} from "gt-next/server";
import {GTProvider} from "gt-next";
import Header from "@/components/ui/Header";

const DMSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"]
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
      className={`${DMSans.variable} antialiased`}>
      <GTProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem>

          <Header/>

          {children}
          <Analytics/>
        </ThemeProvider>
      </GTProvider>
    </body>
    </html>
  );
}
