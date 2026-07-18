import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import About from "@/components/About";

export const metadata = {
  title: "About — Functional Intelligence",
  description:
    "Functional Intelligence is written and edited by Nripendra Acharya — clear, measurable frameworks for concepts that resist easy measurement.",
};

export default function AboutPage() {
  return (
    <>
      <Nav active="about" />
      <div className="frame">
        <About />
      </div>
      <Footer />
    </>
  );
}
