import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full bg-background border-t border-surface-elevated py-8 mt-auto z-20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-text-muted">
          <span className="font-display font-bold text-lg text-text-primary">VocaPrep</span>
          <span className="text-sm">© {new Date().getFullYear()}</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-text-muted">
          <Link to="/privacy" className="hover:text-text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-text-primary transition-colors">
            Terms of Service
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-text-primary transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
