# ƒi — Functional Intelligence

**You fund it. I break it down.**

A research market. Readers put papers, topics, and questions on **The Board**
and back the ones they want explained. The most-funded idea ships as a
5-minute brief every **Tuesday & Thursday, 7:00 AM ET**. The market for each
issue closes at **8:00 PM ET the night before**; unpicked ideas roll over and
keep their funding.

## Stack

- **Next.js 15** (App Router) on **Vercel**
- **Supabase** (Postgres + RLS) — tables prefixed `fi_` inside the
  `sawhorse-intelligence` project
- **Stripe Checkout** for backing payments (env-gated, see below)
- **Substack** for the briefs themselves

## How money flows

1. `POST /api/back` — with Stripe configured it creates a Checkout session;
   the webhook records the paid backing. Without Stripe keys (launch mode),
   backings are recorded directly as unpaid **pledges**.
2. `POST /api/stripe/webhook` — verifies the Stripe signature and upserts the
   `paid` backing using the Supabase service role key.
3. Row-level security guarantees the public key can only ever write
   `status='pledged'` rows — `paid` rows come exclusively from the webhook.

## Going live with payments

Add these in Vercel → Project → Settings → Environment Variables, then redeploy:

| Variable | Where to get it |
| --- | --- |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Webhooks → add endpoint `https://<domain>/api/stripe/webhook`, event `checkout.session.completed` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API keys |

## Running an issue (manual, for now)

When a brief ships, mark the winner covered (Supabase SQL editor):

```sql
update fi_ideas
set status = 'covered', covered_at = now(), brief_url = 'https://<substack-post>'
where id = '<idea-id>';
```

Covered ideas move to the **Shipped** section with their final total; all
other ideas roll over automatically.

## Local dev

```bash
npm install
npm run dev
```

Optional overrides go in `.env.local` (see `.env.example`).

## Language rules

Backing is framed as **fund / back / commission** — never bet, wager, odds,
or win. There are no payouts; people pay to prioritize coverage. Keep it that
way in all copy.
