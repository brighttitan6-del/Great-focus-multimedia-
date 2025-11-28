import React from 'react';
import { COMPANY_INFO } from '../constants';
import { ViewState } from '../types';
import { MapPin, Phone, Mail, Facebook, Youtube, Video } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: ViewState) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-black text-gray-400 py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand */}
          <div>
            <h3 className="text-white font-heading font-bold text-xl mb-4">{COMPANY_INFO.name}</h3>
            <p className="mb-4 text-sm">{COMPANY_INFO.tagline}</p>
            <p className="text-sm leading-relaxed">
              Transforming creative ideas into powerful visual experiences that connect with people and drive results.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-brand-primary shrink-0" />
                <span>{COMPANY_INFO.location}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-brand-primary shrink-0" />
                <span>{COMPANY_INFO.phone} <br/> {COMPANY_INFO.phone2}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-brand-primary shrink-0" />
                <span>{COMPANY_INFO.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Links & Social */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Connect</h4>
            <div className="flex space-x-4 mb-6">
              <a href={COMPANY_INFO.socials.facebook} target="_blank" rel="noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={COMPANY_INFO.socials.youtube} target="_blank" rel="noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-red-600 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-pink-600 hover:text-white transition-colors">
                 <Video className="h-5 w-5" />
              </a>
            </div>
            <button 
              onClick={() => onNavigate(ViewState.ADMIN)}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Studio Login (Admin)
            </button>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Great Focus Multimedia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};