/** Central SEO constants shared by layout, sitemap, robots, and per-page metadata. */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://sellwhatumade.com";

export const SITE_NAME = "SellWhatUMade";

export const DEFAULT_TITLE =
  "SellWhatUMade — Authentic Handmade Crafts from Rural Indian Artisans";

export const DEFAULT_DESCRIPTION =
  "Shop authentic handcrafted treasures — pottery, handloom textiles, folk paintings, wood and metal craft, tribal jewellery — made by rural Indian artisans. Vocal for Local, direct from the maker to you.";

export const DEFAULT_KEYWORDS = [
  "handmade in India",
  "Indian handicrafts online",
  "rural artisans India",
  "vocal for local",
  "Atmanirbhar Bharat",
  "buy handloom textiles online",
  "authentic handcrafted jewellery",
  "tribal art India",
  "support local artisans",
  "Madhubani painting online",
  "blue pottery Jaipur",
  "handmade marketplace India",
];

export const DEFAULT_OG_IMAGE = `${SITE_URL}/website_logo.png`;
