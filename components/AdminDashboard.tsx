
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  DollarSign, Calendar, TrendingUp, LayoutGrid, Video, 
  Briefcase, CreditCard, Plus, UploadCloud,
  Trash2, Edit, Download, MoreHorizontal, Search, Bell,
  Save, X, Layers, Clock, User as UserIcon, LogOut, CheckCircle, Square, CheckSquare,
  Menu, MessageSquare, AlertCircle, Lock, Loader2, Phone, Mail, FileText,
  Smartphone, History, ArrowUpRight, ArrowDownLeft, MoreVertical,
  Activity, List, Send, Filter, Image as ImageIcon, PlayCircle, MonitorPlay,
  ArrowLeft, Paperclip, Smile, Landmark, Wallet
} from 'lucide-react';
import { ServiceUploadForm } from './ServiceUploadForm';
import { User, ServiceItem, Booking, Project, ActivityLog, PortfolioItem } from '../types';
import { api } from '../services/api';

interface AdminDashboardProps {
  user: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
}

interface Invoice {
  id: string;
  client: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  method: string;
}

interface Transaction {
  id: string;
  type: 'Credit' | 'Debit';
  description: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  method?: string;
}

interface ChatConversation {
    id: number;
    name: string;
    avatar: string;
    color: string;
    email?: string;
    phone?: string;
    project?: string;
    status: 'online' | 'offline' | 'busy';
    lastMessage: string;
    time: string;
    unread: number;
    history: {
        id: string;
        sender: 'admin' | 'client';
        text: string;
        time: string;
    }[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogin, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'bookings' | 'projects' | 'finance' | 'messages' | 'portfolio'>('overview');
  const [isUploading, setIsUploading] = useState(false);
  const [editingServiceData, setEditingServiceData] = useState<ServiceItem | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Data State
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  
  // Portfolio Upload State
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [newPortfolioItem, setNewPortfolioItem] = useState({
      title: '',
      category: 'Wedding',
      type: 'image',
      videoUrl: '',
      imageUrl: ''
  });
  const [uploadPreview, setUploadPreview] = useState<string>('');

  // Projects Filter & Activity State
  const [projectSearch, setProjectSearch] = useState('');
  const [projectStatusFilter, setProjectStatusFilter] = useState('All');
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [activityNote, setActivityNote] = useState('');

  // Finance State
  const [availableBalance, setAvailableBalance] = useState(145000);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawProvider, setWithdrawProvider] = useState<'airtel' | 'tnm' | 'bank'>('airtel');
  const [withdrawAccount, setWithdrawAccount] = useState('');
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);

  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: "INV-2023-001", client: "Mwayi Phiri", date: "Nov 15, 2023", amount: 150000, status: "Paid", method: "Airtel Money" },
    { id: "INV-2023-002", client: "Daniel Banda", date: "Nov 20, 2023", amount: 85000, status: "Pending", method: "TNM Mpamba" },
    { id: "INV-2023-003", client: "Sarah Johnson", date: "Nov 10, 2023", amount: 40000, status: "Paid", method: "Cash" },
    { id: "INV-2023-004", client: "Green Energy Ltd", date: "Nov 22, 2023", amount: 60000, status: "Overdue", method: "Bank Transfer" },
  ]);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "TRX-998", type: "Credit", description: "Payment from Mwayi Phiri", amount: 150000, date: "Nov 15, 2023", status: "Completed", method: "Airtel Money" },
    { id: "TRX-997", type: "Debit", description: "Equipment Rental", amount: 25000, date: "Nov 12, 2023", status: "Completed", method: "Bank Transfer" },
  ]);

  // Messages State (Upgraded)
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [chatSearch, setChatSearch] = useState('');
  const [chatMessageInput, setChatMessageInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [chatConversations, setChatConversations] = useState<ChatConversation[]>([
     {
        id: 1,
        name: 'TechMalawi',
        avatar: 'T',
        color: 'bg-blue-600',
        phone: '265999123456',
        project: 'Product Launch Ad',
        status: 'online',
        lastMessage: 'Looks great! Can we change the background music?',
        time: 'Nov 25',
        unread: 1,
        history: [
            { id: '1', sender: 'admin', text: 'Here is the first draft of the launch ad.', time: '10:00 AM' },
            { id: '2', sender: 'client', text: 'Looks great! Can we change the background music?', time: '10:30 AM' }
        ]
     },
     {
        id: 2,
        name: 'John Doe',
        avatar: 'J',
        color: 'bg-indigo-600',
        email: 'john@example.com',
        project: 'Wedding Quote',
        status: 'offline',
        lastMessage: 'Hi, I need a quote for my wedding in December.',
        time: '2h ago',
        unread: 2,
        history: [
            { id: '1', sender: 'client', text: 'Hi, I need a quote for my wedding in December. We will have around 200 guests.', time: '2:00 PM' }
        ]
     },
     {
        id: 3,
        name: 'Alice Smith',
        avatar: 'A',
        color: 'bg-pink-600',
        email: 'alice@company.com',
        project: 'Corporate Video',
        status: 'online',
        lastMessage: 'Do you do drone shots for real estate?',
        time: '1d ago',
        unread: 0,
        history: [
             { id: '1', sender: 'client', text: 'Do you do drone shots for real estate? We have a new complex opening soon.', time: 'Yesterday' },
             { id: '2', sender: 'admin', text: 'Yes, we specialize in drone cinematography. I can send our portfolio.', time: 'Yesterday' }
        ]
     },
     {
        id: 4,
        name: 'Robert Brown',
        avatar: 'R',
        color: 'bg-orange-600',
        email: 'robert@gmail.com',
        project: 'Music Video',
        status: 'busy',
        lastMessage: 'Looking for a director for my new Afro-pop song.',
        time: '2d ago',
        unread: 0,
        history: [
            { id: '1', sender: 'client', text: 'Looking for a director for my new Afro-pop song. Budget is flexible.', time: 'Mon' }
        ]
     }
  ]);

  const activeChat = useMemo(() => chatConversations.find(c => c.id === activeConversationId), [chatConversations, activeConversationId]);
  
  useEffect(() => {
     if(activeChat && chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
     }
  }, [activeChat?.history]);

  const handleSendMessage = (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!chatMessageInput.trim() || !activeConversationId) return;
      
      const newMsg = {
          id: `m-${Date.now()}`,
          sender: 'admin' as const,
          text: chatMessageInput,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatConversations(prev => prev.map(c => {
          if (c.id === activeConversationId) {
              return {
                  ...c,
                  history: [...c.history, newMsg],
                  lastMessage: chatMessageInput,
                  time: 'Just now'
              };
          }
          return c;
      }));
      setChatMessageInput('');
      
      // Simulate reply
      setTimeout(() => {
          setChatConversations(prev => prev.map(c => {
              if (c.id === activeConversationId) {
                  return {
                      ...c,
                      history: [...c.history, {
                          id: `m-r-${Date.now()}`,
                          sender: 'client',
                          text: 'Thanks for the update!',
                          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      }],
                      lastMessage: 'Thanks for the update!',
                      time: 'Just now'
                  };
              }
              return c;
          }));
      }, 3000);
  };

  // --- ANALYTICS ---
  const monthlyRevenueData = useMemo(() => [
    { month: 'Jan', revenue: 150000 }, { month: 'Feb', revenue: 180000 },
    { month: 'Mar', revenue: 160000 }, { month: 'Apr', revenue: 240000 },
    { month: 'May', revenue: 210000 }, { month: 'Jun', revenue: 320000 },
    { month: 'Jul', revenue: 380000 }, { month: 'Aug', revenue: 420000 },
  ], []);

  const servicePopularityData = useMemo(() => [
    { name: 'Video', value: 45, color: '#3b82f6' }, 
    { name: 'Photo', value: 25, color: '#10b981' },
    { name: 'Graphics', value: 20, color: '#f59e0b' }, 
    { name: 'Web', value: 10, color: '#6366f1' },
  ], []);

  // --- LOAD DATA ---
  useEffect(() => {
    if (user?.isAdmin) {
      setIsLoadingData(true);
      Promise.all([api.getServices(), api.getBookings(), api.getProjects(), api.getPortfolio()])
        .then(([s, b, p, port]) => {
          setServices(s);
          setBookings(b);
          setProjects(p);
          setPortfolioItems(port);
        })
        .finally(() => setIsLoadingData(false));
    }
  }, [user]);

  // --- ACTIONS ---
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const u = await api.login({ email: loginEmail, password: loginPassword });
      if (u.isAdmin) onLogin(u);
      else setLoginError('Access Denied');
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const amount = parseInt(withdrawAmount);
      if (!amount || amount <= 0) return alert("Please enter a valid amount");
      if (amount > availableBalance) return alert("Insufficient balance");
      if (!withdrawAccount.trim()) return alert("Please enter account details");

      setIsProcessingWithdraw(true);
      
      // Simulate API
      setTimeout(() => {
          const providerName = withdrawProvider === 'airtel' ? 'Airtel Money' : withdrawProvider === 'tnm' ? 'TNM Mpamba' : 'Bank Transfer';
          const newTx: Transaction = {
              id: `WTH-${Date.now().toString().slice(-6)}`,
              type: 'Debit',
              description: `Withdrawal to ${providerName}`,
              amount: amount,
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              status: 'Completed',
              method: providerName
          };
          
          setTransactions([newTx, ...transactions]);
          setAvailableBalance(prev => prev - amount);
          setIsProcessingWithdraw(false);
          setShowWithdrawModal(false);
          setWithdrawAmount('');
          setWithdrawAccount('');
          alert(`Successfully withdrew MK ${amount.toLocaleString()} to ${providerName} (${withdrawAccount})`);
      }, 2000);
  };

  // Portfolio Actions
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const result = reader.result as string;
              setUploadPreview(result);
              setNewPortfolioItem(prev => ({
                  ...prev,
                  imageUrl: prev.type === 'image' ? result : 'https://via.placeholder.com/400x300?text=Video',
                  videoUrl: prev.type === 'video' ? result : ''
              }));
          };
          reader.readAsDataURL(file);
      }
  };

  const handleAddPortfolio = async () => {
      if (!newPortfolioItem.title) return;
      
      const itemToAdd: Partial<PortfolioItem> = {
          title: newPortfolioItem.title,
          category: newPortfolioItem.category,
          type: newPortfolioItem.type as 'image' | 'video',
          imageUrl: newPortfolioItem.imageUrl || 'https://via.placeholder.com/400x300',
          videoUrl: newPortfolioItem.videoUrl
      };

      const added = await api.addPortfolioItem(itemToAdd);
      setPortfolioItems([added, ...portfolioItems]);
      setShowPortfolioModal(false);
      setNewPortfolioItem({ title: '', category: 'Wedding', type: 'image', videoUrl: '', imageUrl: '' });
      setUploadPreview('');
  };

  const handleDeletePortfolio = async (id: string) => {
      if(confirm('Delete this item from portfolio?')) {
          await api.deletePortfolioItem(id);
          setPortfolioItems(prev => prev.filter(i => i.id !== id));
      }
  };

  const handleUpdateInvoiceStatus = (id: string, newStatus: Invoice['status']) => {
      setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv));
  };

  // Booking Actions
  const handleBookingAction = async (id: string, action: 'confirm' | 'complete' | 'cancel') => {
    const statusMap = {
      confirm: 'Confirmed',
      complete: 'Completed',
      cancel: 'Cancelled'
    } as const;
    
    const newStatus = statusMap[action];
    
    // Optimistic Update
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    
    try {
      await api.updateBooking(id, { status: newStatus });
    } catch (err) {
      console.error("Failed to update booking", err);
    }
  };

  // Project Actions
  const handleProjectProgress = (id: string, newProgress: number) => {
     const newActivity: ActivityLog = { id: Date.now().toString(), text: `Progress updated to ${newProgress}%`, date: new Date().toLocaleString(), type: 'info' };
     setProjects(prev => prev.map(p => {
         if (p.id === id) {
             return { 
                 ...p, 
                 progress: newProgress,
                 activities: [newActivity, ...(p.activities || [])]
             };
         }
         return p;
     }));
     api.updateProject(id, { progress: newProgress });
  };
  
  const handleAddDeliverable = (projectId: string) => {
      const name = prompt("Deliverable Name (e.g., Final Video):");
      if (!name) return;
      const url = prompt("Deliverable URL (Google Drive/Dropbox link):");
      if (!url) return;
      
      const type = name.toLowerCase().includes('video') ? 'video' : name.toLowerCase().includes('image') || name.toLowerCase().includes('photo') ? 'image' : 'file';
      const newDeliverable = { name, url, type: type as any };
      
      setProjects(prev => prev.map(p => {
          if (p.id === projectId) {
              const updated = { ...p, deliverables: [...(p.deliverables || []), newDeliverable] };
              api.updateProject(p.id, { deliverables: updated.deliverables });
              return updated;
          }
          return p;
      }));
  };

  const handleDeleteDeliverable = (projectId: string, delIndex: number) => {
      if(!confirm("Remove this file?")) return;
      setProjects(prev => prev.map(p => {
          if (p.id === projectId && p.deliverables) {
              const updated = { ...p, deliverables: p.deliverables.filter((_, i) => i !== delIndex) };
              api.updateProject(p.id, { deliverables: updated.deliverables });
              return updated;
          }
          return p;
      }));
  };

  const handleOpenActivities = (project: Project) => {
      setCurrentProject(project);
      setShowActivityModal(true);
  };

  const handleAddActivity = () => {
      if (!currentProject || !activityNote.trim()) return;
      
      const newActivity: ActivityLog = {
          id: Date.now().toString(),
          text: activityNote,
          date: new Date().toLocaleString(),
          type: 'info'
      };

      const updatedProjects = projects.map(p => {
          if (p.id === currentProject.id) {
              return { ...p, activities: [newActivity, ...(p.activities || [])] };
          }
          return p;
      });

      setProjects(updatedProjects);
      setCurrentProject({ ...currentProject, activities: [newActivity, ...(currentProject.activities || [])] });
      setActivityNote('');
  };

  const handleDeleteProject = (id: string) => {
      if (confirm('Are you sure you want to delete this project? This cannot be undone.')) {
          setProjects(prev => prev.filter(p => p.id !== id));
      }
  };

  const filteredProjects = projects.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(projectSearch.toLowerCase()) || 
                            p.client.toLowerCase().includes(projectSearch.toLowerCase());
      const matchesStatus = projectStatusFilter === 'All' || p.status === projectStatusFilter;
      return matchesSearch && matchesStatus;
  });

  const getProjectStatusColor = (status: string) => {
      switch(status) {
          case 'Completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
          case 'In Progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
          case 'Editing': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
          case 'Planning': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
          default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      }
  };

  // --- RENDER HELPERS ---
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1e293b] border border-gray-700 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="bg-blue-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
              <Lock className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Admin Access</h2>
            <p className="text-gray-400 text-sm mt-2">Studio Control Center</p>
          </div>
          {loginError && <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-4 text-sm flex gap-2"><AlertCircle className="w-5 h-5"/>{loginError}</div>}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input type="email" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none" placeholder="Email" required />
            <input type="password" value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none" placeholder="Password" required />
            <button disabled={isLoggingIn} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex justify-center">{isLoggingIn ? <Loader2 className="animate-spin"/> : 'Enter Dashboard'}</button>
          </form>
          <button onClick={onLogout} className="w-full text-center text-gray-500 text-xs mt-6 hover:text-white">Back to Site</button>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutGrid },
    { id: 'services', label: 'Services Packages', icon: Layers },
    { id: 'portfolio', label: 'Portfolio Gallery', icon: ImageIcon },
    { id: 'bookings', label: 'Booking Requests', icon: Calendar },
    { id: 'projects', label: 'Active Projects', icon: Briefcase },
    { id: 'finance', label: 'Finance & Invoices', icon: DollarSign },
    { id: 'messages', label: 'Client Messages', icon: MessageSquare },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'messages':
        return (
           <div className="h-[calc(100vh-140px)] w-full max-w-6xl mx-auto flex flex-col md:flex-row bg-[#1e293b] rounded-2xl border border-gray-700 overflow-hidden shadow-2xl animate-fade-in relative">
              {/* Sidebar Contact List */}
              <div className={`w-full md:w-80 border-r border-gray-700 flex flex-col bg-[#1e293b] absolute md:relative inset-0 z-20 transition-transform duration-300 ${activeConversationId ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}>
                  {/* Search Header */}
                  <div className="p-4 border-b border-gray-700 bg-[#1e293b] z-10">
                      <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
                      <a 
                        href="https://web.whatsapp.com/" 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-green-600/10 border border-green-500/20 rounded-xl p-3 mb-4 flex items-center justify-between cursor-pointer hover:bg-green-600/20 transition-colors group"
                      >
                          <div className="flex items-center gap-3">
                              <div className="bg-green-500/20 p-2 rounded-lg"><MessageSquare className="h-5 w-5 text-green-500" /></div>
                              <div>
                                  <h3 className="text-sm font-bold text-white">WhatsApp Direct</h3>
                                  <p className="text-gray-400 text-[10px]">Connect instantly via Web</p>
                              </div>
                          </div>
                          <ArrowUpRight className="h-4 w-4 text-green-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </a>
                      <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <input 
                              type="text" 
                              value={chatSearch}
                              onChange={(e) => setChatSearch(e.target.value)}
                              placeholder="Search chats..." 
                              className="w-full bg-[#0f172a] text-white pl-9 pr-4 py-2.5 rounded-lg border border-gray-700 focus:border-blue-500 outline-none text-sm" 
                          />
                      </div>
                  </div>
                  
                  {/* List */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                      {chatConversations
                        .filter(c => c.name.toLowerCase().includes(chatSearch.toLowerCase()) || c.project?.toLowerCase().includes(chatSearch.toLowerCase()))
                        .map(chat => (
                          <div 
                              key={chat.id} 
                              onClick={() => setActiveConversationId(chat.id)}
                              className={`p-4 border-b border-gray-700/50 cursor-pointer hover:bg-white/5 transition-colors ${activeConversationId === chat.id ? 'bg-blue-600/10 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'}`}
                          >
                              <div className="flex justify-between items-start mb-1">
                                  <div className="flex items-center gap-3">
                                      <div className={`w-10 h-10 rounded-full ${chat.color} flex items-center justify-center text-white font-bold relative`}>
                                          {chat.avatar}
                                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1e293b] ${chat.status === 'online' ? 'bg-green-500' : chat.status === 'busy' ? 'bg-red-500' : 'bg-gray-500'}`}></div>
                                      </div>
                                      <div>
                                          <h4 className={`text-white text-sm ${chat.unread > 0 ? 'font-bold' : 'font-medium'}`}>{chat.name}</h4>
                                          {chat.project && <span className="text-[10px] text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">{chat.project}</span>}
                                      </div>
                                  </div>
                                  <div className="text-right">
                                      <span className="text-[10px] text-gray-500 block">{chat.time}</span>
                                      {chat.unread > 0 && <span className="inline-block bg-blue-600 text-white text-[10px] font-bold px-1.5 rounded-full min-w-[18px] text-center mt-1">{chat.unread}</span>}
                                  </div>
                              </div>
                              <p className={`text-xs mt-2 truncate ${chat.unread > 0 ? 'text-gray-300 font-medium' : 'text-gray-500'}`}>{chat.lastMessage}</p>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Chat Window */}
              <div className={`flex-1 flex flex-col bg-[#0f172a] absolute md:relative inset-0 z-10 transition-transform duration-300 ${activeConversationId ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
                  {activeChat ? (
                      <>
                          {/* Chat Header */}
                          <div className="p-4 border-b border-gray-700 bg-[#1e293b] flex justify-between items-center shadow-md z-10">
                              <div className="flex items-center gap-3">
                                  <button onClick={() => setActiveConversationId(null)} className="md:hidden text-gray-400 hover:text-white p-1 -ml-2">
                                      <ArrowLeft className="h-6 w-6" />
                                  </button>
                                  <div className={`w-10 h-10 rounded-full ${activeChat.color} flex items-center justify-center text-white font-bold`}>
                                      {activeChat.avatar}
                                  </div>
                                  <div>
                                      <h3 className="text-white font-bold text-sm md:text-base">{activeChat.name}</h3>
                                      <div className="flex items-center gap-2">
                                          <span className={`w-2 h-2 rounded-full ${activeChat.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                                          <span className="text-gray-400 text-xs capitalize">{activeChat.status}</span>
                                      </div>
                                  </div>
                              </div>
                              <div className="flex gap-2">
                                  {activeChat.phone && (
                                    <a 
                                      href={`https://wa.me/${activeChat.phone}`} 
                                      target="_blank" 
                                      rel="noreferrer"
                                      className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-500/10 rounded-lg transition-colors flex items-center justify-center" 
                                      title="Open WhatsApp"
                                    >
                                        <MessageSquare className="h-5 w-5" />
                                    </a>
                                  )}
                                  {activeChat.phone && (
                                    <a 
                                      href={`tel:${activeChat.phone}`}
                                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors flex items-center justify-center" 
                                      title="Call"
                                    >
                                        <Phone className="h-5 w-5" />
                                    </a>
                                  )}
                                  <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                      <MoreVertical className="h-5 w-5" />
                                  </button>
                              </div>
                          </div>

                          {/* Messages Area */}
                          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0f172a] custom-scrollbar">
                              <div className="text-center my-4">
                                  <span className="bg-gray-800 text-gray-500 text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">Start of conversation</span>
                              </div>
                              {activeChat.history.map((msg) => (
                                  <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                      <div className={`max-w-[85%] md:max-w-[70%] ${msg.sender === 'admin' ? 'items-end' : 'items-start'} flex flex-col`}>
                                          <div className={`p-3.5 text-sm rounded-2xl ${
                                              msg.sender === 'admin' 
                                              ? 'bg-blue-600 text-white rounded-br-sm' 
                                              : 'bg-[#1e293b] text-gray-200 border border-gray-700 rounded-bl-sm'
                                          }`}>
                                              {msg.text}
                                          </div>
                                          <span className="text-[10px] text-gray-500 mt-1 px-1">{msg.time}</span>
                                      </div>
                                  </div>
                              ))}
                              <div ref={chatEndRef} />
                          </div>

                          {/* Input Area */}
                          <div className="p-4 bg-[#1e293b] border-t border-gray-700">
                              <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                                  <button type="button" className="p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                                      <Paperclip className="h-5 w-5" />
                                  </button>
                                  <div className="flex-1 bg-[#0f172a] rounded-xl border border-gray-700 flex items-center px-4 py-2 focus-within:border-blue-500 transition-colors">
                                      <input 
                                          type="text" 
                                          value={chatMessageInput}
                                          onChange={(e) => setChatMessageInput(e.target.value)}
                                          placeholder="Type a message..." 
                                          className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm py-1"
                                      />
                                      <button type="button" className="text-gray-400 hover:text-white ml-2">
                                          <Smile className="h-5 w-5" />
                                      </button>
                                  </div>
                                  <button 
                                      type="submit" 
                                      disabled={!chatMessageInput.trim()}
                                      className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                  >
                                      <Send className="h-5 w-5" />
                                  </button>
                              </form>
                          </div>
                      </>
                  ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8 text-center">
                          <div className="w-20 h-20 bg-[#1e293b] rounded-full flex items-center justify-center mb-6 animate-pulse">
                              <MessageSquare className="h-10 w-10 text-gray-600" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-300 mb-2">Your Messages</h3>
                          <p className="max-w-xs text-sm">Select a conversation from the list to start chatting with your clients.</p>
                      </div>
                  )}
              </div>
           </div>
        );

      case 'portfolio':
        return (
          <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
             <div className="flex justify-between items-center mb-6">
                <div>
                   <h2 className="text-2xl font-bold text-white">Portfolio Gallery</h2>
                   <p className="text-gray-400 text-sm">Upload videos and images to showcase your work.</p>
                </div>
                <button onClick={() => setShowPortfolioModal(true)} className="bg-brand-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><UploadCloud className="h-4 w-4"/> Upload New Work</button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {portfolioItems.map((item) => (
                   <div key={item.id} className="bg-[#1e293b] rounded-xl overflow-hidden border border-gray-700 group relative">
                      <div className="aspect-video bg-black relative">
                         {item.type === 'video' ? (
                            <>
                               <img src={item.imageUrl || 'https://via.placeholder.com/400x300?text=Video'} className="w-full h-full object-cover opacity-60" />
                               <div className="absolute inset-0 flex items-center justify-center"><PlayCircle className="w-12 h-12 text-white opacity-80" /></div>
                            </>
                         ) : (
                            <img src={item.imageUrl} className="w-full h-full object-cover" />
                         )}
                         <button 
                            onClick={() => handleDeletePortfolio(item.id)}
                            className="absolute top-2 right-2 p-2 bg-red-600/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                         >
                            <Trash2 className="h-4 w-4" />
                         </button>
                      </div>
                      <div className="p-4">
                         <h4 className="text-white font-bold text-sm truncate">{item.title}</h4>
                         <p className="text-gray-500 text-xs uppercase mt-1">{item.category}</p>
                      </div>
                   </div>
                ))}
             </div>

             {/* Upload Modal */}
             {showPortfolioModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                   <div className="bg-gray-800 rounded-2xl w-full max-w-lg border border-gray-700 shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
                      <h3 className="text-xl font-bold text-white mb-4">Upload to Portfolio</h3>
                      <div className="space-y-4">
                         <div>
                            <label className="text-xs text-gray-400 uppercase font-bold block mb-1">Title</label>
                            <input type="text" value={newPortfolioItem.title} onChange={e => setNewPortfolioItem({...newPortfolioItem, title: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-brand-primary outline-none" placeholder="Project Title" />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <label className="text-xs text-gray-400 uppercase font-bold block mb-1">Category</label>
                               <select value={newPortfolioItem.category} onChange={e => setNewPortfolioItem({...newPortfolioItem, category: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-brand-primary outline-none">
                                  <option>Wedding</option>
                                  <option>Advertising</option>
                                  <option>Photography</option>
                                  <option>Graphic Design</option>
                                  <option>Corporate</option>
                               </select>
                            </div>
                            <div>
                               <label className="text-xs text-gray-400 uppercase font-bold block mb-1">Type</label>
                               <select value={newPortfolioItem.type} onChange={e => setNewPortfolioItem({...newPortfolioItem, type: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-brand-primary outline-none">
                                  <option value="image">Image</option>
                                  <option value="video">Video</option>
                               </select>
                            </div>
                         </div>
                         
                         {newPortfolioItem.type === 'video' && (
                             <div>
                                <label className="text-xs text-gray-400 uppercase font-bold block mb-1">YouTube Video URL</label>
                                <div className="relative">
                                   <MonitorPlay className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                                   <input 
                                      type="text" 
                                      value={newPortfolioItem.videoUrl} 
                                      onChange={e => setNewPortfolioItem({...newPortfolioItem, videoUrl: e.target.value})} 
                                      className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-3 py-3 text-white focus:border-brand-primary outline-none" 
                                      placeholder="https://youtube.com/..." 
                                   />
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1">Or upload a video file below</p>
                             </div>
                         )}

                         <div>
                            <label className="text-xs text-gray-400 uppercase font-bold block mb-1">File Upload</label>
                            <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-brand-primary transition-colors bg-gray-900/50">
                               <input type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" id="pf-upload" />
                               <label htmlFor="pf-upload" className="cursor-pointer flex flex-col items-center">
                                  {uploadPreview ? (
                                     newPortfolioItem.type === 'video' ? <video src={uploadPreview} className="h-32 rounded mb-2" controls /> : <img src={uploadPreview} className="h-32 object-cover rounded mb-2" />
                                  ) : (
                                     <UploadCloud className="h-8 w-8 text-gray-500 mb-2" />
                                  )}
                                  <span className="text-sm text-gray-300">Click to choose file</span>
                               </label>
                            </div>
                         </div>

                         <div className="flex gap-3 mt-6">
                            <button onClick={() => {setShowPortfolioModal(false); setUploadPreview('');}} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">Cancel</button>
                            <button onClick={handleAddPortfolio} className="flex-1 py-3 bg-brand-primary hover:bg-blue-600 text-white rounded-lg font-bold">Publish Item</button>
                         </div>
                      </div>
                   </div>
                </div>
             )}
          </div>
        );

      case 'finance':
        return (
          <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
             <div className="flex justify-between items-center mb-6">
                <div>
                   <h2 className="text-2xl font-bold text-white">Financial Performance</h2>
                   <p className="text-gray-400 text-sm">Revenue tracking and wallet withdrawals.</p>
                </div>
                <div className="flex gap-2">
                   <button className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-white/10">
                      <Download className="h-4 w-4" /> Report
                   </button>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 bg-gradient-to-br from-blue-900 to-slate-900 p-6 rounded-xl border border-blue-500/30 shadow-lg relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Wallet className="w-32 h-32 text-white" />
                   </div>
                   <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-2 relative z-10">Available Wallet Balance</p>
                   <h3 className="text-4xl font-heading font-bold text-white mb-6 relative z-10">MK {availableBalance.toLocaleString()}</h3>
                   <div className="flex gap-3 relative z-10">
                      <button 
                        onClick={() => setShowWithdrawModal(true)}
                        className="bg-brand-primary hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-blue-900/40 transition-all"
                      >
                         <ArrowUpRight className="h-4 w-4" /> Withdraw Funds
                      </button>
                   </div>
                </div>

                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 flex flex-col justify-center">
                   <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Pending Invoices</p>
                   <h3 className="text-2xl font-heading font-bold text-white">MK 85,000</h3>
                   <span className="text-yellow-500 text-xs flex items-center gap-1 mt-1 font-bold"><Clock className="h-3 w-3" /> 2 Waiting payment</span>
                </div>
                
                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 flex flex-col justify-center">
                   <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Total Revenue</p>
                   <h3 className="text-2xl font-heading font-bold text-white">MK 190,000</h3>
                   <span className="text-green-500 text-xs flex items-center gap-1 mt-1 font-bold"><TrendingUp className="h-3 w-3" /> +12% vs last month</span>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#1e293b] rounded-xl border border-gray-700 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">Transaction History</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#0f172a] text-gray-400 uppercase text-xs font-bold">
                                <tr>
                                    <th className="p-3 rounded-l-lg">Type</th>
                                    <th className="p-3">Description</th>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Amount</th>
                                    <th className="p-3 rounded-r-lg">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {transactions.map((txn) => (
                                    <tr key={txn.id} className="hover:bg-gray-800/50">
                                        <td className="p-3">
                                            <div className={`flex items-center gap-2 font-bold ${txn.type === 'Credit' ? 'text-green-500' : 'text-red-500'}`}>
                                                {txn.type === 'Credit' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                                                {txn.type}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <p className="font-medium text-white">{txn.description}</p>
                                            <p className="text-xs text-gray-500">{txn.method}</p>
                                        </td>
                                        <td className="p-3 text-gray-400">{txn.date}</td>
                                        <td className={`p-3 font-mono font-bold ${txn.type === 'Credit' ? 'text-green-400' : 'text-white'}`}>
                                            MK {txn.amount.toLocaleString()}
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
                                                txn.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                                txn.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                                                'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                                {txn.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-[#1e293b] rounded-xl border border-gray-700 p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Recent Invoices</h3>
                    <div className="space-y-4">
                        {invoices.slice(0, 4).map((inv) => (
                            <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg bg-[#0f172a] border border-gray-700">
                                <div>
                                    <p className="text-white text-xs font-bold">{inv.client}</p>
                                    <p className="text-[10px] text-gray-500">{inv.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white text-xs font-bold">MK {inv.amount.toLocaleString()}</p>
                                    <span className={`text-[10px] ${inv.status === 'Paid' ? 'text-green-500' : inv.status === 'Pending' ? 'text-yellow-500' : 'text-red-500'}`}>
                                        {inv.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
             </div>

             {/* Withdraw Modal */}
             {showWithdrawModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                   <div className="bg-[#1e293b] w-full max-w-md rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
                      <div className="p-6 border-b border-gray-700 bg-gray-900/50 flex justify-between items-center">
                         <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-brand-primary" /> Withdraw Funds
                         </h3>
                         <button onClick={() => setShowWithdrawModal(false)} className="text-gray-400 hover:text-white"><X className="h-5 w-5"/></button>
                      </div>
                      
                      <div className="p-6">
                         <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6 text-center">
                            <p className="text-blue-300 text-xs uppercase font-bold mb-1">Available to Withdraw</p>
                            <h4 className="text-2xl font-bold text-white">MK {availableBalance.toLocaleString()}</h4>
                         </div>

                         <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                            <div>
                               <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Withdraw To</label>
                               <div className="grid grid-cols-3 gap-2">
                                  <button 
                                    type="button"
                                    onClick={() => setWithdrawProvider('airtel')}
                                    className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${withdrawProvider === 'airtel' ? 'bg-red-600/20 border-red-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'}`}
                                  >
                                     <Smartphone className={`h-5 w-5 ${withdrawProvider === 'airtel' ? 'text-red-500' : ''}`} />
                                     <span className="text-[10px] font-bold">Airtel Money</span>
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={() => setWithdrawProvider('tnm')}
                                    className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${withdrawProvider === 'tnm' ? 'bg-green-600/20 border-green-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'}`}
                                  >
                                     <Smartphone className={`h-5 w-5 ${withdrawProvider === 'tnm' ? 'text-green-500' : ''}`} />
                                     <span className="text-[10px] font-bold">TNM Mpamba</span>
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={() => setWithdrawProvider('bank')}
                                    className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${withdrawProvider === 'bank' ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'}`}
                                  >
                                     <Landmark className={`h-5 w-5 ${withdrawProvider === 'bank' ? 'text-blue-500' : ''}`} />
                                     <span className="text-[10px] font-bold">Bank Transfer</span>
                                  </button>
                               </div>
                            </div>

                            <div>
                               <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                  {withdrawProvider === 'bank' ? 'Account Number' : 'Phone Number'}
                               </label>
                               <input 
                                  type="text" 
                                  value={withdrawAccount}
                                  onChange={(e) => setWithdrawAccount(e.target.value)}
                                  className="w-full bg-[#0f172a] border border-gray-600 rounded-lg p-3 text-white focus:border-brand-primary outline-none"
                                  placeholder={withdrawProvider === 'bank' ? 'Enter Account Number' : 'e.g. 099...'}
                                  required
                               />
                            </div>

                            <div>
                               <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Amount (MK)</label>
                               <div className="relative">
                                  <DollarSign className="absolute left-3 top-3 text-gray-500 h-4 w-4" />
                                  <input 
                                     type="number" 
                                     value={withdrawAmount}
                                     onChange={(e) => setWithdrawAmount(e.target.value)}
                                     className="w-full bg-[#0f172a] border border-gray-600 rounded-lg p-3 pl-9 text-white focus:border-brand-primary outline-none"
                                     placeholder="0.00"
                                     min="500"
                                     required
                                  />
                               </div>
                            </div>

                            <button 
                               type="submit" 
                               disabled={isProcessingWithdraw}
                               className="w-full py-3 bg-brand-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                            >
                               {isProcessingWithdraw ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowUpRight className="h-5 w-5" />}
                               {isProcessingWithdraw ? 'Processing...' : 'Confirm Withdrawal'}
                            </button>
                         </form>
                      </div>
                   </div>
                </div>
             )}
          </div>
        );

      case 'overview':
        return (
          <div className="space-y-6 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Revenue</p>
                    <h3 className="text-2xl font-heading font-bold text-white mt-1">MK 450,000</h3>
                  </div>
                  <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                    <DollarSign className="h-6 w-6" />
                  </div>
                </div>
                <span className="text-green-500 text-xs flex items-center gap-1 font-bold"><TrendingUp className="h-3 w-3" /> +15% from last month</span>
              </div>

              <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Active Projects</p>
                    <h3 className="text-2xl font-heading font-bold text-white mt-1">{projects.filter(p => p.status === 'In Progress').length}</h3>
                  </div>
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                    <Briefcase className="h-6 w-6" />
                  </div>
                </div>
                <span className="text-gray-400 text-xs">3 due this week</span>
              </div>

              <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Pending Bookings</p>
                    <h3 className="text-2xl font-heading font-bold text-white mt-1">{bookings.filter(b => b.status === 'Pending').length}</h3>
                  </div>
                  <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                    <Calendar className="h-6 w-6" />
                  </div>
                </div>
                <span className="text-yellow-500 text-xs font-bold">Action required</span>
              </div>

              <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Services</p>
                    <h3 className="text-2xl font-heading font-bold text-white mt-1">{services.length}</h3>
                  </div>
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                    <Video className="h-6 w-6" />
                  </div>
                </div>
                <span className="text-gray-400 text-xs"> across 5 categories</span>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg">
                <h3 className="text-white font-bold mb-6">Revenue Overview</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyRevenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg">
                <h3 className="text-white font-bold mb-6">Popular Services</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={servicePopularityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {servicePopularityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                         contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#fff' }}
                         itemStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-4 flex-wrap">
                    {servicePopularityData.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                        <span className="text-xs text-gray-400">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-[#1e293b] rounded-xl border border-gray-700 shadow-lg overflow-hidden">
               <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                  <h3 className="text-white font-bold">Recent Bookings</h3>
                  <button onClick={() => setActiveTab('bookings')} className="text-brand-primary text-sm font-bold hover:text-white transition-colors">View All</button>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                     <thead className="bg-[#0f172a] text-gray-400 uppercase text-xs font-bold">
                        <tr>
                           <th className="p-4">Client</th>
                           <th className="p-4">Service</th>
                           <th className="p-4">Date</th>
                           <th className="p-4">Status</th>
                           <th className="p-4 text-right">Amount</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-700">
                        {bookings.slice(0, 5).map((booking) => (
                           <tr key={booking.id} className="hover:bg-gray-800/50 transition-colors">
                              <td className="p-4 font-medium text-white">{booking.clientName}</td>
                              <td className="p-4 text-gray-300">{booking.serviceName || 'Unknown Service'}</td>
                              <td className="p-4 text-gray-400">{booking.date}</td>
                              <td className="p-4">
                                 <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
                                    booking.status === 'Confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                    booking.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                                    booking.status === 'Completed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                 }`}>
                                    {booking.status}
                                 </span>
                              </td>
                              <td className="p-4 text-right text-white font-mono">MK {booking.amount?.toLocaleString()}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          </div>
        );

        case 'services':
        return isUploading ? (
          <ServiceUploadForm 
            onCancel={() => { setIsUploading(false); setEditingServiceData(null); }} 
            onSave={async (service) => {
               if (editingServiceData) {
                  await api.updateService(service.id, service);
                  setServices(services.map(s => s.id === service.id ? service : s));
               } else {
                  await api.createService(service);
                  setServices([service, ...services]);
               }
               setIsUploading(false);
               setEditingServiceData(null);
            }}
            initialData={editingServiceData}
          />
        ) : (
          <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center bg-[#1e293b] p-4 rounded-xl border border-gray-700">
                <h2 className="text-xl font-bold text-white">Services Management</h2>
                <button onClick={() => setIsUploading(true)} className="bg-brand-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all">
                   <Plus className="h-5 w-5" /> Add New Service
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                   <div key={service.id} className="bg-[#1e293b] rounded-xl overflow-hidden border border-gray-700 hover:border-gray-500 transition-all shadow-lg group">
                      <div className="h-40 bg-gray-800 relative">
                         <img src={service.imageUrl || 'https://via.placeholder.com/400'} alt={service.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                         <div className="absolute top-2 right-2 flex gap-2">
                            <button 
                               onClick={() => {
                                  setEditingServiceData(service);
                                  setIsUploading(true);
                               }}
                               className="bg-blue-600 p-2 rounded-full text-white hover:bg-blue-500 shadow-md transform hover:scale-110 transition-all"
                            >
                               <Edit className="h-4 w-4" />
                            </button>
                            <button 
                               onClick={async () => {
                                  if(confirm('Are you sure you want to delete this service?')) {
                                     await api.deleteService(service.id);
                                     setServices(services.filter(s => s.id !== service.id));
                                  }
                               }}
                               className="bg-red-600 p-2 rounded-full text-white hover:bg-red-500 shadow-md transform hover:scale-110 transition-all"
                            >
                               <Trash2 className="h-4 w-4" />
                            </button>
                         </div>
                         <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-white border border-white/10">
                            {service.category}
                         </div>
                      </div>
                      <div className="p-4">
                         <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-white text-lg leading-tight">{service.title}</h3>
                            <span className="text-brand-accent font-bold text-sm whitespace-nowrap">{service.priceStart}</span>
                         </div>
                         <p className="text-gray-400 text-sm line-clamp-2 mb-4 h-10">{service.description}</p>
                         <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                            <div className="flex -space-x-2">
                               {service.tiers && service.tiers.length > 0 ? (
                                  service.tiers.map((_, i) => (
                                     <div key={i} className="w-6 h-6 rounded-full bg-gray-700 border-2 border-[#1e293b] flex items-center justify-center text-[8px] text-white">T{i+1}</div>
                                  ))
                               ) : (
                                  <span className="text-xs text-gray-500">No tiers</span>
                               )}
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${service.isActive !== false ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                               {service.isActive !== false ? 'Active' : 'Inactive'}
                            </span>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        );

      case 'bookings':
        return (
          <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
             <div className="flex justify-between items-center mb-6">
                <div>
                   <h2 className="text-2xl font-bold text-white">Booking Requests</h2>
                   <p className="text-gray-400 text-sm">Manage client appointments and orders.</p>
                </div>
                <div className="flex gap-2">
                   <button className="bg-[#1e293b] text-white px-4 py-2 rounded-lg border border-gray-700 flex items-center gap-2 hover:bg-gray-800">
                      <Filter className="h-4 w-4" /> Filter
                   </button>
                   <button className="bg-[#1e293b] text-white px-4 py-2 rounded-lg border border-gray-700 flex items-center gap-2 hover:bg-gray-800">
                      <Download className="h-4 w-4" /> Export
                   </button>
                </div>
             </div>

             <div className="bg-[#1e293b] rounded-xl border border-gray-700 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm">
                      <thead className="bg-[#0f172a] text-gray-400 uppercase text-xs font-bold">
                         <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Client</th>
                            <th className="p-4">Service Details</th>
                            <th className="p-4">Date & Time</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                         {bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-800/50 transition-colors group">
                               <td className="p-4 font-mono text-xs text-gray-500">#{booking.id.slice(-6)}</td>
                               <td className="p-4">
                                  <p className="font-bold text-white">{booking.clientName}</p>
                                  <p className="text-xs text-gray-400">user@example.com</p>
                               </td>
                               <td className="p-4">
                                  <p className="text-white font-medium">{booking.serviceName}</p>
                                  <p className="text-xs text-brand-primary">{booking.tierName}</p>
                               </td>
                               <td className="p-4 text-gray-300">
                                  <div className="flex items-center gap-2">
                                     <Calendar className="h-3 w-3" /> {booking.date}
                                  </div>
                               </td>
                               <td className="p-4">
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                     booking.status === 'Confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                     booking.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                                     booking.status === 'Completed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                     'bg-red-500/10 text-red-400 border-red-500/20'
                                  }`}>
                                     {booking.status}
                                  </span>
                               </td>
                               <td className="p-4">
                                  <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                     {booking.status === 'Pending' && (
                                        <>
                                           <button onClick={() => handleBookingAction(booking.id, 'confirm')} className="bg-green-600 p-2 rounded hover:bg-green-500 text-white shadow-lg" title="Confirm">
                                              <CheckCircle className="h-4 w-4" />
                                           </button>
                                           <button onClick={() => handleBookingAction(booking.id, 'cancel')} className="bg-red-600 p-2 rounded hover:bg-red-500 text-white shadow-lg" title="Cancel">
                                              <X className="h-4 w-4" />
                                           </button>
                                        </>
                                     )}
                                     {booking.status === 'Confirmed' && (
                                        <button onClick={() => handleBookingAction(booking.id, 'complete')} className="bg-blue-600 p-2 rounded hover:bg-blue-500 text-white shadow-lg" title="Mark Complete">
                                           <CheckSquare className="h-4 w-4" />
                                        </button>
                                     )}
                                     <button className="bg-gray-700 p-2 rounded hover:bg-gray-600 text-white shadow-lg">
                                        <MoreHorizontal className="h-4 w-4" />
                                     </button>
                                  </div>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
             <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div>
                   <h2 className="text-2xl font-bold text-white">Active Projects</h2>
                   <p className="text-gray-400 text-sm">Track progress and client deliverables.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                   <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <input 
                         type="text" 
                         value={projectSearch}
                         onChange={(e) => setProjectSearch(e.target.value)}
                         placeholder="Search projects..." 
                         className="w-full bg-[#1e293b] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:border-brand-primary outline-none"
                      />
                   </div>
                   <select 
                      value={projectStatusFilter}
                      onChange={(e) => setProjectStatusFilter(e.target.value)}
                      className="bg-[#1e293b] border border-gray-700 rounded-lg px-4 py-2 text-white text-sm outline-none"
                   >
                      <option value="All">All Status</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Editing">Editing</option>
                      <option value="Client Review">Client Review</option>
                      <option value="Completed">Completed</option>
                   </select>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                   <div key={project.id} className="bg-[#1e293b] rounded-xl border border-gray-700 p-6 flex flex-col shadow-lg hover:border-gray-500 transition-all">
                      <div className="flex justify-between items-start mb-4">
                         <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${getProjectStatusColor(project.status)}`}>
                            {project.status}
                         </span>
                         <button onClick={() => handleDeleteProject(project.id)} className="text-gray-500 hover:text-red-400">
                            <Trash2 className="h-4 w-4" />
                         </button>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                      <p className="text-sm text-gray-400 mb-4 flex items-center gap-2"><UserIcon className="h-3 w-3" /> {project.client}</p>
                      
                      <div className="mb-4">
                         <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-brand-primary font-bold">{project.progress}%</span>
                         </div>
                         <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden cursor-pointer" title="Click to update">
                            <div 
                               className="bg-brand-primary h-full rounded-full transition-all duration-500" 
                               style={{ width: `${project.progress}%` }}
                            ></div>
                            <input 
                               type="range" 
                               min="0" 
                               max="100" 
                               value={project.progress} 
                               onChange={(e) => handleProjectProgress(project.id, parseInt(e.target.value))}
                               className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                         </div>
                      </div>

                      <div className="space-y-3 mb-6 flex-1">
                         <div className="flex items-center gap-2 text-xs text-gray-300">
                            <Clock className="h-3 w-3" /> Due: <span className="text-white">{project.dueDate}</span>
                         </div>
                         {project.deliverables && project.deliverables.length > 0 && (
                             <div className="space-y-1">
                                 <p className="text-[10px] uppercase font-bold text-gray-500">Files</p>
                                 {project.deliverables.map((del, idx) => (
                                     <div key={idx} className="flex justify-between items-center text-xs bg-gray-800 p-2 rounded border border-gray-700">
                                         <span className="truncate max-w-[150px] text-gray-300">{del.name}</span>
                                         <button onClick={() => handleDeleteDeliverable(project.id, idx)} className="text-red-400 hover:text-red-300"><X className="h-3 w-3" /></button>
                                     </div>
                                 ))}
                             </div>
                         )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-auto">
                         <button 
                             onClick={() => handleAddDeliverable(project.id)}
                             className="bg-gray-700 hover:bg-gray-600 text-white text-xs py-2 rounded-lg font-medium flex items-center justify-center gap-1"
                         >
                             <UploadCloud className="h-3 w-3" /> Upload File
                         </button>
                         <button 
                             onClick={() => handleOpenActivities(project)}
                             className="bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary text-xs py-2 rounded-lg font-bold flex items-center justify-center gap-1 border border-brand-primary/30"
                         >
                             <Activity className="h-3 w-3" /> Activity Log
                         </button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100 flex font-sans">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1e293b] border-r border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="h-20 flex items-center px-6 border-b border-gray-700">
            <h1 className="text-xl font-heading font-bold text-white tracking-wider">STUDIO ADMIN</h1>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
            {sidebarItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id as any); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                  {item.id === 'bookings' && bookings.filter(b => b.status === 'Pending').length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {bookings.filter(b => b.status === 'Pending').length}
                    </span>
                  )}
                  {item.id === 'messages' && chatConversations.reduce((acc, curr) => acc + curr.unread, 0) > 0 && (
                      <span className="ml-auto bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {chatConversations.reduce((acc, curr) => acc + curr.unread, 0)}
                      </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-3 mb-4 px-2">
              <img src={user.avatar || "https://ui-avatars.com/api/?name=Admin"} alt="Admin" className="w-10 h-10 rounded-full border-2 border-blue-500" />
              <div>
                <p className="text-sm font-bold text-white truncate w-32">{user.name}</p>
                <p className="text-xs text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white py-2.5 rounded-lg transition-colors text-sm font-bold"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-[#0f172a]/95 backdrop-blur-md border-b border-gray-700 flex items-center justify-between px-6 sticky top-0 z-30">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
             <div className="relative">
                <Bell className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0f172a]"></span>
             </div>
             <a href="/" target="_blank" className="text-sm text-gray-400 hover:text-white flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 transition-colors">
                View Site <ArrowUpRight className="h-3 w-3" />
             </a>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-[#0f172a] custom-scrollbar">
          {isLoadingData ? (
             <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-brand-primary" />
                <p>Loading Studio Data...</p>
             </div>
          ) : (
             renderContent()
          )}
        </main>
      </div>

      {/* Modals */}
      {showActivityModal && currentProject && (
         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-[#1e293b] w-full max-w-lg rounded-xl shadow-2xl border border-gray-700 flex flex-col max-h-[80vh]">
               <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/50 rounded-t-xl">
                  <h3 className="font-bold text-white">Project Activity Log</h3>
                  <button onClick={() => setShowActivityModal(false)} className="text-gray-400 hover:text-white"><X className="h-5 w-5"/></button>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {currentProject.activities?.map((act) => (
                     <div key={act.id} className="flex gap-3">
                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${act.type === 'success' ? 'bg-green-500' : act.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                        <div>
                           <p className="text-sm text-gray-300">{act.text}</p>
                           <p className="text-xs text-gray-500 mt-1">{act.date}</p>
                        </div>
                     </div>
                  ))}
                  {(!currentProject.activities || currentProject.activities.length === 0) && (
                     <p className="text-gray-500 text-center italic text-sm">No activity recorded yet.</p>
                  )}
               </div>
               <div className="p-4 border-t border-gray-700 bg-gray-900/50 rounded-b-xl">
                  <div className="flex gap-2">
                     <input 
                        type="text" 
                        value={activityNote}
                        onChange={(e) => setActivityNote(e.target.value)}
                        placeholder="Add a note..." 
                        className="flex-1 bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-brand-primary outline-none"
                     />
                     <button onClick={handleAddActivity} disabled={!activityNote.trim()} className="bg-brand-primary text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50">
                        <Send className="h-4 w-4" />
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};
