import { getSiteConfig } from "@/lib/get-site-config";

export default async function SiteConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getSiteConfig();
  
  return (
    <div
      data-site-name={config.site?.name}
      data-site-logo={config.site?.logo}
      data-footer-about={config.footer?.aboutText}
      data-footer-copyright={config.footer?.copyright}
      data-contact-email={config.contact?.email}
    >
      {children}
    </div>
  );
}