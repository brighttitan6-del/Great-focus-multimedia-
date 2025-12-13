
import React, { useState, useRef, useEffect } from 'react';
import { generateCreativeAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Sparkles, User, Bot, Lock, Loader2, CheckCircle, Smartphone } from 'lucide-react';

export const AiConsultant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm your creative assistant at Great Focus created by bright Titan. Need ideas for a wedding theme, an ad script, or a logo concept? Ask me anything!", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Payment State
  const [hasPaid, setHasPaid] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentProvider, setPaymentProvider] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, hasPaid]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await generateCreativeAdvice(input);
    
    const modelMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  const handlePayment = (provider: string) => {
    setIsProcessingPayment(true);
    setPaymentProvider(provider);
    // Simulate payment processing delay
    setTimeout(() => {
      setIsProcessingPayment(false);
      setHasPaid(true);
      setPaymentProvider(null);
    }, 2000);
  };

  return (
    <div className="bg-brand-dark py-12 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden h-[600px] flex flex-col relative">
          
          {/* Header */}
          <div className="bg-brand-primary p-4 flex items-center gap-3 relative z-10">
            <Sparkles className="text-brand-accent h-6 w-6" />
            <div>
              <h2 className="text-white font-bold">Creative Consultant (AI)</h2>
              <p className="text-blue-200 text-xs">Powered by Gemini 2.5</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start max-w-[80%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-gray-600' : 'bg-brand-primary'}`}>
                    {msg.role === 'user' ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
                  </div>
                  <div className={`p-3 rounded-lg text-sm ${
                    msg.role === 'user' 
                      ? 'bg-white/10 text-white rounded-tr-none' 
                      : 'bg-brand-primary/20 border border-brand-primary/20 text-gray-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 bg-brand-primary/20 p-3 rounded-lg rounded-tl-none ml-10">
                  <div className="w-2 h-2 bg-brand-accent rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-2 h-2 bg-brand-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-brand-accent rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Payment Gate Overlay */}
          {!hasPaid && (
            <div className="absolute inset-0 z-20 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center p-6 top-[72px]">
               <div className="bg-gray-900 border border-brand-primary/30 p-8 rounded-2xl shadow-2xl max-w-sm text-center w-full animate-scale-in">
                  <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-primary/50 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                     <Lock className="h-8 w-8 text-brand-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Unlock AI Assistant</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Get unlimited creative advice and concepts generated instantly.
                  </p>
                  
                  <div className="bg-black/40 rounded-lg p-4 mb-6 border border-white/5">
                     <span className="text-gray-500 text-xs uppercase font-bold tracking-wider">Access Fee</span>
                     <div className="text-3xl font-bold text-white mt-1 text-brand-accent">MK 500</div>
                  </div>

                  <div className="space-y-3 w-full">
                    <button 
                      onClick={() => handlePayment('Airtel')}
                      disabled={isProcessingPayment}
                      className="w-full py-3 bg-[#e40000] hover:bg-[#cc0000] text-white font-bold rounded-lg shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed border border-white/10"
                    >
                      {isProcessingPayment && paymentProvider === 'Airtel' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Smartphone className="h-5 w-5" />}
                      {isProcessingPayment && paymentProvider === 'Airtel' ? 'Processing...' : 'Pay with Airtel Money'}
                    </button>

                    <button 
                      onClick={() => handlePayment('TNM')}
                      disabled={isProcessingPayment}
                      className="w-full py-3 bg-[#00A550] hover:bg-[#008f45] text-white font-bold rounded-lg shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed border border-white/10"
                    >
                      {isProcessingPayment && paymentProvider === 'TNM' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Smartphone className="h-5 w-5" />}
                      {isProcessingPayment && paymentProvider === 'TNM' ? 'Processing...' : 'Pay with TNM Mpamba'}
                    </button>
                  </div>

                  <p className="text-[10px] text-gray-500 mt-4 flex items-center justify-center gap-1">
                     <CheckCircle className="h-3 w-3 text-green-500" /> Secure Mobile Money Transaction
                  </p>
               </div>
            </div>
          )}

          {/* Input - Blurred/Disabled when locked */}
          <div className={`p-4 border-t border-white/10 bg-black/20 ${!hasPaid ? 'filter blur-[2px] opacity-60 pointer-events-none select-none' : ''}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ex: 'Suggest a song for a fast-paced car ad...'"
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary"
                disabled={!hasPaid}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !hasPaid}
                className="bg-brand-primary hover:bg-blue-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
