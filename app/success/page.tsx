import Link from "next/link";

export default function Success() {
  return (
    <div className="hero-band" style={{ minHeight: "100vh" }}>
      <div className="wrap">
        <section className="hero" style={{ paddingBottom: 24 }}>
          <h1>
            <span className="fund">You&rsquo;re on</span>{" "}
            <span className="break">the board.</span>
          </h1>
          <p className="sub">
            Your backing is in. Watch it climb — the market closes at 8:00 PM
            ET the night before each issue, and the top idea ships Tuesday
            &amp; Thursday at 7:00 AM.
          </p>
          <div className="cta-row">
            <Link className="btn btn-gold" href="/#board">
              Back to The Board →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
