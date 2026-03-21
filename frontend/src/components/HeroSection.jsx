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
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80"
          alt="Internship background"
          className="w-full h-full object-cover opacity-60 scale-105 blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-950/80 to-yellow-900/60 dark:from-blue-950/90 dark:to-yellow-900/80" />
      </div>
      <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-yellow-200/30 blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-yellow-100/20 blur-3xl animate-float" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-28 pb-20">
        <div
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-yellow-400/40 bg-white/60 dark:bg-yellow-900/30 shadow-lg backdrop-blur-md mb-8 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="text-base font-semibold text-yellow-700 dark:text-yellow-200 tracking-wide">
            A comprehensive platform for managing internship placements, weekly
            logbooks, supervisor reviews, and academic evaluations — all in one
            place.
          </span>
        </div>

        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-serif font-extrabold text-yellow-700 dark:text-yellow-200 leading-tight mb-6 drop-shadow-xl opacity-0 animate-fade-up"
          style={{ animationDelay: "0.25s" }}
        >
          Track. Evaluate.{" "}
          <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent animate-gradient-x">
            Excel.
          </span>
        </h1>
        <p
          className="text-lg sm:text-xl text-yellow-800/70 dark:text-yellow-200/70 max-w-2xl mx-auto mb-10 leading-relaxed opacity-0 animate-fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          Empowering students, supervisors, and administrators with seamless
          digital internship management.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.55s" }}
        >
          <a
            href="/login"
            className="px-10 py-4 rounded-2xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-blue-900 font-extrabold text-lg shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-300 animate-pulse"
          >
            Get Started
          </a>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto mb-8 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.7s" }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="rounded-xl bg-white/70 dark:bg-yellow-900/30 shadow-lg p-6 flex flex-col items-center backdrop-blur-md hover:scale-105 hover:shadow-2xl transition-all duration-300"
              style={{ animationDelay: `${0.7 + i * 0.1}s` }}
            >
              <stat.icon className="w-8 h-8 text-yellow-600 dark:text-yellow-300 mb-2" />
              <p className="text-3xl font-extrabold text-yellow-700 dark:text-yellow-200 drop-shadow">
                {stat.value}
              </p>
              <p className="text-sm text-yellow-700/60 dark:text-yellow-200/60 mt-1 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 animate-float">
          <ArrowDown className="w-7 h-7 text-yellow-700/40 dark:text-yellow-200/40 mx-auto animate-bounce" />
        </div>
      </div>
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
