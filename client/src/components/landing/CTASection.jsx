import { Link } from 'react-router-dom';
import Button from '../ui/Button';

export const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-waveform-motif opacity-20 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto bg-surface-elevated border border-white/10 rounded-2xl p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />

          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-white">
            Ready to ace your next interview?
          </h2>

          <p className="text-lg text-text-muted mb-10 max-w-xl mx-auto">
            Join thousands of candidates who transformed their communication skills and landed roles
            at top tech companies.
          </p>

          <Link to="/register">
            <Button
              variant="accent"
              size="lg"
              className="font-display font-bold px-10 py-4 text-lg shadow-lg shadow-accent/20 hover:shadow-accent/40"
            >
              Start Your Free Session
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
