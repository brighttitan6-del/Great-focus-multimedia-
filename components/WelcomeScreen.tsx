import React from 'react';
import { Camera, UserPlus, LogIn } from 'lucide-react';
import { ViewState } from '../types';

interface WelcomeScreenProps {
  onNavigate: (view: ViewState) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden flex flex-col items-center justify-center p-6 text-center">
      
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/1080/1920?grayscale&blur=2" 
          alt="Studio Background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/80 via-brand-dark/90 to-brand-dark"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center animate-fade-in">
        
        {/* Logo Animation */}
        <div className="mb-8 relative group cursor-default">
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-blue-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-gray-900 ring-1 ring-white/10 p-6 rounded-2xl shadow-2xl">
            <Camera className="w-16 h-16 text-brand-primary" />
          </div>
        </div>

        {/* Text */}
        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-3 tracking-tight">
          GREAT FOCUS
        </h1>
        <p className="text-sm font-bold tracking-[0.3em] text-brand-primary uppercase mb-8">
          Multimedia Studio
        </p>
        <p className="text-gray-400 mb-12 leading-relaxed max-w-xs mx-auto">
          Create. Capture. Compel. <br/>
          Your professional story starts here.
        </p>

        {/* Buttons */}
        <div className="w-full space-y-4">
          <button 
            onClick={() => onNavigate(ViewState.LOGIN)}
            className="w-full group bg-brand-primary hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-3"
          >
            <LogIn className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Sign In
          </button>
          
          <button 
            onClick={() => onNavigate(ViewState.LOGIN)} 
            className="w-full group bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl border border-white/10 transition-all flex items-center justify-center gap-3 backdrop-blur-sm"
          >
            <UserPlus className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            Create Account
          </button>
        </div>

      </div>

      {/* Footer Note */}
      <div className="absolute bottom-6 z-10">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest">
          Est. 2024 • Lilongwe, Malawi
        </p>
      </div>
    </div>
  );
};