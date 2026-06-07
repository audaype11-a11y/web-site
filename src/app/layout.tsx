import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { Navbar } from "@/components/blog/navbar";
import { Footer } from "@/components/blog/footer";

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
    default: "مدونة الطبيب | مدونة طبية شخصية",
    template: "%s | مدونة الطبيب",
  },
  description:
    "مدونة شخصية لطالب طب بشري - مقالات طبية، ملاحظات دراسية، ونصائح صحية",
  keywords: [
    "طب",
    "طب بشري",
    "مقالات طبية",
    "صحة",
    "طالب طب",
    "مدونة طبية",
  ],
  authors: [{ name: "مدونة الطبيب" }],
  openGraph: {
    title: "مدونة الطبيب | مدونة طبية شخصية",
    description: "مدونة شخصية لطالب طب بشري - مقالات طبية، ملاحظات دراسية، ونصائح صحية",
    type: "website",
    locale: "ar_SA",
    dir: "rtl",
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
