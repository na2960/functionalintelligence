// Research Services retainers — Stripe subscription products (live mode).
// The tier keys stay `founder_voice*` as stable internal identifiers (they
// flow through Checkout metadata and the webhook); only the display names
// change. Price IDs are catalog identifiers (not secrets); override via env
// if the prices are ever recreated.
export type RetainerTier = "founder_voice" | "founder_voice_plus";

export const RETAINERS: Record<
  RetainerTier,
  { name: string; price: string; monthly: string }
> = {
  founder_voice: {
    name: "Custom Blueprint",
    monthly: "$1,500/mo",
    price:
      process.env.STRIPE_PRICE_FOUNDER_VOICE ??
      "price_1TuPMICvWCG8D5mHQR27EwL0",
  },
  founder_voice_plus: {
    name: "Custom Blueprint+",
    monthly: "$2,500/mo",
    price:
      process.env.STRIPE_PRICE_FOUNDER_VOICE_PLUS ??
      "price_1TuPMgCvWCG8D5mHcH41h3s3",
  },
};

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@funcimarket.com";
