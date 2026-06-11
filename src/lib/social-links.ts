// Default social media links from environment variables
const defaultSocialLinks = {
  twitter: process.env.TWITTER_URL || "",
  instagram: process.env.INSTAGRAM_URL || "",
  youtube: process.env.YOUTUBE_URL || "",
  linkedin: process.env.LINKEDIN_URL || "",
  telegram: process.env.TELEGRAM_URL || "",
  whatsapp: process.env.WHATSAPP_URL || "",
};

// Default contact info from environment variables
const defaultContactInfo = {
  email: process.env.CONTACT_EMAIL || "",
  phone: process.env.CONTACT_PHONE || "",
};

// These will be populated client-side from the API
let socialLinks = { ...defaultSocialLinks };
let contactInfo = { ...defaultContactInfo };

export { socialLinks, contactInfo };

// Check if any social link exists
export function hasSocialLinks(): boolean {
  return Object.values(socialLinks).some((link) => link && link.length > 0);
}

// Update social links from config (called by client components)
export function updateSocialLinks(config: any) {
  if (config?.social) {
    socialLinks = {
      twitter: config.social.twitter || defaultSocialLinks.twitter,
      instagram: config.social.instagram || defaultSocialLinks.instagram,
      youtube: config.social.youtube || defaultSocialLinks.youtube,
      linkedin: config.social.linkedin || defaultSocialLinks.linkedin,
      telegram: config.social.telegram || defaultSocialLinks.telegram,
      whatsapp: config.social.whatsapp || defaultSocialLinks.whatsapp,
    };
  }
  if (config?.contact) {
    contactInfo = {
      email: config.contact.email || defaultContactInfo.email,
      phone: config.contact.phone || defaultContactInfo.phone,
    };
  }
}
