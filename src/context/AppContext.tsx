import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  avatar: string;
  reputation: number;
  badges: string[];
  role: 'admin' | 'member';
  email: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  subscriptionTier: 'free' | 'pro' | 'enterprise';
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'available' | 'borrowed' | 'maintenance';
  owner_id: string;
  borrower_id?: string;
  image: string;
  created_at: string;
  due_date?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer_id: string;
  attendees: string[];
  max_attendees?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  tags?: string[];
  is_recurring?: boolean;
}

export type LoopType = 'friend' | 'neighborhood' | 'organization';

export interface Loop {
  id: string;
  name: string;
  code: string;
  type: LoopType;
  description: string;
  members: User[];
  items: Item[];
  events: Event[];
  settings: {
    isPrivate: boolean;
    requireApproval: boolean;
    radius?: number;
    centerPoint?: {
      lat: number;
      lng: number;
      address: string;
    };
    maxMembers?: number;
    allowItemSharing: boolean;
    allowEvents: boolean;
  };
  createdAt: string;
  adminId: string;
  subscriptionTier: 'free' | 'pro' | 'enterprise';
}

interface AppContextType {
  currentUser: User | null;
  currentLoop: Loop | null;
  userLoops: Loop[];
  setCurrentUser: (user: User) => void;
  setCurrentLoop: (loop: Loop) => void;
  addLoop: (loop: Loop) => void;
  createLoop: (name: string, description: string, type: LoopType) => void;
  joinLoop: (code: string) => boolean;
  addItem: (item: Omit<Item, 'id' | 'created_at'>) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  addEvent: (event: Omit<Event, 'id'>) => void;
  joinEvent: (eventId: string, userId: string) => void;
  subscriptionLimits: {
    maxMembers: number;
    maxEvents: number;
    hasAdvancedFeatures: boolean;
    hasAnalytics: boolean;
    hasCustomBranding: boolean;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Demo users
const demoUsers: User[] = [
  { 
    id: '1', 
    name: 'Alex Chen', 
    avatar: '👨‍💻', 
    reputation: 95, 
    badges: ['Loop Creator', 'Tech Helper'], 
    role: 'admin',
    email: 'alex@example.com',
    subscriptionTier: 'pro',
    location: { lat: 40.7128, lng: -74.0060, address: '123 Main St, New York, NY' }
  },
  { 
    id: '2', 
    name: 'Sarah Johnson', 
    avatar: '👩‍🎨', 
    reputation: 88, 
    badges: ['Event Master'], 
    role: 'member',
    email: 'sarah@example.com',
    subscriptionTier: 'free',
    location: { lat: 40.7589, lng: -73.9851, address: '456 Park Ave, New York, NY' }
  },
  { 
    id: '3', 
    name: 'Mike Rodriguez', 
    avatar: '👨‍🍳', 
    reputation: 92, 
    badges: ['Helpful Neighbor'], 
    role: 'member',
    email: 'mike@example.com',
    subscriptionTier: 'free'
  },
  { 
    id: '4', 
    name: 'Emma Wilson', 
    avatar: '👩‍📚', 
    reputation: 85, 
    badges: ['Book Lover'], 
    role: 'member',
    email: 'emma@example.com',
    subscriptionTier: 'enterprise'
  }
];

// Demo items
const demoItems: Item[] = [
  { 
    id: '1', 
    title: 'Power Drill', 
    description: 'Cordless drill with bits', 
    category: 'Tools', 
    status: 'available', 
    owner_id: '1', 
    image: '🔧', 
    created_at: '2024-01-15',
    location: { lat: 40.7128, lng: -74.0060, address: '123 Main St' }
  },
  { 
    id: '2', 
    title: 'JavaScript: The Good Parts', 
    description: 'Classic programming book', 
    category: 'Books', 
    status: 'borrowed', 
    owner_id: '4', 
    borrower_id: '1', 
    image: '📚', 
    created_at: '2024-01-14', 
    due_date: '2024-01-28' 
  },
  { 
    id: '3', 
    title: 'Board Game Collection', 
    description: 'Settlers of Catan, Ticket to Ride, and more!', 
    category: 'Games', 
    status: 'available', 
    owner_id: '3', 
    image: '🎲', 
    created_at: '2024-01-13'
  }
];

// Demo events
const demoEvents: Event[] = [
  { 
    id: '1', 
    title: 'Friend Game Night', 
    description: 'Board games and snacks at my place', 
    date: '2024-01-30', 
    time: '19:00', 
    location: 'Alex\'s Apartment', 
    organizer_id: '1', 
    attendees: ['1', '2'], 
    max_attendees: 6,
    tags: ['games', 'social', 'indoor'],
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  { 
    id: '2', 
    title: 'Neighborhood Cleanup', 
    description: 'Community cleanup event in Central Park', 
    date: '2024-02-03', 
    time: '10:00', 
    location: 'Central Park South Entrance', 
    organizer_id: '2', 
    attendees: ['2', '3'], 
    max_attendees: 20,
    tags: ['community', 'environment', 'outdoor'],
    coordinates: { lat: 40.7829, lng: -73.9654 }
  }
];

// Demo loops
const demoLoops: Loop[] = [
  {
    id: '1',
    name: 'College Friends',
    code: 'FRIENDS2024',
    type: 'friend',
    description: 'Our tight-knit college friend group for planning hangouts and events',
    members: demoUsers.slice(0, 2),
    items: [],
    events: [demoEvents[0]],
    settings: {
      isPrivate: true,
      requireApproval: false,
      maxMembers: 20,
      allowItemSharing: true,
      allowEvents: true
    },
    createdAt: '2024-01-01',
    adminId: '1',
    subscriptionTier: 'free'
  },
  {
    id: '2',
    name: 'Upper West Side',
    code: 'UWS2024',
    type: 'neighborhood',
    description: 'Neighbors sharing resources and organizing local events',
    members: demoUsers,
    items: demoItems,
    events: [demoEvents[1]],
    settings: {
      isPrivate: false,
      requireApproval: true,
      radius: 2,
      centerPoint: { lat: 40.7831, lng: -73.9712, address: 'Upper West Side, NYC' },
      maxMembers: 100,
      allowItemSharing: true,
      allowEvents: true
    },
    createdAt: '2024-01-01',
    adminId: '1',
    subscriptionTier: 'pro'
  },
  {
    id: '3',
    name: 'TechCorp Team',
    code: 'TECH2024',
    type: 'organization',
    description: 'Company team for coordination and team building',
    members: demoUsers.slice(0, 3),
    items: [],
    events: [],
    settings: {
      isPrivate: true,
      requireApproval: true,
      maxMembers: 500,
      allowItemSharing: true,
      allowEvents: true
    },
    createdAt: '2024-01-01',
    adminId: '1',
    subscriptionTier: 'enterprise'
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(demoUsers[0]);
  const [currentLoop, setCurrentLoop] = useState<Loop | null>(demoLoops[1]);
  const [userLoops, setUserLoops] = useState<Loop[]>(demoLoops);

  const getSubscriptionLimits = (tier: string) => {
    switch (tier) {
      case 'free':
        return {
          maxMembers: 20,
          maxEvents: 5,
          hasAdvancedFeatures: false,
          hasAnalytics: false,
          hasCustomBranding: false
        };
      case 'pro':
        return {
          maxMembers: 100,
          maxEvents: -1,
          hasAdvancedFeatures: true,
          hasAnalytics: true,
          hasCustomBranding: true
        };
      case 'enterprise':
        return {
          maxMembers: -1,
          maxEvents: -1,
          hasAdvancedFeatures: true,
          hasAnalytics: true,
          hasCustomBranding: true
        };
      default:
        return {
          maxMembers: 20,
          maxEvents: 5,
          hasAdvancedFeatures: false,
          hasAnalytics: false,
          hasCustomBranding: false
        };
    }
  };

  const subscriptionLimits = getSubscriptionLimits(currentLoop?.subscriptionTier || 'free');

  const addLoop = (loop: Loop) => {
    setUserLoops(prev => [...prev, loop]);
  };

  const generateLoopCode = (name: string, type: LoopType): string => {
    const prefix = type.toUpperCase().slice(0, 3);
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${year}${random}`;
  };

  const createLoop = (name: string, description: string, type: LoopType) => {
    if (!currentUser) return;

    const newLoop: Loop = {
      id: Date.now().toString(),
      name,
      code: generateLoopCode(name, type),
      type,
      description,
      members: [currentUser],
      items: [],
      events: [],
      settings: {
        isPrivate: type === 'friend' || type === 'organization',
        requireApproval: type !== 'friend',
        maxMembers: type === 'friend' ? 20 : type === 'neighborhood' ? 100 : 500,
        allowItemSharing: true,
        allowEvents: true,
        ...(type === 'neighborhood' && {
          radius: 1,
          centerPoint: { lat: 40.7128, lng: -74.0060, address: 'New York, NY' }
        })
      },
      createdAt: new Date().toISOString().split('T')[0],
      adminId: currentUser.id,
      subscriptionTier: 'free'
    };

    setUserLoops(prev => [...prev, newLoop]);
    setCurrentLoop(newLoop);
  };

  const joinLoop = (code: string): boolean => {
    const existingLoop = demoLoops.find(loop => loop.code === code);
    if (existingLoop && currentUser) {
      if (!existingLoop.members.find(member => member.id === currentUser.id)) {
        const updatedLoop = {
          ...existingLoop,
          members: [...existingLoop.members, currentUser]
        };
        setUserLoops(prev => {
          const filtered = prev.filter(loop => loop.id !== existingLoop.id);
          return [...filtered, updatedLoop];
        });
        setCurrentLoop(updatedLoop);
      } else {
        setCurrentLoop(existingLoop);
      }
      return true;
    }
    return false;
  };

  const addItem = (itemData: Omit<Item, 'id' | 'created_at'>) => {
    if (!currentLoop) return;
    
    const newItem: Item = {
      ...itemData,
      id: Date.now().toString(),
      created_at: new Date().toISOString().split('T')[0]
    };
    
    const updatedLoop = {
      ...currentLoop,
      items: [...currentLoop.items, newItem]
    };
    
    setCurrentLoop(updatedLoop);
    setUserLoops(prev => prev.map(loop => 
      loop.id === currentLoop.id ? updatedLoop : loop
    ));
  };

  const updateItem = (id: string, updates: Partial<Item>) => {
    if (!currentLoop) return;
    
    const updatedLoop = {
      ...currentLoop,
      items: currentLoop.items.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    };
    
    setCurrentLoop(updatedLoop);
    setUserLoops(prev => prev.map(loop => 
      loop.id === currentLoop.id ? updatedLoop : loop
    ));
  };

  const addEvent = (eventData: Omit<Event, 'id'>) => {
    if (!currentLoop) return;
    
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString()
    };
    
    const updatedLoop = {
      ...currentLoop,
      events: [...currentLoop.events, newEvent]
    };
    
    setCurrentLoop(updatedLoop);
    setUserLoops(prev => prev.map(loop => 
      loop.id === currentLoop.id ? updatedLoop : loop
    ));
  };

  const joinEvent = (eventId: string, userId: string) => {
    if (!currentLoop) return;
    
    const updatedLoop = {
      ...currentLoop,
      events: currentLoop.events.map(event => 
        event.id === eventId 
          ? { ...event, attendees: [...event.attendees, userId] }
          : event
      )
    };
    
    setCurrentLoop(updatedLoop);
    setUserLoops(prev => prev.map(loop => 
      loop.id === currentLoop.id ? updatedLoop : loop
    ));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      currentLoop,
      userLoops,
      setCurrentUser,
      setCurrentLoop: (loop) => {
        setCurrentLoop(loop);
        setUserLoops(prev => prev.map(l => l.id === loop.id ? loop : l));
      },
      addLoop,
      createLoop,
      joinLoop,
      addItem,
      updateItem,
      addEvent,
      joinEvent,
      subscriptionLimits
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}