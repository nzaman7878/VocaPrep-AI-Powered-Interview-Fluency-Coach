import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/slices/authSlice.js';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../ui/Button';

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(login(formData));
    if (login.fulfilled.match(resultAction)) {
      navigate('/dashboard');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full mx-auto overflow-hidden bg-surface/40 backdrop-blur-2xl border border-surface-elevated/50 shadow-premium rounded-3xl p-8 md:p-10 transition-all duration-300 relative">
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-80" />
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-text-primary">
          Welcome Back
        </h2>
        <p className="text-text-muted mt-2 font-medium">Log in to continue your interview prep.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-sm font-semibold flex items-center animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2 animate-pulse"></div>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary block">Email Address</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3.5 bg-surface/50 backdrop-blur-sm border border-surface-elevated/80 rounded-xl text-text-primary placeholder:text-text-muted/50 focus:bg-surface focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 outline-none shadow-sm"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-text-primary block">Password</label>
            <Link
              to="#"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3.5 bg-surface/50 backdrop-blur-sm border border-surface-elevated/80 rounded-xl text-text-primary placeholder:text-text-muted/50 focus:bg-surface focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 outline-none shadow-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 group"
          isLoading={status === 'loading'}
          rightIcon={<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
        >
          Sign In
        </Button>
      </form>

      <p className="mt-8 text-center text-sm font-medium text-text-muted">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="text-primary hover:text-primary/80 font-semibold underline decoration-2 decoration-primary/30 hover:decoration-primary underline-offset-4 transition-all"
        >
          Create one now
        </Link>
      </p>
    </div>
  );
}
