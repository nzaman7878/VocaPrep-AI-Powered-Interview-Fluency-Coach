import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { Mic } from 'lucide-react';

export const HeroSection = () => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[85vh] flex items-center overflow-hidden py-20"
    >
      {/* Dynamic Cursor Blob */}
      <div
        className="absolute w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none transition-all duration-300 ease-out"
        style={{
          left: `${mousePos.x}%`,
          top: `${mousePos.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
      />

      <div className="container mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Text */}
          <div className="flex flex-col items-start space-y-8">
            <div className="inline-flex items-center px-3 py-1 rounded-sm bg-surface-elevated border border-white/5 text-sm font-mono text-secondary shadow-sm">
              <span className="w-2 h-2 rounded-full bg-secondary mr-2 animate-pulse" />
              AI-Powered Interview Coach
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight tracking-tight text-text-primary">
              Master your next{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                tech interview.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-text-muted max-w-xl font-sans leading-relaxed">
              Get real-time feedback on your technical and behavioral responses. VocaPrep uses
              advanced AI to analyze your content, delivery, and pacing.
            </p>

            <div className="flex items-center gap-4 pt-4">
              <Link to="/register">
                <Button
                  variant="accent"
                  size="lg"
                  className="font-display font-bold px-8 shadow-lg shadow-accent/20 hover:shadow-accent/40"
                >
                  Start Coaching Free
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative h-[400px] w-full flex items-center justify-center animate-float hidden lg:flex">
            {/* Abstract Waveform Visual */}
            <div className="absolute inset-0 bg-waveform-motif rounded-3xl opacity-30" />

            <div className="relative w-64 h-64 bg-surface rounded-full flex items-center justify-center border border-white/10 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />

              <div className="flex items-center gap-2">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 bg-primary rounded-full animate-waveform"
                    style={{
                      height: `${30 + Math.random() * 70}%`,
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>

              {/* Central Mic Icon overlay */}
              <div className="absolute bg-background/50 backdrop-blur-md p-4 rounded-full border border-white/10">
                <Mic className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
