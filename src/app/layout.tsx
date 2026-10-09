import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/my-shadchn/theme-provider";
import Header from "./_Components/Header";
import { Footer } from "./_Components/Footer";
import { siteConfig } from "@/config/site";

// Монгол кирилл үсэг дэмждэг фонтууд
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Монгол кино стриминг`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "mn_MN",
    siteName: siteConfig.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
