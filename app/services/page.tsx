import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FounderVoice from "@/components/FounderVoice";

export const metadata = {
  title: "Research Services — Functional Intelligence",
  description:
    "Well-researched, custom implementation blueprints for your data model or problem statement, based on state-of-the-art peer-reviewed literature. From $1,500/mo.",
};

export default function Services() {
  return (
    <>
      <Nav active="services" />
      <FounderVoice />
      <Footer />
    </>
  );
}
