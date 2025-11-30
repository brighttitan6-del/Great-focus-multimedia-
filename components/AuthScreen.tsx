
import React, { useState } from 'react';
import { User, ViewState } from '../types';
import { Mail, Lock, User as UserIcon, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

interface AuthScreenProps {
  onLogin: (user: User) => void;
  onNavigate: (view: ViewState) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onNavigate }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null); // Clear error on typing
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let user: User;
      if (isSignUp) {
        user = await api.register(formData);
      } else {
        user = await api.login({ email: formData.email, password: formData.password });
      }
      onLogin(user);
    } catch (err: any) {
      console.error(err);
      setError(err.message || (isSignUp ? 'Registration failed' : 'Login failed'));
      setIsLoading(false); // Stop loading only on error, success will unmount/redirect
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setError(null);
    // Simulate Google OAuth delay
    setTimeout(() => {
      setIsLoading(false);
      const mockGoogleUser: User = {
        id: 'g-' + Math.random().toString(36).substr(2, 9),
        name: 'Google User',
        email: 'user@gmail.com',
        avatar: 'https://randomuser.me/api/portraits/men/46.jpg'
      };
      onLogin(mockGoogleUser);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button 
          onClick={() => onNavigate(ViewState.HOME)}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </button>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading font-bold text-white mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-400">
              {isSignUp ? 'Join Great Focus Multimedia today.' : 'Sign in to manage your bookings.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-start gap-3 animate-fade-in">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Google Login Button */}
          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white text-gray-900 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors mb-6 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            <span>Sign {isSignUp ? 'up' : 'in'} with Google</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#0f172a] text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <div className="relative">
                <UserIcon className="absolute left-3 top-3.5 text-gray-500 h-5 w-5" />
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Full Name" 
                  className="w-full bg-black/30 border border-white/10 rounded-lg py-3 pl-10 text-white focus:border-brand-primary outline-none focus:ring-1 focus:ring-brand-primary transition-all"
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-500 h-5 w-5" />
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email Address" 
                className="w-full bg-black/30 border border-white/10 rounded-lg py-3 pl-10 text-white focus:border-brand-primary outline-none focus:ring-1 focus:ring-brand-primary transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-500 h-5 w-5" />
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password" 
                className="w-full bg-black/30 border border-white/10 rounded-lg py-3 pl-10 text-white focus:border-brand-primary outline-none focus:ring-1 focus:ring-brand-primary transition-all"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-brand-primary hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
              <button 
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setFormData({ name: '', email: '', password: '' });
                }}
                className="text-brand-accent hover:text-white font-medium ml-1"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
