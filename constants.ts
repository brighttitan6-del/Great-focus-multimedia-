
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
    description: 'Cinematic storytelling of your special day. We capture every emotion, smile, and tear.',
    priceStart: 'MK 150,000',
    category: ServiceCategory.VIDEO_PRODUCTION,
    iconName: 'video',
    imageUrl: 'https://picsum.photos/800/600?random=1',
    videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    tiers: [
      {
        name: 'Silver Package',
        price: 150000,
        description: 'Perfect for intimate ceremonies.',
        features: ['Full Ceremony Coverage', '3-5 Minute Highlight Reel', '1 Videographer', 'Digital Delivery']
      },
      {
        name: 'Gold Package',
        price: 250000,
        description: 'Our most popular comprehensive package.',
        features: ['Full Day Coverage', '10 Minute Cinematic Film', 'Drone Aerial Shots', '2 Videographers', 'Flash Drive Delivery']
      },
      {
        name: 'Platinum Package',
        price: 400000,
        description: 'The ultimate luxury experience in 4K.',
        features: ['Unlimited Coverage', 'Full Documentary Edit (60mins)', 'Drone & 4K Quality', '3 Videographers', 'Same Day Edit (Teaser)']
      }
    ],
    addOns: [
      { name: 'Extra Hour Coverage', price: 20000 },
      { name: 'Raw Footage Hard Drive', price: 50000 },
      { name: 'Pre-Wedding Shoot', price: 40000 }
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
    tiers: [
      {
        name: 'Startup Logo',
        price: 40000,
        description: 'Essential branding to get you started.',
        features: ['2 Logo Concepts', 'High-Res PNG & JPG', '3 Revisions']
      },
      {
        name: 'Corporate Identity',
        price: 120000,
        description: 'Complete branding solution.',
        features: ['5 Logo Concepts', 'Source Files (AI, EPS)', 'Business Card Design', 'Letterhead Design', 'Social Media Kit']
      }
    ],
    addOns: [
      { name: 'Priority Delivery (24h)', price: 15000 },
      { name: '3D Mockups', price: 10000 }
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
    tiers: [
      {
        name: 'Social Teaser',
        price: 85000,
        description: 'Short, punchy 15s ad for Instagram/TikTok.',
        features: ['15 Seconds', 'Stock Footage/Music', 'Text Overlay', '1 Revision']
      },
      {
        name: 'Broadcast Ad',
        price: 150000,
        description: 'Full 30s commercial quality ad.',
        features: ['30 Seconds', 'Voiceover Recording', 'Custom Animation', 'Scriptwriting', 'Unlimited Revisions']
      }
    ],
    addOns: [
      { name: 'Professional Voiceover', price: 30000 },
      { name: '4K Export', price: 15000 }
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
    tiers: [
      { name: 'Half Day', price: 50000, description: 'Up to 4 hours coverage.', features: ['4 Hours', '50 Edited Photos', 'Online Gallery'] },
      { name: 'Full Day', price: 100000, description: 'Up to 8 hours coverage.', features: ['8 Hours', '150 Edited Photos', 'Online Gallery', 'Photo Book'] }
    ],
    addOns: [
      { name: 'Extra Photographer', price: 30000 }
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
    tiers: [
      { name: 'Starter', price: 60000, description: 'Basic monthly management.', features: ['2 Posts/Week', 'Community Management', 'Monthly Report'] },
      { name: 'Growth', price: 150000, description: 'Aggressive growth strategy.', features: ['Daily Posts', 'Ad Campaign Management', 'Content Creation', 'Bi-Weekly Reports'] }
    ],
    addOns: []
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
    tiers: [
      { name: 'Performance', price: 200000, description: 'Clean performance shots.', features: ['1 Location', 'Performance Only', 'Color Grading'] },
      { name: 'Concept', price: 350000, description: 'Story-driven cinematic video.', features: ['3 Locations', 'Scripted Storyline', 'VFX & Advanced Editing', 'Drone Shots'] }
    ],
    addOns: [
      { name: 'Model/Dancers Casting', price: 50000 }
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
    tiers: [
      { name: 'Landing Page', price: 300000, description: 'High converting single page.', features: ['One Page', 'Contact Form', 'Mobile Responsive', 'SEO Basic'] },
      { name: 'Corporate Site', price: 600000, description: 'Multi-page business site.', features: ['5 Pages', 'CMS Integration', 'Blog Section', 'Analytics Setup'] },
      { name: 'E-Commerce', price: 1200000, description: 'Full online store.', features: ['Product Management', 'Payment Gateway', 'User Accounts', 'Security Suite'] }
    ],
    addOns: [
      { name: 'Domain & Hosting (1yr)', price: 45000 },
      { name: 'Logo Design', price: 30000 }
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
    tiers: [
      { name: 'Prototype', price: 250000, description: 'Clickable visual prototype.', features: ['10 Screens', 'Figma File', 'Interactive Flow'] },
      { name: 'Full Design System', price: 550000, description: 'Complete dev-ready assets.', features: ['All Screens', 'Design System', 'Icons & Assets', 'Dev Handoff'] }
    ],
    addOns: []
  },
  {
    id: 's9',
    title: 'Creative Skills Academy',
    description: 'Master photography, video editing, and graphic design with our expert-led online courses.',
    priceStart: 'MK 45,000',
    category: ServiceCategory.EDUCATION,
    iconName: 'graduation-cap',
    imageUrl: 'https://picsum.photos/800/600?random=9',
    tiers: [
      { name: 'Crash Course', price: 45000, description: '2-week intensive basics.', features: ['Online Access', '2 Projects', 'Certificate'] },
      { name: 'Masterclass', price: 120000, description: '6-week professional course.', features: ['Live Mentorship', 'Portfolio Building', 'Advanced Tools', 'Job Support'] }
    ],
    addOns: []
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
  { id: 'b1', clientName: 'Mwayi Phiri', serviceId: 's1', serviceName: 'Wedding Video', tierName: 'Silver Package', date: '2023-11-15', status: 'Confirmed', amount: 150000 },
  { id: 'b2', clientName: 'Daniel Banda', serviceId: 's3', serviceName: 'Motion Graphics', tierName: 'Social Teaser', date: '2023-11-20', status: 'Pending', amount: 85000 },
  { id: 'b3', clientName: 'Sarah Johnson', serviceId: 's2', serviceName: 'Brand Identity', tierName: 'Startup Logo', date: '2023-11-10', status: 'Completed', amount: 40000 },
  { id: 'b4', clientName: 'Green Energy Ltd', serviceId: 's5', serviceName: 'Digital Marketing', tierName: 'Starter', date: '2023-12-01', status: 'Confirmed', amount: 60000 },
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
    activities: [
      { id: 'a1', text: 'Project started', date: '2023-11-01 09:00', type: 'info' },
      { id: 'a2', text: 'Draft video uploaded', date: '2023-11-10 14:30', type: 'success' },
      { id: 'a3', text: 'Client feedback received', date: '2023-11-12 10:15', type: 'warning' }
    ],
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
    status: "Editing",
    activities: [
      { id: 'a4', text: 'Shooting completed', date: '2023-11-15 18:00', type: 'success' },
      { id: 'a5', text: 'Footage transfer started', date: '2023-11-16 09:00', type: 'info' }
    ]
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
    status: "Client Review",
    activities: [
      { id: 'a6', text: 'Final cut sent for review', date: '2023-11-20 16:45', type: 'success' }
    ]
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
    status: "Planning",
    activities: [
      { id: 'a7', text: 'Initial brief meeting', date: '2023-11-22 11:00', type: 'info' }
    ]
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
