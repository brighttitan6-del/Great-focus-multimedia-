import React, { useState } from 'react';
import { MOCK_BOOKINGS, SERVICES } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  DollarSign, Calendar, Users, TrendingUp, LayoutGrid, Video, 
  Briefcase, MessageSquare, CreditCard, Settings, Plus, Upload, 
  Image as ImageIcon, CheckCircle, Clock, Trash2, Edit, FileText, Download, MoreHorizontal, AlertCircle
} from 'lucide-react';
import { ServiceCategory } from '../types';
import { ServiceUploadForm } from './ServiceUploadForm';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'bookings' | 'projects' | 'finance'>('overview');
  const [isUploading, setIsUploading] = useState(false);

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

  // --- SUB-COMPONENTS ---

  const OverviewPanel = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Revenue This Month', value: 'MK 850,000', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'New Bookings', value: '12', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Pending Projects', value: '8', icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Growth', value: '+18%', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-lg font-bold mb-6 text-white">Revenue Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                <Bar dataKey="amount" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-lg font-bold mb-6 text-white">Service Popularity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={serviceData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {serviceData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
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
            className="bg-brand-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-colors"
          >
            <Plus className="h-4 w-4" /> Add New Service
          </button>
        )}
      </div>

      {isUploading ? (
        <ServiceUploadForm onCancel={() => setIsUploading(false)} />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {SERVICES.map((service) => (
            <div key={service.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col md:flex-row items-center gap-4 hover:border-gray-600 transition-colors">
              <img src={service.imageUrl} alt={service.title} className="w-20 h-20 object-cover rounded-lg bg-gray-700" />
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-bold text-white">{service.title}</h3>
                <p className="text-gray-400 text-sm">{service.category}</p>
                <p className="text-brand-accent text-sm font-medium mt-1">{service.priceStart}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"><Edit className="h-5 w-5" /></button>
                <button className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"><Trash2 className="h-5 w-5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const BookingsPanel = () => (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Recent Bookings</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 text-white rounded-full">All</button>
          <button className="px-3 py-1 text-xs bg-brand-primary text-white rounded-full">Pending</button>
          <button className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 text-white rounded-full">Confirmed</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase">
            <tr>
              <th className="p-4">Client</th>
              <th className="p-4">Service</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-700">
            {MOCK_BOOKINGS.map((booking) => (
              <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-medium text-white">{booking.clientName}</td>
                <td className="p-4 text-gray-300">Wedding Video</td> {/* Mock service name */}
                <td className="p-4 text-gray-400">{booking.date}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'Confirmed' ? 'bg-green-500/20 text-green-400' :
                    booking.status === 'Completed' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="p-4 text-white">MK {booking.amount.toLocaleString()}</td>
                <td className="p-4">
                  <button className="text-blue-400 hover:text-blue-300 text-xs font-bold">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ProjectsPanel = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Active Client Projects</h2>
        <div className="flex gap-2">
          <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-400 flex items-center">
             Sort by: Due Date
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_PROJECTS.map((project) => (
          <div key={project.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs text-brand-primary font-bold uppercase tracking-wider">{project.client}</span>
                <h3 className="text-lg font-bold text-white mt-1">{project.title}</h3>
              </div>
              <button className="text-gray-400 hover:text-white"><MoreHorizontal className="h-5 w-5" /></button>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    project.progress === 100 ? 'bg-green-500' : 'bg-brand-primary'
                  }`} 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="h-4 w-4" />
                <span>Due: {project.dueDate}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                {project.status === 'In Progress' && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                {project.status === 'Review' && <div className="w-2 h-2 rounded-full bg-yellow-500" />}
                {project.status === 'Editing' && <div className="w-2 h-2 rounded-full bg-purple-500" />}
                <span>{project.status}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-700 flex gap-3">
              <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <MessageSquare className="h-4 w-4" /> Chat
              </button>
              <button className="flex-1 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Upload className="h-4 w-4" /> Upload
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const FinancePanel = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
          <h3 className="text-3xl font-bold text-white">MK 1.2M</h3>
          <p className="text-green-500 text-xs mt-2 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> +15% from last month</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Pending Invoices</p>
          <h3 className="text-3xl font-bold text-white">MK 145K</h3>
          <p className="text-yellow-500 text-xs mt-2 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> 2 invoices overdue</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Expenses</p>
          <h3 className="text-3xl font-bold text-white">MK 320K</h3>
          <p className="text-gray-500 text-xs mt-2">Equipment & Software</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Transaction History</h2>
          <button className="text-sm text-brand-primary hover:text-white flex items-center gap-1">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase">
              <tr>
                <th className="p-4">Invoice ID</th>
                <th className="p-4">Client</th>
                <th className="p-4">Date</th>
                <th className="p-4">Method</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-700">
              {MOCK_INVOICES.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-gray-400 text-xs">{inv.id}</td>
                  <td className="p-4 font-medium text-white">{inv.client}</td>
                  <td className="p-4 text-gray-400">{inv.date}</td>
                  <td className="p-4 text-gray-300">{inv.method}</td>
                  <td className="p-4 text-white font-bold">MK {inv.amount.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      inv.status === 'Paid' ? 'bg-green-500/20 text-green-400' :
                      inv.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-gray-400 hover:text-white"><FileText className="h-4 w-4" /></button>
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
    <div className="min-h-screen bg-gray-900 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-gray-900 border-r border-gray-800 flex-shrink-0">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="bg-brand-primary p-1.5 rounded-lg">
              <Settings className="text-white h-5 w-5" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">Admin</h1>
              <p className="text-gray-500 text-xs">Control Center</p>
            </div>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutGrid },
            { id: 'services', label: 'Services', icon: Video },
            { id: 'bookings', label: 'Bookings', icon: Calendar },
            { id: 'projects', label: 'Client Projects', icon: Briefcase },
            { id: 'finance', label: 'Payments', icon: CreditCard },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id as any); setIsUploading(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id 
                  ? 'bg-brand-primary/10 text-brand-primary' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-heading font-bold text-white capitalize">{activeTab.replace(/([A-Z])/g, ' $1').trim()}</h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-white relative">
              <MessageSquare className="h-6 w-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-gray-900"></span>
            </button>
            <div className="h-10 w-10 bg-gradient-to-br from-brand-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              A
            </div>
          </div>
        </header>

        {activeTab === 'overview' && <OverviewPanel />}
        {activeTab === 'services' && <ServicesPanel />}
        {activeTab === 'bookings' && <BookingsPanel />}
        {activeTab === 'projects' && <ProjectsPanel />}
        {activeTab === 'finance' && <FinancePanel />}
      </main>
    </div>
  );
};
