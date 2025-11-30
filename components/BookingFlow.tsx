import React, { useState } from 'react';
import { SERVICES } from '../constants';
import { ServiceItem } from '../types';
import { Check, Calendar, Clock, CreditCard, UploadCloud, CheckCircle, Home, Download, AlertCircle } from 'lucide-react';

interface BookingFlowProps {
  preSelectedServiceId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({ preSelectedServiceId, onSuccess, onCancel }) => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<ServiceItem | undefined>(
    SERVICES.find(s => s.id === preSelectedServiceId)
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    notes: '',
    paymentMethod: 'airtel' // airtel, tnm, card
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleServiceSelect = (id: string) => {
    setSelectedService(SERVICES.find(s => s.id === id));
    setStep(2);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const now = new Date();

    // Name Validation
    if (!formData.name.trim()) newErrors.name = 'Full name is required';

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone Validation (International)
    // Clean spaces, dashes, parentheses
    const cleanPhone = formData.phone.replace(/[\s-()]/g, '');
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone = 'Enter a valid phone number (e.g. +1 234...)';
    }

    // Date & Time Validation
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';

    if (formData.date && formData.time) {
      const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
      if (selectedDateTime <= now) {
        newErrors.date = 'Please select a future date and time';
        newErrors.time = ' ';
      }
    } else if (formData.date) {
        // If only date provided so far, check if date is in past (simple check)
        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0,0,0,0);
        if (selectedDate < today) {
            newErrors.date = 'Date cannot be in the past';
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep(3); // Go to payment
    }
  };

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setStep(4); // Go to confirmation screen
    }, 2000);
  };

  const calculateDeposit = (priceStr: string | undefined) => {
    if (!priceStr) return '0';
    const amount = parseInt(priceStr.replace(/[^0-9]/g, ''));
    return isNaN(amount) ? '0' : (amount / 2).toLocaleString();
  };

  const getInputClass = (fieldName: string) => `
    w-full bg-black/30 border rounded-lg p-3 text-white outline-none focus:ring-1 transition-all
    ${errors[fieldName] 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
      : 'border-white/10 focus:border-brand-primary focus:ring-brand-primary'}
  `;

  return (
    <div className="py-12 bg-brand-dark min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8 text-sm">
            {[
              { num: 1, label: 'Service' },
              { num: 2, label: 'Details' },
              { num: 3, label: 'Payment' },
              { num: 4, label: 'Done' }
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className={`flex flex-col items-center ${step >= s.num ? 'text-brand-primary' : 'text-gray-500'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors duration-300 ${
                    step >= s.num ? 'bg-brand-primary text-white' : 'bg-white/10'
                  }`}>
                    {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                  </div>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {idx < 3 && (
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

          {/* STEP 2: Details Form */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-6">Project Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                  <input 
                    name="name" 
                    onChange={handleChange} 
                    value={formData.name} 
                    type="text" 
                    className={getInputClass('name')}
                    placeholder="Enter your name" 
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email</label>
                  <input 
                    name="email" 
                    onChange={handleChange} 
                    value={formData.email} 
                    type="email" 
                    className={getInputClass('email')}
                    placeholder="Enter your email" 
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Phone</label>
                <input 
                  name="phone" 
                  onChange={handleChange} 
                  value={formData.phone} 
                  type="tel" 
                  className={getInputClass('phone')}
                  placeholder="Enter your phone number" 
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.phone}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-gray-500 h-5 w-5" />
                    <input 
                      name="date" 
                      onChange={handleChange} 
                      value={formData.date} 
                      type="date" 
                      className={`${getInputClass('date')} pl-10`} 
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  {errors.date && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.date}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 text-gray-500 h-5 w-5" />
                    <input 
                      name="time" 
                      onChange={handleChange} 
                      value={formData.time} 
                      type="time" 
                      className={`${getInputClass('time')} pl-10`} 
                    />
                  </div>
                  {errors.time && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.time}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Project Brief / Notes</label>
                <textarea name="notes" onChange={handleChange} value={formData.notes} rows={4} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-brand-primary outline-none" placeholder="Describe your vision, specific shots needed, or music preference..."></textarea>
              </div>

              <div>
                  <label className="block text-sm text-gray-400 mb-1">Upload Reference (Optional)</label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:bg-white/5 transition-colors cursor-pointer relative">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                    <UploadCloud className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-400">Tap to upload files (PDF, JPG, PNG)</p>
                  </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setStep(1)} className="flex-1 px-6 py-3 rounded-lg border border-white/10 text-white hover:bg-white/10">Back</button>
                <button type="submit" className="flex-1 px-6 py-3 rounded-lg bg-brand-primary text-white font-bold hover:bg-blue-600">Continue</button>
              </div>
            </form>
          )}

          {/* STEP 3: Payment */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-2">Secure Deposit</h2>
              <p className="text-gray-400 mb-6">A 50% deposit is required to secure your booking.</p>
              
              <div className="bg-brand-primary/10 p-4 rounded-lg border border-brand-primary/20 mb-8 flex justify-between items-center">
                <span className="text-white font-medium">{selectedService?.title}</span>
                <span className="text-brand-accent font-bold text-lg">{selectedService?.priceStart}</span>
              </div>

              <h3 className="text-white font-bold mb-4">Select Payment Method</h3>
              <div className="space-y-3 mb-8">
                <label className="flex items-center p-4 border border-white/10 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10">
                  <input type="radio" name="paymentMethod" value="airtel" checked={formData.paymentMethod === 'airtel'} onChange={handleChange} className="mr-3 w-5 h-5 text-brand-primary" />
                  <div className="flex-1">
                    <span className="text-white font-bold block">Airtel Money</span>
                    <span className="text-xs text-gray-400">Pay using Mobile Money</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-red-600"></div>
                </label>

                <label className="flex items-center p-4 border border-white/10 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10">
                  <input type="radio" name="paymentMethod" value="tnm" checked={formData.paymentMethod === 'tnm'} onChange={handleChange} className="mr-3 w-5 h-5 text-brand-primary" />
                  <div className="flex-1">
                    <span className="text-white font-bold block">TNM Mpamba</span>
                    <span className="text-xs text-gray-400">Pay using Mobile Money</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-green-600"></div>
                </label>

                <label className="flex items-center p-4 border border-white/10 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10">
                  <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleChange} className="mr-3 w-5 h-5 text-brand-primary" />
                  <div className="flex-1">
                    <span className="text-white font-bold block">Card Payment</span>
                    <span className="text-xs text-gray-400">Visa / Mastercard</span>
                  </div>
                  <CreditCard className="text-white" />
                </label>
              </div>

              <div className="flex gap-4">
                <button disabled={isProcessing} onClick={() => setStep(2)} className="flex-1 px-6 py-3 rounded-lg border border-white/10 text-white hover:bg-white/10 disabled:opacity-50">Back</button>
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

          {/* STEP 4: Confirmation */}
          {step === 4 && (
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
                          <span className="text-gray-400">Date & Time</span>
                          <div className="text-right">
                             <div className="text-white font-medium">{formData.date}</div>
                             <div className="text-gray-500 text-xs">{formData.time}</div>
                          </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                          <span className="text-gray-400">Total Value</span>
                          <span className="text-gray-500 line-through text-xs">{selectedService?.priceStart}</span>
                      </div>

                      <div className="flex justify-between items-center bg-green-500/10 p-2 rounded-lg -mx-2">
                          <span className="text-green-400 font-bold">Deposit Paid (50%)</span>
                          <span className="text-white font-bold text-lg">MK {calculateDeposit(selectedService?.priceStart)}</span>
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
                  <button className="bg-white/5 px-8 py-3 rounded-lg text-white font-medium hover:bg-white/10 transition-colors border border-white/10 flex items-center justify-center gap-2">
                     <Download className="w-4 h-4" /> Save Receipt
                  </button>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};