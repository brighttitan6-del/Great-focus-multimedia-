
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ViewState, ServiceItem } from '../types';
import { Video, Camera, Palette, Activity, TrendingUp, Music, Loader2, ChevronDown, ChevronUp, Clock, Check, Search, Filter, ArrowUpDown, Globe, Smartphone, GraduationCap, PlayCircle, Maximize2, X, DollarSign, Layers, PlusCircle, Sparkles, Info } from 'lucide-react';
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
  const [priceFilter, setPriceFilter] = useState<string>('All');
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
      
      const price = getPriceValue(service.priceStart);
      let matchesPrice = true;
      if (priceFilter === 'Under MK 100k') {
        matchesPrice = price < 100000;
      } else if (priceFilter === 'MK 100k - 300k') {
        matchesPrice = price >= 100000 && price <= 300000;
      } else if (priceFilter === 'Over MK 300k') {
        matchesPrice = price > 300000;
      }

      return matchesSearch && matchesCategory && matchesPrice;
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
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">Comprehensive packages tailored to your needs. Explore our tiered options below.</p>
          
          {/* Search & Filter Bar */}
          <div className="max-w-5xl mx-auto bg-white/5 border border-white/10 rounded-xl p-4 shadow-lg backdrop-blur-sm relative z-20">
             <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary transition-all"
                />
              </div>

              <button 
                className="lg:hidden flex items-center justify-center gap-2 bg-white/10 p-3 rounded-lg text-white"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-5 w-5" /> Filters
              </button>

              <div className={`${showFilters ? 'flex' : 'hidden'} lg:flex flex-col md:flex-row gap-4 flex-wrap`}>
                <div className="relative min-w-[160px] flex-1">
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
                </div>

                <div className="relative min-w-[160px] flex-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="w-full appearance-none bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-8 text-white focus:outline-none focus:border-brand-primary cursor-pointer"
                  >
                    <option value="All" className="bg-gray-800">Any Price</option>
                    <option value="Under MK 100k" className="bg-gray-800">Under MK 100k</option>
                    <option value="MK 100k - 300k" className="bg-gray-800">MK 100k - 300k</option>
                    <option value="Over MK 300k" className="bg-gray-800">Over MK 300k</option>
                  </select>
                </div>
              </div>
            </div>
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
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center z-30">
                       <button
                          onClick={(e) => {
                             e.stopPropagation();
                             setViewingMedia({
                                type: service.videoUrl ? 'video' : 'image',
                                url: service.videoUrl || service.imageUrl
                             });
                          }}
                          className="bg-brand-primary/90 text-white p-3 rounded-full hover:bg-brand-primary hover:scale-110 transition-all shadow-xl backdrop-blur-sm transform -translate-y-6 group-hover/media:translate-y-[-1.5rem] duration-300"
                       >
                          {service.videoUrl ? <PlayCircle className="h-8 w-8" /> : <Maximize2 className="h-8 w-8" />}
                       </button>
                    </div>

                    <img 
                      src={service.imageUrl || 'https://via.placeholder.com/400'} 
                      alt={service.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    
                    {/* Hover Preview Slide-up */}
                    <div className="absolute inset-x-0 bottom-0 bg-[#0f172a]/95 backdrop-blur-xl p-4 translate-y-full group-hover/media:translate-y-0 transition-transform duration-300 ease-out z-40 border-t border-white/10">
                        <div className="flex items-center gap-2 mb-2 text-brand-primary">
                            <Sparkles className="h-3 w-3" />
                            <span className="text-[10px] uppercase font-bold tracking-wider">Packages Preview</span>
                        </div>
                        <div className="space-y-1.5">
                            {service.tiers && service.tiers.slice(0, 3).map((tier, i) => (
                                <div key={i} className="flex justify-between items-center text-xs border-b border-white/5 pb-1 last:border-0 last:pb-0">
                                    <span className="text-gray-300 truncate max-w-[60%]">{tier.name}</span>
                                    <span className="text-brand-accent font-medium">MK {tier.price.toLocaleString()}</span>
                                </div>
                            ))}
                            {service.tiers && service.tiers.length > 3 && (
                                <div className="text-[10px] text-center text-gray-500 pt-1">
                                    + {service.tiers.length - 3} more options
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="absolute bottom-4 left-4 z-20 pointer-events-none transition-opacity duration-200 group-hover/media:opacity-0">
                       <span className="bg-brand-primary px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg">
                         {service.category}
                       </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-brand-primary mb-4 transition-all duration-300 group-hover:bg-brand-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-primary/50 ring-1 ring-white/10 group-hover:ring-0">
                        {getIcon(service.iconName)}
                      </div>
                      
                      <div className="flex gap-2">
                        {/* Tooltip Wrapper */}
                        <div className="relative group/tooltip">
                            <button className="text-gray-400 hover:text-brand-primary transition-colors bg-white/5 p-1 rounded-full hover:bg-white/10">
                                <Info className="h-5 w-5" />
                            </button>
                            {/* Visual Tooltip Content */}
                            <div className="absolute right-0 top-8 w-72 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 z-50 transform -translate-y-2 group-hover/tooltip:translate-y-0 origin-top-right">
                                <div className="absolute -top-1.5 right-2.5 w-3 h-3 bg-gray-900 border-l border-t border-white/10 transform rotate-45"></div>
                                
                                <h5 className="text-white font-bold text-xs mb-3 uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-2">
                                    <Sparkles className="h-3 w-3 text-brand-accent" /> Service Highlights
                                </h5>
                                
                                <div 
                                    className="relative rounded-lg overflow-hidden aspect-video mb-3 border border-white/10 bg-black cursor-pointer group/preview shadow-lg hover:shadow-brand-primary/20 hover:border-brand-primary/50 transition-all"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setViewingMedia({
                                            type: service.videoUrl ? 'video' : 'image',
                                            url: service.videoUrl || service.imageUrl
                                        });
                                    }}
                                >
                                    <img 
                                        src={service.imageUrl || 'https://via.placeholder.com/400'} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover opacity-80 group-hover/preview:opacity-100 transition-opacity"
                                    />
                                    <div className="absolute inset-0 bg-black/30 group-hover/preview:bg-black/10 transition-colors flex items-center justify-center">
                                        {service.videoUrl ? (
                                            <div className="flex flex-col items-center gap-1">
                                                <PlayCircle className="h-8 w-8 text-white/90 drop-shadow-lg group-hover/preview:scale-110 transition-transform" />
                                                <span className="text-[8px] text-white uppercase tracking-widest font-bold drop-shadow-md">Watch Preview</span>
                                            </div>
                                        ) : (
                                            <span className="text-[8px] text-white uppercase tracking-widest font-bold border border-white/50 px-2 py-1 rounded backdrop-blur-sm group-hover/preview:bg-white/10 group-hover/preview:border-white transition-all">View Gallery</span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {service.tiers && service.tiers.length > 0 && (
                                        <div>
                                            <p className="text-brand-primary text-xs font-bold mb-1">Recommended: {service.tiers[1]?.name || service.tiers[0].name}</p>
                                            <ul className="space-y-1">
                                                {(service.tiers[1]?.features || service.tiers[0].features).slice(0, 3).map((feat, fIdx) => (
                                                    <li key={fIdx} className="text-[10px] text-gray-300 flex items-start gap-1.5 leading-tight">
                                                        <Check className="h-3 w-3 text-green-500 shrink-0 mt-0.5" /> {feat}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button className="text-gray-400 hover:text-white transition-colors bg-white/5 p-1 rounded-full hover:bg-white/10">
                          {expandedId === service.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-primary transition-colors">{service.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">{service.description}</p>
                    
                    {/* Expanded Content: Tiers & Add-ons */}
                    {expandedId === service.id && service.tiers && (
                      <div className="mt-4 mb-4 space-y-4 animate-fade-in border-t border-white/10 pt-4">
                        <div className="flex items-center gap-2 text-brand-accent">
                           <Layers className="h-4 w-4" />
                           <p className="text-xs font-bold uppercase tracking-wider">Select a Package</p>
                        </div>
                        
                        <div className="space-y-3">
                           {service.tiers.map((tier, idx) => (
                             <div key={idx} className="bg-black/40 p-4 rounded-xl border border-white/10 hover:border-brand-primary/50 transition-all group/tier relative overflow-hidden">
                               <div className="flex justify-between items-start mb-2 relative z-10">
                                 <div>
                                    <h4 className="text-white font-bold text-sm">{tier.name}</h4>
                                    <p className="text-gray-400 text-xs mt-0.5">{tier.description}</p>
                                 </div>
                                 <span className="text-brand-primary font-bold text-sm bg-brand-primary/10 px-2 py-1 rounded">MK {tier.price.toLocaleString()}</span>
                               </div>
                               
                               <ul className="text-xs text-gray-400 space-y-1 mb-3 relative z-10">
                                  {tier.features.slice(0, 3).map((feat, i) => (
                                     <li key={i} className="flex items-center gap-1.5"><Check className="h-3 w-3 text-green-500" /> {feat}</li>
                                  ))}
                                  {tier.features.length > 3 && <li className="text-gray-500 pl-4 italic">+ {tier.features.length - 3} more features</li>}
                               </ul>

                               <button 
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   onBookService(service.id);
                                 }}
                                 className="w-full py-2 text-xs bg-white/10 hover:bg-brand-primary text-white rounded transition-colors flex items-center justify-center gap-1 font-bold relative z-10"
                               >
                                 Book {tier.name}
                               </button>
                             </div>
                           ))}
                        </div>

                        {service.addOns && service.addOns.length > 0 && (
                           <div className="pt-2">
                              <div className="flex items-center gap-2 text-gray-400 mb-2">
                                 <PlusCircle className="h-3 w-3" />
                                 <p className="text-[10px] font-bold uppercase tracking-wider">Available Add-ons</p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                 {service.addOns.map((ao, i) => (
                                    <span key={i} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">
                                       {ao.name}
                                    </span>
                                 ))}
                              </div>
                           </div>
                        )}
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
              // Empty State (Same as before)
              <div className="col-span-1 md:col-span-3 text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No services found</h3>
                <p className="text-gray-400">Try adjusting your search or filters.</p>
                <button 
                  onClick={() => {setSelectedCategory('All'); setPriceFilter('All'); setSortBy('default'); setSearchQuery('');}}
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
            >
              <X className="w-6 h-6" />
            </button>
            {viewingMedia.type === 'video' ? (
               <CustomVideoPlayer url={viewingMedia.url} autoPlay={true} />
            ) : (
               <img src={viewingMedia.url} alt="Service View" className="w-full h-full object-contain" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
