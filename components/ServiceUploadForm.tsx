
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Image as ImageIcon, Video, X, Clock, Trash2, CheckCircle, DollarSign, UploadCloud, Link as LinkIcon, Globe, MonitorPlay, FileVideo, Save } from 'lucide-react';
import { ServiceCategory, ServiceItem } from '../types';

interface ServiceUploadFormProps {
  onCancel: () => void;
  onSave: (service: ServiceItem) => void;
  initialData?: ServiceItem | null;
}

export const ServiceUploadForm: React.FC<ServiceUploadFormProps> = ({ onCancel, onSave, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState<ServiceCategory>(initialData?.category || ServiceCategory.VIDEO_PRODUCTION);
  const [description, setDescription] = useState(initialData?.description || '');
  
  // Extract number from MK string if present
  const formatPrice = (p: string) => p?.replace(/[^0-9]/g, '') || '';
  const [priceStart, setPriceStart] = useState(formatPrice(initialData?.priceStart || ''));
  
  const [packages, setPackages] = useState(initialData?.packages || [{ name: 'Standard', price: '', time: '3 Days' }]);
  
  // Media State - Check if initial data uses external URLs
  const hasExternalLinks = initialData && (
    (initialData.imageUrl?.startsWith('http') && !initialData.imageUrl.includes('picsum')) || 
    initialData.videoUrl?.startsWith('http')
  );

  const [mediaMode, setMediaMode] = useState<'upload' | 'url'>(hasExternalLinks ? 'url' : 'upload');
  
  // File Upload State
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  
  // URL State
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.imageUrl || '');
  const [promoVideoUrl, setPromoVideoUrl] = useState(initialData?.videoUrl || '');

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // If we switch to upload mode and have an initial image URL that isn't a blob, set it as preview
    if (mediaMode === 'upload' && initialData?.imageUrl && !coverImagePreview) {
       setCoverImagePreview(initialData.imageUrl);
    }
  }, [mediaMode, initialData, coverImagePreview]);

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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      setCoverImageFile(file);
      const prev = URL.createObjectURL(file);
      setCoverImagePreview(prev);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 50 * 1024 * 1024) {
         alert("Video size should be less than 50MB for direct upload. Use a link for larger files.");
         return;
      }
      setVideoFile(file);
    }
  };

  const removeCoverImage = () => {
    if (coverImagePreview && coverImagePreview.startsWith('blob:')) URL.revokeObjectURL(coverImagePreview);
    setCoverImageFile(null);
    setCoverImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const removeVideoFile = () => {
    setVideoFile(null);
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Determine final Media URLs
    let finalImageUrl = 'https://picsum.photos/800/600'; // Default fallback
    let finalVideoUrl = undefined;

    if (mediaMode === 'upload') {
      if (coverImagePreview) finalImageUrl = coverImagePreview;
      if (videoFile) {
        finalVideoUrl = URL.createObjectURL(videoFile); 
      } else if (initialData?.videoUrl) {
         // Keep existing video if not replaced and in upload mode (assuming simple preservation)
         finalVideoUrl = initialData.videoUrl;
      }
    } else {
      if (coverImageUrl) finalImageUrl = coverImageUrl;
      if (promoVideoUrl) finalVideoUrl = promoVideoUrl;
    }

    const formattedPackages = packages.map(p => ({
      ...p,
      price: p.price.startsWith('MK') ? p.price : `MK ${p.price}`
    }));

    const newService: ServiceItem = {
      id: initialData?.id || `s-${Date.now()}`,
      title,
      category,
      description,
      priceStart: priceStart.startsWith('MK') ? priceStart : `MK ${priceStart}`,
      imageUrl: finalImageUrl,
      videoUrl: finalVideoUrl,
      iconName: initialData?.iconName || 'video', 
      packages: formattedPackages
    };

    onSave(newService);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 md:p-8 animate-fade-in shadow-2xl">
      <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-700">
        <div>
           <h2 className="text-2xl font-bold text-white">
             {initialData ? 'Edit Service Package' : 'Add New Service Package'}
           </h2>
           <p className="text-gray-400 text-sm">
             {initialData ? 'Update the details below.' : 'Create a professional listing for your clients.'}
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
              Basic Information
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
                  placeholder="Describe the service details, deliverables, and value proposition..."
                  required
                ></textarea>
              </div>
              <div>
                 <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Starting Price (MK)</label>
                 <div className="relative">
                   <DollarSign className="absolute left-3 top-3 text-gray-500 h-4 w-4" />
                   <input 
                     type="text" 
                     value={priceStart}
                     onChange={(e) => setPriceStart(e.target.value)}
                     placeholder="150,000" 
                     className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 pl-10 text-white focus:border-brand-primary outline-none focus:ring-1 focus:ring-brand-primary transition-all" 
                     required
                   />
                 </div>
              </div>
           </div>
        </div>

        {/* Media Section */}
        <div className="space-y-6 pt-6 border-t border-gray-700">
           <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-primary text-xs flex items-center justify-center">2</span>
              Media Assets
           </h3>
           <div className="pl-8">
              {/* Media Toggle */}
              <div className="flex bg-gray-900 p-1 rounded-lg w-fit mb-6 border border-gray-700">
                 <button 
                    type="button"
                    onClick={() => setMediaMode('upload')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mediaMode === 'upload' ? 'bg-gray-700 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                 >
                    <UploadCloud className="h-4 w-4" /> Upload Files
                 </button>
                 <button 
                    type="button"
                    onClick={() => setMediaMode('url')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mediaMode === 'url' ? 'bg-gray-700 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                 >
                    <LinkIcon className="h-4 w-4" /> External Links
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Cover Image */}
                 <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                       Cover Image {mediaMode === 'upload' ? '(Required)' : '(URL)'}
                    </label>
                    
                    {mediaMode === 'upload' ? (
                       <div className="relative">
                          <input 
                             type="file" 
                             ref={imageInputRef} 
                             onChange={handleImageSelect} 
                             className="hidden" 
                             accept="image/*"
                          />
                          {coverImagePreview ? (
                             <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-600 group">
                                <img src={coverImagePreview} alt="Cover Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                   <button type="button" onClick={removeCoverImage} className="bg-red-600 text-white p-2 rounded-full hover:scale-110 transition-transform">
                                      <Trash2 className="h-5 w-5" />
                                   </button>
                                </div>
                             </div>
                          ) : (
                             <div 
                                onClick={() => imageInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-600 bg-gray-900/50 rounded-lg aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary hover:bg-gray-800 transition-all group"
                             >
                                <div className="p-3 bg-gray-800 rounded-full group-hover:bg-brand-primary/20 transition-colors mb-2">
                                   <ImageIcon className="h-8 w-8 text-gray-500 group-hover:text-brand-primary" />
                                </div>
                                <span className="text-gray-400 text-sm font-medium group-hover:text-white">Click to Upload Cover</span>
                                <span className="text-gray-600 text-xs mt-1">JPG, PNG (Max 5MB)</span>
                             </div>
                          )}
                       </div>
                    ) : (
                       <div className="relative">
                          <Globe className="absolute left-3 top-3 text-gray-500 h-4 w-4" />
                          <input 
                             type="text" 
                             value={coverImageUrl}
                             onChange={(e) => setCoverImageUrl(e.target.value)}
                             placeholder="https://example.com/image.jpg"
                             className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 pl-10 text-white focus:border-brand-primary outline-none transition-all"
                          />
                          {coverImageUrl && (
                             <div className="mt-3 aspect-video rounded-lg overflow-hidden border border-gray-700 bg-black">
                                <img src={coverImageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                             </div>
                          )}
                       </div>
                    )}
                 </div>

                 {/* Promo Video */}
                 <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                       Promo Video {mediaMode === 'upload' ? '(Optional)' : '(YouTube/Vimeo)'}
                    </label>
                    
                    {mediaMode === 'upload' ? (
                       <div className="relative">
                          <input 
                             type="file" 
                             ref={videoInputRef} 
                             onChange={handleVideoSelect} 
                             className="hidden" 
                             accept="video/*"
                          />
                          {videoFile ? (
                             <div className="relative h-full min-h-[160px] bg-gray-900 rounded-lg border border-green-500/50 flex flex-col items-center justify-center p-4">
                                <FileVideo className="h-10 w-10 text-green-500 mb-2" />
                                <span className="text-white text-sm font-medium text-center truncate w-full px-4">{videoFile.name}</span>
                                <span className="text-gray-500 text-xs">{(videoFile.size / (1024*1024)).toFixed(2)} MB</span>
                                <button type="button" onClick={removeVideoFile} className="mt-3 text-red-400 hover:text-red-300 text-xs flex items-center gap-1">
                                   <Trash2 className="h-3 w-3" /> Remove
                                </button>
                             </div>
                          ) : (
                             <div 
                                onClick={() => videoInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-600 bg-gray-900/50 rounded-lg aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-brand-accent hover:bg-gray-800 transition-all group"
                             >
                                <div className="p-3 bg-gray-800 rounded-full group-hover:bg-brand-accent/20 transition-colors mb-2">
                                   <Video className="h-8 w-8 text-gray-500 group-hover:text-brand-accent" />
                                </div>
                                <span className="text-gray-400 text-sm font-medium group-hover:text-white">Upload Promo Video</span>
                                <span className="text-gray-600 text-xs mt-1">MP4, MOV (Max 50MB)</span>
                             </div>
                          )}
                       </div>
                    ) : (
                       <div className="relative">
                          <MonitorPlay className="absolute left-3 top-3 text-gray-500 h-4 w-4" />
                          <input 
                             type="text" 
                             value={promoVideoUrl}
                             onChange={(e) => setPromoVideoUrl(e.target.value)}
                             placeholder="https://youtube.com/watch?v=..."
                             className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 pl-10 text-white focus:border-brand-primary outline-none transition-all"
                          />
                          <p className="text-[10px] text-gray-500 mt-1">Supports YouTube, Vimeo, or direct video links.</p>
                          {promoVideoUrl && (
                             <div className="mt-2 text-xs text-brand-primary flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" /> Link Ready
                             </div>
                          )}
                       </div>
                    )}
                 </div>
              </div>
           </div>
        </div>

        {/* Package Builder */}
        <div className="space-y-6 pt-6 border-t border-gray-700">
          <div className="flex justify-between items-center pl-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-primary text-xs flex items-center justify-center">3</span>
              Service Packages
            </h3>
            <button 
              type="button" 
              onClick={handleAddPackage} 
              className="text-xs flex items-center gap-1 bg-brand-primary text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
            >
              <Plus className="h-3 w-3" /> Add Package
            </button>
          </div>
          
          <div className="pl-8 space-y-3">
            {packages.map((pkg, idx) => (
              <div key={idx} className="bg-gray-900/50 p-4 rounded-xl border border-gray-700 flex flex-col md:flex-row gap-4 items-center animate-fade-in relative group hover:border-brand-primary/30 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 text-xs font-bold border border-gray-700 group-hover:border-brand-primary/50 group-hover:text-brand-primary transition-colors">
                   {idx + 1}
                </div>
                
                <div className="flex-1 w-full">
                   <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Package Name</label>
                   <input 
                    type="text" 
                    value={pkg.name}
                    onChange={(e) => handlePackageChange(idx, 'name', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-brand-primary outline-none" 
                    placeholder="e.g. Gold Package" 
                   />
                </div>

                <div className="w-full md:w-32">
                   <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Price</label>
                   <input 
                    type="text" 
                    value={pkg.price}
                    onChange={(e) => handlePackageChange(idx, 'price', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-brand-primary outline-none" 
                    placeholder="Price" 
                   />
                </div>

                <div className="w-full md:w-40">
                   <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Turnaround</label>
                   <div className="relative">
                      <Clock className="absolute left-2 top-2.5 text-gray-500 h-3 w-3" />
                      <select 
                        value={pkg.time}
                        onChange={(e) => handlePackageChange(idx, 'time', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 pl-7 text-white text-sm focus:border-brand-primary outline-none appearance-none"
                      >
                        <option>24 Hours</option>
                        <option>2-3 Days</option>
                        <option>1 Week</option>
                        <option>2 Weeks</option>
                        <option>1 Month</option>
                        <option>Custom</option>
                      </select>
                   </div>
                </div>

                {packages.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => handleRemovePackage(idx)}
                    className="text-gray-500 hover:text-red-400 p-2 transition-colors self-end md:self-center"
                    title="Remove Package"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
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
