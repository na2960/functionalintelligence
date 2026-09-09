import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import About from "@/components/About";

export const metadata = {
  title: "About — Functional Intelligence",
  description: "About Functional Intelligence — coming soon.",
};

export default function AboutPage() {
  return (
    <>
      <Nav active="about" />
      <About />
      <Footer />
    </>
  );
}
