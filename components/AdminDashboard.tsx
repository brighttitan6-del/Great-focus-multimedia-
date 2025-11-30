
import React, { useState, useRef, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  DollarSign, Calendar, Users, TrendingUp, LayoutGrid, Video, 
  Briefcase, CreditCard, Settings, Plus, Upload, UploadCloud,
  Trash2, Edit, FileText, Download, MoreHorizontal, Search, Bell,
  Save, X, Package, Layers, Clock, User as UserIcon, LogOut, CheckCircle, XCircle, MessageSquare, AlertCircle, Lock, Loader2, Eye, EyeOff, CheckSquare, Square,
  Menu, Smartphone, ExternalLink, Send, MessageCircle
} from 'lucide-react';
import { ServiceUploadForm } from './ServiceUploadForm';
import { User, ServiceItem, Booking } from '../types';
import { api } from '../services/api';

interface AdminDashboardProps {
  user: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogin, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'bookings' | 'projects' | 'finance' | 'messages'>('overview');
  const [isUploading, setIsUploading] = useState(false);
  const [editingServiceData, setEditingServiceData] = useState<ServiceItem | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeChatProject, setActiveChatProject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Management State
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [tempPackages, setTempPackages] = useState<{name: string, price: string, time: string}[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<Set<string>>(new Set());

  // Data State
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  // Projects State with Persona/Category Details
  const [projects, setProjects] = useState([
    { id: 'p1', client: "TechMalawi", category: "Advertising", phone: "265999123456", email: "info@techmalawi.com", title: "Product Launch Ad", dueDate: "Nov 25, 2023", progress: 75, status: "In Progress" },
    { id: 'p2', client: "Chikondi Phiri", category: "Wedding", phone: "265888123456", email: "chikondi@gmail.com", title: "Wedding Highlights", dueDate: "Dec 01, 2023", progress: 40, status: "Editing" },
    { id: 'p3', client: "Green Energy", category: "Corporate", phone: "265991234567", email: "ops@greenenergy.mw", title: "Corporate Documentary", dueDate: "Nov 30, 2023", progress: 90, status: "Client Review" },
    { id: 'p4', client: "AutoFix", category: "Graphic Design", phone: "265881234567", email: "manager@autofix.mw", title: "Rebranding Assets", dueDate: "Dec 05, 2023", progress: 10, status: "Planning" },
  ]);
  const [activeBookingAction, setActiveBookingAction] = useState<string | null>(null);

  // Deliverables State
  const [deliveringProjectId, setDeliveringProjectId] = useState<string | null>(null);
  const [deliverableFiles, setDeliverableFiles] = useState<File[]>([]);
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const deliverableInputRef = useRef<HTMLInputElement>(null);

  // Finance & Withdrawal State
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bank');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const MOCK_INVOICES = [
    { id: "INV-2023-001", client: "Mwayi Phiri", date: "Nov 15, 2023", amount: 150000, status: "Paid", method: "Airtel Money" },
    { id: "INV-2023-002", client: "Daniel Banda", date: "Nov 20, 2023", amount: 85000, status: "Pending", method: "TNM Mpamba" },
    { id: "INV-2023-003", client: "Sarah Johnson", date: "Nov 10, 2023", amount: 40000, status: "Paid", method: "Cash" },
    { id: "INV-2023-004", client: "Green Energy Ltd", date: "Nov 22, 2023", amount: 60000, status: "Overdue", method: "Bank Transfer" },
  ];

