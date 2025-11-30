import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ViewState, ServiceItem } from '../types';
import { Video, Camera, Palette, Activity, TrendingUp, Music, Loader2, ChevronDown, ChevronUp, Clock, Check, Search, Filter, ArrowUpDown, Globe, Smartphone, GraduationCap, PlayCircle, Maximize2, X } from 'lucide-react';
import { CustomVideoPlayer } from './CustomVideoPlayer';

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
    case 'globe': return <Globe className="h-8 w-8" />;
    case 'smartphone': return <Smartphone className="h-8 w-8" />;
    case 'graduation-cap': return <GraduationCap className="h-8 w-8" />;
    default: return <Video className="h-8 w-8" />;
  }
};

export const ServicesList: React.FC<ServicesListProps> = ({ onNavigate, onBookService }) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('default');
  const [showFilters, setShowFilters] = useState(false);

  // Media Modal State
  const [viewingMedia, setViewingMedia] = useState<{type: 'video' | 'image', url: string} | null>(null);

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
    // Prevent triggering if clicking a button inside or form controls
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('select')) return;
    setExpandedId(expandedId === id ? null : id);
  };

  const getPriceValue = (priceStr: string) => {
    return parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
  };

  const categories = ['All', ...Array.from(new Set(services.map(s => s.category)))];

  const filteredServices = services
    .filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            service.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return getPriceValue(a.priceStart) - getPriceValue(b.priceStart);
        case 'price-desc': return getPriceValue(b.priceStart) - getPriceValue(a.priceStart);
        case 'name-asc': return a.title.localeCompare(b.title);
        case 'name-desc': return b.title.localeCompare(a.title);
        default: return 0;
      }
    });

  return (
    <div className="py-20 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Our Services</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">We offer a comprehensive range of production services designed to elevate your brand and capture your most important moments.</p>
          
          {/* Search & Filter Bar */}
          <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-xl p-4 shadow-lg backdrop-blur-sm relative z-20">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                />
              </div>

              {/* Mobile Filter Toggle */}
              <button 
                className="md:hidden flex items-center justify-center gap-2 bg-white/10 p-3 rounded-lg text-white"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-5 w-5" /> Filters
              </button>

              {/* Filters Container */}
              <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-4`}>
                {/* Category Dropdown */}
                <div className="relative min-w-[160px]">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full appearance-none bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-8 text-white focus:outline-none focus:border-brand-primary cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                </div>

                {/* Sort Dropdown */}
                <div className="relative min-w-[160px]">
                  <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-8 text-white focus:outline-none focus:border-brand-primary cursor-pointer"
                  >
                    <option value="default" className="bg-gray-800">Default Sort</option>
                    <option value="price-asc" className="bg-gray-800">Price: Low to High</option>
                    <option value="price-desc" className="bg-gray-800">Price: High to Low</option>
                    <option value="name-asc" className="bg-gray-800">Name: A-Z</option>
                    <option value="name-desc" className="bg-gray-800">Name: Z-A</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                </div>
              </div>
            </div>
            
            {/* Active Filters Summary */}
            {(selectedCategory !== 'All' || sortBy !== 'default' || searchQuery) && (
              <div className="flex items-center gap-2 mt-4 text-xs text-gray-400 animate-fade-in">
                <span>Active Filters:</span>
                {selectedCategory !== 'All' && <span className="bg-brand-primary/20 text-brand-primary px-2 py-1 rounded border border-brand-primary/30">{selectedCategory}</span>}
                {sortBy !== 'default' && <span className="bg-white/10 px-2 py-1 rounded border border-white/10">Sorted</span>}
                {searchQuery && <span className="bg-white/10 px-2 py-1 rounded border border-white/10">Search: "{searchQuery}"</span>}
                <button 
                  onClick={() => {setSelectedCategory('All'); setSortBy('default'); setSearchQuery('');}}
                  className="text-red-400 hover:text-red-300 ml-auto flex items-center gap-1"
                >
                  <span className="h-4 w-4 flex items-center justify-center rounded-full border border-current text-[10px]">✕</span> Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 text-brand-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <div 
                  key={service.id} 
                  onClick={(e) => toggleExpand(service.id, e)}
                  className={`group bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 ease-out cursor-pointer shadow-lg 
                    ${expandedId === service.id 
                      ? 'ring-2 ring-brand-primary/50 bg-white/10 scale-[1.02] shadow-2xl shadow-brand-primary/10' 
                      : 'hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl hover:shadow-brand-primary/20 hover:border-brand-primary/50 hover:bg-white/10'
                    }`}
                >
                  <div className="h-48 overflow-hidden relative group/media">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />
                    
                    {/* Media Overlay Button */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center z-30">
                       <button
                          onClick={(e) => {
                             e.stopPropagation();
                             setViewingMedia({
                                type: service.videoUrl ? 'video' : 'image',
                                url: service.videoUrl || service.imageUrl
                             });
                          }}
                          className="bg-brand-primary/90 text-white p-3 rounded-full hover:bg-brand-primary hover:scale-110 transition-all shadow-xl backdrop-blur-sm"
                          title={service.videoUrl ? "Watch Preview" : "View Full Image"}
                       >
                          {service.videoUrl ? <PlayCircle className="h-8 w-8" /> : <Maximize2 className="h-8 w-8" />}
                       </button>
                    </div>

                    <img 
                      src={service.imageUrl || 'https://via.placeholder.com/400'} 
                      alt={service.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
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
              ))
            ) : (
              <div className="col-span-1 md:col-span-3 text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No services found</h3>
                <p className="text-gray-400">Try adjusting your search or filters to find what you're looking for.</p>
                <button 
                  onClick={() => {setSelectedCategory('All'); setSortBy('default'); setSearchQuery('');}}
                  className="mt-6 text-brand-primary hover:text-white font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Media Modal */}
      {viewingMedia && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setViewingMedia(null)}
        >
          <div 
            className={`relative w-full ${viewingMedia.type === 'video' ? 'max-w-5xl aspect-video' : 'max-w-4xl h-auto max-h-[90vh]'} bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center`}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setViewingMedia(null)} 
              className="absolute top-4 right-4 z-50 text-white bg-black/50 hover:bg-red-600 p-2 rounded-full transition-colors backdrop-blur-md border border-white/10"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            
            {viewingMedia.type === 'video' ? (
               <CustomVideoPlayer 
                  url={viewingMedia.url} 
                  autoPlay={true}
               />
            ) : (
               <img 
                  src={viewingMedia.url} 
                  alt="Service Full View" 
                  className="w-full h-full object-contain"
               />
            )}
          </div>
        </div>
      )}
    </div>
  );
};