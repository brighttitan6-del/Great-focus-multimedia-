
import React, { useState } from 'react';
import { PORTFOLIO_ITEMS } from '../constants';
import { PlayCircle, Image as ImageIcon, X } from 'lucide-react';
import { CustomVideoPlayer } from './CustomVideoPlayer';

export const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  
  const categories = ['All', ...Array.from(new Set(PORTFOLIO_ITEMS.map(i => i.category)))];

  const filteredItems = filter === 'All' 
    ? PORTFOLIO_ITEMS 
    : PORTFOLIO_ITEMS.filter(item => item.category === filter);

  const handleItemClick = (type: string, videoUrl?: string) => {
    if (type === 'video' && videoUrl) {
      setSelectedVideo(videoUrl);
    }
  };

  return (
    <div className="py-20 bg-[#0b1120]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Featured Work</h2>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => handleItemClick(item.type, item.videoUrl)}
              className="relative group rounded-xl overflow-hidden aspect-video bg-gray-800 cursor-pointer shadow-xl border border-white/5"
            >
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center p-4">
                <h3 className="text-white font-bold text-xl mb-1">{item.title}</h3>
                <p className="text-brand-accent text-sm uppercase tracking-wide mb-4">{item.category}</p>
                {item.type === 'video' ? (
                  <PlayCircle className="w-16 h-16 text-white drop-shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-white" />
                )}
                {item.type === 'video' && <p className="text-xs text-gray-300 mt-2">Click to watch</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Overlay */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedVideo(null)} 
              className="absolute top-4 right-4 z-50 text-white bg-black/50 hover:bg-red-600 p-2 rounded-full transition-colors backdrop-blur-md border border-white/10"
              aria-label="Close video"
            >
              <X className="w-6 h-6" />
            </button>
            <CustomVideoPlayer 
              url={selectedVideo} 
              autoPlay={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};
