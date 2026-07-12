import Board from "@/components/Board";
import BoardActions from "@/components/BoardActions";
import CommissionCta from "@/components/CommissionCta";
import Countdown from "@/components/Countdown";
import EmailCapture from "@/components/EmailCapture";
import HeroCtas from "@/components/HeroCtas";
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
            <section className="hero">
              <div className="kicker">A RESEARCH MARKETPLACE</div>
              <h1>
                <span className="fund">You fund it.</span>{" "}
                <span className="break">We break it down</span>
              </h1>
              <div className="hero-tail">to its underlying assumptions.</div>
              <p className="sub">
                Cutting-edge research, AI models, bio-medicine, quantum, supply
                chain, chemistry, and more. The{" "}
                <strong>highest-funded topic</strong> on The Board resolves as a{" "}
                <strong>5-minute brief</strong> every{" "}
                <strong>Tuesday &amp; Thursday at 7am</strong>.
              </p>
              <p className="free-note">
                Free to read. Pay to steer or commission.
              </p>
              <HeroCtas />
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
              <span className="count">
                live leaderboard · #1 at market close ships as the next brief
              </span>
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
                <h3>Never miss the 7am brief.</h3>
                <p>
                  One email, Tuesday &amp; Thursday. Free — and it&rsquo;s the
                  same list as the Substack.
                </p>
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
                  Want it written for you alone? Commission a single topic at{" "}
                  <strong style={{ color: "var(--gold)" }}>$100+</strong>: a
                  private brief, delivered to you before it goes public — if it
                  ever does. Commissioner&rsquo;s choice.
                </p>
                <p>
                  Researchers: want your own paper featured? Commission a
                  breakdown of your work — or put it on The Board and let the
                  crowd bid it to the top.
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
