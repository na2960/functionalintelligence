import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FounderVoice from "@/components/FounderVoice";

export const metadata = {
  title: "Writing Services — Functional Intelligence",
  description:
    "Technical content, written in your voice and published under your name. Founder Voice retainers, from $1,500/mo. Our involvement stays private.",
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
