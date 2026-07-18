// Update the Founder Voice / Founder Voice+ Stripe product names + descriptions
// so they read correctly at Checkout and in the Stripe dashboard.
//
// Run with your live secret key (never commit it):
//   STRIPE_SECRET_KEY=sk_live_xxx node scripts/update-stripe-products.mjs
//
// Optionally override the price IDs:
//   STRIPE_PRICE_FOUNDER_VOICE=price_xxx STRIPE_PRICE_FOUNDER_VOICE_PLUS=price_yyy ...

import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("Set STRIPE_SECRET_KEY to run this script.");
  process.exit(1);
}
const stripe = new Stripe(key);

const PLANS = [
  {
    priceId:
      process.env.STRIPE_PRICE_FOUNDER_VOICE ??
      "price_1TuPMICvWCG8D5mHQR27EwL0",
    name: "Founder Voice",
    description:
      "Two publish-ready, well-researched pieces a month — written in your " +
      "voice and published under your name. Includes a monthly kickoff call, " +
      "drafts in five business days, and two revision rounds. Full IP " +
      "assignment; month-to-month.",
  },
  {
    priceId:
      process.env.STRIPE_PRICE_FOUNDER_VOICE_PLUS ??
      "price_1TuPMgCvWCG8D5mHcH41h3s3",
    name: "Founder Voice+",
    description:
      "Four publish-ready pieces a month — written in your voice and " +
      "published under your name, with wider distribution and priority " +
      "turnaround. Includes a monthly kickoff call, drafts in five business " +
      "days, and two revision rounds. Full IP assignment; month-to-month.",
  },
];

for (const plan of PLANS) {
  const price = await stripe.prices.retrieve(plan.priceId);
  const productId =
    typeof price.product === "string" ? price.product : price.product.id;
  const updated = await stripe.products.update(productId, {
    name: plan.name,
    description: plan.description,
  });
  console.log(`✓ ${updated.id} — ${updated.name}`);
}

console.log("Done.");
