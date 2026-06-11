import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { DynamicNavbar } from "@/components/blog/dynamic-navbar";
import { DynamicFooter } from "@/components/blog/dynamic-footer";
import { getSiteConfig } from "@/lib/get-site-config";
import { site, navLinks, footer } from "@/lib/site-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  const siteName = config.site?.name || site.name;
  const siteDesc = config.site?.description || site.description;
  const siteLogo = config.site?.logo || site.logo;

  return {
    title: {
      default: `${siteName} | ${siteDesc.split(" - ")[0]}`,
      template: `%s | ${siteName}`,
    },
    description: siteDesc,
    keywords: config.site?.keywords || site.keywords,
    authors: [{ name: config.site?.author || site.author }],
    icons: {
      icon: siteLogo,
      apple: siteLogo,
    },
    openGraph: {
      title: `${siteName} | ${siteDesc.split(" - ")[0]}`,
      description: siteDesc,
      type: "website",
      locale: "ar_SA",
      dir: "rtl",
      siteName: siteName,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getSiteConfig();
  
  const defaultConfig = {
    site: config.site || site,
    navLinks: navLinks,
    footer: {
      ...footer,
      aboutText: config.footer?.aboutText || footer.aboutText,
      copyright: config.footer?.copyright || footer.copyright,
    }
  };

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <DynamicNavbar defaultConfig={defaultConfig} />
              <main className="flex-1">{children}</main>
              <DynamicFooter defaultConfig={defaultConfig} />
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
