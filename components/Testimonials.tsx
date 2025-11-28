import React from 'react';
import { TESTIMONIALS } from '../constants';
import { Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <div className="py-20 bg-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">What Our Clients Say</h2>
          <div className="w-24 h-1 bg-brand-primary mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial) => (
            <div key={testimonial.id} className="bg-white/5 p-8 rounded-2xl border border-white/10 relative hover:bg-white/10 transition-colors">
              <Quote className="absolute top-6 right-6 text-brand-primary/20 h-10 w-10 rotate-180" />
              
              <div className="flex items-center mb-6">
                <img 
                  src={testimonial.avatarUrl} 
                  alt={testimonial.name} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-brand-primary"
                />
                <div className="ml-4">
                  <h4 className="text-white font-bold">{testimonial.name}</h4>
                  <p className="text-brand-accent text-xs uppercase tracking-wide">{testimonial.role}</p>
                </div>
              </div>
              
              <p className="text-gray-300 italic leading-relaxed">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};