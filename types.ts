
export enum ViewState {
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
  DIGITAL_MARKETING = 'Digital Marketing'
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  priceStart: string;
  category: ServiceCategory;
  iconName: string;
  imageUrl: string;
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
  date: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  amount: number;
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
}