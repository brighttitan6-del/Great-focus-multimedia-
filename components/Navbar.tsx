

import React, { useState } from 'react';
import { ViewState, User } from '../types';
import { Menu, X, Camera, LogOut, Settings, Facebook, Youtube, Video } from 'lucide-react';
import { COMPANY_INFO } from '../constants';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  user: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navItems = [
    { label: 'Home', view: ViewState.HOME },
    { label: 'Services', view: ViewState.SERVICES },
    { label: 'Portfolio', view: ViewState.PORTFOLIO },
    { label: 'AI Consult', view: ViewState.AI_CONSULT },
    { label: 'Contact', view: ViewState.CONTACT },
  ];

  const handleNavClick = (view: ViewState) => {
    onNavigate(view);
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-brand-dark/95 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group" 
            onClick={() => handleNavClick(ViewState.HOME)}
          >
            <div className="bg-brand-primary p-2 rounded-lg group-hover:bg-brand-accent transition-colors">
              <Camera className="text-white h-6 w-6" />
            </div>
            <div className="ml-3">
              <h1 className="text-white font-heading font-bold text-lg leading-none">GREAT FOCUS</h1>
              <p className="text-gray-400 text-xs tracking-wider">MULTIMEDIA</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.view)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === item.view 
                    ? 'text-brand-accent' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Social Icons */}
            <div className="flex items-center space-x-3 px-3 border-l border-white/10 ml-2">
              <a href={COMPANY_INFO.socials.facebook} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href={COMPANY_INFO.socials.youtube} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-red-500 transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
              <a href={`https://${COMPANY_INFO.socials.tiktok}`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Video className="h-4 w-4" />
              </a>
            </div>

            {/* Auth Button */}
            {user ? (
              <div className="relative ml-2">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors border border-white/10"
                >
                  <img 
                    src={user.avatar || "https://ui-avatars.com/api/?name=User"} 
                    alt={user.name} 
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm font-medium text-white">{user.name.split(' ')[0]}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-2xl py-2 border border-white/10 animate-fade-in">
                     <div className="px-4 py-2 border-b border-white/10 mb-2">
                       <p className="text-white text-sm font-bold truncate">{user.name}</p>
                       <p className="text-gray-400 text-xs truncate">{user.email}</p>
                     </div>
                     {user.isAdmin && (
                        <button 
                          onClick={() => handleNavClick(ViewState.ADMIN)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-2"
                        >
                          <Settings className="h-4 w-4" /> Studio Admin
                        </button>
                     )}
                     <button 
                       onClick={() => handleNavClick(ViewState.BOOKING)}
                       className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                     >
                       My Dashboard
                     </button>
                     <button 
                       onClick={handleLogoutClick}
                       className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 flex items-center gap-2"
                     >
                       <LogOut className="h-4 w-4" /> Sign Out
                     </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => handleNavClick(ViewState.LOGIN)}
                className="ml-2 px-4 py-2 bg-brand-primary text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            {user && (
               <img 
                onClick={() => onNavigate(ViewState.BOOKING)} // Quick link to profile/bookings on mobile
                src={user.avatar || "https://ui-avatars.com/api/?name=User"} 
                alt={user.name} 
                className="w-8 h-8 rounded-full border border-brand-primary"
              />
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-brand-dark border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.view)}
                className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium ${
                  currentView === item.view
                    ? 'text-brand-accent bg-white/5'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Mobile Socials */}
            <div className="flex items-center space-x-6 px-3 py-3 border-t border-white/5 mt-2">
              <a href={COMPANY_INFO.socials.facebook} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={COMPANY_INFO.socials.youtube} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-red-500 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href={`https://${COMPANY_INFO.socials.tiktok}`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Video className="h-5 w-5" />
              </a>
            </div>

            {!user ? (
               <button
                onClick={() => handleNavClick(ViewState.LOGIN)}
                className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-white bg-brand-primary mt-2"
              >
                Sign In / Sign Up
              </button>
            ) : (
              <>
                 {user.isAdmin && (
                    <button
                      onClick={() => handleNavClick(ViewState.ADMIN)}
                      className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-gray-300 hover:text-white"
                    >
                      Admin Dashboard
                    </button>
                 )}
                 <button
                  onClick={handleLogoutClick}
                  className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-red-400"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};