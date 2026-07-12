import Board from "@/components/Board";
import Countdown from "@/components/Countdown";
import SubmitForm from "@/components/SubmitForm";
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

  return (
    <div className="wrap">
      <header className="header">
        <div className="mark">
          <em>f</em> i
        </div>
        <div className="masthead">
          <span className="name">FUNCTIONAL INTELLIGENCE</span>
          <span className="status">
            <span className="dot" />
            THE BOARD · MARKET OPEN
          </span>
        </div>
        <div className="spacer" />
        <a
          className="substack"
          href={SUBSTACK_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          READ ON SUBSTACK ↗
        </a>
      </header>

      <section className="hero">
        <h1>
          <span className="fund">You fund it.</span>
          <br />
          <span className="break">I break it down.</span>
        </h1>
        <p className="sub">
          A research market. Back the paper, topic, or idea you want explained
          — the most-funded idea on The Board ships as a sharp{" "}
          <strong>5-minute brief</strong>, every{" "}
          <strong>Tuesday &amp; Thursday at 7am</strong>. AI, biomedicine,
          markets, supply chain, science, math. No jargon — you finish every
          brief smarter and a little smug about it.
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
        <Countdown />
      </section>

      <section id="board">
        <div className="section-head">
          <h2>THE BOARD</h2>
          <div className="rule" />
        </div>
        <p className="section-sub">
          Live ranking by total funding. Highest total when the market closes
          wins the next brief. Unpicked ideas roll over and keep their money —
          they stay in the running until covered or beaten.
        </p>
        <Board initial={board} />
      </section>

      <section>
        <div className="section-head">
          <h2>HOW IT WORKS</h2>
          <div className="rule" />
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
              Tuesday &amp; Thursday. A clear, intuitive breakdown in your
              inbox before you finish your coffee.
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
              <strong style={{ color: "var(--gold)" }}>$100+</strong> and mark
              it a Commission: a private brief, delivered to you before it goes
              public — if it ever does. Commissioner&rsquo;s choice.
            </p>
          </div>
          <a className="btn btn-ghost" href="#board">
            Commission a brief →
          </a>
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>SUBMIT</h2>
          <div className="rule" />
        </div>
        <SubmitForm />
      </section>

      <footer className="footer">
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
      </footer>
    </div>
  );
}
