import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../store/slices/authSlice.js';
import { Mail, Lock, User, Briefcase, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { ROLES } from '../../../../shared/roles.js';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    targetRole: ROLES[0].id,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(register(formData));
    if (register.fulfilled.match(resultAction)) {
      navigate('/dashboard');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full max-w-md mx-auto overflow-hidden bg-white/70 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 transition-all duration-300 hover:shadow-indigo-500/10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-transparent">
          Create Account
        </h2>
        <p className="text-slate-500 mt-2 font-medium">
          Start practicing for your next big interview.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold flex items-center animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2 animate-pulse"></div>
          {typeof error === 'string' ? error : error[0]?.message || 'An error occurred'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 block">Full Name</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <User className="w-5 h-5" />
            </div>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none"
              placeholder="Jane Doe"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 block">Email Address</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 block">Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 block">Target Role</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <Briefcase className="w-5 h-5" />
            </div>
            <select
              name="targetRole"
              value={formData.targetRole}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none appearance-none"
            >
              {ROLES.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="relative w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden mt-2"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          <span className="flex items-center justify-center relative">
            {status === 'loading' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </span>
        </button>
      </form>

      <p className="mt-8 text-center text-sm font-medium text-slate-600">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-indigo-600 hover:text-indigo-700 font-semibold underline decoration-2 decoration-indigo-200 hover:decoration-indigo-600 underline-offset-4 transition-all"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
