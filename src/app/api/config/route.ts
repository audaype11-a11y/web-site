import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { site as staticSite, footer as staticFooter, social as staticSocial, contact as staticContact } from "@/lib/site-config";

// GET /api/config - Get merged site config (database + static)
export async function GET() {
  try {
    // Get dynamic configs from database
    const dbConfigs = await db.siteConfig.findMany();
    
    const dbConfig: Record<string, string> = {};
    dbConfigs.forEach((config) => {
      dbConfig[config.key] = config.value;
    });

    // Merge static and dynamic configs
    const config = {
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
      }
    };

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error getting config:", error);
    // Return static config if database fails
    return NextResponse.json({
      site: staticSite,
      footer: staticFooter,
      social: staticSocial,
      contact: staticContact
    });
  }
}