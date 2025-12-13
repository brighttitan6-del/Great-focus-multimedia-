
import React from 'react';
import { ViewState } from '../types';
import { Home, Layers, Image as ImageIcon, Calendar, Sparkles } from 'lucide-react';

interface MobileNavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { view: ViewState.HOME, label: 'Home', icon: Home },
    { view: ViewState.SERVICES, label: 'Services', icon: Layers },
    { view: ViewState.PORTFOLIO, label: 'Gallery', icon: ImageIcon },
    { view: ViewState.BOOKING, label: 'Book', icon: Calendar },
    { view: ViewState.AI_CONSULT, label: 'AI Tips', icon: Sparkles },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f172a]/95 backdrop-blur-xl border-t border-white/10 z-50 pb-safe">
      <div className="flex justify-around items-center h-16 px-1">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.view)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all active:scale-95 ${
                isActive ? 'text-brand-primary' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className={`p-1 rounded-full ${isActive ? 'bg-brand-primary/20' : ''}`}>
                <item.icon className={`h-5 w-5 ${isActive ? 'fill-current' : ''}`} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-brand-primary' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
