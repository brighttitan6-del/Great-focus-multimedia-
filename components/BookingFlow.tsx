
import React, { useState, useEffect } from 'react';
import { SERVICES } from '../constants';
import { ServiceItem, Project, User, ServiceTier, ServiceAddOn } from '../types';
import { api } from '../services/api';
import { Check, Calendar, Clock, CreditCard, UploadCloud, CheckCircle, Home, Download, AlertCircle, Plus, FileText, Video, Image as ImageIcon, Loader2, ArrowRight } from 'lucide-react';

interface BookingFlowProps {
  preSelectedServiceId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({ preSelectedServiceId, onSuccess, onCancel }) => {
  const [user, setUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'LIST' | 'CREATE'>('LIST');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Booking Wizard State
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<ServiceItem | undefined>(undefined);
  const [selectedTier, setSelectedTier] = useState<ServiceTier | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<ServiceAddOn[]>([]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    notes: '',
    paymentMethod: 'airtel'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser(u);
      setFormData(prev => ({ ...prev, name: u.name, email: u.email }));
    }

    if (preSelectedServiceId) {
       setViewMode('CREATE');
       const service = SERVICES.find(s => s.id === preSelectedServiceId);
       setSelectedService(service);
       if(service) setStep(2); // Skip to tier selection
    } else if (storedUser) {
       loadProjects(JSON.parse(storedUser).email);
    } else {
       setViewMode('CREATE');
    }
  }, [preSelectedServiceId]);

