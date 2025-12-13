
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Image as ImageIcon, Video, X, Clock, Trash2, CheckCircle, DollarSign, UploadCloud, Link as LinkIcon, Globe, MonitorPlay, FileVideo, Save, List, Star } from 'lucide-react';
import { ServiceCategory, ServiceItem, ServiceTier, ServiceAddOn } from '../types';

interface ServiceUploadFormProps {
  onCancel: () => void;
  onSave: (service: ServiceItem) => void;
  initialData?: ServiceItem | null;
}

export const ServiceUploadForm: React.FC<ServiceUploadFormProps> = ({ onCancel, onSave, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState<ServiceCategory>(initialData?.category || ServiceCategory.VIDEO_PRODUCTION);
  const [description, setDescription] = useState(initialData?.description || '');
  const [priceStart, setPriceStart] = useState(initialData?.priceStart?.replace(/[^0-9]/g, '') || '');
  
  // New State for Tiers and Add-ons
  const [tiers, setTiers] = useState<ServiceTier[]>(initialData?.tiers || [
    { name: 'Standard', price: 0, description: '', features: [''] }
  ]);
  const [addOns, setAddOns] = useState<ServiceAddOn[]>(initialData?.addOns || []);
  
  const [mediaMode, setMediaMode] = useState<'upload' | 'url'>('url');
  
  // URL State
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.imageUrl || '');
  const [promoVideoUrl, setPromoVideoUrl] = useState(initialData?.videoUrl || '');

  // TIER MANAGEMENT
  const handleAddTier = () => {
    setTiers([...tiers, { name: '', price: 0, description: '', features: [''] }]);
  };
  
  const handleRemoveTier = (index: number) => {
    setTiers(tiers.filter((_, i) => i !== index));
  };

  const handleTierChange = (index: number, field: keyof ServiceTier, value: any) => {
    const newTiers = [...tiers];
    (newTiers[index] as any)[field] = value;
    setTiers(newTiers);
  };

  const handleFeatureChange = (tierIndex: number, featureIndex: number, value: string) => {
    const newTiers = [...tiers];
    newTiers[tierIndex].features[featureIndex] = value;
    setTiers(newTiers);
  };

  const handleAddFeature = (tierIndex: number) => {
    const newTiers = [...tiers];
    newTiers[tierIndex].features.push('');
    setTiers(newTiers);
  };

  const handleRemoveFeature = (tierIndex: number, featureIndex: number) => {
    const newTiers = [...tiers];
    newTiers[tierIndex].features = newTiers[tierIndex].features.filter((_, i) => i !== featureIndex);
    setTiers(newTiers);
  };

  // ADD-ON MANAGEMENT
  const handleAddAddOn = () => {
    setAddOns([...addOns, { name: '', price: 0 }]);
  };

  const handleRemoveAddOn = (index: number) => {
    setAddOns(addOns.filter((_, i) => i !== index));
  };

  const handleAddOnChange = (index: number, field: keyof ServiceAddOn, value: any) => {
    const newAddOns = [...addOns];
    (newAddOns[index] as any)[field] = value;
    setAddOns(newAddOns);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setCoverImageUrl(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newService: ServiceItem = {
      id: initialData?.id || `s-${Date.now()}`,
      title,
      category,
      description,
      priceStart: priceStart.startsWith('MK') ? priceStart : `MK ${parseInt(priceStart || '0').toLocaleString()}`,
      imageUrl: coverImageUrl || 'https://picsum.photos/800/600',
      videoUrl: promoVideoUrl,
      iconName: initialData?.iconName || 'video', 
      tiers: tiers,
      addOns: addOns,
      // Create legacy packages structure for backward compatibility
      packages: tiers.map(t => ({
        name: t.name,
        price: `MK ${t.price.toLocaleString()}`,
        time: 'N/A'
      }))
    };

    onSave(newService);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 md:p-8 animate-fade-in shadow-2xl">
      <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-700">
        <div>
           <h2 className="text-2xl font-bold text-white">
             {initialData ? 'Edit Service & Pricing' : 'Create New Service'}
           </h2>
           <p className="text-gray-400 text-sm">
             Configure tiers, features, and custom add-ons.
           </p>
        </div>
        <button onClick={onCancel} className="text-gray-400 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-colors">
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Info Section */}
        <div className="space-y-6">
           <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-primary text-xs flex items-center justify-center">1</span>
              Service Overview
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Service Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cinematic Wedding Film" 
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-brand-primary outline-none focus:ring-1 focus:ring-brand-primary transition-all" 
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-brand-primary outline-none focus:ring-1 focus:ring-brand-primary transition-all"
                >
                  {Object.values(ServiceCategory).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3} 
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-brand-primary outline-none focus:ring-1 focus:ring-brand-primary transition-all" 
                  placeholder="Describe the service details..."
                  required
                ></textarea>
              </div>
              <div>
                 <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Display Price (MK)</label>
                 <div className="relative">
                   <DollarSign className="absolute left-3 top-3 text-gray-500 h-4 w-4" />
                   <input 
                     type="number" 
                     value={priceStart}
                     onChange={(e) => setPriceStart(e.target.value)}
                     placeholder="150000" 
                     className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 pl-10 text-white focus:border-brand-primary outline-none focus:ring-1 focus:ring-brand-primary transition-all" 
                     required
                   />
                 </div>
              </div>
              
              <div>
                 <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cover Image</label>
                 <div className="flex gap-2">
                     <div className="flex-1 border border-gray-700 bg-gray-900 rounded-lg p-3 relative flex items-center gap-3">
                         <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                         <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center overflow-hidden">
                             {coverImageUrl ? <img src={coverImageUrl} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-500" />}
                         </div>
                         <span className="text-sm text-gray-400">{coverImageUrl ? 'Image selected' : 'Upload image file'}</span>
                     </div>
                 </div>
              </div>
           </div>
        </div>

        {/* TIERS SECTION */}
        <div className="space-y-6 pt-6 border-t border-gray-700">
          <div className="flex justify-between items-center pl-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-primary text-xs flex items-center justify-center">2</span>
              Pricing Tiers
            </h3>
            <button 
              type="button" 
              onClick={handleAddTier} 
              className="text-xs flex items-center gap-1 bg-brand-primary text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="h-3 w-3" /> Add Tier
            </button>
          </div>
          
          <div className="pl-8 space-y-4">
            {tiers.map((tier, idx) => (
              <div key={idx} className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 relative group hover:border-brand-primary/30 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded">Tier {idx + 1}</span>
                  <button type="button" onClick={() => handleRemoveTier(idx)} className="text-red-400 hover:text-red-300">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                     <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Tier Name</label>
                     <input 
                      type="text" 
                      value={tier.name}
                      onChange={(e) => handleTierChange(idx, 'name', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm" 
                      placeholder="e.g. Gold Package" 
                     />
                  </div>
                  <div>
                     <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Price (MK)</label>
                     <input 
                      type="number" 
                      value={tier.price}
                      onChange={(e) => handleTierChange(idx, 'price', parseInt(e.target.value) || 0)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm" 
                      placeholder="0" 
                     />
                  </div>
                  <div className="md:col-span-2">
                     <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Description</label>
                     <input 
                      type="text" 
                      value={tier.description}
                      onChange={(e) => handleTierChange(idx, 'description', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm" 
                      placeholder="Brief summary of this tier" 
                     />
                  </div>
                </div>
                
                {/* Features List */}
                <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                   <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">Included Features</label>
                   <div className="space-y-2">
                      {tier.features.map((feature, fIdx) => (
                         <div key={fIdx} className="flex gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-2 shrink-0" />
                            <input 
                              type="text" 
                              value={feature}
                              onChange={(e) => handleFeatureChange(idx, fIdx, e.target.value)}
                              className="w-full bg-transparent border-b border-gray-600 py-1 text-sm text-gray-300 focus:border-brand-primary outline-none"
                              placeholder="Feature detail"
                            />
                            <button type="button" onClick={() => handleRemoveFeature(idx, fIdx)} className="text-gray-600 hover:text-red-400">
                               <X className="h-3 w-3" />
                            </button>
                         </div>
                      ))}
                      <button 
                        type="button" 
                        onClick={() => handleAddFeature(idx)}
                        className="text-xs text-brand-primary hover:text-white mt-2 flex items-center gap-1"
                      >
                         <Plus className="h-3 w-3" /> Add Feature
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ADD-ONS SECTION */}
        <div className="space-y-6 pt-6 border-t border-gray-700">
          <div className="flex justify-between items-center pl-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-primary text-xs flex items-center justify-center">3</span>
              Optional Add-ons
            </h3>
            <button 
              type="button" 
              onClick={handleAddAddOn} 
              className="text-xs flex items-center gap-1 bg-gray-700 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Plus className="h-3 w-3" /> Add Item
            </button>
          </div>
          
          <div className="pl-8 grid grid-cols-1 md:grid-cols-2 gap-4">
             {addOns.map((addon, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-gray-900 p-3 rounded-lg border border-gray-700">
                   <input 
                      type="text" 
                      value={addon.name}
                      onChange={(e) => handleAddOnChange(idx, 'name', e.target.value)}
                      className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                      placeholder="Add-on Name"
                   />
                   <div className="relative w-32">
                      <span className="absolute left-2 top-2 text-gray-500 text-xs">MK</span>
                      <input 
                        type="number" 
                        value={addon.price}
                        onChange={(e) => handleAddOnChange(idx, 'price', parseInt(e.target.value) || 0)}
                        className="w-full bg-gray-800 border border-gray-600 rounded pl-8 pr-2 py-2 text-white text-sm text-right"
                      />
                   </div>
                   <button type="button" onClick={() => handleRemoveAddOn(idx)} className="text-gray-500 hover:text-red-400 p-1">
                      <X className="h-4 w-4" />
                   </button>
                </div>
             ))}
             {addOns.length === 0 && <p className="text-gray-500 text-sm italic col-span-2">No add-ons configured.</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-6 py-3 border border-gray-600 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-8 py-3 bg-brand-primary hover:bg-blue-600 text-white rounded-lg font-bold transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2"
          >
            {initialData ? <Save className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            {initialData ? 'Update Service' : 'Publish Service'}
          </button>
        </div>
      </form>
    </div>
  );
};
