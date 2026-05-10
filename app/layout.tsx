import { LanguageProvider } from "@/app/LanguageContext";
import Navbar from "@/app/components/Navbar";
import { Cairo } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import ContactSection from "@/app/components/ContactSection";

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "Sky Insurance | سكاي للوساطة التأمينية",
  description:
    "Preserving Prosperity, Providing Peace of Mind | نحمي أصولك ونوفر حلول إدارة المخاطر",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} antialiased`}>
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
          <ContactSection />
        </LanguageProvider>
      </body>
    </html>
  );
}
