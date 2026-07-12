# ƒi — Functional Intelligence

**You fund it. I break it down.**

A research market. Readers put papers, topics, and questions on **The Board**
and back the ones they want explained. The most-funded idea ships as a
5-minute brief every **Tuesday & Thursday, 7:00 AM ET**. The market for each
issue closes at **8:00 PM ET the night before**; unpicked ideas roll over and
keep their funding.

## Stack

- **Next.js 15** (App Router) on **Vercel**
- **Supabase** (Postgres + RLS) — dedicated `functional-intelligence`
  project, tables prefixed `fi_`
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

## Connect Stripe (go live with payments)

Both flows — backing a topic (`/api/back`, min $3) and commissioning a private
brief (`/api/commission`, min $100) — already build a Stripe Checkout session
when the keys below are present. Until then they run in **pledge mode** (funding
is recorded, no card is charged). To turn on real payments:

1. **Secret key** — Stripe dashboard → Developers → API keys → copy the Secret
   key (`sk_live_…` or `sk_test_…`). Add as `STRIPE_SECRET_KEY` in Vercel.
2. **Webhook** — Stripe → Developers → Webhooks → Add endpoint:
   - URL: `https://<your-domain>/api/stripe/webhook`
   - Event: `checkout.session.completed`
   - Copy the endpoint's **Signing secret** (`whsec_…`) → add as
     `STRIPE_WEBHOOK_SECRET` in Vercel.
3. **Service role key** — Supabase → `functional-intelligence` project →
   Settings → API → copy the `service_role` key → add as
   `SUPABASE_SERVICE_ROLE_KEY` in Vercel (server-only; lets the webhook write
   `paid` rows).
4. Redeploy. Test with a Stripe test key + card `4242 4242 4242 4242`.

**Status:** `STRIPE_SECRET_KEY` is set in Vercel. `STRIPE_WEBHOOK_SECRET` is
pending — add it once the custom domain is attached, since the webhook URL
needs the final domain.

Row-level security guarantees the public key can only ever write
`status='pledged'` rows — `paid` rows come exclusively from the verified
webhook. Backer email (for brief delivery) is captured on the session and
stored on the backing.

### Email / Substack

Emails from the signup band and the fund/commission modals are stored in
`fi_subscribers` (Supabase) and mirrored to your Substack (best-effort, via the
same endpoint the embed form uses — set `NEXT_PUBLIC_SUBSTACK_URL`). Supabase is
the source of truth; export it any time if the Substack sync is rate-limited.

## Running an issue (manual, for now)

When a brief ships, mark the winner covered (Supabase SQL editor):

```sql
update fi_ideas
set status = 'covered',
    covered_at = now(),
    brief_url = 'https://<substack-post>',        -- optional
    brief_body = $brief$
Paste the brief text here. Supports blank-line paragraphs, ## and ###
headings, - bullet lists, **bold**, *italics*, and [links](https://…).
$brief$
where id = '<idea-id>';
```

Covered ideas move to **Shipped** on the board and appear on the **Briefs**
tab (`/briefs`), readable on-site. If `brief_body` is empty the brief page
links out to `brief_url` instead. All other ideas roll over automatically.

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
