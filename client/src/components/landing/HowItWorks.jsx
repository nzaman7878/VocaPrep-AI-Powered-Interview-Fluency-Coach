import { Card, CardContent } from '../ui/Card';
import { UserCircle, Mic, TrendingUp } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Choose your role',
      description: 'Select your target position. Our AI curates behavioral and technical questions specific to your desired role.',
      icon: UserCircle,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      number: '02',
      title: 'Answer naturally',
      description: 'Speak your answers aloud just like in a real interview. Our system accurately transcribes your audio and maps your delivery.',
      icon: Mic,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
    {
      number: '03',
      title: 'Get instant coaching',
      description: 'Receive immediate, actionable feedback on both what you said and how you said it to rapidly improve your skills.',
      icon: TrendingUp,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative z-10 bg-background/50 border-y border-surface-elevated">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-24">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            How it Works
          </h2>
          <p className="text-text-muted text-lg">
            Three simple steps to interview mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
          {/* Connector Line (visible on desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-primary/10 via-secondary/30 to-accent/10 -translate-y-1/2 z-0" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative z-10 flex flex-col items-center transition-transform duration-500 hover:-translate-y-2">
                {/* Number Badge */}
                <div className={`w-16 h-16 rounded-full ${step.bg} ${step.color} border border-white/5 shadow-lg flex items-center justify-center mb-6 relative group overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="font-display font-bold text-2xl">{step.number}</span>
                </div>
                
                <Card className="w-full h-full bg-surface/50 backdrop-blur-sm border-white/5 hover:border-white/10 overflow-hidden text-center">
                  <CardContent className="p-8">
                    <div className="flex justify-center mb-4">
                      <Icon className={`w-8 h-8 ${step.color} opacity-80`} />
                    </div>
                    <h3 className="text-xl font-display font-bold mb-3">{step.title}</h3>
                    <p className="text-text-muted leading-relaxed">{step.description}</p>
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

export default HowItWorks;
