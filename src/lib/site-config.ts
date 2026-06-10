import siteConfig from "./site.json";

export type SiteConfig = typeof siteConfig;

export const site = siteConfig;

export const {
  site: siteInfo,
  links,
  navLinks,
  footer,
  social,
  contact
} = siteConfig;