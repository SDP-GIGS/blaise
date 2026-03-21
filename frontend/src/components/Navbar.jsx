import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, BookOpen } from "lucide-react";

const navLinks = [
  { label: "Overview", href: "#overview" },
  { label: "Roles", href: "#roles" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 dark:bg-gray-900/60 shadow-xl backdrop-blur-lg border-b border-yellow-100/40 dark:border-yellow-900/40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-300">
            <BookOpen className="w-6 h-6 text-blue-900 group-hover:text-yellow-100 transition-colors duration-300" />
          </div>
          <span className="text-2xl font-extrabold font-serif text-gray-900 dark:text-yellow-100 tracking-tight drop-shadow group-hover:text-yellow-600 transition-colors duration-300">
            ILES
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-base font-semibold text-gray-600 dark:text-yellow-200/80 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-yellow-100/40 dark:hover:bg-yellow-900/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/login"
            className="px-6 py-2 rounded-xl text-base font-bold text-gray-600 dark:text-yellow-200/80 hover:text-yellow-700 dark:hover:text-yellow-400 transition-colors duration-200 border border-yellow-200/60 dark:border-yellow-900/60 bg-white/40 dark:bg-yellow-900/20 shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-7 py-2.5 rounded-xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-blue-900 text-base font-extrabold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-300"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-3 rounded-xl bg-white/60 dark:bg-yellow-900/30 shadow-lg text-gray-900 dark:text-yellow-100 hover:bg-yellow-100/60 dark:hover:bg-yellow-900/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white/90 dark:bg-yellow-900/95 border-t border-yellow-200/40 dark:border-yellow-900/40 shadow-2xl animate-fade-up backdrop-blur-xl">
          <div className="px-8 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-lg font-bold text-gray-700 dark:text-yellow-200/90 hover:text-yellow-600 dark:hover:text-yellow-400 px-3 py-2 rounded-lg hover:bg-yellow-100/40 dark:hover:bg-yellow-900/30 transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="text-lg font-bold text-gray-700 dark:text-yellow-200/90 hover:text-yellow-700 dark:hover:text-yellow-400 px-3 py-2 rounded-lg hover:bg-yellow-100/40 dark:hover:bg-yellow-900/30 transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              className="px-7 py-3 rounded-xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-blue-900 text-lg font-extrabold text-center mt-2 shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
