import { Card, CardContent } from '../ui/Card';
import { MessageSquare, Zap, Target } from 'lucide-react';

export const FeatureCards = () => {
  const features = [
    {
      title: 'Content Analysis',
      description:
        'Get deep feedback on the substance of your answers. Ensure you hit key technical requirements and STAR method points.',
      icon: MessageSquare,
      color: 'text-primary',
      bg: 'bg-primary/10',
      offset: 'translate-y-0',
    },
    {
      title: 'Delivery Coaching',
      description:
        'Track filler words, speaking pace, and pauses. Improve your confidence and clarity with real-time acoustic analysis.',
      icon: Zap,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
      offset: 'lg:translate-y-12',
    },
    {
      title: 'Progress Tracking',
      description:
        'Monitor your improvement over time with detailed visual metrics, historical session comparisons, and streak tracking.',
      icon: Target,
      color: 'text-accent',
      bg: 'bg-accent/10',
      offset: 'translate-y-0',
    },
  ];

  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-24">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Everything you need to land the offer
          </h2>
          <p className="text-text-muted text-lg">
            A comprehensive suite of tools designed to transform your interview anxiety into
            structured confidence.
          </p>
        </div>

        {/* Interlocking Diagonal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto pb-12">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className={`transition-transform duration-500 hover:-translate-y-2 ${feature.offset}`}
              >
                <Card className="h-full bg-surface/50 backdrop-blur-sm border-white/5 hover:border-white/10 overflow-hidden group">
                  <CardContent className="p-8 flex flex-col h-full relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div
                      className={`w-12 h-12 rounded-lg ${feature.bg} ${feature.color} flex items-center justify-center mb-6`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl font-display font-bold mb-3">{feature.title}</h3>
                    <p className="text-text-muted leading-relaxed flex-1">{feature.description}</p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
