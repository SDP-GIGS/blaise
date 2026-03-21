import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ModulesSection from "../components/ModulesSection";
import RolesSection from "../components/RolesSection";
import WeeklyBreakdown from "../components/WeeklyBreakdown";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <div
      className="min-h-screen bg-background text-foreground selection:bg-gold/30 scroll-smooth"
      style={{ scrollBehavior: "smooth" }}
    >
      <Navbar />
      <main>
        <section className="fade-in">
          <HeroSection />
        </section>
        <section className="mt-12 fade-in" id="modules">
          <ModulesSection />
        </section>
        <section className="mt-12 fade-in" id="roles">
          <RolesSection />
        </section>
        <section className="mt-12 fade-in" id="curriculum">
          <WeeklyBreakdown />
        </section>
      </main>
      <Footer />
      <style>{`
        html { scroll-behavior: smooth; }
        .fade-in {
          opacity: 0;
          transform: translateY(40px);
          animation: fadeInUp 0.8s ease forwards;
        }
        .fade-in:nth-child(1) { animation-delay: 0.1s; }
        .fade-in:nth-child(2) { animation-delay: 0.2s; }
        .fade-in:nth-child(3) { animation-delay: 0.3s; }
        .fade-in:nth-child(4) { animation-delay: 0.4s; }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
