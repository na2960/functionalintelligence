import Board from "@/components/Board";
import Countdown from "@/components/Countdown";
import Nav from "@/components/Nav";
import SubmitForm from "@/components/SubmitForm";
import { formatMoney } from "@/lib/market";
import { fetchBoard, type BoardIdea } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const SUBSTACK_URL =
  process.env.NEXT_PUBLIC_SUBSTACK_URL ??
  "https://functionalintelligence.substack.com";

export default async function Home() {
  let board: BoardIdea[] = [];
  try {
    board = await fetchBoard();
  } catch {
    // render with an empty board rather than a 500; the client refreshes
  }

  const openIdeas = board.filter((i) => i.status === "open");
  const totalOnBoard = openIdeas.reduce((s, i) => s + i.total_cents, 0);
  const totalBackers = openIdeas.reduce((s, i) => s + i.backers, 0);

  return (
    <>
      <Nav active="board" />

      <div className="hero-band">
        <div className="wrap">
          <section className="hero">
            <h1>
              <span className="fund">You fund it.</span>{" "}
              <span className="break">I break it down.</span>
            </h1>
            <p className="sub">
              A research market. Back the paper, topic, or idea you want
              explained — the <strong>single most-funded idea</strong> on The
              Board ships as a sharp <strong>5-minute brief</strong>, every{" "}
              <strong>Tuesday &amp; Thursday at 7am</strong>. AI, biomedicine,
              markets, supply chain, science, math. No jargon — you finish
              every brief smarter and a little smug about it.
            </p>
            <div className="cta-row">
              <a className="btn btn-gold" href="#board">
                See The Board →
              </a>
              <a className="btn btn-ghost" href="#submit">
                Fund an idea →
              </a>
            </div>
            <p className="free-note">
              Free to read, always. You only pay if you want to steer.
            </p>
            <div className="stat-strip">
              <span>
                <b>{formatMoney(totalOnBoard)}</b> riding on the board
              </span>
              <span className="stat-dot">·</span>
              <span>
                <b>{totalBackers}</b> backer{totalBackers === 1 ? "" : "s"}{" "}
                steering
              </span>
              <span className="stat-dot">·</span>
              <span>
                <b>{openIdeas.length}</b> ideas in the race
              </span>
            </div>
            <Countdown />
          </section>
        </div>
      </div>

      <main className="wrap">
        <section id="board">
          <div className="section-head">
            <h2>The Board</h2>
            <span className="count">
              live leaderboard · #1 at market close ships as the next brief
            </span>
          </div>
          <p className="section-sub">
            One winner per issue: the top-funded idea when the market closes.
            Everything else rolls over with its money intact — still in the
            running until covered or beaten.
          </p>
          <Board initial={board} />
        </section>

        <section>
          <div className="section-head">
            <h2>How it works</h2>
          </div>
          <div className="steps">
            <div className="step">
              <div className="n">01 · SUBMIT</div>
              <h4>Pitch the idea</h4>
              <p>
                A paper link, a topic, a question. If it makes you curious, it
                belongs on The Board.
              </p>
            </div>
            <div className="step">
              <div className="n">02 · BACK</div>
              <h4>Put money on it</h4>
              <p>
                Backing is a bid: it says how much you want it covered. Stack
                onto ideas you didn&rsquo;t submit — totals add up.
              </p>
            </div>
            <div className="step">
              <div className="n">03 · CLOSE</div>
              <h4>Market closes 8pm ET</h4>
              <p>
                The night before each issue, the board locks. Highest total
                funding takes the slot.
              </p>
            </div>
            <div className="step">
              <div className="n">04 · SHIP</div>
              <h4>Brief lands at 7am</h4>
              <p>
                Tuesday &amp; Thursday. A clear, intuitive breakdown — read it
                here or in your inbox.
              </p>
            </div>
          </div>
        </section>

        <section id="commission">
          <div className="commission">
            <div>
              <h3>Commissions</h3>
              <p>
                Want it written for you alone? Back a single idea at{" "}
                <strong style={{ color: "var(--gold)" }}>$100+</strong> and
                mark it a Commission: a private brief, delivered to you before
                it goes public — if it ever does. Commissioner&rsquo;s choice.
              </p>
              <p>
                Researchers: want your own paper featured? Commission a
                breakdown of your work — or put it on The Board and let the
                crowd bid it to the top.
              </p>
            </div>
            <a className="btn btn-ghost" href="#board">
              Commission a brief →
            </a>
          </div>
        </section>

        <section>
          <div className="section-head">
            <h2>Put an idea on The Board</h2>
          </div>
          <SubmitForm />
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-inner">
          <span>
            ƒi — Functional Intelligence ·{" "}
            <a href={SUBSTACK_URL} target="_blank" rel="noopener noreferrer">
              Substack
            </a>
          </span>
          <span className="fine">
            Backing funds coverage: you&rsquo;re paying to prioritize what gets
            explained, not placing a wager. No odds, no payouts. Briefs are
            free to read for everyone, always.
          </span>
        </div>
      </footer>
    </>
  );
}
