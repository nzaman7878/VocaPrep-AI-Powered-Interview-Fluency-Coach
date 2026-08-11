import { useDispatch, useSelector } from 'react-redux';
import { googleLogin } from '../../store/slices/authSlice.js';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const handleSuccess = async (credentialResponse) => {
    const resultAction = await dispatch(googleLogin(credentialResponse.credential));
    if (googleLogin.fulfilled.match(resultAction)) {
      navigate('/dashboard');
    }
  };

  const handleError = () => {
    console.error('Google Login Failed');
  };

  return (
    <div className="w-full mx-auto overflow-hidden bg-surface/40 backdrop-blur-2xl border border-surface-elevated/50 shadow-premium rounded-3xl p-8 md:p-10 transition-all duration-300 relative flex flex-col items-center">
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-80" />
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-text-primary">
          Welcome to VocaPrep
        </h2>
        <p className="text-text-muted mt-2 font-medium">Sign in to continue your interview prep.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-sm font-semibold flex items-center animate-in fade-in slide-in-from-top-2 duration-300 w-full">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2 animate-pulse"></div>
          {error}
        </div>
      )}

      <div className="flex flex-col items-center justify-center w-full py-4">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap
          theme="filled_black"
          shape="pill"
          size="large"
          text="continue_with"
        />
      </div>

      <p className="mt-8 text-center text-sm font-medium text-text-muted">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
