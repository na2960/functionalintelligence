const PAPER_URL = "https://pmc.ncbi.nlm.nih.gov/articles/PMC11141807/";
const SCHOLAR_URL =
  process.env.NEXT_PUBLIC_SCHOLAR_URL ??
  "https://scholar.google.com/scholar?q=Nripendra+Acharya";

export default function About() {
  return (
    <section id="about" className="frame-sec about">
      <div className="section-head">
        <h2>About</h2>
      </div>
      <p className="about-intro">
        Functional Intelligence is written and edited by Nripendra Acharya,
        whose research interests have centered on a recurring problem:
        constructing clear, measurable frameworks for concepts that resist easy
        measurement. His published works include biomedical research published
        in the proceedings of the AMIA Joint Summits on Translational Science,
        along with earlier industry writing such as a white paper on human
        engagement in digital banking.
      </p>

      <blockquote className="about-quote">
        <p>
          &ldquo;A little over 15 years ago, the final report produced by the
          World Health Organization&rsquo;s Commission on Social Determinants of
          Health identified health equity as a key criterion for social and
          economic policies and initiatives, which paralleled the growing
          awareness within the United States that medical care alone cannot
          address health disparities without an understanding of the fundamental
          role of social factors on health. However, given the multi-domain and
          dynamic nature of its component factors, along with the complex
          pathways in which these factors affect health outcomes, social
          determinants of health (SDOH) can be challenging to assess and
          articulate in a clear and measurable framework&hellip;&rdquo;
        </p>
        <cite>
          — Development and Validation of an Individual Socioeconomic Deprivation
          Index (ISDI) in the NIH&rsquo;s All of Us Data Network, AMIA Joint
          Summits on Translational Science, 2024 ·{" "}
          <a href={PAPER_URL} target="_blank" rel="noopener noreferrer">
            Read the full paper →
          </a>
        </cite>
      </blockquote>

      <a
        className="about-scholar"
        href={SCHOLAR_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Google Scholar ↗
      </a>
    </section>
  );
}
