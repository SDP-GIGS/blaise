import { ArrowDown, GraduationCap, Users, ClipboardCheck } from "lucide-react";

const stats = [
  { icon: GraduationCap, label: "Students", value: "500+" },
  { icon: Users, label: "Supervisors", value: "120+" },
  { icon: ClipboardCheck, label: "Evaluations", value: "2,400+" },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-950">
      {/* Background */}
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80" alt="" className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-blue-900/80 dark:bg-blue-950/80" />
      </div>
      <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-yellow-200/20 blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-yellow-100/10 blur-3xl animate-float" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-16">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-400/30 bg-yellow-100/30 mb-8 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-yellow-700 dark:text-yellow-300 text-sm font-medium">
            Internship Logging & Evaluation System
          </span>
        </div>

        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-yellow-700 dark:text-yellow-300 leading-tight mb-6 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.25s" }}
        >
          Track. Evaluate.{" "}
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">Excel.</span>
        </h1>
        <p
          className="text-lg sm:text-xl text-yellow-700/60 dark:text-yellow-300/60 max-w-2xl mx-auto mb-10 leading-relaxed opacity-0 animate-fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          A comprehensive platform for managing internship placements, weekly
          logbooks, supervisor reviews, and academic evaluations  all in one
          place.
        </p>
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.55s" }}
        >
          <a
            href="/login"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 text-blue-900 font-bold text-base hover:opacity-90 transition-opacity shadow-lg"
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
              <stat.icon className="w-5 h-5 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stat.value}</p>
              <p className="text-xs text-yellow-700/50 dark:text-yellow-300/50 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 animate-float">
          <ArrowDown className="w-5 h-5 text-yellow-700/40 dark:text-yellow-300/40 mx-auto" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
