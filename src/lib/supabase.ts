import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar: string;
          reputation: number;
          badges: string[];
          subscription_tier: 'free' | 'pro' | 'enterprise';
          location: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          avatar?: string;
          reputation?: number;
          badges?: string[];
          subscription_tier?: 'free' | 'pro' | 'enterprise';
          location?: any;
        };
        Update: {
          name?: string;
          avatar?: string;
          reputation?: number;
          badges?: string[];
          subscription_tier?: 'free' | 'pro' | 'enterprise';
          location?: any;
          updated_at?: string;
        };
      };
      loops: {
        Row: {
          id: string;
          name: string;
          code: string;
          type: 'friend' | 'neighborhood' | 'organization';
          description: string;
          settings: any;
          admin_id: string;
          subscription_tier: 'free' | 'pro' | 'enterprise';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          code: string;
          type: 'friend' | 'neighborhood' | 'organization';
          description?: string;
          settings?: any;
          admin_id: string;
          subscription_tier?: 'free' | 'pro' | 'enterprise';
        };
        Update: {
          name?: string;
          description?: string;
          settings?: any;
          subscription_tier?: 'free' | 'pro' | 'enterprise';
          updated_at?: string;
        };
      };
      loop_members: {
        Row: {
          id: string;
          loop_id: string;
          user_id: string;
          role: 'admin' | 'member';
          joined_at: string;
        };
        Insert: {
          loop_id: string;
          user_id: string;
          role?: 'admin' | 'member';
        };
        Update: {
          role?: 'admin' | 'member';
        };
      };
      items: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          status: 'available' | 'borrowed' | 'maintenance';
          owner_id: string;
          borrower_id: string | null;
          loop_id: string;
          image: string;
          location: any;
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description?: string;
          category: string;
          status?: 'available' | 'borrowed' | 'maintenance';
          owner_id: string;
          borrower_id?: string | null;
          loop_id: string;
          image?: string;
          location?: any;
          due_date?: string | null;
        };
        Update: {
          title?: string;
          description?: string;
          category?: string;
          status?: 'available' | 'borrowed' | 'maintenance';
          borrower_id?: string | null;
          image?: string;
          location?: any;
          due_date?: string | null;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          date: string;
          time: string;
          location: string;
          coordinates: any;
          organizer_id: string;
          loop_id: string;
          max_attendees: number | null;
          tags: string[];
          is_recurring: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description?: string;
          date: string;
          time: string;
          location: string;
          coordinates?: any;
          organizer_id: string;
          loop_id: string;
          max_attendees?: number | null;
          tags?: string[];
          is_recurring?: boolean;
        };
        Update: {
          title?: string;
          description?: string;
          date?: string;
          time?: string;
          location?: string;
          coordinates?: any;
          max_attendees?: number | null;
          tags?: string[];
          is_recurring?: boolean;
          updated_at?: string;
        };
      };
      event_attendees: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          joined_at: string;
        };
        Insert: {
          event_id: string;
          user_id: string;
        };
        Update: {};
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          data: any;
          read: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          type: string;
          title: string;
          message: string;
          data?: any;
          read?: boolean;
        };
        Update: {
          read?: boolean;
        };
      };
    };
  };
}