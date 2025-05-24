import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AcademicCapIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { useFavorites } from "../hooks/useFavorites";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getFavoritesCount } = useFavorites();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <AcademicCapIcon className="h-8 w-8" />
          <span className="truncate">Türkiye Üniversiteleri</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex gap-6">
            <li>
              <Link to="/" className="hover:text-blue-200 transition-colors">
                Ana Sayfa
              </Link>
            </li>
            <li>
              <Link
                to="/universities"
                className="hover:text-blue-200 transition-colors"
              >
                Üniversiteler
              </Link>
            </li>
            <li>
              <Link
                to="/search"
                className="hover:text-blue-200 transition-colors"
              >
                Arama
              </Link>
            </li>
            <li>
              <Link
                to="/enhanced-search"
                className="hover:text-blue-200 transition-colors"
              >
                Gelişmiş Arama
              </Link>
            </li>
            <li>
              <Link
                to="/favorites"
                className="hover:text-blue-200 transition-colors flex items-center gap-1"
              >
                <HeartIcon className="w-4 h-4" />
                Favoriler
                {getFavoritesCount() > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center">
                    {getFavoritesCount()}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-800 py-2">
          <nav className="container mx-auto px-4">
            <ul className="flex flex-col gap-4 py-2">
              <li>
                <Link
                  to="/"
                  className="block py-2 hover:text-blue-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link
                  to="/universities"
                  className="block py-2 hover:text-blue-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Üniversiteler
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="block py-2 hover:text-blue-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Arama
                </Link>
              </li>
              <li>
                <Link
                  to="/enhanced-search"
                  className="block py-2 hover:text-blue-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Gelişmiş Arama
                </Link>
              </li>
              <li>
                <Link
                  to="/favorites"
                  className="flex items-center gap-1 py-2 hover:text-blue-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <HeartIcon className="w-4 h-4" />
                  Favoriler
                  {getFavoritesCount() > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center">
                      {getFavoritesCount()}
                    </span>
                  )}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
