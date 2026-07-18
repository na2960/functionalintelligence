// Founder Voice retainers — Stripe subscription products (live mode).
// Price IDs are catalog identifiers (not secrets); override via env if the
// prices are ever recreated.
export type RetainerTier = "founder_voice" | "founder_voice_plus";

export const RETAINERS: Record<
  RetainerTier,
  { name: string; price: string; monthly: string }
> = {
  founder_voice: {
    name: "Founder Voice",
    monthly: "$1,500/mo",
    price:
      process.env.STRIPE_PRICE_FOUNDER_VOICE ??
      "price_1TuPMICvWCG8D5mHQR27EwL0",
  },
  founder_voice_plus: {
    name: "Founder Voice+",
    monthly: "$2,500/mo",
    price:
      process.env.STRIPE_PRICE_FOUNDER_VOICE_PLUS ??
      "price_1TuPMgCvWCG8D5mHcH41h3s3",
  },
};

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@funcimarket.com";
