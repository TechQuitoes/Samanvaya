import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Noto_Serif_Devanagari } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const devanagari = Noto_Serif_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "LDMS - Leader Documentation & Management System",
  description: "Serving Leaders. Strengthening Seva.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} ${devanagari.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f7f3e9] text-[#2c221e] font-sans">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