  const loadProjects = async (email: string) => {
    setLoadingProjects(true);
    try {
      const data = await api.getProjects(email);
      setProjects(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleServiceSelect = (id: string) => {
    const service = SERVICES.find(s => s.id === id);
    setSelectedService(service);
    setSelectedTier(null); // Reset tier if service changes
    setSelectedAddOns([]);
    setStep(2);
  };

  const handleTierSelect = (tier: ServiceTier) => {
     setSelectedTier(tier);
  };

  const toggleAddOn = (addon: ServiceAddOn) => {
     if (selectedAddOns.find(a => a.name === addon.name)) {
        setSelectedAddOns(selectedAddOns.filter(a => a.name !== addon.name));
     } else {
        setSelectedAddOns([...selectedAddOns, addon]);
     }
  };

  const calculateTotal = () => {
     const tierPrice = selectedTier?.price || 0;
     const addOnsPrice = selectedAddOns.reduce((acc, curr) => acc + curr.price, 0);
     return tierPrice + addOnsPrice;
  };

  const calculateDeposit = () => {
     return calculateTotal() / 2;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const now = new Date();

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';

    if (formData.date && formData.time) {
      const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
      if (selectedDateTime <= now) {
        newErrors.date = 'Please select a future date and time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep(4); // Go to payment
    }
  };

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(5);
      if (user) loadProjects(user.email);
    }, 2000);
  };

  const getInputClass = (fieldName: string) => `
    w-full bg-black/30 border rounded-lg p-3 text-white outline-none focus:ring-1 transition-all
    ${errors[fieldName] 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
      : 'border-white/10 focus:border-brand-primary focus:ring-brand-primary'}
  `;

  // --- RENDER LIST VIEW ---
  if (viewMode === 'LIST' && user) {
     return (
        <div className="py-12 bg-brand-dark min-h-screen">
           <div className="max-w-5xl mx-auto px-4">
              <div className="flex justify-between items-center mb-8">
                 <div>
                    <h2 className="text-3xl font-bold text-white">Client Dashboard</h2>
                    <p className="text-gray-400 mt-1">Manage your projects and download files.</p>
                 </div>
                 <button 
                    onClick={() => setViewMode('CREATE')}
                    className="bg-brand-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
                 >
                    <Plus className="h-5 w-5" /> New Booking
                 </button>
              </div>

              {loadingProjects ? (
                 <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 text-brand-primary animate-spin" /></div>
              ) : projects.length === 0 ? (
                 <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                    <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Active Projects</h3>
                    <p className="text-gray-400 mb-6">You haven't booked any services yet.</p>
                    <button onClick={() => setViewMode('CREATE')} className="text-brand-primary hover:text-white font-medium">Start a new project</button>
                 </div>
              ) : (
                 <div className="grid grid-cols-1 gap-6">
                    {projects.map(project => (
                       <div key={project.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                             <div>
                                <div className="flex items-center gap-2 mb-1">
                                   <h3 className="text-xl font-bold text-white">{project.title}</h3>
                                   <span className="bg-brand-primary/20 text-brand-primary border border-brand-primary/30 text-xs px-2 py-0.5 rounded-full uppercase font-bold">{project.category}</span>
                                </div>
                                <p className="text-gray-400 text-sm">Due: {project.dueDate}</p>
                             </div>
                             <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                   project.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 
                                   project.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                                   'bg-gray-700 text-gray-300'
                                }`}>
                                   {project.status}
                                </span>
                             </div>
                          </div>
                          <div className="w-full bg-gray-900 h-2 rounded-full mb-6 overflow-hidden">
                             <div 
                                className={`h-full rounded-full transition-all duration-1000 ${project.status === 'Completed' ? 'bg-green-500' : 'bg-brand-primary'}`} 
                                style={{ width: `${project.progress}%` }}
                             ></div>
                          </div>
                          {project.deliverables && project.deliverables.length > 0 && (
                             <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                   <UploadCloud className="h-4 w-4 text-brand-accent" /> Project Deliverables
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                   {project.deliverables.map((file, idx) => (
                                      <div key={idx} className="flex items-center justify-between bg-gray-700/50 p-3 rounded hover:bg-gray-700 transition-colors">
                                         <div className="flex items-center gap-3 overflow-hidden">
                                            {file.type === 'video' ? <Video className="h-5 w-5 text-blue-400 flex-shrink-0" /> : 
                                             file.type === 'image' ? <ImageIcon className="h-5 w-5 text-purple-400 flex-shrink-0" /> :
                                             <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />}
                                            <span className="text-gray-200 text-sm truncate">{file.name}</span>
                                         </div>
                                         <a 
                                            href={file.url} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="text-brand-primary hover:text-white p-1 rounded hover:bg-white/10"
                                            title="Download/View"
                                         >
                                            <Download className="h-4 w-4" />
                                         </a>
                                      </div>
                                   ))}
                                </div>
                             </div>
                          )}
                       </div>
                    ))}
                 </div>
              )}
           </div>
        </div>
     );
  }

  // --- RENDER CREATE MODE (Wizard) ---
  return (
    <div className="py-12 bg-brand-dark min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        {user && (
           <button onClick={() => setViewMode('LIST')} className="mb-6 text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
              <AlertCircle className="h-4 w-4 rotate-180" /> Back to Dashboard
           </button>
        )}
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8 text-sm">
            {[
              { num: 1, label: 'Service' },
              { num: 2, label: 'Package' },
              { num: 3, label: 'Details' },
              { num: 4, label: 'Payment' },
              { num: 5, label: 'Done' }
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className={`flex flex-col items-center ${step >= s.num ? 'text-brand-primary' : 'text-gray-500'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors duration-300 ${
                    step >= s.num ? 'bg-brand-primary text-white' : 'bg-white/10'
                  }`}>
                    {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                  </div>
                  <span className="hidden sm:inline text-xs">{s.label}</span>
                </div>
                {idx < 4 && (
                  <div className={`h-1 flex-1 mx-2 sm:mx-4 transition-colors duration-300 ${step > idx + 1 ? 'bg-brand-primary' : 'bg-white/10'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* STEP 1: Select Service */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-6">Select a Service</h2>
              <div className="grid grid-cols-1 gap-4">
                {SERVICES.map(service => (
                  <div 
                    key={service.id}
                    onClick={() => handleServiceSelect(service.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all flex justify-between items-center ${
                      selectedService?.id === service.id 
                        ? 'bg-brand-primary/20 border-brand-primary' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <h3 className="text-white font-bold">{service.title}</h3>
                      <p className="text-gray-400 text-sm">{service.priceStart}</p>
                    </div>
                    {selectedService?.id === service.id && <Check className="text-brand-primary" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Select Tier & Add-ons */}
          {step === 2 && selectedService && (
            <div className="animate-fade-in">
               <h2 className="text-2xl font-bold text-white mb-6">Choose Your Package</h2>
               
               <div className="space-y-6 mb-8">
                  {selectedService.tiers.map((tier, idx) => (
                     <div 
                        key={idx}
                        onClick={() => handleTierSelect(tier)}
                        className={`p-5 rounded-xl border cursor-pointer transition-all ${
                           selectedTier?.name === tier.name
                           ? 'bg-brand-primary/20 border-brand-primary ring-1 ring-brand-primary'
                           : 'bg-white/5 border-white/10 hover:border-gray-500'
                        }`}
                     >
                        <div className="flex justify-between items-start mb-2">
                           <div>
                              <h3 className="text-white font-bold text-lg">{tier.name}</h3>
                              <p className="text-gray-400 text-sm">{tier.description}</p>
                           </div>
                           <span className="text-brand-accent font-bold text-lg">MK {tier.price.toLocaleString()}</span>
                        </div>
                        <ul className="grid grid-cols-2 gap-2 text-xs text-gray-300 mt-4 border-t border-white/10 pt-3">
                           {tier.features.map((feat, i) => (
                              <li key={i} className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-green-500" /> {feat}</li>
                           ))}
                        </ul>
                     </div>
                  ))}
               </div>

               {selectedService.addOns.length > 0 && (
                  <div className="mb-8">
                     <h3 className="text-white font-bold mb-4">Optional Add-ons</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedService.addOns.map((addon, idx) => {
                           const isSelected = selectedAddOns.some(a => a.name === addon.name);
                           return (
                              <div 
                                 key={idx}
                                 onClick={() => toggleAddOn(addon)}
                                 className={`p-3 rounded-lg border cursor-pointer flex justify-between items-center transition-all ${
                                    isSelected ? 'bg-green-500/20 border-green-500' : 'bg-black/20 border-white/10'
                                 }`}
                              >
                                 <span className="text-gray-200 text-sm">{addon.name}</span>
                                 <span className="text-brand-primary font-bold text-sm">+ MK {addon.price.toLocaleString()}</span>
                              </div>
                           );
                        })}
                     </div>
                  </div>
               )}

               <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="px-6 py-3 rounded-lg border border-white/10 text-white hover:bg-white/10">Back</button>
                  <button 
                     onClick={() => setStep(3)} 
                     disabled={!selectedTier}
                     className="flex-1 px-6 py-3 rounded-lg bg-brand-primary text-white font-bold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     Continue to Details
                  </button>
               </div>
            </div>
          )}

          {/* STEP 3: Details Form */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                  <input name="name" onChange={handleChange} value={formData.name} type="text" className={getInputClass('name')} placeholder="Enter your name" />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email</label>
                  <input name="email" onChange={handleChange} value={formData.email} type="email" className={getInputClass('email')} placeholder="Enter your email" />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Phone</label>
                <input name="phone" onChange={handleChange} value={formData.phone} type="tel" className={getInputClass('phone')} placeholder="Enter your phone number" />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Date</label>
                  <input name="date" onChange={handleChange} value={formData.date} type="date" className={getInputClass('date')} min={new Date().toISOString().split('T')[0]} />
                  {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Time</label>
                  <input name="time" onChange={handleChange} value={formData.time} type="time" className={getInputClass('time')} />
                  {errors.time && <p className="text-red-400 text-xs mt-1">{errors.time}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Project Brief</label>
                <textarea name="notes" onChange={handleChange} value={formData.notes} rows={3} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-brand-primary outline-none" placeholder="Describe your vision..."></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setStep(2)} className="px-6 py-3 rounded-lg border border-white/10 text-white hover:bg-white/10">Back</button>
                <button type="submit" className="flex-1 px-6 py-3 rounded-lg bg-brand-primary text-white font-bold hover:bg-blue-600">Review & Pay</button>
              </div>
            </form>
          )}

          {/* STEP 4: Payment */}
          {step === 4 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-2">Secure Deposit</h2>
              <p className="text-gray-400 mb-6">Review your order and pay the 50% deposit.</p>
              
              <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-white">{selectedTier?.name}</span>
                    <span className="text-white">MK {selectedTier?.price.toLocaleString()}</span>
                 </div>
                 {selectedAddOns.map((ao, i) => (
                    <div key={i} className="flex justify-between items-center text-sm text-gray-400 mb-1">
                       <span>+ {ao.name}</span>
                       <span>MK {ao.price.toLocaleString()}</span>
                    </div>
                 ))}
                 <div className="border-t border-white/10 mt-4 pt-4 flex justify-between items-center">
                    <span className="text-white font-bold">Total Estimate</span>
                    <span className="text-white font-bold">MK {calculateTotal().toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center mt-2 text-brand-primary">
                    <span className="font-bold">Deposit Due (50%)</span>
                    <span className="font-bold text-xl">MK {calculateDeposit().toLocaleString()}</span>
                 </div>
              </div>

              <h3 className="text-white font-bold mb-4">Select Payment Method</h3>
              <div className="space-y-3 mb-8">
                <label className="flex items-center p-4 border border-white/10 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10">
                  <input type="radio" name="paymentMethod" value="airtel" checked={formData.paymentMethod === 'airtel'} onChange={handleChange} className="mr-3 w-5 h-5 text-brand-primary" />
                  <div className="flex-1">
                    <span className="text-white font-bold block">Airtel Money</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-red-600"></div>
                </label>

                <label className="flex items-center p-4 border border-white/10 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10">
                  <input type="radio" name="paymentMethod" value="tnm" checked={formData.paymentMethod === 'tnm'} onChange={handleChange} className="mr-3 w-5 h-5 text-brand-primary" />
                  <div className="flex-1">
                    <span className="text-white font-bold block">TNM Mpamba</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-green-600"></div>
                </label>

                <label className="flex items-center p-4 border border-white/10 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10">
                  <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleChange} className="mr-3 w-5 h-5 text-brand-primary" />
                  <div className="flex-1">
                    <span className="text-white font-bold block">Card Payment</span>
                  </div>
                  <CreditCard className="text-white" />
                </label>
              </div>

              <div className="flex gap-4">
                <button disabled={isProcessing} onClick={() => setStep(3)} className="flex-1 px-6 py-3 rounded-lg border border-white/10 text-white hover:bg-white/10 disabled:opacity-50">Back</button>
                <button 
                  onClick={handlePayment} 
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {isProcessing ? 'Processing...' : 'Pay Deposit & Book'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Confirmation */}
          {step === 5 && (
             <div className="text-center animate-scale-in">
                <div className="mb-6 inline-flex p-4 rounded-full bg-green-500/10 text-green-500">
                  <CheckCircle className="w-16 h-16" />
                </div>
                <h2 className="text-3xl font-heading font-bold text-white mb-2">Booking Confirmed!</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  Thank you, <span className="text-white font-medium">{formData.name}</span>. Your deposit has been received and your slot is secured.
                </p>

                <div className="bg-white/5 rounded-xl p-6 mb-8 text-left max-w-sm mx-auto border border-white/10 shadow-xl">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Booking Summary</h3>
                  <div className="space-y-4 text-sm">
                      <div className="flex justify-between items-center">
                          <span className="text-gray-400">Service</span>
                          <span className="text-white font-medium text-right">{selectedService?.title}</span>
                      </div>
                      <div className="flex justify-between items-center">
                          <span className="text-gray-400">Package</span>
                          <span className="text-white font-medium text-right">{selectedTier?.name}</span>
                      </div>
                      
                      <div className="flex justify-between items-center bg-green-500/10 p-2 rounded-lg -mx-2">
                          <span className="text-green-400 font-bold">Deposit Paid</span>
                          <span className="text-white font-bold text-lg">MK {calculateDeposit().toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                          <span className="text-gray-400">Payment Method</span>
                          <span className="text-white font-medium capitalize flex items-center gap-2">
                             {formData.paymentMethod} <CheckCircle className="w-3 h-3 text-green-500" />
                          </span>
                      </div>
                      
                      <div className="flex justify-between items-center pt-3 border-t border-dashed border-white/10 mt-2">
                          <span className="text-gray-400">Reference ID</span>
                          <span className="text-brand-primary font-mono text-xs">GF-{Math.floor(Math.random() * 10000)}</span>
                      </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={onSuccess} className="bg-brand-primary px-8 py-3 rounded-lg text-white font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2">
                     <Home className="w-4 h-4" /> Return to Home
                  </button>
                  <button onClick={() => setViewMode('LIST')} className="bg-white/5 px-8 py-3 rounded-lg text-white font-medium hover:bg-white/10 transition-colors border border-white/10 flex items-center justify-center gap-2">
                     <AlertCircle className="w-4 h-4" /> View Dashboard
                  </button>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
