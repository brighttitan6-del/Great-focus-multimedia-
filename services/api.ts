import { ServiceItem, Booking, User } from '../types';
import { SERVICES, MOCK_BOOKINGS } from '../constants';

// --- CONFIGURATION ---
const API_URL = 'http://localhost:5000/api';
// SET THIS TO FALSE TO USE THE REAL BACKEND
const USE_MOCK_DATA = true; 

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
        setTimeout(() => resolve(SERVICES), 500);
      });
    }
    const res = await fetch(`${API_URL}/services`);
    return res.json();
  },

  createService: async (service: Partial<ServiceItem>) => {
    if (USE_MOCK_DATA) {
      console.log('Mock Create Service:', service);
      return { id: 'new-' + Date.now(), ...service };
    }
    const res = await fetch(`${API_URL}/services`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(service)
    });
    return res.json();
  },

  // BOOKINGS
  getBookings: async (): Promise<Booking[]> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => setTimeout(() => resolve(MOCK_BOOKINGS), 500));
    }
    const res = await fetch(`${API_URL}/bookings`, { headers: getHeaders() });
    return res.json();
  },

  createBooking: async (booking: any) => {
    if (USE_MOCK_DATA) {
      console.log('Mock Create Booking:', booking);
      return { id: 'b-' + Date.now(), ...booking, status: 'Confirmed' };
    }
    const res = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(booking)
    });
    return res.json();
  },

  // AUTH
  login: async (credentials: any): Promise<User> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: 'u-123',
            name: 'Demo User',
            email: credentials.email,
            isAdmin: credentials.email.includes('admin'),
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
    if (!res.ok) throw new Error(data);
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
    return res.json();
  }
};