import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import type { Lang } from "../pages/publicPages/landing/index";
import { Link } from "react-router-dom";
import { useUser } from "../context/useUser";

/**
 * Navbar component with navigation links, language selector, and responsive hamburger menu for mobile.
 * @param lang - The current selected language code.
 * @param setLang - Function to update the selected language.
 */
export const Navbar = ({
  lang,
  setLang,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useUser();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Find Care", href: "/find-care" },
    { label: "Education", href: "/health-education" },
    { label: "Support", href: "/contact" },
    !user
      ? { label: "Login", href: "/auth/login" }
      : user.role === "admin"
      ? { label: "Dashboard", href: "/admin" }
      : { label: "Dashboard", href: "/user" },
  ];

  // Language names for selector
  const languageNames: Record<Lang, string> = {
    en: "English",
    pidgin: "Pidgin",
    yoruba: "Yorùbá",
    igbo: "Ìgbò",
    hausa: "Hausa",
  };

  /**
   * Toggles the mobile menu open/close state.
   */
  const toggleMenu = () => setMenuOpen((open) => !open);

  return (
    <nav className="bg-white/10 backdrop-blur-md z-1000 rounded-2xl px-6 py-4 shadow-lg w-full flex flex-col lg:flex-row justify-between items-center gap-4 relative">
      <div className="flex w-full lg:w-auto justify-between items-center">
        <Link to={"/"}>
          <h1 className="text-white font-bold text-[20px]">NaijaCare</h1>
        </Link>
        <div className="lg:hidden relative">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            className="appearance-none bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 pr-8 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:bg-white/20"
          >
            {Object.entries(languageNames).map(([code, name]) => (
              <option key={code} value={code} className="text-gray-800">
                {name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
        </div>
        {/* Hamburger menu button for mobile */}
        <button
          className="lg:hidden p-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={toggleMenu}
        >
          {menuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>
      {/* Desktop Nav Items */}
      <ul className="hidden lg:flex flex-wrap justify-center items-center gap-6 text-white font-medium text-sm">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              to={item.href}
              className="hover:text-blue-300 transition-all duration-200 relative group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-300 transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </li>
        ))}
      </ul>
      {/* Mobile Nav Items (collapsible) */}
      {menuOpen && (
        <ul className="flex flex-col gap-4 text-white font-medium text-base absolute top-full left-0 w-full min-h-[200px] gradient-bg  rounded-b-2xl shadow-lg z-50 p-6 lg:hidden animate-fade-in">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className="block py-2 px-4 rounded hover:bg-blue-500/20 transition-colors duration-200"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Language Selector Dropdown */}
      <div className="hidden lg:block relative">
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as Lang)}
          className="appearance-none bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 pr-8 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:bg-white/20"
        >
          {Object.entries(languageNames).map(([code, name]) => (
            <option key={code} value={code} className="text-gray-800">
              {name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
      </div>
    </nav>
  );
};
