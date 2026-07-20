// Research Services retainers — Stripe subscription products (live mode).
// The tier keys stay `founder_voice*` as stable internal identifiers (they
// flow through Checkout metadata and the webhook); only the display names
// change. We store the Stripe PRODUCT id and resolve its current default
// price at checkout time — so changing the amount in Stripe (which always
// mints a new immutable price) needs no code change here. Product ids are
// catalog identifiers (not secrets); override via env if ever recreated.
export type RetainerTier = "founder_voice" | "founder_voice_plus";

export const RETAINERS: Record<
  RetainerTier,
  { name: string; product: string; monthly: string }
> = {
  founder_voice: {
    name: "Custom Blueprint",
    monthly: "$2,000/mo",
    product: process.env.STRIPE_PRODUCT_FOUNDER_VOICE ?? "prod_UuDoOtfmSyxx5h",
  },
  founder_voice_plus: {
    name: "Custom Blueprint+",
    monthly: "$2,500/mo",
    product:
      process.env.STRIPE_PRODUCT_FOUNDER_VOICE_PLUS ?? "prod_UuDnE2CdeIaSuv",
  },
};

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@funcimarket.com";
