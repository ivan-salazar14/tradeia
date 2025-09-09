import { useState, useEffect } from 'react';
import { Menu, X, LogIn, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.features'), path: '/features' },
    { name: t('nav.strategies'), path: '/strategies' },
    { name: t('nav.education'), path: '/education' },
    { name: t('nav.docs'), path: '/docs' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-sm shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-white font-bold text-xl">TP</span>
            </div>
            <span className={`text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent`}>
              TradeIA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                  isActive(link.path)
                    ? 'text-primary-600 bg-primary-50'
                    : isScrolled
                    ? 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    : 'text-white hover:text-primary-200 hover:bg-white/10'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="flex items-center ml-2 space-x-2">
              <LanguageSwitcher />
              <button
                onClick={() => window.location.href = '/login'}
                className="flex items-center px-4 py-2 text-sm font-medium text-primary-600 bg-white border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <LogIn size={16} className="mr-2" />
                {t('hero.buttons.login')}
              </button>
              <button
                onClick={() => window.location.href = '/register'}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <User size={16} className="mr-2" />
                {t('hero.buttons.signup')}
              </button>
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md md:hidden focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded="false"
          >
            <span className="sr-only">Abrir menú principal</span>
            {isMenuOpen ? (
              <X className="block h-6 w-6 text-gray-700" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6 text-gray-700" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="px-2 pt-2 pb-4 space-y-1 bg-white shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(link.path)
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => window.location.href = '/login'}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-primary-600 bg-white border border-primary-200 rounded-lg hover:bg-primary-50"
            >
              <LogIn size={16} className="mr-2" />
              {t('hero.buttons.login')}
            </button>
            <button
              onClick={() => window.location.href = '/register'}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
            >
              <User size={16} className="mr-2" />
              {t('hero.buttons.signup')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;