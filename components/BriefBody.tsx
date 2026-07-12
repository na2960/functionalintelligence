import React from "react";

// Minimal, safe brief renderer: paragraphs, ## headings, - lists, **bold**,
// *italics*, and [links](https://...). Rendered as React elements — no raw
// HTML ever touches the page, so pasted brief text can't inject markup.

function renderInline(text: string, keyBase: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const pattern =
    /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\(https?:\/\/[^\s)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) {
      out.push(<strong key={`${keyBase}-${i++}`}>{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith("*")) {
      out.push(<em key={`${keyBase}-${i++}`}>{tok.slice(1, -1)}</em>);
    } else {
      const mid = tok.indexOf("](");
      out.push(
        <a
          key={`${keyBase}-${i++}`}
          href={tok.slice(mid + 2, -1)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {tok.slice(1, mid)}
        </a>
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function BriefBody({ body }: { body: string }) {
  const blocks = body.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <div className="brief-body">
      {blocks.map((block, bi) => {
        const b = block.trim();
        if (!b) return null;
        if (b.startsWith("## ")) {
          return <h2 key={bi}>{renderInline(b.slice(3), `h${bi}`)}</h2>;
        }
        if (b.startsWith("### ")) {
          return <h3 key={bi}>{renderInline(b.slice(4), `h${bi}`)}</h3>;
        }
        const lines = b.split("\n");
        if (lines.every((l) => /^[-*] /.test(l.trim()))) {
          return (
            <ul key={bi}>
              {lines.map((l, li) => (
                <li key={li}>
                  {renderInline(l.trim().slice(2), `l${bi}-${li}`)}
                </li>
              ))}
            </ul>
          );
        }
        return <p key={bi}>{renderInline(b, `p${bi}`)}</p>;
      })}
    </div>
  );
}
