import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, Loader2, CheckCircle } from 'lucide-react';
import { COMPANY_INFO } from '../constants';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="py-20 bg-brand-dark border-t border-white/5" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Get in Touch</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Ready to start your next project? Contact us for a quote or consultation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-brand-primary/20 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Visit Us</p>
                    <p className="text-white font-medium">{COMPANY_INFO.location}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-brand-primary/20 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Call Us</p>
                    <p className="text-white font-medium">{COMPANY_INFO.phone}</p>
                    <p className="text-white font-medium">{COMPANY_INFO.phone2}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-brand-primary/20 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Email Us</p>
                    <p className="text-white font-medium">{COMPANY_INFO.email}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <h4 className="text-white font-bold mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href={COMPANY_INFO.socials.facebook} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">Facebook</a>
                  <a href={COMPANY_INFO.socials.youtube} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-red-500 transition-colors">YouTube</a>
                  <a href={`https://${COMPANY_INFO.socials.tiktok}`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors">TikTok</a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-fade-in">
                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-gray-400">Thank you for contacting us. We will get back to you shortly.</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-6 text-brand-primary hover:text-white text-sm font-bold"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-6">Send a Message</h3>
                
                <div>
                  <label htmlFor="name" className="block text-sm text-gray-400 mb-2">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-brand-primary outline-none focus:ring-1 focus:ring-brand-primary transition-all"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm text-gray-400 mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-brand-primary outline-none focus:ring-1 focus:ring-brand-primary transition-all"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm text-gray-400 mb-2">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-brand-primary outline-none focus:ring-1 focus:ring-brand-primary transition-all"
                  >
                    <option value="">Select a subject...</option>
                    <option value="Booking Inquiry">Booking Inquiry</option>
                    <option value="Service Quote">Service Quote</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm text-gray-400 mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-brand-primary outline-none focus:ring-1 focus:ring-brand-primary transition-all"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-primary hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};