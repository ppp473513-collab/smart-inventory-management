import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Stats from "../components/Stats";
import DashboardPreview from "../components/DashboardPreview";
import WhyChooseUs from "../components/WhyChooseUs";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <DashboardPreview />
      <WhyChooseUs />
      <CTA />
      <Footer />
    </>
  );
}

export default Home;