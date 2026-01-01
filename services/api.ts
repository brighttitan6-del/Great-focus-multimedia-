
import { ServiceItem, Booking, User, Project, PortfolioItem } from '../types';
import { SERVICES, MOCK_BOOKINGS, MOCK_PROJECTS, PORTFOLIO_ITEMS } from '../constants';

// --- CONFIGURATION ---
const API_URL = 'http://localhost:5000/api'; 

// SET THIS TO TRUE TO USE MOCK DATA
const USE_MOCK_DATA = true; 

// --- IN-MEMORY DATA STORE (For Mock Mode Persistence) ---
let mockServices: ServiceItem[] = [...SERVICES];
let mockBookings: Booking[] = [...MOCK_BOOKINGS];
let mockProjects: Project[] = [...MOCK_PROJECTS];
let mockPortfolio: PortfolioItem[] = [...PORTFOLIO_ITEMS];

// --- HELPERS ---
const getHeaders = () => {
  const user = localStorage.getItem('user');
  const token = user ? JSON.parse(user).accessToken : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { token: `Bearer ${token}` })
  };
};

export const api = {
  // SERVICES
  getServices: async (): Promise<ServiceItem[]> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve([...mockServices]), 500);
      });
    }
    const res = await fetch(`${API_URL}/services`);
    return res.json();
  },

  createService: async (service: Partial<ServiceItem>): Promise<ServiceItem> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        const newService = { 
          ...service, 
          id: 's-' + Date.now(),
          imageUrl: service.imageUrl || 'https://picsum.photos/800/600'
        } as ServiceItem;
        
        mockServices = [newService, ...mockServices];
        resolve(newService);
      });
    }
    const res = await fetch(`${API_URL}/services`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(service)
    });
    return res.json();
  },

  updateService: async (id: string, updates: Partial<ServiceItem>): Promise<ServiceItem | undefined> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        mockServices = mockServices.map(s => s.id === id ? { ...s, ...updates } : s);
        resolve(mockServices.find(s => s.id === id));
      });
    }
    const res = await fetch(`${API_URL}/services/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) return undefined;
    return res.json();
  },

  deleteService: async (id: string): Promise<boolean> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        mockServices = mockServices.filter(s => s.id !== id);
        resolve(true);
      });
    }
    const res = await fetch(`${API_URL}/services/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.ok;
  },

  // BOOKINGS
  getBookings: async (): Promise<Booking[]> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => setTimeout(() => resolve([...mockBookings]), 500));
    }
    const res = await fetch(`${API_URL}/bookings`, { headers: getHeaders() });
    return res.json();
  },

  createBooking: async (booking: any) => {
    if (USE_MOCK_DATA) {
      const newBooking = { id: 'b-' + Date.now(), ...booking, status: 'Confirmed' };
      mockBookings.push(newBooking);
      return newBooking;
    }
    const res = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(booking)
    });
    return res.json();
  },

  updateBooking: async (id: string, updates: Partial<Booking>) => {
    if (USE_MOCK_DATA) {
       mockBookings = mockBookings.map(b => b.id === id ? { ...b, ...updates } : b);
       return Promise.resolve(mockBookings.find(b => b.id === id));
    }
    const res = await fetch(`${API_URL}/bookings/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  // PROJECTS & DELIVERABLES
  getProjects: async (userEmail?: string): Promise<Project[]> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        // If userEmail provided, filter projects for that client
        const projects = userEmail 
          ? mockProjects.filter(p => p.clientEmail === userEmail || p.email === userEmail)
          : mockProjects;
        setTimeout(() => resolve([...projects]), 300);
      });
    }
    
    let url = `${API_URL}/projects`;
    if (userEmail) {
        url = `${API_URL}/projects/find?email=${encodeURIComponent(userEmail)}`;
    }
    const res = await fetch(url, { headers: getHeaders() });
    return res.json();
  },

  updateProject: async (id: string, updates: Partial<Project>): Promise<Project | undefined> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        mockProjects = mockProjects.map(p => p.id === id ? { ...p, ...updates } : p);
        resolve(mockProjects.find(p => p.id === id));
      });
    }
    
    const res = await fetch(`${API_URL}/projects/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates)
    });
    return res.json();
  },

  // PORTFOLIO
  getPortfolio: async (): Promise<PortfolioItem[]> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve([...mockPortfolio]), 500);
      });
    }
    const res = await fetch(`${API_URL}/portfolio`);
    return res.json();
  },

  addPortfolioItem: async (item: Partial<PortfolioItem>): Promise<PortfolioItem> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        const newItem = {
          ...item,
          id: 'p-' + Date.now()
        } as PortfolioItem;
        mockPortfolio = [newItem, ...mockPortfolio];
        resolve(newItem);
      });
    }
    
    const res = await fetch(`${API_URL}/portfolio`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(item)
    });
    return res.json();
  },

  deletePortfolioItem: async (id: string): Promise<boolean> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        mockPortfolio = mockPortfolio.filter(p => p.id !== id);
        resolve(true);
      });
    }
    
    const res = await fetch(`${API_URL}/portfolio/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    return res.ok;
  },

  // AUTH
  login: async (credentials: any): Promise<User> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (credentials.email === 'admin@greatfocus00123.com') {
            if (credentials.password === 'grax2650') {
              resolve({
                id: 'admin-master',
                name: 'Great Focus Admin',
                email: 'admin@greatfocus00123.com',
                isAdmin: true,
                avatar: 'https://ui-avatars.com/api/?name=Admin&background=0f172a&color=fff',
                accessToken: 'mock-admin-token'
              });
            } else {
              reject(new Error('Invalid password for admin account.'));
            }
            return;
          }
          resolve({
            id: 'u-123',
            name: 'Demo User',
            email: credentials.email,
            isAdmin: false,
            avatar: `https://ui-avatars.com/api/?name=User&background=2563eb&color=fff`,
            accessToken: 'mock-user-token'
          });
        }, 1000);
      });
    }
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data || "Login failed");
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  },

  register: async (userData: any): Promise<User> => {
    if (USE_MOCK_DATA) {
       return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: 'u-' + Date.now(),
            name: userData.name,
            email: userData.email,
            isAdmin: false,
            avatar: `https://ui-avatars.com/api/?name=${userData.name}`,
            accessToken: 'mock-new-user-token'
          });
        }, 1000);
      });
    }
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data || "Registration failed");
    return data;
  }
};
