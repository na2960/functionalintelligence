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
};

export type RecentBacking = {
  amount_cents: number;
  backer_name: string | null;
  created_at: string;
  idea_title: string;
};

export async function fetchBoard(): Promise<BoardIdea[]> {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("fi_board")
    .select("*")
    .order("total_cents", { ascending: false })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as BoardIdea[];
}

export async function fetchRecentBackings(): Promise<RecentBacking[]> {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("fi_backings")
    .select("amount_cents, backer_name, created_at, idea:fi_ideas(title)")
    .in("status", ["pledged", "paid"])
    .order("created_at", { ascending: false })
    .limit(14);
  if (error) throw new Error(error.message);
  return (data ?? [])
    .map((row) => {
      const idea = Array.isArray(row.idea) ? row.idea[0] : row.idea;
      return {
        amount_cents: row.amount_cents,
        backer_name: row.backer_name,
        created_at: row.created_at,
        idea_title: (idea as { title?: string } | null)?.title ?? "",
      };
    })
    .filter((r) => r.idea_title); // drops backings of private commissions
}
