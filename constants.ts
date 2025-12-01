

import { ServiceCategory, ServiceItem, PortfolioItem, Booking, Testimonial, Project } from './types';

export const COMPANY_INFO = {
  name: "Great Focus Multimedia",
  tagline: "Create. Capture. Compel.",
  location: "Area 23 Lilongwe",
  phone: "+265 998235818",
  phone2: "+265 883526602",
  email: "brighttitan6@gmail.com",
  socials: {
    facebook: "https://www.facebook.com/share/1EVsjc7tiN/",
    youtube: "https://youtube.com/@greatfocusmedia",
    tiktok: "tiktok.com/@great.focus.media"
  }
};

export const SERVICES: ServiceItem[] = [
  {
    id: 's1',
    title: 'Wedding Video Packages',
    description: 'Cinematic storytelling of your special day. Includes drone shots and full-day coverage.',
    priceStart: 'MK 150,000',
    category: ServiceCategory.VIDEO_PRODUCTION,
    iconName: 'video',
    imageUrl: 'https://picsum.photos/800/600?random=1',
    videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    packages: [
      { name: 'Silver Package', price: 'MK 150,000', time: '1 Week' },
      { name: 'Gold Package', price: 'MK 250,000', time: '2 Weeks' },
      { name: 'Platinum (Drone + 4K)', price: 'MK 400,000', time: '3 Weeks' }
    ]
  },
  {
    id: 's2',
    title: 'Brand Identity & Logos',
    description: 'Professional logo design, business cards, and complete brand style guides.',
    priceStart: 'MK 40,000',
    category: ServiceCategory.GRAPHIC_DESIGN,
    iconName: 'palette',
    imageUrl: 'https://picsum.photos/800/600?random=2',
    packages: [
      { name: 'Logo Only', price: 'MK 40,000', time: '3 Days' },
      { name: 'Full Branding Kit', price: 'MK 120,000', time: '1 Week' }
    ]
  },
  {
    id: 's3',
    title: 'Motion Graphics & Ads',
    description: 'High-conversion 30s social media ads and animated intros for your business.',
    priceStart: 'MK 85,000',
    category: ServiceCategory.MOTION_GRAPHICS,
    iconName: 'activity',
    imageUrl: 'https://picsum.photos/800/600?random=3',
    videoUrl: 'https://www.youtube.com/watch?v=ysz5S6P_280',
    packages: [
      { name: '15s Social Teaser', price: 'MK 85,000', time: '4 Days' },
      { name: '30s Full Ad', price: 'MK 150,000', time: '1 Week' }
    ]
  },
  {
    id: 's4',
    title: 'Event Photography',
    description: 'Crisp, high-resolution photography for corporate events, parties, and conferences.',
    priceStart: 'MK 50,000',
    category: ServiceCategory.PHOTOGRAPHY,
    iconName: 'camera',
    imageUrl: 'https://picsum.photos/800/600?random=4',
    packages: [
      { name: 'Half Day Coverage', price: 'MK 50,000', time: '3 Days' },
      { name: 'Full Day + Editing', price: 'MK 100,000', time: '1 Week' }
    ]
  },
  {
    id: 's5',
    title: 'Digital Marketing Boost',
    description: 'Social media management and targeted video promotion campaigns.',
    priceStart: 'MK 60,000',
    category: ServiceCategory.DIGITAL_MARKETING,
    iconName: 'trending-up',
    imageUrl: 'https://picsum.photos/800/600?random=5',
    packages: [
      { name: 'Starter Boost', price: 'MK 60,000', time: 'Monthly' },
      { name: 'Growth Partner', price: 'MK 150,000', time: 'Monthly' }
    ]
  },
  {
    id: 's6',
    title: 'Music Video Production',
    description: 'Professional 4K music video shooting and editing with advanced effects.',
    priceStart: 'MK 200,000',
    category: ServiceCategory.VIDEO_PRODUCTION,
    iconName: 'music',
    imageUrl: 'https://picsum.photos/800/600?random=6',
    videoUrl: 'https://www.youtube.com/watch?v=ysz5S6P_280',
    packages: [
      { name: 'Performance Video', price: 'MK 200,000', time: '2 Weeks' },
      { name: 'Concept Video (Scripted)', price: 'MK 350,000', time: '3 Weeks' }
    ]
  },
  {
    id: 's7',
    title: 'Professional Web Development',
    description: 'Custom, responsive websites and web applications built to scale your business online.',
    priceStart: 'MK 300,000',
    category: ServiceCategory.WEB_DEVELOPMENT,
    iconName: 'globe',
    imageUrl: 'https://picsum.photos/800/600?random=7',
    packages: [
      { name: 'Landing Page', price: 'MK 300,000', time: '2 Weeks' },
      { name: 'Corporate Site (5 Pages)', price: 'MK 600,000', time: '4 Weeks' },
      { name: 'E-Commerce Store', price: 'MK 1,200,000', time: '6 Weeks' }
    ]
  },
  {
    id: 's8',
    title: 'UI/UX App Design',
    description: 'User-friendly mobile app interfaces and interactive prototypes for iOS and Android.',
    priceStart: 'MK 250,000',
    category: ServiceCategory.WEB_DEVELOPMENT,
    iconName: 'smartphone',
    imageUrl: 'https://picsum.photos/800/600?random=8',
    packages: [
      { name: 'UI Prototype', price: 'MK 250,000', time: '2 Weeks' },
      { name: 'Full App Design', price: 'MK 550,000', time: '4 Weeks' }
    ]
  },
  {
    id: 's9',
    title: 'Creative Skills Academy',
    description: 'Master photography, video editing, and graphic design with our expert-led online courses.',
    priceStart: 'MK 45,000',
    category: ServiceCategory.EDUCATION,
    iconName: 'graduation-cap',
    imageUrl: 'https://picsum.photos/800/600?random=9',
    packages: [
      { name: 'Basics Crash Course', price: 'MK 45,000', time: '2 Weeks' },
      { name: 'Professional Masterclass', price: 'MK 120,000', time: '6 Weeks' },
      { name: '1-on-1 Mentorship', price: 'MK 200,000', time: 'Monthly' }
    ]
  }
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  { 
    id: 'p1', 
    title: 'Chikondi & Tiyese Wedding', 
    category: 'Wedding', 
    imageUrl: 'https://picsum.photos/400/300?random=10', 
    type: 'video',
    videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ'
  },
  { 
    id: 'p2', 
    title: 'TechCorp Launch Ad', 
    category: 'Advertising', 
    imageUrl: 'https://picsum.photos/400/300?random=11', 
    type: 'video',
    videoUrl: 'https://www.youtube.com/watch?v=ysz5S6P_280'
  },
  { 
    id: 'p3', 
    title: 'Lilongwe Jazz Fest', 
    category: 'Photography', 
    imageUrl: 'https://picsum.photos/400/300?random=12', 
    type: 'image' 
  },
  { 
    id: 'p4', 
    title: 'AutoFix Rebrand', 
    category: 'Graphic Design', 
    imageUrl: 'https://picsum.photos/400/300?random=13', 
    type: 'image' 
  },
];

