

import React, { useState, useMemo, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  DollarSign, Calendar, TrendingUp, LayoutGrid, Video, 
  Briefcase, CreditCard, Plus, UploadCloud,
  Trash2, Edit, Download, MoreHorizontal, Search, Bell,
  Save, X, Layers, Clock, User as UserIcon, LogOut, CheckCircle, Square, CheckSquare,
  Menu, MessageSquare, AlertCircle, Lock, Loader2, Phone, Mail, FileText,
  Smartphone, History, ArrowUpRight, ArrowDownLeft, MoreVertical,
  Activity, List, Send, Filter, Image as ImageIcon, PlayCircle, MonitorPlay
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

  // Withdrawal Modal State
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'airtel' | 'tnm'>('airtel');
  const [withdrawPhone, setWithdrawPhone] = useState('');
  const [withdrawName, setWithdrawName] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Messages State
  const [messages, setMessages] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', subject: 'Wedding Quote', message: 'Hi, I need a quote for my wedding in December. We will have around 200 guests.', date: '2h ago', read: false },
    { id: 2, name: 'Alice Smith', email: 'alice@company.com', subject: 'Corporate Video', message: 'Do you do drone shots for real estate? We have a new complex opening soon.', date: '1d ago', read: true },
    { id: 3, name: 'Robert Brown', email: 'robert@gmail.com', subject: 'Music Video', message: 'Looking for a director for my new Afro-pop song. Budget is flexible.', date: '2d ago', read: false },
  ]);

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

  const handleWithdrawFunds = () => {
    if (!withdrawAmount || !withdrawPhone || !withdrawName) return;
    setIsWithdrawing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsWithdrawing(false);
      setShowWithdrawModal(false);
      
      const amount = parseFloat(withdrawAmount);
      const newTxn: Transaction = {
          id: `TRX-${Math.floor(Math.random() * 10000)}`,
          type: 'Debit',
          description: `Withdrawal to ${withdrawName}`,
          amount: amount,
          date: new Date().toLocaleDateString(),
          status: 'Pending',
          method: withdrawMethod === 'airtel' ? 'Airtel Money' : 'TNM Mpamba'
      };
      
      setTransactions(prev => [newTxn, ...prev]);
      setWithdrawAmount('');
      setWithdrawPhone('');
      setWithdrawName('');
      
      alert('Withdrawal request initiated successfully! Funds will reflect shortly.');
    }, 2000);
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
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                 <div>
                    <h2 className="text-2xl font-bold text-white">Finance Control</h2>
                    <p className="text-gray-400 text-sm">Manage invoices, track revenue, and withdraw funds.</p>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => setShowWithdrawModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/20 transition-all border border-emerald-500/30">
                        <DollarSign className="h-4 w-4" /> Withdraw Funds
                    </button>
                    <button className="bg-[#1e293b] p-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white"><Download className="h-5 w-5"/></button>
                 </div>
             </div>

             {/* Stats Cards */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#1e293b] p-6 rounded-2xl border-l-4 border-emerald-500 relative shadow-lg">
                   <div className="flex justify-between items-start">
                      <div>
                         <p className="text-gray-400 text-xs font-bold uppercase mb-2">Total Revenue</p>
                         <h3 className="text-3xl font-bold text-white mb-2">MK 190,000</h3>
                         <p className="text-emerald-500 text-xs flex items-center gap-1"><TrendingUp className="h-3 w-3" /> +12% this month</p>
                      </div>
                      <div className="bg-emerald-500/10 p-3 rounded-lg"><DollarSign className="h-6 w-6 text-emerald-500" /></div>
                   </div>
                </div>
                <div className="bg-[#1e293b] p-6 rounded-2xl border-l-4 border-yellow-500 relative shadow-lg">
                   <div className="flex justify-between items-start">
                      <div>
                         <p className="text-gray-400 text-xs font-bold uppercase mb-2">Pending Invoices</p>
                         <h3 className="text-3xl font-bold text-white mb-2">MK 85,000</h3>
                         <p className="text-yellow-500 text-xs flex items-center gap-1"><Clock className="h-3 w-3" /> {invoices.filter(i => i.status === 'Pending').length} Waiting</p>
                      </div>
                      <div className="bg-yellow-500/10 p-3 rounded-lg"><CreditCard className="h-6 w-6 text-yellow-500" /></div>
                   </div>
                </div>
                <div className="bg-[#1e293b] p-6 rounded-2xl border-l-4 border-blue-500 relative shadow-lg">
                   <div className="flex justify-between items-start">
                      <div>
                         <p className="text-gray-400 text-xs font-bold uppercase mb-2">Net Profit</p>
                         <h3 className="text-3xl font-bold text-white mb-2">MK 165,000</h3>
                         <p className="text-blue-500 text-xs flex items-center gap-1"><CheckCircle className="h-3 w-3" /> After Expenses</p>
                      </div>
                      <div className="bg-blue-500/10 p-3 rounded-lg"><Briefcase className="h-6 w-6 text-blue-500" /></div>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Invoices Section */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2"><FileText className="h-5 w-5 text-gray-400" /> Recent Invoices</h3>
                    </div>
                    {/* Responsive Table Wrapper */}
                    <div className="bg-[#1e293b] rounded-xl border border-gray-700 overflow-hidden shadow-lg overflow-x-auto">
                         <table className="w-full text-left text-sm min-w-[600px]">
                             <thead className="bg-[#0f172a] text-gray-400 uppercase text-xs font-bold">
                                 <tr><th className="p-4">Client</th><th className="p-4">Amount</th><th className="p-4">Status</th><th className="p-4">Action</th></tr>
                             </thead>
                             <tbody className="divide-y divide-gray-700">
                                 {invoices.map((inv) => (
                                      <tr key={inv.id} className="hover:bg-gray-800/50">
                                         <td className="p-4">
                                            <p className="font-medium text-white">{inv.client}</p>
                                            <p className="text-xs text-gray-500">{inv.id}</p>
                                         </td>
                                         <td className="p-4 text-white font-bold">MK {inv.amount.toLocaleString()}</td>
                                         <td className="p-4"><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${inv.status === 'Paid' ? 'bg-green-500/10 text-green-400 border-green-500/20' : inv.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{inv.status}</span></td>
                                         <td className="p-4">
                                             <div className="relative group/action">
                                                 <button className="text-gray-400 hover:text-white"><MoreVertical className="h-4 w-4" /></button>
                                                 <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 hidden group-hover/action:block z-20 min-w-[120px]">
                                                     {inv.status !== 'Paid' && <button onClick={() => handleUpdateInvoiceStatus(inv.id, 'Paid')} className="w-full text-left px-4 py-2 text-xs text-green-400 hover:bg-white/5">Mark Paid</button>}
                                                     {inv.status !== 'Pending' && <button onClick={() => handleUpdateInvoiceStatus(inv.id, 'Pending')} className="w-full text-left px-4 py-2 text-xs text-yellow-400 hover:bg-white/5">Mark Pending</button>}
                                                     <button className="w-full text-left px-4 py-2 text-xs text-gray-400 hover:bg-white/5">Send PDF</button>
                                                 </div>
                                             </div>
                                         </td>
                                      </tr>
                                 ))}
                             </tbody>
                         </table>
                    </div>
                </div>

                {/* Transaction History Section */}
                <div className="space-y-4">
                     <h3 className="text-lg font-bold text-white flex items-center gap-2"><History className="h-5 w-5 text-gray-400" /> Recent Transactions</h3>
                     <div className="bg-[#1e293b] rounded-xl border border-gray-700 p-4 shadow-lg space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                         {transactions.length > 0 ? transactions.map((txn) => (
                             <div key={txn.id} className="flex justify-between items-center p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50">
                                 <div className="flex items-center gap-3">
                                     <div className={`p-2 rounded-full ${txn.type === 'Credit' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                         {txn.type === 'Credit' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                                     </div>
                                     <div>
                                         <p className="text-xs font-bold text-white truncate max-w-[120px]">{txn.description}</p>
                                         <p className="text-[10px] text-gray-500">{txn.date} • {txn.method}</p>
                                     </div>
                                 </div>
                                 <div className="text-right">
                                     <p className={`text-sm font-bold ${txn.type === 'Credit' ? 'text-green-400' : 'text-white'}`}>
                                         {txn.type === 'Credit' ? '+' : '-'} MK {txn.amount.toLocaleString()}
                                     </p>
                                     <span className="text-[10px] text-gray-500">{txn.status}</span>
                                 </div>
                             </div>
                         )) : (
                             <div className="text-center py-8 text-gray-500 text-sm">No recent transactions</div>
                         )}
                     </div>
                </div>
             </div>

             {/* WITHDRAWAL MODAL */}
             {showWithdrawModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                   <div className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl animate-scale-in overflow-hidden">
                      <div className="p-6 bg-[#1e293b] border-b border-gray-700">
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                             <Smartphone className="h-5 w-5 text-emerald-500" /> Mobile Money Withdrawal
                          </h3>
                          <p className="text-gray-400 text-xs mt-1">Transfer funds instantly to your registered wallet.</p>
                      </div>
                      
                      <div className="p-6 space-y-6">
                         {/* Network Selection */}
                         <div>
                             <label className="text-xs text-gray-400 uppercase font-bold block mb-3">Select Network</label>
                             <div className="grid grid-cols-2 gap-4">
                                 <button 
                                    onClick={() => setWithdrawMethod('airtel')}
                                    className={`relative p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${withdrawMethod === 'airtel' ? 'border-red-500 bg-red-500/10' : 'border-gray-700 bg-gray-800 hover:border-red-500/50'}`}
                                 >
                                     <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs">AM</div>
                                     <span className={`text-sm font-bold ${withdrawMethod === 'airtel' ? 'text-white' : 'text-gray-400'}`}>Airtel Money</span>
                                     {withdrawMethod === 'airtel' && <div className="absolute top-2 right-2 text-red-500"><CheckCircle className="h-4 w-4" /></div>}
                                 </button>
                                 <button 
                                    onClick={() => setWithdrawMethod('tnm')}
                                    className={`relative p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${withdrawMethod === 'tnm' ? 'border-green-500 bg-green-500/10' : 'border-gray-700 bg-gray-800 hover:border-green-500/50'}`}
                                 >
                                     <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-xs">TM</div>
                                     <span className={`text-sm font-bold ${withdrawMethod === 'tnm' ? 'text-white' : 'text-gray-400'}`}>TNM Mpamba</span>
                                     {withdrawMethod === 'tnm' && <div className="absolute top-2 right-2 text-green-500"><CheckCircle className="h-4 w-4" /></div>}
                                 </button>
                             </div>
                         </div>

                         {/* Details */}
                         <div className="space-y-4">
                             <div>
                                <label className="text-xs text-gray-400 uppercase font-bold block mb-2">Registered Name</label>
                                <div className="relative">
                                   <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                                   <input type="text" value={withdrawName} onChange={(e) => setWithdrawName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-3 py-3 text-white focus:border-blue-500 outline-none" placeholder="e.g. John Doe"/>
                                </div>
                             </div>
                             <div>
                                <label className="text-xs text-gray-400 uppercase font-bold block mb-2">Phone Number</label>
                                <div className="relative">
                                   <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                                   <input type="tel" value={withdrawPhone} onChange={(e) => setWithdrawPhone(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-3 py-3 text-white focus:border-blue-500 outline-none" placeholder="e.g. +265 99..."/>
                                </div>
                             </div>
                             <div>
                                <label className="text-xs text-gray-400 uppercase font-bold block mb-2">Amount (MK)</label>
                                <div className="relative">
                                   <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                                   <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-3 py-3 text-white focus:border-blue-500 outline-none font-bold text-lg" placeholder="0.00"/>
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-500 mt-1 px-1">
                                    <span>Fee: MK 500</span>
                                    <span>Balance: MK 190,000</span>
                                </div>
                             </div>
                         </div>

                         <div className="flex gap-3 pt-2">
                            <button onClick={() => setShowWithdrawModal(false)} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors">Cancel</button>
                            <button onClick={handleWithdrawFunds} disabled={!withdrawAmount || !withdrawPhone || isWithdrawing} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                {isWithdrawing ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirm Withdraw'}
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
             )}
          </div>
        );

      case 'messages':
        return (
           <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-2">Client Messages</h2>
              
              <div className="flex gap-3 mb-6">
                  <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input type="text" placeholder="Search..." className="w-full bg-[#1e293b] text-white pl-12 pr-4 py-3 rounded-2xl border border-gray-700 focus:border-blue-500 outline-none" />
                  </div>
                  <button className="bg-[#1e293b] p-3 rounded-2xl border border-gray-700 hover:bg-gray-700 text-gray-300"><Bell className="h-6 w-6" /></button>
              </div>

              <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-lg">
                  <div className="flex items-start gap-4">
                      <div className="bg-green-500/20 p-3 rounded-xl"><MessageSquare className="h-6 w-6 text-green-500" /></div>
                      <div>
                          <h3 className="text-lg font-bold text-white">WhatsApp Direct</h3>
                          <p className="text-gray-400 text-sm mt-1">Connect with clients instantly via WhatsApp Web.</p>
                      </div>
                  </div>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-green-900/20 transition-all">
                      <Plus className="h-4 w-4" /> New Chat
                  </button>
              </div>

              <div className="space-y-3">
                   <div className="bg-[#1e293b] p-5 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-colors cursor-pointer group relative overflow-hidden shadow-md">
                      <div className="absolute top-4 right-4 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1e293b]"></div>
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">T</div>
                          <div>
                              <h4 className="text-white font-bold text-lg">TechMalawi</h4>
                              <p className="text-gray-400 text-sm">265999123456</p>
                          </div>
                      </div>
                      <div className="mt-4 bg-[#0f172a] rounded-xl p-4 border border-gray-800">
                          <div className="flex justify-between items-center mb-1">
                              <span className="text-gray-500 text-xs uppercase tracking-wider font-bold">Active Project</span>
                              <span className="text-gray-500 text-xs">Nov 25, 2023</span>
                          </div>
                          <p className="text-white font-medium">Product Launch Ad</p>
                      </div>
                   </div>

                   {messages.map((msg) => (
                      <div key={msg.id} className={`bg-[#1e293b] p-5 rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer ${!msg.read ? 'border-l-4 border-l-blue-500' : ''}`}>
                          <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 font-bold">{msg.name.charAt(0)}</div>
                                  <div>
                                      <h4 className={`text-white text-sm ${!msg.read ? 'font-bold' : 'font-medium'}`}>{msg.name}</h4>
                                      <p className="text-gray-500 text-xs">{msg.subject}</p>
                                  </div>
                              </div>
                              <span className="text-xs text-gray-500">{msg.date}</span>
                          </div>
                          <p className="text-gray-400 text-sm mt-2 line-clamp-2 pl-12">{msg.message}</p>
                      </div>
                   ))}
              </div>
           </div>
        );

      case 'bookings':
        return (
          <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                 <div>
                    <h2 className="text-2xl font-bold text-white">Booking Requests</h2>
                    <p className="text-gray-400 text-sm">Manage client appointments and orders.</p>
                 </div>
                 <div className="flex gap-2">
                    <button className="bg-[#1e293b] text-white px-4 py-2 rounded-lg border border-gray-700 text-sm font-medium hover:bg-gray-700">Export CSV</button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2"><Plus className="h-4 w-4" /> New Booking</button>
                 </div>
             </div>

             {/* Booking Stats Row */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-700">
                     <p className="text-gray-400 text-xs uppercase font-bold">Total</p>
                     <p className="text-2xl font-bold text-white">{bookings.length}</p>
                 </div>
                 <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-700 border-l-4 border-l-yellow-500">
                     <p className="text-gray-400 text-xs uppercase font-bold">Pending</p>
                     <p className="text-2xl font-bold text-white">{bookings.filter(b => b.status === 'Pending').length}</p>
                 </div>
                 <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-700 border-l-4 border-l-green-500">
                     <p className="text-gray-400 text-xs uppercase font-bold">Confirmed</p>
                     <p className="text-2xl font-bold text-white">{bookings.filter(b => b.status === 'Confirmed').length}</p>
                 </div>
                 <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-700 border-l-4 border-l-blue-500">
                     <p className="text-gray-400 text-xs uppercase font-bold">Completed</p>
                     <p className="text-2xl font-bold text-white">{bookings.filter(b => b.status === 'Completed').length}</p>
                 </div>
             </div>

             {/* Bookings List */}
             <div className="space-y-4">
                 {bookings.map((booking) => (
                    <div key={booking.id} className="bg-[#1e293b] border border-gray-700 rounded-xl p-5 hover:border-blue-500/30 transition-all shadow-md group">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${
                                    booking.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                    booking.status === 'Confirmed' ? 'bg-green-500/10 text-green-500' :
                                    booking.status === 'Completed' ? 'bg-blue-500/10 text-blue-500' :
                                    'bg-red-500/10 text-red-500'
                                }`}>
                                   {booking.clientName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">{booking.clientName}</h3>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400 mt-1">
                                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {booking.date}</span>
                                        <span className="flex items-center gap-1"><Layers className="h-3 w-3" /> {booking.serviceName || 'Service'}</span>
                                        {booking.tierName && <span className="bg-gray-800 px-2 py-0.5 rounded text-xs text-gray-300">{booking.tierName}</span>}
                                    </div>
                                    {booking.notes && <p className="text-gray-500 text-xs mt-2 italic">"{booking.notes}"</p>}
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-3 min-w-[140px]">
                                <span className="text-white font-bold text-xl">MK {booking.amount.toLocaleString()}</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                    booking.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                    booking.status === 'Confirmed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                    booking.status === 'Completed' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                    'bg-red-500/10 text-red-500 border-red-500/20'
                                }`}>
                                    {booking.status}
                                </span>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="mt-4 pt-4 border-t border-gray-800 flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                            {booking.status === 'Pending' && (
                                <>
                                    <button onClick={() => handleBookingAction(booking.id, 'cancel')} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-sm font-medium transition-colors">Decline</button>
                                    <button onClick={() => handleBookingAction(booking.id, 'confirm')} className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-bold shadow-lg shadow-green-900/20 transition-colors flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Accept & Confirm</button>
                                </>
                            )}
                            {booking.status === 'Confirmed' && (
                                <>
                                    <button onClick={() => handleBookingAction(booking.id, 'cancel')} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-sm font-medium transition-colors">Cancel</button>
                                    <button onClick={() => handleBookingAction(booking.id, 'complete')} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-900/20 transition-colors flex items-center gap-2"><CheckSquare className="h-4 w-4" /> Mark Completed</button>
                                </>
                            )}
                            {(booking.status === 'Completed' || booking.status === 'Cancelled') && (
                                <button className="px-4 py-2 rounded-lg bg-white/5 text-gray-500 text-sm cursor-not-allowed">Archived</button>
                            )}
                        </div>
                    </div>
                 ))}
                 {bookings.length === 0 && <div className="text-center py-10 text-gray-500">No bookings found.</div>}
             </div>
          </div>
        );

      case 'projects':
         return (
          <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Active Projects</h2>
                    <p className="text-gray-400 text-sm">Track progress, deliverables, and activities.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="bg-brand-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-colors"><Plus className="h-4 w-4" /> New Project</button>
                </div>
             </div>

             {/* Search and Filters */}
             <div className="flex flex-col md:flex-row gap-4 mb-6">
                 <div className="relative flex-1">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                     <input 
                        type="text" 
                        placeholder="Search projects by client or title..." 
                        value={projectSearch}
                        onChange={(e) => setProjectSearch(e.target.value)}
                        className="w-full bg-[#1e293b] border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-white focus:border-blue-500 outline-none"
                     />
                 </div>
                 <div className="relative min-w-[160px]">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <select 
                        value={projectStatusFilter}
                        onChange={(e) => setProjectStatusFilter(e.target.value)}
                        className="w-full bg-[#1e293b] border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-white focus:border-blue-500 outline-none appearance-none cursor-pointer"
                    >
                        <option value="All">All Status</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Editing">Editing</option>
                        <option value="Client Review">Client Review</option>
                        <option value="Planning">Planning</option>
                        <option value="Completed">Completed</option>
                    </select>
                 </div>
             </div>

             <div className="grid grid-cols-1 gap-6">
                {filteredProjects.length > 0 ? filteredProjects.map((project) => (
                    <div key={project.id} className="bg-[#1e293b] border border-gray-700 rounded-xl overflow-hidden shadow-lg group hover:border-blue-500/30 transition-all">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-xl font-bold text-white">{project.title}</h3>
                                        <span className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full border border-gray-600">{project.category}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm flex items-center gap-2"><UserIcon className="h-3 w-3" /> {project.client}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                     <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getProjectStatusColor(project.status)}`}>{project.status}</span>
                                     <button 
                                        onClick={() => handleDeleteProject(project.id)}
                                        className="p-1.5 text-gray-500 hover:text-red-400 rounded-md hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100"
                                        title="Delete Project"
                                     >
                                         <Trash2 className="h-4 w-4" />
                                     </button>
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="flex justify-between text-xs text-gray-400 mb-2">
                                    <span>Progress</span>
                                    <span>{project.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-900 rounded-full h-2 mb-4">
                                    <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }}></div>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" max="100" 
                                    value={project.progress} 
                                    onChange={(e) => handleProjectProgress(project.id, parseInt(e.target.value))}
                                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-sm font-bold text-gray-300 flex items-center gap-2"><UploadCloud className="h-4 w-4" /> Deliverables</h4>
                                        <button onClick={() => handleAddDeliverable(project.id)} className="text-xs text-blue-400 hover:text-white flex items-center gap-1"><Plus className="h-3 w-3" /> Add File</button>
                                    </div>
                                    {project.deliverables && project.deliverables.length > 0 ? (
                                        <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                                            {project.deliverables.map((file, i) => (
                                                <div key={i} className="flex justify-between items-center bg-gray-800/50 p-2 rounded text-sm group/file">
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        {file.type === 'video' ? <Video className="h-4 w-4 text-blue-500" /> : <FileText className="h-4 w-4 text-gray-500" />}
                                                        <a href={file.url} target="_blank" className="text-gray-300 hover:text-white truncate max-w-[120px]">{file.name}</a>
                                                    </div>
                                                    <button onClick={() => handleDeleteDeliverable(project.id, i)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover/file:opacity-100 transition-opacity"><Trash2 className="h-3 w-3" /></button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-600 text-xs italic text-center py-4">No files uploaded yet.</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                     <button 
                                        onClick={() => handleOpenActivities(project)}
                                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg border border-gray-700 flex flex-col items-center justify-center gap-2 transition-all group/btn"
                                     >
                                         <Activity className="h-6 w-6 text-blue-500 group-hover/btn:scale-110 transition-transform" />
                                         <span className="text-xs font-bold uppercase tracking-wider">View Activities</span>
                                     </button>
                                     <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg border border-gray-700 flex flex-col items-center justify-center gap-2 transition-all group/btn">
                                         <Mail className="h-6 w-6 text-green-500 group-hover/btn:scale-110 transition-transform" />
                                         <span className="text-xs font-bold uppercase tracking-wider">Email Client</span>
                                     </button>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-800/50 p-3 border-t border-gray-700 flex justify-between items-center text-xs text-gray-500">
                             <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Due: {project.dueDate}</span>
                             <span>{project.activities?.length || 0} activities logged</span>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-12 bg-[#1e293b] rounded-xl border border-gray-700">
                        <Search className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                        <h3 className="text-white font-bold mb-1">No projects found</h3>
                        <p className="text-gray-400 text-sm">Try adjusting your search or filters.</p>
                    </div>
                )}
             </div>

             {/* Activity Modal */}
             {showActivityModal && currentProject && (
                 <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
                     <div className="bg-gray-900 w-full max-w-lg rounded-2xl border border-gray-700 shadow-2xl flex flex-col max-h-[80vh]">
                         <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-[#1e293b] rounded-t-2xl">
                             <div>
                                 <h3 className="text-white font-bold text-lg flex items-center gap-2"><List className="h-5 w-5 text-brand-primary" /> Project Activities</h3>
                                 <p className="text-gray-400 text-xs">{currentProject.title}</p>
                             </div>
                             <button onClick={() => setShowActivityModal(false)} className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5"><X className="h-5 w-5" /></button>
                         </div>
                         
                         <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                             {currentProject.activities && currentProject.activities.length > 0 ? (
                                 currentProject.activities.map((act) => (
                                     <div key={act.id} className="flex gap-3 relative">
                                         <div className="flex flex-col items-center">
                                             <div className={`w-3 h-3 rounded-full mt-1.5 ${act.type === 'success' ? 'bg-green-500' : act.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                                             <div className="w-0.5 bg-gray-800 flex-1 my-1"></div>
                                         </div>
                                         <div className="bg-[#1e293b] p-3 rounded-xl border border-gray-700 flex-1 mb-2">
                                             <p className="text-gray-200 text-sm mb-1">{act.text}</p>
                                             <p className="text-gray-500 text-[10px]">{act.date}</p>
                                         </div>
                                     </div>
                                 ))
                             ) : (
                                 <div className="text-center py-8 text-gray-500 text-sm italic">No recent activities recorded.</div>
                             )}
                         </div>

                         <div className="p-4 bg-[#1e293b] border-t border-gray-700 rounded-b-2xl">
                             <div className="relative">
                                 <input 
                                     type="text" 
                                     value={activityNote}
                                     onChange={(e) => setActivityNote(e.target.value)}
                                     onKeyDown={(e) => e.key === 'Enter' && handleAddActivity()}
                                     placeholder="Add a note or update..." 
                                     className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-4 pr-12 py-3 text-white focus:border-brand-primary outline-none"
                                 />
                                 <button 
                                     onClick={handleAddActivity}
                                     disabled={!activityNote.trim()}
                                     className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-primary hover:text-white disabled:opacity-50 p-2"
                                 >
                                     <Send className="h-5 w-5" />
                                 </button>
                             </div>
                         </div>
                     </div>
                 </div>
             )}
          </div>
        );

      case 'overview':
        return (
           <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 {[
                    { label: 'Total Revenue', val: 'MK 190,000', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
                    { label: 'Active Projects', val: projects.length, icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Pending Requests', val: bookings.filter(b=>b.status==='Pending').length, icon: Calendar, color: 'text-yellow-400', bg: 'bg-yellow-500/10', action: () => setActiveTab('bookings') },
                    { label: 'Total Clients', val: '142', icon: UserIcon, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                 ].map((stat, i) => (
                    <div 
                      key={i} 
                      onClick={stat.action}
                      className={`bg-[#1e293b] p-6 rounded-2xl border border-gray-700 ${stat.action ? 'cursor-pointer hover:border-gray-500' : ''}`}
                    >
                       <div className={`p-3 rounded-xl w-fit mb-4 ${stat.bg}`}><stat.icon className={`h-6 w-6 ${stat.color}`} /></div>
                       <p className="text-gray-400 text-xs uppercase font-bold mb-1">{stat.label}</p>
                       <h3 className="text-2xl font-bold text-white">{stat.val}</h3>
                    </div>
                 ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 h-80 flex flex-col">
                    <h3 className="text-white font-bold mb-4">Revenue Trend</h3>
                    <div className="flex-1 w-full min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={monthlyRevenueData}><CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} /><XAxis dataKey="month" stroke="#94a3b8" /><YAxis stroke="#94a3b8" tickFormatter={v=>`${v/1000}k`} /><Tooltip contentStyle={{backgroundColor:'#1e293b', borderColor:'#475569'}} /><Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} /></AreaChart>
                      </ResponsiveContainer>
                    </div>
                 </div>
                 <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 h-80 flex flex-col">
                    <h3 className="text-white font-bold mb-4">Service Popularity</h3>
                    <div className="flex-1 w-full min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart><Pie data={servicePopularityData} innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>{servicePopularityData.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie><Tooltip contentStyle={{backgroundColor:'#1e293b', borderColor:'#475569'}} /></PieChart>
                      </ResponsiveContainer>
                    </div>
                 </div>
              </div>
           </div>
        );
      
      case 'services':
        return isUploading ? (
            <ServiceUploadForm onCancel={() => { setIsUploading(false); setEditingServiceData(null); }} onSave={() => { setIsUploading(false); setEditingServiceData(null); }} initialData={editingServiceData} />
        ) : (
            <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
               <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-bold text-white">Services Packages</h2><button onClick={() => setIsUploading(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus className="h-4 w-4"/> Add Service</button></div>
               {services.map(s => (
                  <div key={s.id} className="bg-[#1e293b] border border-gray-700 rounded-xl p-6 flex gap-4 items-center group">
                     <img src={s.imageUrl} className="w-20 h-20 rounded-lg object-cover bg-gray-800" />
                     <div className="flex-1">
                        <h3 className="text-white font-bold text-lg">{s.title}</h3>
                        <p className="text-gray-400 text-sm">{s.category} • {s.priceStart}</p>
                     </div>
                     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingServiceData(s); setIsUploading(true); }} className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500 hover:text-white"><Edit className="h-4 w-4"/></button>
                        <button className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white"><Trash2 className="h-4 w-4"/></button>
                     </div>
                  </div>
               ))}
            </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col md:flex-row text-gray-100 font-sans">
       <aside className={`w-full md:w-64 bg-[#0f172a] border-r border-gray-800 flex-shrink-0 flex flex-col md:h-screen sticky top-0 z-20 shadow-xl transition-all ${isMobileMenuOpen ? 'h-screen' : 'h-auto'}`}>
          <div className="p-6 flex justify-between items-center">
             <div><h1 className="text-white font-bold text-xl tracking-tight">STUDIO ADMIN</h1><p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">Control Center</p></div>
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-gray-400"><Menu className="h-6 w-6" /></button>
          </div>
          <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col flex-1 overflow-hidden`}>
              <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                 {sidebarItems.map((item) => (
                    <button key={item.id} onClick={() => { setActiveTab(item.id as any); setIsMobileMenuOpen(false); }} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                       <item.icon className="h-5 w-5" /> {item.label}
                    </button>
                 ))}
              </nav>
              <div className="p-4 border-t border-gray-800">
                  <div className="flex items-center gap-3 mb-4 px-2">
                     <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">{user?.name?.charAt(0)}</div>
                     <div className="overflow-hidden"><p className="text-white text-xs font-bold truncate">{user?.name}</p><p className="text-gray-500 text-xs truncate">Administrator</p></div>
                  </div>
                  <button onClick={onLogout} className="w-full text-left px-4 py-2 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/5 flex items-center gap-2 mb-2"><LogOut className="h-4 w-4" /> Sign Out</button>
                  <button onClick={onLogout} className="w-full text-center px-4 py-2 rounded-full border border-gray-700 text-xs text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">Exit Dashboard View</button>
              </div>
          </div>
       </aside>
       <main className="flex-1 p-6 md:p-8 overflow-y-auto relative z-10 custom-scrollbar">
          {renderContent()}
       </main>
       {/* Floating Exit Button for Desktop */}
       <div className="fixed bottom-6 right-6 z-50 hidden md:block">
           <button onClick={onLogout} className="bg-[#1e293b] hover:bg-gray-700 text-gray-400 hover:text-white px-6 py-3 rounded-full border border-gray-700 shadow-2xl text-sm font-medium transition-all">Exit Dashboard View</button>
       </div>
    </div>
  );
};
