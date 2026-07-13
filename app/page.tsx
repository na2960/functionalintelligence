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
        <div className="frame">
          <section className="frame-sec hero-sec">
            <div className="hero-cols">
              <h1 className="rm-title">
                <span className="rm-mark">
                  <em>f</em>i
                </span>
                <span className="rm-text">Research Marketplace</span>
              </h1>
              <div className="hero-aside">
                <p className="hero-lede">You fund it. We break it down.</p>
                <p className="hero-desc">
                  Our team breaks the top-funded topic down to its underlying
                  assumptions using abstractions anyone could understand — a
                  5-minute brief every Tuesday &amp; Thursday at 7am. Free to
                  read. Pay to steer or commission.
                </p>
                <div className="hero-cta-row">
                  <a className="btn btn-gold" href="#board">
                    The Board →
                  </a>
                  <a className="btn btn-secondary" href="/briefs">
                    Read the Briefs →
                  </a>
                </div>
              </div>
            </div>
            <div className="hero-metrics">
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
            </div>
          </section>

          <section className="frame-sec" id="board">
            <div className="section-head">
              <h2>The Board</h2>
            </div>
            <p className="section-sub">
              When the market closes, the most-backed topic becomes the next
              brief. Every other topic keeps its funding and stays in the
              running.
            </p>
            <BoardActions />
            <Board />
          </section>

          <section className="frame-sec brief-signup">
            <div className="signup-inner">
              <div>
                <h3>Don&rsquo;t miss the free 7am brief.</h3>
                <p>Every Tuesday and Thursday.</p>
              </div>
              <EmailCapture variant="band" />
            </div>
          </section>

          <section className="frame-sec">
            <div className="section-head">
              <h2>How it works</h2>
            </div>
            <div className="steps">
              <div className="step">
                <div className="n">01 · Submit</div>
                <h4>Pitch the topic</h4>
                <p>
                  A paper link, a topic, a question. If it makes you curious, it
                  belongs on The Board.
                </p>
              </div>
              <div className="step">
                <div className="n">02 · Back</div>
                <h4>Put money on it</h4>
                <p>
                  Back any topic — yours or someone else&rsquo;s. Every dollar
                  adds to its total.
                </p>
              </div>
              <div className="step">
                <div className="n">03 · Close</div>
                <h4>Market closes 8pm ET</h4>
                <p>
                  The night before each issue, the board locks. The most-backed
                  topic is delivered as a brief.
                </p>
              </div>
              <div className="step">
                <div className="n">04 · Ship</div>
                <h4>Brief lands at 7am</h4>
                <p>
                  Tuesday &amp; Thursday. A clear, intuitive breakdown — read it
                  here or in your inbox.
                </p>
              </div>
            </div>
          </section>

          <section className="frame-sec" id="commission">
            <div className="commission">
              <div>
                <h3>Commissions</h3>
                <p>
                  A commission is a private brief on a topic of your choice,
                  from{" "}
                  <strong style={{ color: "var(--gold)" }}>$100</strong>. It
                  stays private unless you decide otherwise.
                </p>
              </div>
              <CommissionCta />
            </div>
          </section>
        </div>
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
            Backing and commissions are voluntary, non-refundable payments to
            prioritize which topic gets covered. They are not wagers, bets, or
            entries in a game of chance, and they carry no odds, no payouts, and
            no financial, ownership, or other return of any kind. Funding a
            topic does not guarantee any specific result or publication date.
            Every brief is free to read. Functional Intelligence is an
            editorial publication, not a financial product or investment.
          </span>
        </div>
      </footer>
    </>
  );
}
