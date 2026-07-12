import Board from "@/components/Board";
import BoardActions from "@/components/BoardActions";
import CommissionCta from "@/components/CommissionCta";
import Countdown from "@/components/Countdown";
import EmailCapture from "@/components/EmailCapture";
import MarketProvider from "@/components/MarketProvider";
import Nav from "@/components/Nav";
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

      <MarketProvider initialIdeas={board}>
        <div className="hero-band">
          <div className="wrap">
            <section className="hero centered">
              <div className="eyebrow">A Research Marketplace</div>
              <h1>
                <span className="fund">You fund it.</span>{" "}
                <span className="break">We break it down.</span>
              </h1>
              <p className="lede">
                Our team breaks the top-funded topic down to its underlying
                assumptions — delivered as a 5-minute brief every Tuesday &amp;
                Thursday at 7am.
              </p>
              <p className="free-note">
                Free to read. Pay to steer or commission.
              </p>
              <div className="cta-row">
                <a className="btn btn-gold" href="#board">
                  See The Board →
                </a>
              </div>
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
                  <b>{openIdeas.length}</b> topics in the race
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
            </div>
            <p className="section-sub">
              One winner per issue: the top-funded topic when the market closes.
              Everything else rolls over with its money intact — still in the
              running until covered or beaten.
            </p>
            <BoardActions />
            <Board />
          </section>

          <section className="brief-signup">
            <div className="signup-inner">
              <div>
                <h3>Don&rsquo;t miss the free 7am brief.</h3>
                <p>Every Tuesday and Thursday.</p>
              </div>
              <EmailCapture variant="band" />
            </div>
          </section>

          <section>
            <div className="section-head">
              <h2>How it works</h2>
            </div>
            <div className="steps">
              <div className="step">
                <div className="n">01 · SUBMIT</div>
                <h4>Pitch the topic</h4>
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
                  onto topics you didn&rsquo;t submit — totals add up.
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
                  A commission is a private brief on a topic of your choice,
                  from{" "}
                  <strong style={{ color: "var(--gold)" }}>$100</strong>. It
                  stays private unless you decide otherwise.
                </p>
                <p>
                  Researchers can commission a breakdown of their own work, or
                  add it to The Board for the crowd to fund.
                </p>
              </div>
              <CommissionCta />
            </div>
          </section>
        </main>
      </MarketProvider>

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
            explained, not placing a wager. No odds, no payouts. Briefs are free
            to read for everyone, always.
          </span>
        </div>
      </footer>
    </>
  );
}
