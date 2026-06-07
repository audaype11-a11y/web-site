// Social media links from environment variables
export const socialLinks = {
  twitter: process.env.TWITTER_URL || "",
  instagram: process.env.INSTAGRAM_URL || "",
  youtube: process.env.YOUTUBE_URL || "",
  linkedin: process.env.LINKEDIN_URL || "",
  telegram: process.env.TELEGRAM_URL || "",
  whatsapp: process.env.WHATSAPP_URL || "",
};

// Contact info from environment variables
export const contactInfo = {
  email: process.env.CONTACT_EMAIL || "",
  phone: process.env.CONTACT_PHONE || "",
};

// Check if any social link exists
export function hasSocialLinks(): boolean {
  return Object.values(socialLinks).some((link) => link && link.length > 0);
}
