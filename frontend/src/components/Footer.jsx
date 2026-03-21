import { BookOpen } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-yellow-50/80 via-white/60 to-yellow-100/90 dark:from-yellow-900/90 dark:via-yellow-900/60 dark:to-yellow-950/80 py-20 px-6 shadow-2xl backdrop-blur-xl border-t border-yellow-100/40 dark:border-yellow-900/40 overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300">
              <BookOpen className="w-6 h-6 text-blue-900 group-hover:text-yellow-100 transition-colors duration-300" />
            </div>
            <div>
              <span className="text-2xl font-extrabold font-serif text-yellow-700 dark:text-yellow-100 tracking-tight drop-shadow group-hover:text-yellow-600 transition-colors duration-300">
                ILES
              </span>
              <p className="text-sm text-yellow-700/50 dark:text-yellow-200/50 font-medium">
                Internship Logging & Evaluation System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-10">
            {["Overview", "Roles", "Modules", "Curriculum"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-base font-semibold text-yellow-700/60 dark:text-yellow-200/60 hover:text-yellow-600 dark:hover:text-yellow-400 px-3 py-2 rounded-lg hover:bg-yellow-100/40 dark:hover:bg-yellow-900/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-yellow-200/60 dark:border-yellow-900/60 text-center">
          <p className="text-sm text-yellow-700/40 dark:text-yellow-200/40 font-medium tracking-wide">
            © {new Date().getFullYear()} ILES — Built for academic excellence.
          </p>
        </div>
      </div>
      {/* Decorative blurred circles */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-yellow-200/30 blur-3xl animate-pulse-slow z-0" />
      <div className="absolute -bottom-24 right-10 w-96 h-96 rounded-full bg-yellow-100/20 blur-3xl animate-float z-0" />
    </footer>
  );
};

export default Footer;