export const MOCK_BOOKINGS: Booking[] = [
  { id: 'b1', clientName: 'Mwayi Phiri', serviceId: 's1', date: '2023-11-15', status: 'Confirmed', amount: 150000 },
  { id: 'b2', clientName: 'Daniel Banda', serviceId: 's3', date: '2023-11-20', status: 'Pending', amount: 85000 },
  { id: 'b3', clientName: 'Sarah Johnson', serviceId: 's2', date: '2023-11-10', status: 'Completed', amount: 40000 },
  { id: 'b4', clientName: 'Green Energy Ltd', serviceId: 's5', date: '2023-12-01', status: 'Confirmed', amount: 60000 },
];

export const MOCK_PROJECTS: Project[] = [
  { 
    id: 'p1', 
    client: "TechMalawi", 
    clientId: 'u-123',
    clientEmail: 'user@gmail.com', 
    category: "Advertising", 
    phone: "265999123456", 
    email: "user@gmail.com", 
    title: "Product Launch Ad", 
    dueDate: "Nov 25, 2023", 
    progress: 75, 
    status: "In Progress",
    deliverables: []
  },
  { 
    id: 'p2', 
    client: "Chikondi Phiri", 
    clientEmail: 'chikondi@gmail.com',
    category: "Wedding", 
    phone: "265888123456", 
    email: "chikondi@gmail.com", 
    title: "Wedding Highlights", 
    dueDate: "Dec 01, 2023", 
    progress: 40, 
    status: "Editing" 
  },
  { 
    id: 'p3', 
    client: "Green Energy", 
    clientEmail: 'ops@greenenergy.mw',
    category: "Corporate", 
    phone: "265991234567", 
    email: "ops@greenenergy.mw", 
    title: "Corporate Documentary", 
    dueDate: "Nov 30, 2023", 
    progress: 90, 
    status: "Client Review" 
  },
  { 
    id: 'p4', 
    client: "AutoFix", 
    clientEmail: 'manager@autofix.mw',
    category: "Graphic Design", 
    phone: "265881234567", 
    email: "manager@autofix.mw", 
    title: "Rebranding Assets", 
    dueDate: "Dec 05, 2023", 
    progress: 10, 
    status: "Planning" 
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Chikondi Phiri',
    role: 'Happy Bride',
    quote: "Great Focus made our wedding look like a movie! The drone shots were incredible and they captured every emotion perfectly.",
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: 't2',
    name: 'Daniel Banda',
    role: 'CEO, TechMalawi',
    quote: "The motion graphics ad they produced doubled our click-through rate. Professional, fast, and highly creative team.",
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: 't3',
    name: 'Sarah Johnson',
    role: 'Event Organizer',
    quote: "I rely on Great Focus for all my event photography. They never miss a moment and the editing is always top-notch.",
    avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg'
  }
];