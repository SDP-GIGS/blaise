import { BookOpen } from "lucide-react";

const Footer = () => {
  return (
    <footer className="gradient-hero py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-gold" />
            </div>
            <div>
              <span className="text-lg font-bold font-serif text-gold-light">
                ILES
              </span>
              <p className="text-xs text-gold/40">
                Internship Logging & Evaluation System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            {["Overview", "Roles", "Modules", "Curriculum"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-sm text-gold/40 hover:text-gold transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gold/10 text-center">
          <p className="text-xs text-gold/30">
            © {new Date().getFullYear()} ILES — Built for academic excellence.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
