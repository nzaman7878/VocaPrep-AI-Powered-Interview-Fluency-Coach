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
    <header className="sticky top-0 z-50 w-full bg-surface/80 dark:bg-background/80 backdrop-blur-xl border-b border-surface-elevated transition-all duration-300">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Left: Logo & Main Nav */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-3 group">
            {/* Logo waveform motif */}
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary relative overflow-hidden transition-colors group-hover:bg-primary/20">
              <div className="absolute inset-0 bg-waveform-motif opacity-50" />
              <svg
                width="18"
                height="18"
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
            <span className="font-display font-bold text-2xl tracking-tight text-text-primary">
              Voca<span className="text-primary">Prep</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/#features"
              onClick={(e) => handleScrollTo(e, 'features')}
              className="text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              to="/#how-it-works"
              onClick={(e) => handleScrollTo(e, 'how-it-works')}
              className="text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
            >
              How it Works
            </Link>
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <div className="h-6 w-px bg-surface-elevated hidden sm:block" />
          
          {isAuthenticated ? (
            <div className="flex items-center gap-6">
              <Link
                to="/dashboard"
                className="text-sm font-medium text-text-primary hover:text-primary transition-colors hidden sm:block"
              >
                Dashboard
              </Link>
              <Link
                to="/role-selection"
                className="text-sm font-medium text-text-primary hover:text-primary transition-colors hidden sm:block"
              >
                Start Interview
              </Link>
              <div className="h-6 w-px bg-surface-elevated hidden sm:block" />
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-text-primary hidden lg:inline-block">
                  {user?.name || 'User'}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="hidden sm:inline-block">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" className="shadow-lg shadow-primary/20">
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
