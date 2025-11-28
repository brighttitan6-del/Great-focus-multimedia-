import React, { useState, useRef, useEffect } from 'react';
import { generateCreativeAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Sparkles, User, Bot } from 'lucide-react';

export const AiConsultant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm your creative assistant at Great Focus. Need ideas for a wedding theme, an ad script, or a logo concept? Ask me anything!", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  return (
    <div className="bg-brand-dark py-12 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden h-[600px] flex flex-col">
          
          {/* Header */}
          <div className="bg-brand-primary p-4 flex items-center gap-3">
            <Sparkles className="text-brand-accent h-6 w-6" />
            <div>
              <h2 className="text-white font-bold">Creative Consultant (AI)</h2>
              <p className="text-blue-200 text-xs">Powered by Gemini 2.5</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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

          {/* Input */}
          <div className="p-4 border-t border-white/10 bg-black/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ex: 'Suggest a song for a fast-paced car ad...'"
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
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