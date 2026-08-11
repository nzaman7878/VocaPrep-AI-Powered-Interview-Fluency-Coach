import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';
import { Menu, X, User, LayoutDashboard, LogOut, ChevronDown, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserDropdown = ({ user, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-surface-elevated/50 px-2 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20 shadow-sm">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-56 glass-panel shadow-premium border border-surface-elevated rounded-xl overflow-hidden py-1 z-50 origin-top-right"
          >
            <div className="px-4 py-3 border-b border-surface-elevated mb-1 bg-surface-elevated/30">
              <p className="text-sm font-semibold text-text-primary truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-text-muted truncate">{user?.email || ''}</p>
            </div>
            
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Compute authentication state locally
  const isAuthenticated = !!user || !!localStorage.getItem('accessToken');

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleScrollTo = (e, href, id) => {
    if (href.startsWith('/#')) {
      if (window.location.pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', `/#${id}`);
        }
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = (e) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Clean up hash if present
      if (window.location.hash) {
        window.history.pushState(null, '', '/');
      }
    }
    setIsMobileMenuOpen(false);
  };

  // Handle scroll state for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: 'Features', href: '/#features', id: 'features' },
    { label: 'How it Works', href: '/#how-it-works', id: 'how-it-works' },
    { label: 'Pricing', href: '/pricing', id: 'pricing' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-surface/80 dark:bg-background/80 backdrop-blur-xl border-b border-surface-elevated shadow-sm' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between relative">
        
        {/* Left: Logo */}
        <Link to="/" onClick={handleLogoClick} className="flex items-center gap-3 group z-10">
          {/* Logo motif */}
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary relative overflow-hidden transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-105">
            <div className="absolute inset-0 bg-waveform-motif opacity-50" />
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20M17 5v14M7 5v14M22 10v4M2 10v4" />
            </svg>
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-text-primary group-hover:text-primary transition-colors duration-300">
            Voca<span className="text-primary group-hover:text-secondary transition-colors duration-300">Prep</span>
          </span>
        </Link>

        {/* Center: Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={(e) => handleScrollTo(e, link.href, link.id)}
              className="text-sm font-semibold text-text-muted hover:text-text-primary transition-colors relative group py-2"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full" />
            </Link>
          ))}
        </nav>

        {/* Right: Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-6 z-10">
          <ThemeToggle />
          <div className="h-6 w-px bg-surface-elevated" />
          
          {isAuthenticated ? (
            <div className="flex items-center gap-6">
              <Link to="/role-selection">
                <Button variant="primary" size="sm" className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center gap-2 rounded-full px-5">
                  <Mic className="w-4 h-4" />
                  <span>Practice Now</span>
                </Button>
              </Link>
              <div className="h-6 w-px bg-surface-elevated" />
              <UserDropdown user={user} handleLogout={handleLogout} />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="font-semibold">
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all rounded-full px-6 font-semibold">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -mr-2 text-text-secondary hover:text-text-primary hover:bg-surface-elevated rounded-lg transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden fixed top-20 left-0 w-full bg-surface/95 dark:bg-background/95 backdrop-blur-xl border-t border-surface-elevated overflow-y-auto"
            style={{ height: 'calc(100vh - 5rem)' }}
          >
            <div className="flex flex-col p-6 space-y-8">
              {/* Mobile Nav Links */}
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={(e) => handleScrollTo(e, link.href, link.id)}
                    className="text-lg font-semibold text-text-primary pb-4 border-b border-surface-elevated"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Actions */}
              <div className="flex flex-col space-y-4 pt-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 p-4 bg-surface-elevated/50 rounded-xl mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary">{user?.name || 'User'}</p>
                        <p className="text-sm text-text-muted">{user?.email || ''}</p>
                      </div>
                    </div>
                    
                    <Link to="/role-selection">
                      <Button variant="primary" size="lg" className="w-full flex items-center justify-center gap-2 rounded-xl">
                        <Mic className="w-5 h-5" />
                        <span>Practice Now</span>
                      </Button>
                    </Link>
                    <Link to="/dashboard">
                      <Button variant="outline" size="lg" className="w-full rounded-xl">
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="ghost" size="lg" onClick={handleLogout} className="w-full text-red-500 hover:bg-red-500/10 rounded-xl">
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/register">
                      <Button variant="primary" size="lg" className="w-full rounded-xl">
                        Get Started Free
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline" size="lg" className="w-full rounded-xl">
                        Log In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
