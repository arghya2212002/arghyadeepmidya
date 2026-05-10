/**
 * Public profile URLs — replace with your real handles before launch.
 * Optional: set NEXT_PUBLIC_* in `.env.local` to override.
 */
export const socialLinks = {
  instagram:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://www.instagram.com/arghyadeepmidya",
  facebook:
    process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "https://www.facebook.com/arghyadeepmidya",
  linkedin:
    process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "https://www.linkedin.com/in/arghyadeep-midya",
} as const;

/** Used as mailto: — set NEXT_PUBLIC_CONTACT_EMAIL in `.env.local` for your Gmail address */
export const contactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "arghyadeepmidya@gmail.com";
