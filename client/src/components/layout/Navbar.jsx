import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';

export const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Compute authentication state locally instead of relying on non-existent slice property
  const isAuthenticated = !!user || !!localStorage.getItem('accessToken');

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleScrollTo = (e, id) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `/#${id}`);
      }
    }
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl transition-all duration-300">
      <div className="glass-panel h-16 rounded-2xl md:rounded-full px-6 flex items-center justify-between shadow-premium">
        
        {/* Left: Logo & Main Nav */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            {/* Logo waveform motif */}
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary relative overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-waveform-motif opacity-50" />
              <svg
                width="16"
                height="16"
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
            <Link to="/" className="font-display font-bold text-xl tracking-tight text-text-primary">
              Voca<span className="text-primary">Prep</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/#features"
              onClick={(e) => handleScrollTo(e, 'features')}
              className="text-sm font-semibold text-text-muted hover:text-text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              to="/#how-it-works"
              onClick={(e) => handleScrollTo(e, 'how-it-works')}
              className="text-sm font-semibold text-text-muted hover:text-text-primary transition-colors"
            >
              How it Works
            </Link>
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="h-5 w-px bg-surface-elevated hidden sm:block" />
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="text-sm font-semibold text-text-primary hover:text-primary transition-colors hidden sm:block"
              >
                Dashboard
              </Link>
              <Link
                to="/role-selection"
                className="text-sm font-semibold text-text-primary hover:text-primary transition-colors hidden sm:block"
              >
                Start Interview
              </Link>
              <div className="h-5 w-px bg-surface-elevated hidden sm:block" />
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded-full hidden lg:inline-block">
                  {user?.name || 'User'}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-full">
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="hidden sm:inline-block">
                <Button variant="ghost" size="sm" className="rounded-full">
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="accent" size="sm" className="rounded-full shadow-lg shadow-accent/20">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
