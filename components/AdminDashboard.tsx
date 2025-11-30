
import React, { useState, useEffect } from 'react';
import { MOCK_BOOKINGS, SERVICES as INITIAL_SERVICES } from '../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  DollarSign, Calendar, Users, TrendingUp, LayoutGrid, Video, 
  Briefcase, MessageSquare, CreditCard, Settings, Plus, Upload, 
  Trash2, Edit, FileText, Download, MoreHorizontal, AlertCircle, Search, Bell,
  Save, X, Package, Layers, Clock, User as UserIcon, LogOut
} from 'lucide-react';
import { ServiceUploadForm } from './ServiceUploadForm';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'bookings' | 'projects' | 'finance'>('overview');
  const [isUploading, setIsUploading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeChatProject, setActiveChatProject] = useState<string | null>(null);
  
  // State for Services Management
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [tempPackages, setTempPackages] = useState<{name: string, price: string, time: string}[]>([]);

  // --- MOCK DATA FOR CHARTS ---
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
  
  // --- MOCK DATA FOR NEW SECTIONS ---
  const MOCK_PROJECTS = [
    { id: 'p1', client: "TechMalawi", title: "Product Launch Ad", dueDate: "Nov 25, 2023", progress: 75, status: "In Progress" },
    { id: 'p2', client: "Chikondi Phiri", title: "Wedding Highlights", dueDate: "Dec 01, 2023", progress: 40, status: "Editing" },
    { id: 'p3', client: "Green Energy", title: "Corporate Documentary", dueDate: "Nov 30, 2023", progress: 90, status: "Client Review" },
    { id: 'p4', client: "AutoFix", title: "Rebranding Assets", dueDate: "Dec 05, 2023", progress: 10, status: "Planning" },
  ];

  const MOCK_INVOICES = [
    { id: "INV-2023-001", client: "Mwayi Phiri", date: "Nov 15, 2023", amount: 150000, status: "Paid", method: "Airtel Money" },
    { id: "INV-2023-002", client: "Daniel Banda", date: "Nov 20, 2023", amount: 85000, status: "Pending", method: "TNM Mpamba" },
    { id: "INV-2023-003", client: "Sarah Johnson", date: "Nov 10, 2023", amount: 40000, status: "Paid", method: "Cash" },
    { id: "INV-2023-004", client: "Green Energy Ltd", date: "Nov 22, 2023", amount: 60000, status: "Overdue", method: "Bank Transfer" },
  ];

  // --- HANDLERS FOR PACKAGE MANAGEMENT ---
  const handleEditPackages = (serviceId: string, currentPackages: any[]) => {
    setEditingServiceId(serviceId);
    setTempPackages(JSON.parse(JSON.stringify(currentPackages || [])));
  };

  const handleCancelEdit = () => {
    setEditingServiceId(null);
    setTempPackages([]);
  };

  const handleSavePackages = (serviceId: string) => {
    setServices(prev => prev.map(s => {
      if (s.id === serviceId) {
        return { ...s, packages: tempPackages };
      }
      return s;
    }));
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

  // --- SUB-COMPONENTS ---

  const OverviewPanel = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Revenue This Month', value: 'MK 850,000', icon: DollarSign, color: 'text-white', gradient: 'from-green-600 to-green-700' },
          { label: 'New Bookings', value: '12', icon: Calendar, color: 'text-white', gradient: 'from-blue-600 to-blue-700' },
          { label: 'Pending Projects', value: '8', icon: Briefcase, color: 'text-white', gradient: 'from-purple-600 to-purple-700' },
          { label: 'Growth', value: '+18%', icon: TrendingUp, color: 'text-white', gradient: 'from-orange-500 to-orange-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-800/40 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg group hover:bg-gray-800/60 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm mb-1 font-medium">{stat.label}</p>
                <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/10`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800/40 backdrop-blur-md p-8 rounded-xl border border-white/10 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-white">Revenue Overview</h3>
            <select className="bg-black/20 border border-white/10 rounded-lg text-xs text-gray-300 px-3 py-1.5 outline-none focus:border-brand-primary backdrop-blur-sm">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" tick={{fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#9ca3af" tick={{fontSize: 12}} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(8px)' }} 
                  itemStyle={{ color: '#fff' }}
                  cursor={{ stroke: '#4b5563', strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800/40 backdrop-blur-md p-8 rounded-xl border border-white/10 shadow-xl">
          <h3 className="text-lg font-bold mb-6 text-white">Service Distribution</h3>
          <div className="h-72 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={serviceData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={80} 
                  outerRadius={110} 
                  paddingAngle={5} 
                  dataKey="value"
                  stroke="none"
                >
                  {serviceData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', backdropFilter: 'blur(8px)' }}
                   itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {serviceData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-xs text-gray-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ServicesPanel = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Service Management</h2>
        {!isUploading && (
          <button 
            onClick={() => setIsUploading(true)} 
            className="bg-brand-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold transition-all shadow-lg hover:shadow-brand-primary/25"
          >
            <Plus className="h-4 w-4" /> Add New Service
          </button>
        )}
      </div>

      {isUploading ? (
        <ServiceUploadForm onCancel={() => setIsUploading(false)} />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {services.map((service) => (
            <div key={service.id} className="bg-gray-800/40 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-brand-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-gray-800/60">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <img src={service.imageUrl} alt={service.title} className="w-24 h-24 object-cover rounded-lg bg-gray-700 shadow-md" />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-brand-primary/20 text-blue-300 border border-brand-primary/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{service.category}</span>
                    {editingServiceId === service.id && (
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded font-bold uppercase animate-pulse">Editing Packages</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{service.title}</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-brand-accent font-bold">{service.priceStart}</span>
                    <span className="text-gray-500">|</span>
                    <span className="text-gray-400">{service.packages?.length || 0} Packages Available</span>
                  </div>
                </div>

                <div className="flex gap-2 self-start md:self-center">
                  {editingServiceId !== service.id && (
                    <button 
                      onClick={() => handleEditPackages(service.id, service.packages || [])}
                      className="px-4 py-2 text-sm bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white text-gray-300 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Layers className="h-4 w-4" /> Manage Packages
                    </button>
                  )}
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/10">
                     <Edit className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors border border-transparent hover:border-red-500/20">
                     <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Inline Package Editor */}
              {editingServiceId === service.id && (
                <div className="mt-6 pt-6 border-t border-white/10 animate-fade-in">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-white font-bold flex items-center gap-2">
                       <Package className="h-4 w-4 text-brand-primary" /> Package Configuration
                    </h4>
                    <button 
                      onClick={handleAddPackage}
                      className="text-xs flex items-center gap-1 bg-brand-primary/20 text-brand-primary px-3 py-1.5 rounded hover:bg-brand-primary/30 transition-colors border border-brand-primary/30"
                    >
                      <Plus className="h-3 w-3" /> Add Tier
                    </button>
                  </div>

                  <div className="space-y-3 mb-6">
                    {tempPackages.length === 0 && (
                        <p className="text-sm text-gray-500 italic text-center py-4">No packages defined for this service yet.</p>
                    )}
                    {tempPackages.map((pkg, idx) => (
                      <div key={idx} className="bg-black/20 p-3 rounded-lg border border-white/5 flex flex-col md:flex-row gap-3 items-center group hover:bg-black/30 transition-colors">
                        <div className="flex-1 w-full">
                           <label className="text-xs text-gray-500 mb-1 block">Name</label>
                           <input 
                              type="text" 
                              value={pkg.name}
                              onChange={(e) => handlePackageChange(idx, 'name', e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white focus:border-brand-primary outline-none focus:ring-1 focus:ring-brand-primary/50"
                              placeholder="e.g. Standard"
                           />
                        </div>
                        <div className="w-full md:w-32">
                           <label className="text-xs text-gray-500 mb-1 block">Price</label>
                           <input 
                              type="text" 
                              value={pkg.price}
                              onChange={(e) => handlePackageChange(idx, 'price', e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white focus:border-brand-primary outline-none focus:ring-1 focus:ring-brand-primary/50"
                              placeholder="MK..."
                           />
                        </div>
                        <div className="w-full md:w-32">
                           <label className="text-xs text-gray-500 mb-1 block">Duration</label>
                           <div className="relative">
                             <input 
                                type="text" 
                                value={pkg.time}
                                onChange={(e) => handlePackageChange(idx, 'time', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white focus:border-brand-primary outline-none focus:ring-1 focus:ring-brand-primary/50"
                                placeholder="Time"
                             />
                           </div>
                        </div>
                        <div className="flex self-end md:self-center pt-4 md:pt-3">
                           <button 
                              onClick={() => handleRemovePackage(idx)}
                              className="p-1.5 bg-red-500/10 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors"
                              title="Remove Package"
                           >
                              <X className="h-4 w-4" />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={handleCancelEdit}
                      className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-white/10 text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleSavePackages(service.id)}
                      className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-green-900/20"
                    >
                      <Save className="h-4 w-4" /> Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const BookingsPanel = () => (
    <div className="bg-gray-800/40 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden animate-fade-in shadow-xl">
      <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5">
        <h2 className="text-xl font-bold text-white">Recent Bookings</h2>
        <div className="flex gap-2 bg-black/20 p-1 rounded-lg border border-white/5">
          <button className="px-4 py-1.5 text-xs font-medium bg-white/10 text-white rounded shadow-sm">All</button>
          <button className="px-4 py-1.5 text-xs font-medium text-gray-400 hover:text-white rounded hover:bg-white/5 transition-colors">Pending</button>
          <button className="px-4 py-1.5 text-xs font-medium text-gray-400 hover:text-white rounded hover:bg-white/5 transition-colors">Confirmed</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-black/20 text-gray-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-5 font-semibold border-b border-white/5">Client</th>
              <th className="p-5 font-semibold border-b border-white/5">Service</th>
              <th className="p-5 font-semibold border-b border-white/5">Date</th>
              <th className="p-5 font-semibold border-b border-white/5">Status</th>
              <th className="p-5 font-semibold border-b border-white/5">Amount</th>
              <th className="p-5 font-semibold border-b border-white/5">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-white/5">
            {MOCK_BOOKINGS.map((booking) => (
              <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-xs font-bold text-white shadow-md">
                      {booking.clientName.charAt(0)}
                    </div>
                    <span className="font-medium text-white">{booking.clientName}</span>
                  </div>
                </td>
                <td className="p-5 text-gray-300">Wedding Video</td> {/* Mock service name */}
                <td className="p-5 text-gray-400 font-mono text-xs">{booking.date}</td>
                <td className="p-5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                    booking.status === 'Confirmed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    booking.status === 'Completed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                       booking.status === 'Confirmed' ? 'bg-green-400' :
                       booking.status === 'Completed' ? 'bg-blue-400' :
                       'bg-yellow-400'
                    }`}></span>
                    {booking.status}
                  </span>
                </td>
                <td className="p-5 text-white font-medium">MK {booking.amount.toLocaleString()}</td>
                <td className="p-5">
                  <button className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ProjectsPanel = () => (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Active Client Projects</h2>
        <div className="flex gap-2">
          <div className="bg-gray-800/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-400 flex items-center gap-2 shadow-sm backdrop-blur-sm">
             <Clock className="h-3 w-3" /> Sort by: Due Date
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_PROJECTS.map((project) => (
          <div key={project.id} className="bg-gray-800/40 backdrop-blur-md rounded-xl border border-white/10 p-6 hover:border-brand-primary/50 transition-all shadow-lg group hover:shadow-brand-primary/10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs bg-brand-primary/20 text-blue-300 border border-brand-primary/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{project.client}</span>
                <h3 className="text-lg font-bold text-white mt-2 group-hover:text-brand-primary transition-colors">{project.title}</h3>
              </div>
              <button className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg"><MoreHorizontal className="h-5 w-5" /></button>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden border border-white/5">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.5)] ${
                    project.progress === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-brand-primary to-purple-500'
                  }`} 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm bg-black/20 p-3 rounded-lg border border-white/5">
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-mono text-xs">{project.dueDate}</span>
              </div>
              <div className="flex items-center gap-2">
                {project.status === 'In Progress' && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />}
                {project.status === 'Review' && <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]" />}
                {project.status === 'Editing' && <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />}
                <span className="text-gray-300 font-medium">{project.status}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button 
                onClick={() => setActiveChatProject(project.id)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 border border-white/10"
              >
                <MessageSquare className="h-4 w-4" /> Chat
              </button>
              <button className="flex-1 bg-brand-primary text-white py-2.5 rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20">
                <Upload className="h-4 w-4" /> Deliver
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Overlay Modal */}
      {activeChatProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
           <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]">
              <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold">
                       {MOCK_PROJECTS.find(p => p.id === activeChatProject)?.client.charAt(0)}
                    </div>
                    <div>
                       <h3 className="text-white font-bold text-sm">{MOCK_PROJECTS.find(p => p.id === activeChatProject)?.client}</h3>
                       <p className="text-gray-400 text-xs">{MOCK_PROJECTS.find(p => p.id === activeChatProject)?.title}</p>
                    </div>
                 </div>
                 <button onClick={() => setActiveChatProject(null)} className="text-gray-400 hover:text-white"><X className="h-5 w-5" /></button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-900/50">
                 <div className="flex justify-start">
                    <div className="bg-gray-800 text-gray-200 px-4 py-2 rounded-xl rounded-tl-none max-w-[80%] text-sm">
                       Hi! Just checking in on the progress of the video?
                    </div>
                 </div>
                 <div className="flex justify-end">
                    <div className="bg-brand-primary text-white px-4 py-2 rounded-xl rounded-tr-none max-w-[80%] text-sm">
                       Hello! We are currently in the editing phase. Expect a draft by Friday.
                    </div>
                 </div>
              </div>
              <div className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
                 <input type="text" placeholder="Type a message..." className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-brand-primary outline-none" />
                 <button className="bg-brand-primary text-white p-2 rounded-lg"><MessageSquare className="h-5 w-5" /></button>
              </div>
           </div>
        </div>
      )}
    </div>
  );

  const FinancePanel = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/40 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <DollarSign className="w-24 h-24 text-white" />
          </div>
          <p className="text-gray-400 text-sm mb-1 font-medium relative z-10">Total Revenue</p>
          <h3 className="text-3xl font-bold text-white tracking-tight relative z-10">MK 1.2M</h3>
          <p className="text-green-400 text-xs mt-3 flex items-center gap-1 font-bold bg-green-500/20 inline-block px-2 py-1 rounded border border-green-500/30 relative z-10"><TrendingUp className="h-3 w-3" /> +15%</p>
        </div>
        <div className="bg-gray-800/40 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <AlertCircle className="w-24 h-24 text-yellow-500" />
          </div>
          <p className="text-gray-400 text-sm mb-1 font-medium relative z-10">Pending Invoices</p>
          <h3 className="text-3xl font-bold text-white tracking-tight relative z-10">MK 145K</h3>
          <p className="text-yellow-400 text-xs mt-3 flex items-center gap-1 font-bold bg-yellow-500/20 inline-block px-2 py-1 rounded border border-yellow-500/30 relative z-10"><AlertCircle className="h-3 w-3" /> 2 Overdue</p>
        </div>
        <div className="bg-gray-800/40 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <CreditCard className="w-24 h-24 text-gray-400" />
          </div>
          <p className="text-gray-400 text-sm mb-1 font-medium relative z-10">Expenses</p>
          <h3 className="text-3xl font-bold text-white tracking-tight relative z-10">MK 320K</h3>
          <p className="text-gray-400 text-xs mt-3 bg-white/10 inline-block px-2 py-1 rounded border border-white/10 relative z-10">Equipment & Software</p>
        </div>
      </div>

      <div className="bg-gray-800/40 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-bold text-white">Transaction History</h2>
          <button className="text-xs font-bold text-brand-primary hover:text-white flex items-center gap-1 bg-brand-primary/10 hover:bg-brand-primary px-3 py-1.5 rounded-lg transition-colors border border-brand-primary/20">
            <Download className="h-3 w-3" /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/20 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-5 font-semibold border-b border-white/5">Invoice ID</th>
                <th className="p-5 font-semibold border-b border-white/5">Client</th>
                <th className="p-5 font-semibold border-b border-white/5">Date</th>
                <th className="p-5 font-semibold border-b border-white/5">Method</th>
                <th className="p-5 font-semibold border-b border-white/5">Amount</th>
                <th className="p-5 font-semibold border-b border-white/5">Status</th>
                <th className="p-5 font-semibold border-b border-white/5">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/5">
              {MOCK_INVOICES.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-5 font-mono text-brand-primary text-xs">{inv.id}</td>
                  <td className="p-5 font-medium text-white">{inv.client}</td>
                  <td className="p-5 text-gray-400 text-xs font-mono">{inv.date}</td>
                  <td className="p-5 text-gray-300">
                     <span className="flex items-center gap-1.5">
                       {inv.method.includes('Airtel') && <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)]"></div>}
                       {inv.method.includes('TNM') && <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]"></div>}
                       {inv.method}
                     </span>
                  </td>
                  <td className="p-5 text-white font-bold">MK {inv.amount.toLocaleString()}</td>
                  <td className="p-5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      inv.status === 'Paid' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      inv.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-5">
                    <button className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"><FileText className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // --- MAIN LAYOUT ---

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col md:flex-row text-gray-100 font-sans bg-[url('https://picsum.photos/1920/1080?grayscale&blur=10')] bg-cover bg-fixed">
      {/* Dark Overlay for background image readability */}
      <div className="absolute inset-0 bg-[#0f172a]/90 pointer-events-none fixed z-0"></div>
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-gray-900/90 backdrop-blur-xl border-r border-white/10 flex-shrink-0 flex flex-col h-screen sticky top-0 shadow-2xl z-20">
        <div className="p-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-brand-primary to-blue-700 p-2 rounded-xl shadow-lg shadow-brand-primary/30">
              <Settings className="text-white h-6 w-6" />
            </div>
            <div>
              <h1 className="text-white font-heading font-bold text-xl leading-none tracking-tight">STUDIO</h1>
              <p className="text-brand-primary text-xs font-bold tracking-widest uppercase mt-1 text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">Control Center</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-4">Main Menu</p>
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: LayoutGrid },
            { id: 'services', label: 'Services & Packages', icon: Video },
            { id: 'bookings', label: 'Booking Requests', icon: Calendar },
            { id: 'projects', label: 'Active Projects', icon: Briefcase },
            { id: 'finance', label: 'Finance & Invoices', icon: CreditCard },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id as any); setIsUploading(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm font-medium transition-all duration-300 group relative overflow-hidden ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-brand-primary/90 to-blue-600/90 text-white shadow-lg shadow-brand-primary/20 border-l-4 border-brand-accent' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className={`h-5 w-5 transition-colors relative z-10 ${activeTab === item.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`} />
              <span className="relative z-10">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 bg-black/20 relative">
          <div 
             className="bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-3"
             onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white/10">
              A
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-white text-sm font-bold truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@greatfocus.com</p>
            </div>
          </div>
          
          {showUserMenu && (
             <div className="absolute bottom-full left-4 right-4 mb-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
                <button className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2">
                   <UserIcon className="h-4 w-4" /> Profile Settings
                </button>
                <div className="h-px bg-gray-700"></div>
                <button className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2">
                   <LogOut className="h-4 w-4" /> Sign Out
                </button>
             </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen relative z-10">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="text-3xl font-heading font-bold text-white capitalize tracking-tight drop-shadow-lg">{activeTab.replace(/([A-Z])/g, ' $1').trim()}</h2>
            <p className="text-gray-400 text-sm mt-1">Welcome back to your studio command center.</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-2.5 text-gray-500 h-4 w-4" />
              <input type="text" placeholder="Search..." className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:border-brand-primary outline-none focus:ring-1 focus:ring-brand-primary w-64 transition-all shadow-inner" />
            </div>
            <div className="relative">
               <button 
                 onClick={() => setShowNotifications(!showNotifications)}
                 className={`p-2.5 text-gray-400 hover:text-white bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-full hover:bg-gray-800 transition-colors ${showNotifications ? 'bg-gray-800 text-white ring-2 ring-brand-primary/50' : ''}`}
               >
                 <Bell className="h-5 w-5" />
                 <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-gray-900 shadow-sm animate-pulse"></span>
               </button>

               {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-gray-800/95 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-fade-in z-50">
                     <div className="p-3 border-b border-gray-700 bg-black/20">
                        <h4 className="text-sm font-bold text-white">Notifications</h4>
                     </div>
                     <div className="max-h-64 overflow-y-auto">
                        {[1,2,3].map(i => (
                           <div key={i} className="p-3 border-b border-gray-700/50 hover:bg-white/5 cursor-pointer flex gap-3">
                              <div className="w-2 h-2 mt-2 bg-brand-primary rounded-full shrink-0"></div>
                              <div>
                                 <p className="text-xs text-white font-medium">New Booking Request</p>
                                 <p className="text-xs text-gray-400 mt-0.5">Mwayi Phiri requested a Wedding Video package.</p>
                                 <p className="text-[10px] text-gray-500 mt-1">2 mins ago</p>
                              </div>
                           </div>
                        ))}
                     </div>
                     <div className="p-2 text-center border-t border-gray-700">
                        <button className="text-xs text-brand-primary hover:text-white transition-colors">Mark all as read</button>
                     </div>
                  </div>
               )}
            </div>
          </div>
        </header>

        <div className="pb-10">
          {activeTab === 'overview' && <OverviewPanel />}
          {activeTab === 'services' && <ServicesPanel />}
          {activeTab === 'bookings' && <BookingsPanel />}
          {activeTab === 'projects' && <ProjectsPanel />}
          {activeTab === 'finance' && <FinancePanel />}
        </div>
      </main>
    </div>
  );
};
