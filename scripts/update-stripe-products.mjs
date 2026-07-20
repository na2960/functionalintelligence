// Update the Custom Blueprint / Custom Blueprint+ Stripe products: names,
// descriptions, and monthly price. Stripe prices are immutable, so when the
// target amount differs this creates a NEW recurring price, sets it as the
// product default, and prints its id — you then point the app at that id
// (set the env var below, or send me the id and I'll hardcode it).
//
// Run with your live secret key (never commit it):
//   STRIPE_SECRET_KEY=sk_live_xxx node scripts/update-stripe-products.mjs
//
// Optionally override the current price IDs the script starts from:
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
    envKey: "STRIPE_PRICE_FOUNDER_VOICE",
    priceId:
      process.env.STRIPE_PRICE_FOUNDER_VOICE ??
      "price_1TuPMICvWCG8D5mHQR27EwL0",
    name: "Custom Blueprint",
    monthlyCents: 200000, // $2,000 / mo
    description:
      "A custom implementation blueprint for your data model or problem " +
      "statement, with the math explained simply — based on a review of " +
      "state-of-the-art peer-reviewed literature. Kick-off call, literature " +
      "review, blueprint, and a review-and-revision round.",
  },
  {
    envKey: "STRIPE_PRICE_FOUNDER_VOICE_PLUS",
    priceId:
      process.env.STRIPE_PRICE_FOUNDER_VOICE_PLUS ??
      "price_1TuPMgCvWCG8D5mHcH41h3s3",
    name: "Custom Blueprint+",
    monthlyCents: 250000, // $2,500 / mo
    description:
      "Deeper coverage: a technical literature review of the state of the " +
      "art plus a custom implementation blueprint with the math explained " +
      "simply, and writing services after implementation. Kick-off call, " +
      "literature review, blueprint, and a review-and-revision round.",
  },
];

const newIds = [];

for (const plan of PLANS) {
  const price = await stripe.prices.retrieve(plan.priceId);
  const productId =
    typeof price.product === "string" ? price.product : price.product.id;

  await stripe.products.update(productId, {
    name: plan.name,
    description: plan.description,
  });
  console.log(`✓ ${productId} — ${plan.name}`);

  const matches =
    price.active &&
    price.unit_amount === plan.monthlyCents &&
    price.recurring?.interval === "month";

  if (matches) {
    console.log(
      `  price ${plan.priceId} is already $${plan.monthlyCents / 100}/mo — unchanged`
    );
    continue;
  }

  const newPrice = await stripe.prices.create({
    product: productId,
    currency: "usd",
    unit_amount: plan.monthlyCents,
    recurring: { interval: "month" },
  });
  await stripe.products.update(productId, { default_price: newPrice.id });
  newIds.push({ name: plan.name, envKey: plan.envKey, id: newPrice.id });
  console.log(
    `  → NEW price: ${newPrice.id}  ($${plan.monthlyCents / 100}/mo)`
  );
}

if (newIds.length) {
  console.log("\nPoint the app at the new price id(s):");
  for (const n of newIds) {
    console.log(`  ${n.name}: set ${n.envKey}=${n.id}   (or send me this id)`);
  }
  console.log(
    "\nThe old price still exists; archive it in the Dashboard once the app uses the new id."
  );
}

console.log("\nDone.");
