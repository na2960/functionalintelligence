import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

const CONTACT =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@funcimarket.com";

export const metadata = {
  title: "Contact — Functional Intelligence",
  description:
    "Get in touch about writing services, the research marketplace, or anything else.",
};

export default function ContactPage() {
  return (
    <>
      <Nav active="contact" />

      <div className="mo-wrap">
        <section className="mkt-head">
          <div className="mo-eyebrow">// Say hello</div>
          <h1 className="mo-h1">Contact.</h1>
          <p className="mo-lede">
            Questions about writing services, the research marketplace, or a
            topic you want covered — send a note and we&rsquo;ll get back to you.
          </p>
        </section>
      </div>

      <div className="mo-ruler" />

      <div className="mo-wrap">
        <section className="contact-grid">
          <div className="contact-form-col">
            <div className="mo-features-head">
              <span>// Send a message</span>
              <span>Form</span>
            </div>
            <div className="mo-axis" />
            <ContactForm />
          </div>

          <aside className="contact-aside">
            <div className="mo-features-head">
              <span>// Direct</span>
              <span>Email</span>
            </div>
            <div className="mo-axis" />
            <div className="contact-detail">
              <div className="cf-label">Email us</div>
              <a href={`mailto:${CONTACT}`} className="contact-email">
                {CONTACT}
              </a>
            </div>
          </aside>
        </section>
      </div>

      <Footer />
    </>
  );
}
