
import React from 'react';
import { TESTIMONIALS } from '../constants';
import { Quote, Star } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <div className="py-24 bg-gray-900 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-20 left-10 w-64 h-64 bg-brand-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl"></div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
           <span className="text-brand-accent font-bold tracking-widest uppercase text-xs mb-2 block">Client Success Stories</span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">Loved by Locals & Brands</h2>
          <div className="w-24 h-1 bg-brand-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, idx) => (
            <div 
                key={testimonial.id} 
                className="group bg-white/5 p-8 rounded-3xl border border-white/5 relative hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-primary/10 animate-fade-in"
                style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="absolute -top-4 -right-4 bg-brand-dark p-3 rounded-full border border-white/10 group-hover:border-brand-primary/50 transition-colors shadow-xl">
                  <Quote className="text-brand-primary h-6 w-6" />
              </div>
              
              <div className="flex gap-1 mb-6">
                 {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-brand-accent fill-brand-accent" />
                 ))}
              </div>

              <p className="text-gray-300 italic leading-relaxed mb-8 relative z-10">
                "{testimonial.quote}"
              </p>
              
              <div className="flex items-center mt-auto border-t border-white/5 pt-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-brand-primary rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
                    <img 
                      src={testimonial.avatarUrl} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/10 relative z-10"
                    />
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-bold text-sm group-hover:text-brand-primary transition-colors">{testimonial.name}</h4>
                  <p className="text-gray-500 text-xs uppercase tracking-wide font-medium">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Trust Indicators / Stat bar */}
        <div className="mt-20 pt-10 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="p-4">
                <h4 className="text-3xl font-heading font-bold text-white mb-1">50+</h4>
                <p className="text-gray-500 text-xs uppercase tracking-wider">Weddings Captured</p>
            </div>
            <div className="p-4">
                <h4 className="text-3xl font-heading font-bold text-white mb-1">100%</h4>
                <p className="text-gray-500 text-xs uppercase tracking-wider">Client Satisfaction</p>
            </div>
            <div className="p-4">
                <h4 className="text-3xl font-heading font-bold text-white mb-1">30+</h4>
                <p className="text-gray-500 text-xs uppercase tracking-wider">Corporate Brands</p>
            </div>
            <div className="p-4">
                <h4 className="text-3xl font-heading font-bold text-white mb-1">5yr</h4>
                <p className="text-gray-500 text-xs uppercase tracking-wider">Experience</p>
            </div>
        </div>
      </div>
    </div>
  );
};
