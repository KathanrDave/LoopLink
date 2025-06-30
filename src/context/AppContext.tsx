import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth, AuthUser } from '../hooks/useAuth';
import { useLoops, Loop } from '../hooks/useLoops';

interface AppContextType {
  // Auth
  currentUser: AuthUser | null;
  authLoading: boolean;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>;
  
  // Loops
  currentLoop: Loop | null;
  userLoops: Loop[];
  loopsLoading: boolean;
  setCurrentLoop: (loop: Loop) => void;
  createLoop: (name: string, description: string, type: 'friend' | 'neighborhood' | 'organization') => Promise<any>;
  joinLoop: (code: string) => Promise<any>;
  addItem: (item: any) => Promise<any>;
  updateItem: (id: string, updates: any) => Promise<void>;
  addEvent: (event: any) => Promise<any>;
  joinEvent: (eventId: string) => Promise<void>;
  refreshLoops: () => Promise<void>;
  
  // Subscription limits
  subscriptionLimits: {
    maxMembers: number;
    maxEvents: number;
    hasAdvancedFeatures: boolean;
    hasAnalytics: boolean;
    hasCustomBranding: boolean;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const loops = useLoops();

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
          maxEvents: -1, // unlimited
          hasAdvancedFeatures: true,
          hasAnalytics: true,
          hasCustomBranding: true
        };
      case 'enterprise':
        return {
          maxMembers: -1, // unlimited
          maxEvents: -1, // unlimited
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

  const subscriptionLimits = getSubscriptionLimits(loops.currentLoop?.subscriptionTier || 'free');

  return (
    <AppContext.Provider value={{
      // Auth
      currentUser: auth.user,
      authLoading: auth.loading,
      signOut: auth.signOut,
      updateProfile: auth.updateProfile,
      
      // Loops
      currentLoop: loops.currentLoop,
      userLoops: loops.loops,
      loopsLoading: loops.loading,
      setCurrentLoop: loops.setCurrentLoop,
      createLoop: loops.createLoop,
      joinLoop: loops.joinLoop,
      addItem: loops.addItem,
      updateItem: loops.updateItem,
      addEvent: loops.addEvent,
      joinEvent: loops.joinEvent,
      refreshLoops: loops.refreshLoops,
      
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