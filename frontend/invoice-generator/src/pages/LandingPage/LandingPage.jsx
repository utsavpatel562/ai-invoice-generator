import Faqs from "../../components/landing/Faqs";
import Features from "../../components/landing/Features";
import Footer from "../../components/landing/Footer";
import Headers from "../../components/landing/Headers";
import Hero from "../../components/landing/Hero";
import Testimonials from "../../components/landing/Testimonials";

const LandingPage = () => {
  return (
    <div className="bg-white text-gray-600">
      <Headers />
      <main className="">
        <Hero />
        <Features />
        <Testimonials />
        <Faqs />
        <Footer />
      </main>
    </div>
  );
};

export default LandingPage;
