import { createClient } from "@supabase/supabase-js";

// The publishable key is safe to ship to the client; all writes are
// constrained by row-level security. The service role key (webhook only)
// is never bundled and must come from the environment.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://hvczjjshhsjpytqlbvel.supabase.co";

export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "sb_publishable_p10WLaGzSTUMZs3E_ZODSA_ACHhqrNn";

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
