import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ViewState, ServiceItem } from '../types';
import { Video, Camera, Palette, Activity, TrendingUp, Music, Loader2 } from 'lucide-react';

interface ServicesListProps {
  onNavigate: (view: ViewState) => void;
  onBookService: (serviceId: string) => void;
}

const getIcon = (name: string) => {
  switch (name) {
    case 'video': return <Video className="h-8 w-8" />;
    case 'camera': return <Camera className="h-8 w-8" />;
    case 'palette': return <Palette className="h-8 w-8" />;
    case 'activity': return <Activity className="h-8 w-8" />;
    case 'trending-up': return <TrendingUp className="h-8 w-8" />;
    case 'music': return <Music className="h-8 w-8" />;
    default: return <Video className="h-8 w-8" />;
  }
};

export const ServicesList: React.FC<ServicesListProps> = ({ onNavigate, onBookService }) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await api.getServices();
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch services", error);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  return (
    <div className="py-20 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Our Services</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">We offer a comprehensive range of production services designed to elevate your brand and capture your most important moments.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 text-brand-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 ease-out group cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-brand-primary/20 hover:border-brand-primary/30"
              >
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-brand-primary/20 group-hover:bg-brand-primary/0 transition-colors z-10" />
                  <img src={service.imageUrl || 'https://via.placeholder.com/400'} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="p-6">
                  <div className="w-12 h-12 bg-brand-primary/20 rounded-lg flex items-center justify-center text-brand-primary mb-4 transition-all duration-500 group-hover:bg-brand-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-primary/50">
                    <div className="transform transition-transform duration-500 ease-out group-hover:rotate-12 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                      {getIcon(service.iconName)}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">{service.description}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                    <span className="text-brand-accent font-bold">{service.priceStart}</span>
                    <button 
                      onClick={() => onBookService(service.id)}
                      className="text-sm text-white bg-white/10 hover:bg-brand-primary px-4 py-2 rounded-full transition-colors font-medium"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};