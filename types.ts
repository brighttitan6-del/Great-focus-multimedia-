
export enum ViewState {
  WELCOME = 'WELCOME',
  HOME = 'HOME',
  SERVICES = 'SERVICES',
  PORTFOLIO = 'PORTFOLIO',
  BOOKING = 'BOOKING',
  ADMIN = 'ADMIN',
  AI_CONSULT = 'AI_CONSULT',
  CONTACT = 'CONTACT',
  LOGIN = 'LOGIN'
}

export enum ServiceCategory {
  VIDEO_PRODUCTION = 'Video Production',
  GRAPHIC_DESIGN = 'Graphic Design',
  PHOTOGRAPHY = 'Photography',
  MOTION_GRAPHICS = 'Motion Graphics',
  DIGITAL_MARKETING = 'Digital Marketing',
  WEB_DEVELOPMENT = 'Web & App Development',
  EDUCATION = 'Education & Training'
}

export interface ServiceTier {
  name: string;
  price: number;
  description: string;
  features: string[];
}

export interface ServiceAddOn {
  name: string;
  price: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  priceStart: string; // Display string e.g. "MK 150,000"
  category: ServiceCategory;
  iconName: string;
  imageUrl: string;
  videoUrl?: string;
  isActive?: boolean;
  tiers: ServiceTier[];
  addOns: ServiceAddOn[];
  // Legacy support optional
  packages?: {
    name: string;
    price: string;
    time: string;
  }[];
}

export interface Booking {
  id: string;
  clientName: string;
  serviceId: string;
  serviceName?: string; // Snapshot of service name
  tierName?: string; // Selected tier
  addOns?: string[]; // Selected add-ons names
  date: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  amount: number;
}

export interface ActivityLog {
  id: string;
  text: string;
  date: string;
  type?: 'info' | 'warning' | 'success';
}

export interface Project {
  id: string;
  client: string;
  clientId?: string; 
  clientEmail?: string;
  category: string;
  phone: string;
  email: string;
  title: string;
  dueDate: string;
  progress: number;
  status: string;
  activities?: ActivityLog[];
  deliverables?: {
    name: string;
    url: string;
    type: 'video' | 'image' | 'file';
  }[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  type: 'video' | 'image';
  videoUrl?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatarUrl: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin?: boolean;
  accessToken?: string;
}
