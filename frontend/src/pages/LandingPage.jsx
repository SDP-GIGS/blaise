import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ModulesSection from '../components/ModulesSection';
import RolesSection from '../components/RolesSection';
import WeeklyBreakdown from '../components/WeeklyBreakdown';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-gold/30">
      <Navbar />
      <HeroSection />
      <ModulesSection />
      <RolesSection />
      <WeeklyBreakdown />
      <Footer />
    </div>
  );
};

export default LandingPage;