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
    <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-background/80 border-b border-surface-elevated">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo waveform motif */}
          <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary relative overflow-hidden">
            <div className="absolute inset-0 bg-waveform-motif opacity-50" />
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
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

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="h-4 w-px bg-surface-elevated hidden sm:block" />
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="text-sm font-medium text-text-primary hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/role-selection"
                className="text-sm font-medium text-text-primary hover:text-primary transition-colors"
              >
                Start Interview
              </Link>
              <div className="h-4 w-px bg-surface-elevated" />
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-text-muted hidden sm:inline-block">
                  {user?.name}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="hidden sm:inline-block">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="accent" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
