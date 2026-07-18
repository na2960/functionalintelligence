import { createClient } from "@supabase/supabase-js";

// The publishable key is safe to ship to the client; all writes are
// constrained by row-level security. The service role key (webhook only)
// is never bundled and must come from the environment.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://hxmbvkljjulssmoylwbq.supabase.co";

export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "sb_publishable_NkiX6MDTmdr8RCFBmayfkw_trPQJyng";

export function publicClient() {
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false },
  });
}

export function serviceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;
  return createClient(SUPABASE_URL, key, { auth: { persistSession: false } });
}

export type BoardIdea = {
  id: string;
  title: string;
  detail: string | null;
  link: string | null;
  category: string;
  status: string;
  brief_url: string | null;
  covered_at: string | null;
  created_at: string;
  total_cents: number;
  backers: number;
  last_backed_at: string | null;
  top_backer: string | null;
};

export type Brief = {
  id: string;
  title: string;
  detail: string | null;
  category: string;
  brief_url: string | null;
  brief_body: string | null;
  covered_at: string | null;
};

export async function fetchBoard(): Promise<BoardIdea[]> {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("fi_board")
    .select("*")
    .order("total_cents", { ascending: false })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  const board = (data ?? []) as BoardIdea[];

  // Attach the most recent named backer per topic (social proof on the card).
  // backer_name is intended to be public; emails are never selected here.
  const { data: backers } = await supabase
    .from("fi_backings")
    .select("idea_id, backer_name, created_at")
    .not("backer_name", "is", null)
    .in("status", ["pledged", "paid"])
    .order("created_at", { ascending: false })
    .limit(200);
  const topBacker = new Map<string, string>();
  for (const b of backers ?? []) {
    if (b.backer_name && !topBacker.has(b.idea_id)) {
      topBacker.set(b.idea_id, b.backer_name);
    }
  }
  return board.map((i) => ({ ...i, top_backer: topBacker.get(i.id) ?? null }));
}

const BRIEF_COLS =
  "id, title, detail, category, brief_url, brief_body, covered_at";

export async function fetchBriefs(): Promise<Brief[]> {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("fi_ideas")
    .select(BRIEF_COLS)
    .in("status", ["covered", "commissioned"])
    .order("covered_at", { ascending: false, nullsFirst: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Brief[];
}

export async function fetchLatestBrief(): Promise<Brief | null> {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("fi_ideas")
    .select(BRIEF_COLS)
    .eq("status", "covered")
    .order("covered_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Brief) ?? null;
}

export async function fetchBrief(id: string): Promise<Brief | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("fi_ideas")
    .select(BRIEF_COLS)
    .eq("id", id)
    .in("status", ["covered", "commissioned"])
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Brief) ?? null;
}
