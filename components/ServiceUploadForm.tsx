
import React, { useState, useRef } from 'react';
import { Plus, Image as ImageIcon, Video, X, Clock, Trash2, CheckCircle, DollarSign } from 'lucide-react';
import { ServiceCategory } from '../types';

interface ServiceUploadFormProps {
  onCancel: () => void;
}

export const ServiceUploadForm: React.FC<ServiceUploadFormProps> = ({ onCancel }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ServiceCategory>(ServiceCategory.VIDEO_PRODUCTION);
  const [description, setDescription] = useState('');
  const [priceStart, setPriceStart] = useState('');
  const [packages, setPackages] = useState([{ name: 'Standard', price: '', time: '3 Days' }]);
  
  // File Upload State
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPackage = () => {
    setPackages([...packages, { name: '', price: '', time: '1 Week' }]);
  };

  const handlePackageChange = (index: number, field: string, value: string) => {
    const newPackages = [...packages];
    (newPackages[index] as any)[field] = value;
    setPackages(newPackages);
  };

  const handleRemovePackage = (index: number) => {
    setPackages(packages.filter((_, i) => i !== index));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: File[] = Array.from(e.target.files);
      
      // Basic validation: check size (max 50MB) and type
      const validFiles = newFiles.filter(file => {
        const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
        const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB
        return isValidType && isValidSize;
      });

      setSelectedFiles(prev => [...prev, ...validFiles]);

      // Create previews
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    const newPreviews = [...previews];
    
    // Revoke URL to prevent memory leaks
    URL.revokeObjectURL(newPreviews[index]);

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission logic here
    console.log("Submitting service:", { title, category, description, priceStart, packages, files: selectedFiles });
    onCancel();
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 md:p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Add New Service</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Service Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cinematic Wedding Film" 
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:border-brand-primary outline-none focus:ring-1 focus:ring-brand-primary transition-all" 
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value as ServiceCategory)}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:border-brand-primary outline-none focus:ring-1 focus:ring-brand-primary transition-all"
            >
              {Object.values(ServiceCategory).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Starting Price Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Starting Price (Display Amount)</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500 font-bold text-sm">MK</span>
                <input 
                  type="text" 
                  value={priceStart}
                  onChange={(e) => setPriceStart(e.target.value)}
                  placeholder="e.g. 150,000" 
                  className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 pl-10 text-white focus:border-brand-primary outline-none focus:ring-1 focus:ring-brand-primary transition-all" 
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">This amount will be displayed on the service card.</p>
            </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Description</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4} 
            className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:border-brand-primary outline-none focus:ring-1 focus:ring-brand-primary transition-all" 
            placeholder="Describe the service details, deliverables, and value proposition..."
            required
          ></textarea>
        </div>

        {/* Media Upload */}
        <div>
           <label className="block text-sm text-gray-400 mb-2">Portfolio Media (Images & Video)</label>
           <input 
             type="file" 
             ref={fileInputRef} 
             onChange={handleFileSelect} 
             className="hidden" 
             multiple 
             accept="image/*,video/*"
           />
           <div 
             onClick={() => fileInputRef.current?.click()}
             className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:bg-gray-700/30 transition-colors cursor-pointer group"
           >
              <div className="flex justify-center gap-4 mb-3">
                <div className="p-3 bg-gray-800 rounded-full group-hover:bg-brand-primary/20 transition-colors">
                   <ImageIcon className="h-6 w-6 text-gray-400 group-hover:text-brand-primary" />
                </div>
                <div className="p-3 bg-gray-800 rounded-full group-hover:bg-brand-accent/20 transition-colors">
                   <Video className="h-6 w-6 text-gray-400 group-hover:text-brand-accent" />
                </div>
              </div>
              <p className="text-gray-300 font-medium text-sm">Click to upload or drag and drop</p>
              <p className="text-gray-500 text-xs mt-1">SVG, PNG, JPG or MP4 (max 50MB)</p>
           </div>

           {/* Preview Grid */}
           {selectedFiles.length > 0 && (
             <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
               {previews.map((src, index) => (
                 <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-700 aspect-video bg-black">
                   {selectedFiles[index].type.startsWith('image') ? (
                     <img src={src} alt="Preview" className="w-full h-full object-cover" />
                   ) : (
                     <video src={src} className="w-full h-full object-cover" />
                   )}
                   <button 
                     type="button"
                     onClick={() => removeFile(index)}
                     className="absolute top-1 right-1 bg-red-600/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                     <X className="h-3 w-3" />
                   </button>
                   <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1">
                      <p className="text-xs text-white truncate px-1">{selectedFiles[index].name}</p>
                   </div>
                 </div>
               ))}
             </div>
           )}
        </div>

        {/* Package Builder */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Service Packages</h3>
              <p className="text-gray-400 text-xs">Define pricing tiers (e.g., Basic, Premium)</p>
            </div>
            <button 
              type="button" 
              onClick={handleAddPackage} 
              className="text-xs flex items-center gap-1 bg-brand-primary/10 text-brand-primary px-3 py-1.5 rounded-full hover:bg-brand-primary/20 transition-colors border border-brand-primary/20"
            >
              <Plus className="h-3 w-3" /> Add Tier
            </button>
          </div>
          
          <div className="space-y-3">
            {packages.map((pkg, idx) => (
              <div key={idx} className="bg-black/20 p-4 rounded-lg border border-gray-700 grid grid-cols-1 md:grid-cols-12 gap-4 items-center animate-fade-in relative group">
                {packages.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => handleRemovePackage(idx)}
                    className="absolute -top-2 -right-2 bg-red-500/10 text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
                
                <div className="md:col-span-4">
                  <input 
                    type="text" 
                    value={pkg.name}
                    onChange={(e) => handlePackageChange(idx, 'name', e.target.value)}
                    className="w-full bg-transparent border-b border-gray-700 text-white p-2 text-sm focus:border-brand-primary outline-none placeholder-gray-500" 
                    placeholder="Package Name (e.g. Standard)" 
                  />
                </div>
                <div className="md:col-span-4 relative">
                  <span className="absolute left-0 top-2 text-gray-500 text-sm">MK</span>
                  <input 
                    type="text" 
                    value={pkg.price}
                    onChange={(e) => handlePackageChange(idx, 'price', e.target.value)}
                    className="w-full bg-transparent border-b border-gray-700 text-white p-2 pl-8 text-sm focus:border-brand-primary outline-none placeholder-gray-500" 
                    placeholder="Price" 
                  />
                </div>
                <div className="md:col-span-4 relative">
                  <Clock className="absolute left-0 top-2 text-gray-500 h-4 w-4" />
                  <select 
                    value={pkg.time}
                    onChange={(e) => handlePackageChange(idx, 'time', e.target.value)}
                    className="w-full bg-transparent border-b border-gray-700 text-white p-2 pl-6 text-sm focus:border-brand-primary outline-none"
                  >
                    <option>24 Hours</option>
                    <option>2-3 Days</option>
                    <option>1 Week</option>
                    <option>2 Weeks</option>
                    <option>Custom</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-6 py-2 border border-gray-600 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-6 py-2 bg-brand-primary hover:bg-blue-600 text-white rounded-lg font-bold transition-colors shadow-lg shadow-blue-500/20"
          >
            Publish Service
          </button>
        </div>
      </form>
    </div>
  );
};
