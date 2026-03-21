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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 shadow">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
            <BookOpen className="w-5 h-5 text-gold" />
          </div>
          <span className="text-xl font-bold font-serif text-gray-900 dark:text-white tracking-tight">
            ILES
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/login"
            className="px-5 py-2 rounded-lg text-sm font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2.5 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 text-blue-900 text-sm font-bold hover:opacity-90 transition-opacity shadow-lg"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-gray-900 dark:text-white"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white/90 dark:bg-gray-900/90 border-t border-gray-200 dark:border-gray-700 animate-fade-up">
          <div className="px-6 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white py-2"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white py-2"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 text-blue-900 text-sm font-bold text-center mt-2"
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
