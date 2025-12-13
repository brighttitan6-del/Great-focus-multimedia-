
import React from 'react';
import { ViewState } from '../types';
import { ArrowRight, Play, Phone } from 'lucide-react';

interface HeroProps {
  onNavigate: (view: ViewState) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <div className="relative overflow-hidden bg-brand-dark min-h-[600px] flex items-center">
      {/* Background Gradient/Image Placeholder */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-dark/95 to-brand-primary/20" />
        <img 
          src="https://picsum.photos/1920/1080?grayscale&blur=2" 
          alt="Studio background" 
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center md:text-left">
        <div className="md:w-2/3">
          <div className="inline-block px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 mb-6">
            <span className="text-brand-accent text-sm font-semibold tracking-wide uppercase">Multimedia Excellence</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white leading-tight mb-6">
            Your Story. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">
              Beautifully Told.
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto md:mx-0 font-light">
            Wedding films, corporate ads, motion graphics, and graphic design crafted by a premier creative studio serving clients worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start flex-wrap">
            <button 
              onClick={() => onNavigate(ViewState.BOOKING)}
              className="px-8 py-4 bg-brand-primary hover:bg-blue-600 text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              Book a Consultation
              <ArrowRight className="h-5 w-5" />
            </button>
            <a 
              href="tel:+265883526602"
              className="px-8 py-4 bg-brand-accent hover:bg-amber-600 text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-amber-500/25 flex items-center justify-center gap-2"
            >
              Book a Quick Call
              <Phone className="h-5 w-5" />
            </a>
            <button 
              onClick={() => onNavigate(ViewState.PORTFOLIO)}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg font-bold transition-all backdrop-blur-sm flex items-center justify-center gap-2"
            >
              View Portfolio
              <Play className="h-5 w-5 fill-current" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
