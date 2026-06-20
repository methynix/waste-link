import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Roles from "@/components/Roles";
import HowItWorks from "@/components/HowItWorks";
import Market from "@/components/Market";
import Trust from "@/components/Trust";
import AppBand from "@/components/AppBand";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Roles />
        <HowItWorks />
        <Market />
        <Trust />
        <AppBand />
      </main>
      <Footer />
    </>
  );
}
