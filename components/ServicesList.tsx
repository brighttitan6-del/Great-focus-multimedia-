
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ViewState, ServiceItem } from '../types';
import { Video, Camera, Palette, Activity, TrendingUp, Music, Loader2, ChevronDown, ChevronUp, Clock, Check } from 'lucide-react';

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
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    // Prevent triggering if clicking a button inside
    if ((e.target as HTMLElement).closest('button')) return;
    setExpandedId(expandedId === id ? null : id);
  };

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
                onClick={(e) => toggleExpand(service.id, e)}
                className={`group bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 ease-out cursor-pointer shadow-lg 
                  ${expandedId === service.id 
                    ? 'ring-2 ring-brand-primary/50 bg-white/10 scale-[1.02] shadow-2xl shadow-brand-primary/10' 
                    : 'hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl hover:shadow-brand-primary/20 hover:border-brand-primary/50 hover:bg-white/10'
                  }`}
              >
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  <div className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 mix-blend-overlay" />
                  <img 
                    src={service.imageUrl || 'https://via.placeholder.com/400'} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute bottom-4 left-4 z-20">
                     <span className="bg-brand-primary px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg">
                       {service.category}
                     </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-brand-primary mb-4 transition-all duration-300 group-hover:bg-brand-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-primary/50 ring-1 ring-white/10 group-hover:ring-0">
                      <div className="transform transition-all duration-500 ease-out group-hover:rotate-12 group-hover:scale-110">
                        {getIcon(service.iconName)}
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-white transition-colors bg-white/5 p-1 rounded-full hover:bg-white/10">
                      {expandedId === service.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-primary transition-colors">{service.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">{service.description}</p>
                  
                  {/* Expanded Content: Packages */}
                  {expandedId === service.id && service.packages && (
                    <div className="mt-4 mb-4 space-y-3 animate-fade-in border-t border-white/10 pt-4">
                      <p className="text-xs font-bold text-brand-accent uppercase tracking-wider mb-2">Available Packages</p>
                      {service.packages.map((pkg, idx) => (
                        <div key={idx} className="bg-black/20 p-3 rounded-lg border border-white/5 hover:bg-black/40 hover:border-brand-primary/30 transition-all">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-white font-bold text-sm">{pkg.name}</span>
                            <span className="text-brand-primary font-bold text-sm">{pkg.price}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {pkg.time}</span>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onBookService(service.id);
                            }}
                            className="w-full py-2 text-xs bg-white/10 hover:bg-brand-primary text-white rounded transition-colors flex items-center justify-center gap-1 font-medium"
                          >
                            Select Package
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Starting from</p>
                      <span className="text-brand-accent font-bold text-lg">{service.priceStart}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookService(service.id);
                      }}
                      className="text-sm text-white bg-white/10 hover:bg-brand-primary px-5 py-2.5 rounded-lg transition-all font-bold shadow-lg shadow-black/20 hover:shadow-brand-primary/20"
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
