import { NextRequest, NextResponse } from "next/server";
import { publicClient } from "@/lib/supabase";

const CATEGORIES = new Set([
  "ai",
  "biomed",
  "markets",
  "supply-chain",
  "science",
  "math",
  "other",
]);

export async function POST(req: NextRequest) {
  let body: {
    title?: string;
    link?: string;
    category?: string;
    detail?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  const title = (body.title ?? "").trim();
  const link = (body.link ?? "").trim();
  const detail = (body.detail ?? "").trim();
  const category = CATEGORIES.has(body.category ?? "")
    ? (body.category as string)
    : "other";

  if (title.length < 3 || title.length > 140) {
    return NextResponse.json(
      { error: "Title must be 3–140 characters." },
      { status: 400 }
    );
  }
  if (link && !/^https?:\/\//i.test(link)) {
    return NextResponse.json(
      { error: "Links must start with http(s)://" },
      { status: 400 }
    );
  }
  if (link.length > 500 || detail.length > 1000) {
    return NextResponse.json({ error: "Too long." }, { status: 400 });
  }

  const supabase = publicClient();
  const { data, error } = await supabase
    .from("fi_ideas")
    .insert({
      title,
      link: link || null,
      detail: detail || null,
      category,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Could not submit the idea. Try again." },
      { status: 500 }
    );
  }
  return NextResponse.json({ id: data.id });
}
