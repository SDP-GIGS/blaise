import { ArrowDown, GraduationCap, Users, ClipboardCheck } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { icon: GraduationCap, label: "Students", value: "500+" },
  { icon: Users, label: "Supervisors", value: "120+" },
  { icon: ClipboardCheck, label: "Evaluations", value: "2,400+" },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy/80" />
      </div>

      {/* Decorative orbs */}
      <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-gold/10 blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-gold/5 blur-3xl animate-float" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-16">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/10 mb-8 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="text-gold text-sm font-medium">
            Internship Logging & Evaluation System
          </span>
        </div>

        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-gold-light leading-tight mb-6 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.25s" }}
        >
          Track. Evaluate.{" "}
          <span className="text-gradient-gold">Excel.</span>
        </h1>

        <p
          className="text-lg sm:text-xl text-gold/60 max-w-2xl mx-auto mb-10 leading-relaxed opacity-0 animate-fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          A comprehensive platform for managing internship placements, weekly
          logbooks, supervisor reviews, and academic evaluations — all in one
          place.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.55s" }}
        >
          <a
            href="/login"
            className="px-8 py-3.5 rounded-xl gradient-gold text-navy font-bold text-base hover:opacity-90 transition-opacity shadow-gold"
          >
            Get Started
          </a>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-3 gap-6 max-w-lg mx-auto opacity-0 animate-fade-up"
          style={{ animationDelay: "0.7s" }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="w-5 h-5 text-gold mx-auto mb-2" />
              <p className="text-2xl font-bold text-gold-light">{stat.value}</p>
              <p className="text-xs text-gold/50 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 animate-float">
          <ArrowDown className="w-5 h-5 text-gold/40 mx-auto" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
