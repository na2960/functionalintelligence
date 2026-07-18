const PAPER_URL = "https://pmc.ncbi.nlm.nih.gov/articles/PMC11141807/";
const SCHOLAR_URL =
  process.env.NEXT_PUBLIC_SCHOLAR_URL ??
  "https://scholar.google.com/scholar?q=Nripendra+Acharya";

export default function About() {
  return (
    <>
      <div className="tstrip">
        <span>// About</span>
        <span className="tstrip-mid" />
        <span>FIG. 05 — WHO WE ARE</span>
      </div>

      <div className="mo-wrap">
        <section className="mkt-head">
          <div className="mo-eyebrow">// Clear frameworks for hard things</div>
          <h1 className="mo-h1">About.</h1>
          <p className="mo-lede">
            Functional Intelligence is written and edited by Nripendra Acharya,
            whose research has centered on a recurring problem: constructing
            clear, measurable frameworks for concepts that resist easy
            measurement.
          </p>
        </section>
      </div>

      <div className="mo-ruler" />

      <div className="mo-wrap">
        <section className="about-body">
          <div className="mo-features-head">
            <span>// Background</span>
            <span>01 / Bio</span>
          </div>
          <div className="mo-axis" />
          <div className="about-grid">
            <div className="about-col">
              <p className="mo-card-desc about-para">
                His published works include biomedical research in the
                proceedings of the AMIA Joint Summits on Translational Science,
                along with earlier industry writing such as a white paper on
                human engagement in digital banking.
              </p>
              <div className="about-links">
                <a
                  className="mo-link"
                  href={SCHOLAR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Scholar ↗
                </a>
                <a
                  className="mo-link"
                  href={PAPER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read the full paper ↗
                </a>
              </div>
            </div>

            <blockquote className="about-quote">
              <p>
                &ldquo;A little over 15 years ago, the final report produced by
                the World Health Organization&rsquo;s Commission on Social
                Determinants of Health identified health equity as a key
                criterion for social and economic policies and initiatives,
                which paralleled the growing awareness within the United States
                that medical care alone cannot address health disparities
                without an understanding of the fundamental role of social
                factors on health. However, given the multi-domain and dynamic
                nature of its component factors, along with the complex pathways
                in which these factors affect health outcomes, social
                determinants of health (SDOH) can be challenging to assess and
                articulate in a clear and measurable framework&hellip;&rdquo;
              </p>
              <cite>
                — Development and Validation of an Individual Socioeconomic
                Deprivation Index (ISDI) in the NIH&rsquo;s All of Us Data
                Network, AMIA Joint Summits on Translational Science, 2024
              </cite>
            </blockquote>
          </div>
        </section>
      </div>
    </>
  );
}
