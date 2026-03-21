import { BookOpen } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-950 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <span className="text-lg font-bold font-serif text-yellow-700 dark:text-yellow-300">
                ILES
              </span>
              <p className="text-xs text-yellow-700/40 dark:text-yellow-300/40">
                Internship Logging & Evaluation System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            {["Overview", "Roles", "Modules", "Curriculum"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-sm text-yellow-700/40 dark:text-yellow-300/40 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-yellow-200 dark:border-yellow-900/30 text-center">
          <p className="text-xs text-yellow-700/30 dark:text-yellow-300/30">
            © {new Date().getFullYear()} ILES — Built for academic excellence.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
