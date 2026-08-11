import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import api from '../api/axiosConfig'; // fallback to standard axios if api auth config missing
import { useSelector } from 'react-redux';
import Badge from '../components/ui/Badge';

const PRICING_PLANS = [
  {
    id: 'price_mock_1_month',
    name: '1 Month Pass',
    price: '$9',
    duration: 'per month',
    description: 'Perfect for upcoming interviews.',
    features: [
      'Unlimited AI Interviews',
      'Advanced feedback and scoring',
      'All roles and scenarios',
      'Audio transcription included',
    ],
    recommended: false,
  },
  {
    id: 'price_mock_6_month',
    name: '6 Month Pro',
    price: '$39',
    duration: 'every 6 months',
    description: 'Best for active job seekers.',
    features: [
      'Unlimited AI Interviews',
      'Advanced feedback and scoring',
      'All roles and scenarios',
      'Audio transcription included',
      'Priority processing',
    ],
    recommended: true,
  },
  {
    id: 'price_mock_12_month',
    name: '12 Month Elite',
    price: '$69',
    duration: 'per year',
    description: 'Long-term fluency and career prep.',
    features: [
      'Unlimited AI Interviews',
      'Advanced feedback and scoring',
      'All roles and scenarios',
      'Audio transcription included',
      'Priority processing',
      'Early access to new features',
    ],
    recommended: false,
  },
];

const PricingPage = () => {
  useDocumentTitle('Pricing - VocaPrep');
  const [loadingPriceId, setLoadingPriceId] = useState(null);
  const [error, setError] = useState('');
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubscribe = async (priceId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setLoadingPriceId(priceId);
      setError('');
      const response = await api.post('/stripe/create-checkout-session', { priceId });
      
      if (response.data.success && response.data.data.url) {
        window.location.href = response.data.data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoadingPriceId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl">
            Upgrade Your Interview Prep
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            You've reached the limit of the free tier. Unlock unlimited AI interviews, detailed feedback, and realistic roleplay scenarios to land your dream job.
          </p>
          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
              {error}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col p-8 rounded-2xl border ${
                plan.recommended
                  ? 'border-primary shadow-xl bg-card scale-105 z-10'
                  : 'border-border shadow-sm bg-card'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <Badge variant="primary" className="text-sm px-3 py-1 uppercase tracking-wide">
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                <p className="mt-2 text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-5xl font-extrabold text-foreground">{plan.price}</span>
                <span className="text-lg text-muted-foreground ml-2">{plan.duration}</span>
              </div>

              <ul className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-foreground">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mr-3" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loadingPriceId !== null}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all flex items-center justify-center ${
                  plan.recommended
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {loadingPriceId === plan.id ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  'Subscribe Now'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
