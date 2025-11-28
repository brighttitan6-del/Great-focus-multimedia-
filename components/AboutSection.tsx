import React from 'react';
import { Target, Eye, Lightbulb, Star, Shield, Zap, Users, CheckCircle } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const coreValues = [
    { icon: <Lightbulb className="h-6 w-6" />, title: 'Creativity', desc: 'Thinking beyond limits.' },
    { icon: <Star className="h-6 w-6" />, title: 'Excellence', desc: 'Highest standards always.' },
    { icon: <Shield className="h-6 w-6" />, title: 'Integrity', desc: 'Honesty & transparency.' },
    { icon: <Zap className="h-6 w-6" />, title: 'Innovation', desc: 'Embracing new tech.' },
    { icon: <Users className="h-6 w-6" />, title: 'Teamwork', desc: 'Collaboration fuels success.' },
  ];

  const benefits = [
    "Professional and experienced creative team",
    "Modern equipment and advanced editing tools",
    "Timely project delivery",
    "Affordable and flexible pricing",
    "Client-centered approach"
  ];

  return (
    <div className="py-20 bg-gray-900 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">About Great Focus Media</h2>
          <p className="text-gray-300 leading-relaxed text-lg">
            Great Focus Media is a dynamic multimedia production company dedicated to delivering high-quality visual content that inspires, informs, and engages audiences. 
            We specialize in graphic design, video production, photography, motion graphics, and digital media solutions that bring ideas to life.
          </p>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-brand-dark p-8 rounded-2xl border border-brand-primary/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Eye className="h-32 w-32 text-brand-primary" />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-brand-primary/20 rounded-lg">
                <Eye className="h-6 w-6 text-brand-primary" />
              </div>
              <h3 className="text-2xl font-bold text-white">Our Vision</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              To be a leading multimedia company in Africa and beyond—transforming creative ideas into powerful visual experiences that connect with people and drive results.
            </p>
          </div>

          <div className="bg-brand-dark p-8 rounded-2xl border border-brand-accent/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Target className="h-32 w-32 text-brand-accent" />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-brand-accent/20 rounded-lg">
                <Target className="h-6 w-6 text-brand-accent" />
              </div>
              <h3 className="text-2xl font-bold text-white">Our Mission</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              To empower businesses and individuals through creative storytelling, cutting-edge technology, and exceptional design, producing world-class media content that stands out in every platform.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Our Core Values</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {coreValues.map((val, idx) => (
              <div key={idx} className="bg-white/5 p-6 rounded-xl text-center hover:bg-white/10 transition-colors">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/10 text-brand-accent mb-4">
                  {val.icon}
                </div>
                <h4 className="text-white font-bold mb-1">{val.title}</h4>
                <p className="text-gray-400 text-xs">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gradient-to-r from-brand-primary/10 to-brand-dark rounded-3xl p-8 md:p-12 border border-white/10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h3 className="text-3xl font-heading font-bold text-white mb-6">Why Choose Us?</h3>
              <div className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-brand-primary shrink-0" />
                    <span className="text-gray-200">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 gap-4">
                 <img src="https://picsum.photos/400/300?random=50" className="rounded-xl w-full h-32 object-cover opacity-80" alt="Team working" />
                 <img src="https://picsum.photos/400/300?random=51" className="rounded-xl w-full h-32 object-cover opacity-80 translate-y-4" alt="Camera equipment" />
                 <img src="https://picsum.photos/400/300?random=52" className="rounded-xl w-full h-32 object-cover opacity-80" alt="Editing suite" />
                 <img src="https://picsum.photos/400/300?random=53" className="rounded-xl w-full h-32 object-cover opacity-80 translate-y-4" alt="Drone shot" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};