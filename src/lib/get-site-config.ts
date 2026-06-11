import { db } from "@/lib/db";
import { site as staticSite, footer as staticFooter, social as staticSocial, contact as staticContact } from "./site-config";

// Cache for site config
let cachedConfig: any = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getSiteConfig() {
  const now = Date.now();
  
  // Return cached config if still valid
  if (cachedConfig && (now - cacheTime) < CACHE_DURATION) {
    return cachedConfig;
  }

  try {
    // Get dynamic configs from database
    const dbConfigs = await db.siteConfig.findMany();
    
    const dbConfig: Record<string, string> = {};
    dbConfigs.forEach((config) => {
      dbConfig[config.key] = config.value;
    });

    // Merge static and dynamic configs (dynamic takes priority)
    cachedConfig = {
      site: {
        name: dbConfig.siteName || staticSite.name,
        description: dbConfig.siteDescription || staticSite.description,
        keywords: dbConfig.siteKeywords ? dbConfig.siteKeywords.split(",") : staticSite.keywords,
        author: dbConfig.siteAuthor || staticSite.author,
        logo: dbConfig.siteLogo || staticSite.logo
      },
      footer: {
        aboutText: dbConfig.footerAboutText || staticFooter.aboutText,
        quickLinks: staticFooter.quickLinks,
        copyright: dbConfig.footerCopyright || staticFooter.copyright
      },
      social: {
        twitter: dbConfig.twitterUrl || staticSocial.twitter,
        instagram: dbConfig.instagramUrl || staticSocial.instagram,
        youtube: dbConfig.youtubeUrl || staticSocial.youtube,
        telegram: dbConfig.telegramUrl || staticSocial.telegram,
        whatsapp: dbConfig.whatsappUrl || staticSocial.whatsapp,
        linkedin: dbConfig.linkedinUrl || staticSocial.linkedin
      },
      contact: {
        email: dbConfig.contactEmail || staticContact.email
      },
      profile: {
        name: dbConfig.doctorName || staticSite.author,
        bio: dbConfig.doctorBio || "",
        image: dbConfig.doctorImage || "",
        aboutPage: dbConfig.aboutPage || ""
      }
    };

    cacheTime = now;
    return cachedConfig;
  } catch (error) {
    // If database fails, return static config
    console.error("Error fetching site config from DB:", error);
    return {
      site: staticSite,
      footer: staticFooter,
      social: staticSocial,
      contact: staticContact
    };
  }
}

// Clear cache when config is updated
export function clearSiteConfigCache() {
  cachedConfig = null;
  cacheTime = 0;
}