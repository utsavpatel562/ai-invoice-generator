import Features from "../../components/landing/Features";
import Headers from "../../components/landing/Headers";
import Hero from "../../components/landing/Hero";

const LandingPage = () => {
  return (
    <div className="bg-white text-gray-600">
      <Headers />
      <main className="mb-[100vh]">
        <Hero />
        <Features />
      </main>
    </div>
  );
};

export default LandingPage;
