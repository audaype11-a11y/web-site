import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { Navbar } from "@/components/blog/navbar";
import { Footer } from "@/components/blog/footer";
import { site } from "@/lib/site-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.site.name} | ${site.site.description.split(" - ")[0]}`,
    template: `%s | ${site.site.name}`,
  },
  description: site.site.description,
  keywords: site.site.keywords,
  authors: [{ name: site.site.author }],
  icons: {
    icon: site.site.logo,
    apple: site.site.logo,
  },
  openGraph: {
    title: `${site.site.name} | ${site.site.description.split(" - ")[0]}`,
    description: site.site.description,
    type: "website",
    locale: "ar_SA",
    dir: "rtl",
    siteName: site.site.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
