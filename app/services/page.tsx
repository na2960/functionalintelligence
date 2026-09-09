import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FounderVoice from "@/components/FounderVoice";

export const metadata = {
  title: "Research Services — Functional Intelligence",
  description:
    "Custom physics-AI models for high-value prediction in markets and materials — calibrated, uncertainty-aware forecasts turned into auditable, economic decisions.",
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
