import { ServiceItem, Booking, User } from '../types';
import { SERVICES, MOCK_BOOKINGS } from '../constants';

// --- CONFIGURATION ---
const API_URL = 'http://localhost:5000/api'; 

// SET THIS TO TRUE TO USE MOCK DATA
const USE_MOCK_DATA = true; 

// --- IN-MEMORY DATA STORE (For Mock Mode Persistence) ---
let mockServices: ServiceItem[] = [...SERVICES];
let mockBookings: Booking[] = [...MOCK_BOOKINGS];

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

  // AUTH
  login: async (credentials: any): Promise<User> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // ADMIN CREDENTIAL CHECK
          if (credentials.email === 'admin@greatfocus00123.com') {
            if (credentials.password === 'grax2650') {
              resolve({
                id: 'admin-master',
                name: 'Great Focus Admin',
                email: 'admin@greatfocus00123.com',
                isAdmin: true,
                avatar: 'https://ui-avatars.com/api/?name=Admin&background=0f172a&color=fff'
              });
            } else {
              reject(new Error('Invalid password for admin account.'));
            }
            return;
          }

          // Simulate specific errors for testing purposes
          if (credentials.email === 'error@test.com') {
            reject(new Error('Invalid email or password. Please try again.'));
            return;
          }
          if (credentials.email === 'network@test.com') {
             reject(new Error('Network connection failed. Please check your internet.'));
             return;
          }
          
          // Regular User Login
          resolve({
            id: 'u-123',
            name: 'Demo User',
            email: credentials.email,
            isAdmin: false,
            avatar: `https://ui-avatars.com/api/?name=User&background=2563eb&color=fff`
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
       return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate specific error for existing user
          if (userData.email === 'exist@test.com') {
            reject(new Error('This email address is already registered.'));
            return;
          }

          resolve({
            id: 'u-' + Date.now(),
            name: userData.name,
            email: userData.email,
            isAdmin: false,
            avatar: `https://ui-avatars.com/api/?name=${userData.name}`
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