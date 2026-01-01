
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PortfolioItem } from '../types';
import { PlayCircle, Image as ImageIcon, X, Loader2, Maximize2 } from 'lucide-react';
import { CustomVideoPlayer } from './CustomVideoPlayer';

export const Portfolio: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [viewingItem, setViewingItem] = useState<{ type: 'video' | 'image', url: string } | null>(null);
  
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await api.getPortfolio();
        setItems(data);
      } catch (error) {
        console.error("Failed to load portfolio", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category)))];

  const filteredItems = filter === 'All' 
    ? items 
    : items.filter(item => item.category === filter);

  const handleItemClick = (item: PortfolioItem) => {
    if (item.type === 'video' && item.videoUrl) {
      setViewingItem({ type: 'video', url: item.videoUrl });
    } else if (item.type === 'image' || (item.type === 'video' && !item.videoUrl)) {
      // Fallback to image for video if no URL, or standard image
      setViewingItem({ type: 'image', url: item.imageUrl });
    }
  };

  return (
    <div className="py-20 bg-[#0b1120] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Featured Work</h2>
          
          {loading ? (
             <div className="flex justify-center my-8"><Loader2 className="h-8 w-8 text-brand-primary animate-spin"/></div>
          ) : (
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === cat 
                      ? 'bg-brand-primary text-white' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleItemClick(item)}
                className="relative group rounded-xl overflow-hidden aspect-video bg-gray-800 cursor-pointer shadow-xl border border-white/5"
              >
                <img 
                  src={item.imageUrl || (item.type === 'video' ? 'https://via.placeholder.com/800x450?text=Video+Preview' : 'https://via.placeholder.com/800x450?text=Image')} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center p-4 backdrop-blur-[2px]">
                  <h3 className="text-white font-bold text-xl mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
                  <p className="text-brand-accent text-sm uppercase tracking-wide mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{item.category}</p>
                  
                  {item.type === 'video' ? (
                    <PlayCircle className="w-16 h-16 text-white drop-shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300 hover:text-brand-primary" />
                  ) : (
                    <Maximize2 className="w-12 h-12 text-white drop-shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300 hover:text-brand-primary" />
                  )}
                  
                  <p className="text-xs text-gray-300 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {item.type === 'video' ? 'Click to Watch' : 'View Full Image'}
                  </p>
                </div>
              </div>
            ))}
            {filteredItems.length === 0 && (
                <div className="col-span-1 md:col-span-2 text-center py-10 text-gray-500">
                    No items found in this category.
                </div>
            )}
          </div>
        )}
      </div>

      {/* Media Modal Overlay */}
      {viewingItem && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setViewingItem(null)}
        >
          <div 
            className={`relative w-full ${viewingItem.type === 'video' ? 'max-w-5xl aspect-video' : 'max-w-5xl h-auto max-h-[90vh]'} bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center`}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setViewingItem(null)} 
              className="absolute top-4 right-4 z-50 text-white bg-black/50 hover:bg-red-600 p-2 rounded-full transition-colors backdrop-blur-md border border-white/10 group"
              aria-label="Close view"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
            </button>
            
            {viewingItem.type === 'video' ? (
              <CustomVideoPlayer 
                url={viewingItem.url} 
                autoPlay={true}
              />
            ) : (
              <img 
                src={viewingItem.url} 
                alt="Portfolio Fullscreen" 
                className="w-full h-full object-contain max-h-[85vh]"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
