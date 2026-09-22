import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Wings and Drinks",
  description: "La mejor colección de juegos para fiestas",
  manifest: "/manifest.ts",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col bg-black selection:bg-purple-500 selection:text-white" suppressHydrationWarning>
        <div className="bg-noise"></div>
        {children}
      </body>
    </html>
  );
}
