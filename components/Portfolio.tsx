import React, { useState } from 'react';
import { PORTFOLIO_ITEMS } from '../constants';
import { PlayCircle, Image as ImageIcon } from 'lucide-react';

export const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...Array.from(new Set(PORTFOLIO_ITEMS.map(i => i.category)))];

  const filteredItems = filter === 'All' 
    ? PORTFOLIO_ITEMS 
    : PORTFOLIO_ITEMS.filter(item => item.category === filter);

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
            <div key={item.id} className="relative group rounded-xl overflow-hidden aspect-video bg-gray-800 cursor-pointer">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center p-4">
                <h3 className="text-white font-bold text-xl mb-1">{item.title}</h3>
                <p className="text-brand-accent text-sm uppercase tracking-wide mb-4">{item.category}</p>
                {item.type === 'video' ? (
                  <PlayCircle className="w-12 h-12 text-white" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-white" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};