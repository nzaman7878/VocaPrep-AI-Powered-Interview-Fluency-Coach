import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full bg-surface/50 backdrop-blur-xl border-t border-surface-elevated py-10 mt-auto z-20 transition-all duration-300">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3 text-text-muted">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-display font-bold text-xl text-text-primary group-hover:text-primary transition-colors">VocaPrep</span>
          </Link>
          <span className="w-1 h-1 rounded-full bg-surface-elevated" />
          <span className="text-sm font-medium">© {new Date().getFullYear()}</span>
        </div>

        <div className="flex items-center gap-8 text-sm font-medium text-text-muted">
          <Link to="/privacy" className="hover:text-primary transition-colors relative group py-1">
            Privacy Policy
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full rounded-full" />
          </Link>
          <Link to="/terms" className="hover:text-primary transition-colors relative group py-1">
            Terms of Service
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full rounded-full" />
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition-colors relative group py-1"
          >
            GitHub
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full rounded-full" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