  // Chart Data
  const revenueData = [
    { name: 'Jan', amount: 120000 }, { name: 'Feb', amount: 180000 },
    { name: 'Mar', amount: 150000 }, { name: 'Apr', amount: 250000 },
    { name: 'May', amount: 210000 }, { name: 'Jun', amount: 300000 },
  ];
  const serviceData = [
    { name: 'Wedding', value: 400 }, { name: 'Corporate', value: 300 },
    { name: 'Ads', value: 300 }, { name: 'Graphics', value: 200 },
  ];
  const COLORS = ['#2563eb', '#f59e0b', '#10b981', '#6366f1'];

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      try {
        const [fetchedServices, fetchedBookings] = await Promise.all([
          api.getServices(),
          api.getBookings()
        ]);
        setServices(fetchedServices);
        setBookings(fetchedBookings);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (user?.isAdmin) {
      loadData();
    }
  }, [user]);

  // Filtering
  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredBookings = bookings.filter(b => 
    b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProjects = projects.filter(p => 
    p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInvoices = MOCK_INVOICES.filter(inv => 
    inv.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Admin Login Handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const loggedInUser = await api.login({ email: loginEmail, password: loginPassword });
      
      if (loggedInUser.isAdmin) {
        onLogin(loggedInUser);
      } else {
        setLoginError('Access Denied. You do not have administrator privileges.');
      }
    } catch (error: any) {
      setLoginError(error.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // --- RENDER LOGIN FORM IF NOT AUTHENTICATED ---
  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="bg-brand-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-primary/30">
              <Lock className="w-8 h-8 text-brand-primary" />
            </div>
            <h2 className="text-2xl font-bold text-white">Admin Access</h2>
            <p className="text-gray-400 text-sm mt-2">Restricted area. Authorized personnel only.</p>
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-start gap-3 animate-fade-in">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{loginError}</p>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 text-gray-500 h-5 w-5" />
                <input 
                  type="email" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-10 text-white focus:border-brand-primary outline-none focus:ring-1 focus:ring-brand-primary transition-all"
                  placeholder="admin@greatfocus.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-500 h-5 w-5" />
                <input 
                  type="password" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-10 text-white focus:border-brand-primary outline-none focus:ring-1 focus:ring-brand-primary transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full bg-brand-primary hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {isLoggingIn ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Access Dashboard'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs">
              Protected by Great Focus Security System
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD HANDLERS ---
  const handleEditPackages = (serviceId: string, currentPackages: any[]) => {
    setEditingServiceId(serviceId);
    setTempPackages(JSON.parse(JSON.stringify(currentPackages || [])));
  };

  const handleSavePackages = async (serviceId: string) => {
    try {
      const updatedService = await api.updateService(serviceId, { packages: tempPackages });
      if (updatedService) {
        setServices(prev => prev.map(s => s.id === serviceId ? updatedService : s));
      }
    } catch (error) {
      console.error("Failed to update packages", error);
    }
    setEditingServiceId(null);
    setTempPackages([]);
  };

  const handlePackageChange = (index: number, field: string, value: string) => {
    const newPackages = [...tempPackages];
    (newPackages[index] as any)[field] = value;
    setTempPackages(newPackages);
  };

  const handleAddPackage = () => {
    setTempPackages([...tempPackages, { name: 'New Package', price: '', time: '1 Week' }]);
  };

  const handleRemovePackage = (index: number) => {
    setTempPackages(tempPackages.filter((_, i) => i !== index));
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm("Delete this service?")) {
      try {
        await api.deleteService(id);
        setServices(prev => prev.filter(s => s.id !== id));
      } catch (error) {
        console.error("Failed to delete service", error);
      }
    }
  };

  const handleSaveService = async (service: ServiceItem) => {
    try {
      if (editingServiceData) {
        // Update existing service
        const updated = await api.updateService(service.id, service);
        // Fallback for mock mode if updateService returns undefined or to update UI immediately
        setServices(prev => prev.map(s => s.id === service.id ? service : s));
      } else {
        // Create new service
        const created = await api.createService(service);
        setServices(prev => [created, ...prev]);
      }
      setIsUploading(false);
      setEditingServiceData(null);
    } catch (error) {
      console.error("Failed to save service", error);
    }
  };

  const handleUpdateBookingStatus = async (id: string, newStatus: 'Confirmed' | 'Completed' | 'Cancelled') => {
    try {
      const updated = await api.updateBooking(id, { status: newStatus });
      if (updated) {
        setBookings(prev => prev.map(b => b.id === id ? updated : b));
      }
    } catch (error) {
      console.error("Failed to update booking", error);
    }
    setActiveBookingAction(null);
  };

  const handleDeliverProjectClick = (id: string) => {
    setDeliveringProjectId(id);
    setDeliverableFiles([]);
  };

  const handleDeliverableSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDeliverableFiles(Array.from(e.target.files));
    }
  };

  const handleConfirmDelivery = () => {
    if (!deliveringProjectId) return;
    
    const project = projects.find(p => p.id === deliveringProjectId);

    // Simulate upload and update
    setProjects(prev => prev.map(p => 
      p.id === deliveringProjectId 
        ? { ...p, status: 'Completed', progress: 100 } 
        : p
    ));
    
    if (notifyWhatsApp && project) {
      // Simulate opening WhatsApp web to notify client
      const message = `Hello ${project.client}, your ${project.title} (${project.category}) files are ready for download!`;
      window.open(`https://wa.me/${project.phone}?text=${encodeURIComponent(message)}`, '_blank');
    }

    // Close modal
    setDeliveringProjectId(null);
    setDeliverableFiles([]);
  };

  const handleWithdrawFunds = () => {
    if (!withdrawAmount) return;
    setIsWithdrawing(true);
    // Simulate API delay
    setTimeout(() => {
      setIsWithdrawing(false);
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      alert('Withdrawal request processed successfully!');
    }, 2000);
  };

  const handleRemoveDeliverable = (index: number) => {
    setDeliverableFiles(prev => prev.filter((_, i) => i !== index));
  };

  // --- BULK ACTIONS HANDLERS ---
  const toggleServiceSelection = (id: string) => {
    const newSelection = new Set(selectedServiceIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedServiceIds(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedServiceIds.size === filteredServices.length && filteredServices.length > 0) {
      setSelectedServiceIds(new Set());
    } else {
      setSelectedServiceIds(new Set(filteredServices.map(s => s.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedServiceIds.size === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedServiceIds.size} selected services?`)) {
      for (const id of Array.from(selectedServiceIds)) {
        await api.deleteService(id as string);
      }
      setServices(prev => prev.filter(s => !selectedServiceIds.has(s.id)));
      setSelectedServiceIds(new Set());
    }
  };

  const handleBulkStatus = async (isActive: boolean) => {
    if (selectedServiceIds.size === 0) return;
    for (const id of Array.from(selectedServiceIds)) {
      await api.updateService(id as string, { isActive });
    }
    setServices(prev => prev.map(s => 
      selectedServiceIds.has(s.id) ? { ...s, isActive } : s
    ));
    setSelectedServiceIds(new Set());
  };

  const tabTitles: Record<string, string> = {
    overview: 'Dashboard Overview',
    services: 'Services Packages',
    bookings: 'Booking Requests',
    projects: 'Active Projects',
    finance: 'Finance & Invoices',
    messages: 'Client Messages'
  };

  const renderContent = () => {
    if (isLoadingData && activeTab !== 'overview') {
       return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 text-brand-primary animate-spin" /></div>;
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Revenue', value: 'MK 850k', icon: DollarSign, color: 'text-green-400' },
                { label: 'Bookings', value: bookings.length.toString(), icon: Calendar, color: 'text-blue-400' },
                { label: 'Pending', value: bookings.filter(b => b.status === 'Pending').length.toString(), icon: Briefcase, color: 'text-purple-400' },
                { label: 'Growth', value: '+18%', icon: TrendingUp, color: 'text-orange-400' },
              ].map((stat, i) => (
                <div key={i} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                      <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-900 border border-gray-700">
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg h-80">
                  <h3 className="text-white font-bold mb-4">Revenue Trend</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 30 }}>
                       <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                       <XAxis dataKey="name" stroke="#9ca3af" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                       <YAxis stroke="#9ca3af" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                       <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                       <Area type="monotone" dataKey="amount" stroke="#2563eb" fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
               <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg h-80">
                  <h3 className="text-white font-bold mb-4">Service Popularity</h3>
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 20 }}>
                        <Pie 
                           data={serviceData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} 
                           paddingAngle={5} dataKey="value" stroke="none"
                        >
                           {serviceData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </div>
        );

      case 'services':
        return isUploading ? (
          <ServiceUploadForm 
             onCancel={() => { setIsUploading(false); setEditingServiceData(null); }} 
             onSave={handleSaveService} 
             initialData={editingServiceData}
          />
        ) : (
          <div className="space-y-6 animate-fade-in">
             {/* Bulk Actions Toolbar */}
             {selectedServiceIds.size > 0 ? (
                <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-xl p-4 flex flex-wrap justify-between items-center gap-4 animate-fade-in">
                   <div className="flex items-center gap-3">
                      <div className="bg-brand-primary text-white text-xs font-bold px-2 py-1 rounded">
                         {selectedServiceIds.size} Selected
                      </div>
                      <span className="text-gray-400 text-sm">Bulk Actions:</span>
                   </div>
                   <div className="flex gap-2">
                      <button 
                        onClick={() => handleBulkStatus(true)}
                        className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-green-400 px-3 py-2 rounded-lg text-xs font-medium border border-gray-700"
                      >
                         <Eye className="h-4 w-4" /> Mark Active
                      </button>
                      <button 
                        onClick={() => handleBulkStatus(false)}
                        className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-yellow-400 px-3 py-2 rounded-lg text-xs font-medium border border-gray-700"
                      >
                         <EyeOff className="h-4 w-4" /> Mark Inactive
                      </button>
                      <button 
                        onClick={handleBulkDelete}
                        className="flex items-center gap-1 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 px-3 py-2 rounded-lg text-xs font-medium border border-red-500/20"
                      >
                         <Trash2 className="h-4 w-4" /> Delete Selected
                      </button>
                   </div>
                </div>
             ) : (
                <div className="flex justify-between items-center bg-gray-800 p-4 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-2">
                        <button 
                           onClick={toggleSelectAll}
                           className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"
                        >
                           <Square className="h-5 w-5" /> Select All
                        </button>
                    </div>
                    <button 
                       onClick={() => { setEditingServiceData(null); setIsUploading(true); }}
                       className="bg-brand-primary text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-blue-600 shadow-lg shadow-blue-500/20"
                    >
                       <Plus className="h-4 w-4" /> Add Service
                    </button>
                </div>
             )}

             {filteredServices.map(service => {
                const isSelected = selectedServiceIds.has(service.id);
                return (
                  <div 
                    key={service.id} 
                    className={`bg-gray-800 border rounded-xl p-6 shadow-lg transition-all ${isSelected ? 'border-brand-primary ring-1 ring-brand-primary bg-gray-800/80' : 'border-gray-700'}`}
                  >
                     <div className="flex flex-col md:flex-row gap-6 relative">
                        {/* Checkbox */}
                        <div className="absolute top-0 left-0 md:relative md:top-auto md:left-auto">
                            <button 
                              onClick={() => toggleServiceSelection(service.id)}
                              className={`p-1 rounded transition-colors ${isSelected ? 'text-brand-primary' : 'text-gray-600 hover:text-gray-400'}`}
                            >
                               {isSelected ? <CheckSquare className="h-6 w-6" /> : <Square className="h-6 w-6" />}
                            </button>
                        </div>

                        <div className="relative group">
                           <img src={service.imageUrl} className="w-24 h-24 object-cover rounded-lg bg-gray-700 shadow-lg" alt={service.title} />
                           {service.videoUrl && (
                              <div className="absolute bottom-1 right-1 bg-black/60 p-1 rounded-full border border-white/20">
                                 <Video className="h-3 w-3 text-white" />
                              </div>
                           )}
                        </div>
                        
                        <div className="flex-1 ml-8 md:ml-0">
                           <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-xs font-bold text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded border border-blue-800">{service.category}</span>
                              {service.isActive === false && (
                                <span className="text-xs font-bold text-gray-400 bg-gray-700 px-2 py-0.5 rounded border border-gray-600 flex items-center gap-1">
                                  <EyeOff className="h-3 w-3" /> Inactive
                                </span>
                              )}
                              {editingServiceId === service.id && <span className="text-xs text-yellow-500 animate-pulse">Editing Packages...</span>}
                           </div>
                           <h3 className={`text-xl font-bold text-white ${service.isActive === false ? 'opacity-60' : ''}`}>{service.title}</h3>
                           <p className="text-gray-400 text-sm mt-1">{service.packages?.length || 0} Packages configured</p>
                           {service.description && (
                              <p className="text-gray-500 text-xs mt-1 line-clamp-1 max-w-lg">{service.description}</p>
                           )}
                        </div>
                        <div className="flex gap-2 self-start mt-8 md:mt-0">
                           {editingServiceId !== service.id && (
                             <>
                               <button 
                                 onClick={() => { setEditingServiceData(service); setIsUploading(true); }}
                                 className="bg-brand-primary/10 hover:bg-brand-primary hover:text-white text-brand-primary px-3 py-2 rounded text-xs font-medium flex items-center gap-1 border border-brand-primary/20 transition-all"
                                 title="Edit Service Details"
                               >
                                  <Edit className="h-3 w-3" /> Edit
                               </button>
                               <button 
                                 onClick={() => handleEditPackages(service.id, service.packages || [])} 
                                 className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-xs font-medium flex items-center gap-1 border border-gray-600"
                                 title="Quick Package Edit"
                               >
                                  <Layers className="h-3 w-3" /> Packages
                               </button>
                             </>
                           )}
                           <button onClick={() => handleDeleteService(service.id)} className="bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 p-2 rounded border border-red-500/20 transition-colors">
                              <Trash2 className="h-4 w-4" />
                           </button>
                        </div>
                     </div>
                     
                     {/* Inline Editor */}
                     {editingServiceId === service.id && (
                        <div className="mt-6 pt-6 border-t border-gray-700 animate-fade-in">
                           <div className="flex justify-between items-center mb-4">
                              <h4 className="text-white font-bold text-sm">Quick Package Manager</h4>
                              <button onClick={handleAddPackage} className="text-brand-primary text-xs hover:underline flex items-center gap-1"><Plus className="h-3 w-3" /> Add Row</button>
                           </div>
                           <div className="space-y-3">
                              {tempPackages.map((pkg, idx) => (
                                 <div key={idx} className="flex flex-col md:flex-row gap-2 items-center bg-gray-900/50 p-2 rounded border border-gray-700">
                                    <input type="text" value={pkg.name} onChange={(e) => handlePackageChange(idx, 'name', e.target.value)} className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm w-full" placeholder="Name" />
                                    <input type="text" value={pkg.price} onChange={(e) => handlePackageChange(idx, 'price', e.target.value)} className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm w-full md:w-32" placeholder="Price" />
                                    <input type="text" value={pkg.time} onChange={(e) => handlePackageChange(idx, 'time', e.target.value)} className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm w-full md:w-32" placeholder="Time" />
                                    <button onClick={() => handleRemovePackage(idx)} className="text-red-400 hover:text-red-300 p-1"><X className="h-4 w-4" /></button>
                                 </div>
                              ))}
                           </div>
                           <div className="flex justify-end gap-3 mt-4">
                              <button onClick={() => setEditingServiceId(null)} className="text-gray-400 text-sm hover:text-white">Cancel</button>
                              <button onClick={() => handleSavePackages(service.id)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-bold shadow-lg">Save Changes</button>
                           </div>
                        </div>
                     )}
                  </div>
                );
             })}
          </div>
        );

      case 'bookings':
         return (
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl pb-20">
               <table className="w-full text-left">
                  <thead className="bg-gray-900 text-gray-400 text-xs uppercase">
                     <tr>
                        <th className="p-4">Client</th>
                        <th className="p-4 hidden md:table-cell">Date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700 text-sm">
                     {filteredBookings.map(b => (
                        <tr key={b.id} className="hover:bg-gray-700/50">
                           <td className="p-4 font-medium text-white">{b.clientName}</td>
                           <td className="p-4 text-gray-400 hidden md:table-cell">{b.date}</td>
                           <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                 b.status === 'Confirmed' ? 'text-green-400 bg-green-900/30' : 
                                 b.status === 'Pending' ? 'text-yellow-400 bg-yellow-900/30' : 
                                 b.status === 'Completed' ? 'text-blue-400 bg-blue-900/30' :
                                 'text-red-400 bg-red-900/30'
                              }`}>{b.status}</span>
                           </td>
                           <td className="p-4 relative">
                              <button onClick={() => setActiveBookingAction(activeBookingAction === b.id ? null : b.id)} className="text-gray-400 hover:text-white"><MoreHorizontal className="h-5 w-5" /></button>
                              {activeBookingAction === b.id && (
                                 <div className="absolute right-4 top-10 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 w-32 py-1">
                                    <button onClick={() => handleUpdateBookingStatus(b.id, 'Confirmed')} className="block w-full text-left px-4 py-2 text-xs text-green-400 hover:bg-gray-800">Confirm</button>
                                    <button onClick={() => handleUpdateBookingStatus(b.id, 'Completed')} className="block w-full text-left px-4 py-2 text-xs text-blue-400 hover:bg-gray-800">Complete</button>
                                    <button onClick={() => handleUpdateBookingStatus(b.id, 'Cancelled')} className="block w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-gray-800">Cancel</button>
                                 </div>
                              )}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         );

      case 'projects':
         return (
            <div className="space-y-4 animate-fade-in relative">
               {filteredProjects.map(p => (
                  <div key={p.id} className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg">
                     <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-white font-bold text-lg">{p.title}</h3>
                              <span className="bg-brand-primary/20 text-brand-primary border border-brand-primary/30 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">{p.category}</span>
                           </div>
                           <div className="flex flex-col text-xs text-gray-400 gap-1">
                             <p className="font-medium text-gray-300">{p.client}</p>
                             <div className="flex items-center gap-3">
                               <span className="flex items-center gap-1"><Smartphone className="h-3 w-3" /> {p.phone}</span>
                               <span className="hidden md:inline">|</span>
                               <span className="truncate max-w-[150px]">{p.email}</span>
                             </div>
                           </div>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded self-start ${p.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-300'}`}>{p.status}</span>
                     </div>
                     
                     <div className="w-full bg-gray-900 h-2 rounded-full mb-6 overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-1000 ${p.status === 'Completed' ? 'bg-green-500' : 'bg-brand-primary'}`} style={{ width: `${p.progress}%` }}></div>
                     </div>
                     
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <button 
                           onClick={() => window.open(`https://wa.me/${p.phone}?text=Hello ${p.client}, regarding your ${p.title} project...`, '_blank')}
                           className="bg-green-600/10 hover:bg-green-600 hover:text-white text-green-500 py-2 rounded text-sm flex items-center justify-center gap-2 border border-green-600/20 transition-all"
                        >
                           <Smartphone className="h-4 w-4" /> WhatsApp
                        </button>
                        
                        <button onClick={() => setActiveChatProject(p.id)} className="bg-gray-700 hover:bg-gray-600 text-white py-2 rounded text-sm flex items-center justify-center gap-2">
                           <MessageSquare className="h-4 w-4" /> Internal Notes
                        </button>
                        
                        {p.status !== 'Completed' && (
                           <button onClick={() => handleDeliverProjectClick(p.id)} className="col-span-2 md:col-span-2 bg-brand-primary hover:bg-blue-600 text-white py-2 rounded text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
                              <Upload className="h-4 w-4" /> Deliver to {p.client}
                           </button>
                        )}
                     </div>
                  </div>
               ))}
               
               {/* Deliver Project Modal */}
               {deliveringProjectId && (
                 <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-gray-800 border border-gray-700 w-full max-w-lg rounded-xl overflow-hidden shadow-2xl">
                       <div className="p-5 border-b border-gray-700 flex justify-between items-center bg-gray-900">
                          <h3 className="text-white font-bold text-lg flex items-center gap-2">
                             <UploadCloud className="h-5 w-5 text-brand-primary" /> Deliver Project
                          </h3>
                          <button onClick={() => { setDeliveringProjectId(null); setDeliverableFiles([]); }}><X className="h-5 w-5 text-gray-400 hover:text-white" /></button>
                       </div>
                       
                       <div className="p-6">
                          <div className="mb-6 bg-brand-primary/10 border border-brand-primary/20 rounded-lg p-3">
                             {(() => {
                               const proj = projects.find(p => p.id === deliveringProjectId);
                               return proj ? (
                                 <div className="flex flex-col gap-1">
                                    <div className="flex justify-between items-start">
                                      <p className="text-xs text-gray-400 uppercase font-bold">Delivering To:</p>
                                      <span className="bg-brand-primary text-white text-[10px] px-2 py-0.5 rounded-full">{proj.category}</span>
                                    </div>
                                    <p className="text-white font-bold">{proj.client}</p>
                                    <p className="text-gray-400 text-sm">{proj.title}</p>
                                 </div>
                               ) : null;
                             })()}
                          </div>
                          
                          <input 
                            type="file" 
                            multiple 
                            accept="video/*,image/*,.zip,.pdf,.rar"
                            ref={deliverableInputRef} 
                            className="hidden" 
                            onChange={handleDeliverableSelect}
                          />
                          <div 
                            onClick={() => deliverableInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-600 bg-gray-900/50 rounded-lg p-8 text-center hover:bg-gray-700/30 transition-colors cursor-pointer mb-4 group"
                          >
                             <div className="flex justify-center gap-3 mb-2">
                                 <Upload className="h-8 w-8 text-gray-400 group-hover:text-white transition-colors" />
                                 <Video className="h-8 w-8 text-gray-400 group-hover:text-brand-primary transition-colors" />
                             </div>
                             <p className="text-gray-300 font-medium text-sm">Drag & Drop or Click to Upload</p>
                             <p className="text-gray-500 text-xs mt-1">Supported: MP4, MOV, AVI, Images, ZIP (Max 2GB)</p>
                          </div>

                          {deliverableFiles.length > 0 && (
                             <div className="mb-6 space-y-2 max-h-40 overflow-y-auto">
                                {deliverableFiles.map((file, idx) => (
                                   <div key={idx} className="flex items-center justify-between bg-gray-700 p-2 rounded text-sm">
                                      <div className="flex items-center gap-2 overflow-hidden">
                                         {file.type.startsWith('video/') ? <Video className="h-4 w-4 text-brand-primary flex-shrink-0" /> : <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />}
                                         <span className="text-white truncate">{file.name}</span>
                                      </div>
                                      <button onClick={() => handleRemoveDeliverable(idx)} className="text-red-400 hover:text-white p-1 flex-shrink-0"><X className="h-3 w-3" /></button>
                                   </div>
                                ))}
                             </div>
                          )}
                          
                          <div className="mb-6">
                             <label className="flex items-center gap-2 cursor-pointer bg-gray-900/50 p-3 rounded-lg border border-gray-700 hover:border-brand-primary/50">
                                <input 
                                  type="checkbox" 
                                  checked={notifyWhatsApp} 
                                  onChange={(e) => setNotifyWhatsApp(e.target.checked)} 
                                  className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary bg-gray-800 border-gray-600"
                                />
                                <div>
                                   <span className="text-white text-sm font-medium flex items-center gap-1"><Smartphone className="h-3 w-3" /> Notify Client via WhatsApp</span>
                                   <p className="text-xs text-gray-500">Opens WhatsApp chat with download link</p>
                                </div>
                             </label>
                          </div>

                          <div className="flex gap-3">
                             <button onClick={() => { setDeliveringProjectId(null); setDeliverableFiles([]); }} className="flex-1 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 font-medium">Cancel</button>
                             <button 
                               onClick={handleConfirmDelivery}
                               disabled={deliverableFiles.length === 0}
                               className="flex-1 py-3 rounded-lg bg-brand-primary hover:bg-blue-600 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                             >
                                <Send className="h-4 w-4" /> Send Files
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>
               )}

               {/* Internal Notes Chat Overlay */}
               {activeChatProject && (
                  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                     <div className="bg-gray-800 border border-gray-700 w-full max-w-sm rounded-xl overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900">
                           <h3 className="text-white font-bold text-sm">Internal Project Notes</h3>
                           <button onClick={() => setActiveChatProject(null)}><X className="h-4 w-4 text-gray-400" /></button>
                        </div>
                        <div className="h-64 bg-gray-900 p-4 overflow-y-auto space-y-3">
                           <div className="bg-gray-800 text-gray-300 p-2 rounded-lg text-xs self-start w-3/4 border border-gray-700">Client requires revision on intro.</div>
                           <div className="bg-brand-primary text-white p-2 rounded-lg text-xs self-end w-3/4 ml-auto">Editor: Rendering new version now.</div>
                        </div>
                        <div className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
                           <input className="bg-gray-900 border border-gray-700 rounded px-3 py-1 text-white text-sm w-full focus:border-brand-primary outline-none" placeholder="Type..." />
                           <button className="text-brand-primary"><Save className="h-5 w-5" /></button>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         );

      case 'finance':
         // Calculate Finance Stats
         const totalRevenue = MOCK_INVOICES.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
         const pendingRevenue = MOCK_INVOICES.filter(i => i.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);
         const overdueRevenue = MOCK_INVOICES.filter(i => i.status === 'Overdue').reduce((acc, curr) => acc + curr.amount, 0);

         return (
            <div className="space-y-6">
               {/* New Stats Section */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex items-center justify-between relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-bl-full -mr-4 -mt-4 transition-all hover:bg-green-500/20"></div>
                     <div className="relative z-10">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Revenue</p>
                        <h3 className="text-3xl font-heading font-bold text-white">MK {totalRevenue.toLocaleString()}</h3>
                        <p className="text-xs text-green-400 flex items-center gap-1 mt-2"><TrendingUp className="h-3 w-3" /> +12% this month</p>
                     </div>
                     <div className="relative z-10 p-3 bg-green-500/10 rounded-lg border border-green-500/20 text-green-500">
                        <DollarSign className="h-6 w-6" />
                     </div>
                  </div>

                  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex items-center justify-between relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-bl-full -mr-4 -mt-4 transition-all hover:bg-yellow-500/20"></div>
                     <div className="relative z-10">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Pending Payments</p>
                        <h3 className="text-3xl font-heading font-bold text-white">MK {pendingRevenue.toLocaleString()}</h3>
                        <p className="text-xs text-yellow-400 flex items-center gap-1 mt-2"><Clock className="h-3 w-3" /> {MOCK_INVOICES.filter(i => i.status === 'Pending').length} Invoices Waiting</p>
                     </div>
                     <div className="relative z-10 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20 text-yellow-500">
                        <CreditCard className="h-6 w-6" />
                     </div>
                  </div>

                  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex items-center justify-between relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-bl-full -mr-4 -mt-4 transition-all hover:bg-red-500/20"></div>
                     <div className="relative z-10">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Overdue Invoices</p>
                        <h3 className="text-3xl font-heading font-bold text-white">MK {overdueRevenue.toLocaleString()}</h3>
                        <p className="text-xs text-red-400 flex items-center gap-1 mt-2"><AlertCircle className="h-3 w-3" /> {MOCK_INVOICES.filter(i => i.status === 'Overdue').length} Action Required</p>
                     </div>
                     <div className="relative z-10 p-3 bg-red-500/10 rounded-lg border border-red-500/20 text-red-500">
                        <AlertCircle className="h-6 w-6" />
                     </div>
                  </div>
               </div>

               <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-xl">
                  <div className="p-4 border-b border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
                     <h3 className="text-white font-bold">Financial Management</h3>
                     <div className="flex gap-2">
                        <button 
                           onClick={() => setShowWithdrawModal(true)}
                           className="text-xs bg-green-600/10 text-green-500 px-4 py-2 rounded-lg border border-green-600/20 hover:bg-green-600 hover:text-white font-bold flex items-center gap-2 transition-all"
                        >
                           <CreditCard className="h-4 w-4" /> Withdraw Money
                        </button>
                        <button className="text-xs bg-brand-primary/10 text-brand-primary px-3 py-2 rounded-lg border border-brand-primary/20 hover:bg-brand-primary/20 flex items-center gap-2 transition-all">
                           <Download className="h-4 w-4" /> Export Report
                        </button>
                     </div>
                  </div>
                  <table className="w-full text-left">
                     <thead className="bg-gray-900 text-gray-400 text-xs uppercase">
                        <tr>
                           <th className="p-4">Invoice</th>
                           <th className="p-4">Client</th>
                           <th className="p-4 text-right">Amount</th>
                           <th className="p-4">Status</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-700 text-sm">
                        {filteredInvoices.map(inv => (
                           <tr key={inv.id} className="hover:bg-gray-700/50">
                              <td className="p-4 font-mono text-gray-400 text-xs">{inv.id}</td>
                              <td className="p-4 text-white font-medium">{inv.client}</td>
                              <td className="p-4 text-right text-gray-300">MK {inv.amount.toLocaleString()}</td>
                              <td className="p-4"><span className="text-xs border px-2 py-0.5 rounded border-gray-600 text-gray-300">{inv.status}</span></td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               {/* Withdrawal Modal */}
               {showWithdrawModal && (
                  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                     <div className="bg-gray-800 border border-gray-700 w-full max-w-sm rounded-xl overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900">
                           <h3 className="text-white font-bold text-lg">Withdraw Funds</h3>
                           <button onClick={() => setShowWithdrawModal(false)}><X className="h-5 w-5 text-gray-400 hover:text-white" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                           <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center mb-4">
                              <p className="text-xs text-gray-400 uppercase font-bold">Available Balance</p>
                              <p className="text-2xl font-bold text-white">MK 850,000</p>
                           </div>

                           <div>
                              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Amount (MK)</label>
                              <div className="relative">
                                 <span className="absolute left-3 top-3 text-gray-500 font-bold text-sm">MK</span>
                                 <input 
                                    type="number" 
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 pl-10 text-white focus:border-green-500 outline-none"
                                    placeholder="0.00"
                                 />
                              </div>
                           </div>

                           <div>
                              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Withdrawal Method</label>
                              <select 
                                 value={withdrawMethod}
                                 onChange={(e) => setWithdrawMethod(e.target.value)}
                                 className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-green-500 outline-none"
                              >
                                 <option value="bank">Bank Transfer</option>
                                 <option value="airtel">Airtel Money</option>
                                 <option value="tnm">TNM Mpamba</option>
                              </select>
                           </div>

                           <button 
                              onClick={handleWithdrawFunds}
                              disabled={isWithdrawing || !withdrawAmount}
                              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                              {isWithdrawing ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirm Withdrawal'}
                           </button>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         );

      case 'messages':
         return (
            <div className="space-y-6 animate-fade-in">
               <div className="bg-gradient-to-r from-green-900/20 to-gray-800 p-6 rounded-xl border border-green-500/20 shadow-lg flex justify-between items-center">
                  <div>
                     <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        <MessageSquare className="h-6 w-6 text-green-500" /> WhatsApp Direct
                     </h3>
                     <p className="text-gray-400 text-sm">Connect with clients instantly via WhatsApp Web.</p>
                  </div>
                  <button className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg flex items-center gap-2">
                     <Plus className="h-4 w-4" /> New Chat
                  </button>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {projects.map(project => (
                     <div key={project.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-green-500/50 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                           <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xl border border-brand-primary/20">
                                 {project.client.charAt(0)}
                              </div>
                              <div>
                                 <h4 className="text-lg font-bold text-white">{project.client}</h4>
                                 <p className="text-sm text-gray-400">{project.phone}</p>
                              </div>
                           </div>
                           <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                        </div>
                        
                        <div className="bg-gray-900/50 rounded-lg p-4 mb-6 border border-gray-700/50">
                           <div className="flex justify-between text-xs text-gray-400 mb-2">
                              <span>Active Project</span>
                              <span>{project.dueDate}</span>
                           </div>
                           <p className="text-white font-medium text-sm truncate">{project.title}</p>
                        </div>

                        <div className="flex gap-3">
                           <button 
                              onClick={() => window.open(`https://wa.me/${project.phone}?text=Hello ${project.client}, regarding your project ${project.title}...`, '_blank')}
                              className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-900/20"
                           >
                              <MessageSquare className="h-4 w-4" /> Open Chat
                           </button>
                           <button className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg border border-gray-600 transition-colors">
                              <MoreHorizontal className="h-4 w-4" />
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         );
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col md:flex-row text-gray-100 font-sans">
       {/* Sidebar */}
       <aside className={`w-full md:w-64 bg-gray-900 border-r border-gray-700 flex-shrink-0 flex flex-col md:h-screen sticky top-0 z-20 shadow-2xl transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'h-screen' : 'h-auto'}`}>
          <div className="p-6 border-b border-gray-700 flex justify-between items-center">
             <div>
                <h1 className="text-white font-heading font-bold text-xl tracking-tight">STUDIO ADMIN</h1>
                <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">Control Center</p>
             </div>
             <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-800"
             >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
             </button>
          </div>
          
          <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col flex-1 overflow-hidden`}>
              <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                 {Object.entries(tabTitles).map(([key, label]) => (
                    <button 
                      key={key} 
                      onClick={() => { setActiveTab(key as any); setIsUploading(false); setIsMobileMenuOpen(false); }}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                         activeTab === key ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                       {label}
                    </button>
                 ))}
              </nav>
              <div className="p-4 bg-gray-800 border-t border-gray-700">
                 <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setShowUserMenu(!showUserMenu)}>
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                       {user?.name?.charAt(0) || 'A'}
                    </div>
                    <div className="overflow-hidden">
                       <p className="text-white text-xs font-bold truncate">{user?.name}</p>
                       <p className="text-gray-500 text-[10px] truncate">{user?.email}</p>
                    </div>
                 </div>
                 {showUserMenu && (
                    <div className="mt-3 space-y-2 animate-fade-in">
                       <button className="w-full text-left text-xs text-gray-300 hover:text-white flex items-center gap-2"><Settings className="h-3 w-3" /> Settings</button>
                       <button onClick={onLogout} className="w-full text-left text-xs text-red-400 hover:text-red-300 flex items-center gap-2"><LogOut className="h-3 w-3" /> Sign Out</button>
                    </div>
                 )}
              </div>
          </div>
       </aside>

       {/* Main Content */}
       <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-cover bg-fixed relative z-10" style={{ backgroundImage: 'url("https://picsum.photos/1920/1080?grayscale&blur=10")' }}>
          <div className="absolute inset-0 bg-brand-dark/95 z-0 pointer-events-none"></div>
          <div className="relative z-10 max-w-6xl mx-auto pb-20">
             
             {/* Header */}
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold text-white tracking-tight">{tabTitles[activeTab]}</h2>
                <div className="flex items-center gap-4 w-full md:w-auto">
                   <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-3 top-2.5 text-gray-500 h-4 w-4" />
                      <input 
                         type="text" 
                         placeholder="Search..." 
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         className="bg-gray-800 border border-gray-700 rounded-full py-2 pl-10 pr-4 text-sm text-white w-full focus:border-brand-primary outline-none"
                      />
                   </div>
                   <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 bg-gray-800 border border-gray-700 rounded-full text-gray-400 hover:text-white relative">
                      <Bell className="h-5 w-5" />
                      <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                   </button>
                   {showNotifications && (
                      <div className="absolute right-0 top-20 bg-gray-800 border border-gray-700 rounded-xl p-4 w-64 shadow-2xl z-50">
                         <h4 className="text-white text-xs font-bold mb-2 uppercase">Notifications</h4>
                         <div className="space-y-2">
                            <div className="text-xs text-gray-300 pb-2 border-b border-gray-700">New booking from Mwayi.</div>
                            <div className="text-xs text-gray-300">Server maintenance at 2 AM.</div>
                         </div>
                      </div>
                   )}
                </div>
             </div>

             {/* Dynamic Content */}
             {renderContent()}

          </div>
       </main>
    </div>
  );
};
