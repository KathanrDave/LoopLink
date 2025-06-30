import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          avatar: string | null
          reputation: number | null
          badges: string[] | null
          subscription_tier: string | null
          location: any | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          name: string
          avatar?: string | null
          reputation?: number | null
          badges?: string[] | null
          subscription_tier?: string | null
          location?: any | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar?: string | null
          reputation?: number | null
          badges?: string[] | null
          subscription_tier?: string | null
          location?: any | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      loops: {
        Row: {
          id: string
          name: string
          code: string
          type: string
          description: string | null
          settings: any | null
          admin_id: string | null
          subscription_tier: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          code: string
          type: string
          description?: string | null
          settings?: any | null
          admin_id?: string | null
          subscription_tier?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          code?: string
          type?: string
          description?: string | null
          settings?: any | null
          admin_id?: string | null
          subscription_tier?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      loop_members: {
        Row: {
          id: string
          loop_id: string | null
          user_id: string | null
          role: string | null
          joined_at: string | null
        }
        Insert: {
          id?: string
          loop_id?: string | null
          user_id?: string | null
          role?: string | null
          joined_at?: string | null
        }
        Update: {
          id?: string
          loop_id?: string | null
          user_id?: string | null
          role?: string | null
          joined_at?: string | null
        }
      }
      items: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string
          status: string | null
          owner_id: string | null
          borrower_id: string | null
          loop_id: string | null
          image: string | null
          location: any | null
          due_date: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category: string
          status?: string | null
          owner_id?: string | null
          borrower_id?: string | null
          loop_id?: string | null
          image?: string | null
          location?: any | null
          due_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: string
          status?: string | null
          owner_id?: string | null
          borrower_id?: string | null
          loop_id?: string | null
          image?: string | null
          location?: any | null
          due_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string
          time: string
          location: string
          coordinates: any | null
          organizer_id: string | null
          loop_id: string | null
          max_attendees: number | null
          tags: string[] | null
          is_recurring: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          date: string
          time: string
          location: string
          coordinates?: any | null
          organizer_id?: string | null
          loop_id?: string | null
          max_attendees?: number | null
          tags?: string[] | null
          is_recurring?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          date?: string
          time?: string
          location?: string
          coordinates?: any | null
          organizer_id?: string | null
          loop_id?: string | null
          max_attendees?: number | null
          tags?: string[] | null
          is_recurring?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      event_attendees: {
        Row: {
          id: string
          event_id: string | null
          user_id: string | null
          joined_at: string | null
        }
        Insert: {
          id?: string
          event_id?: string | null
          user_id?: string | null
          joined_at?: string | null
        }
        Update: {
          id?: string
          event_id?: string | null
          user_id?: string | null
          joined_at?: string | null
        }
      }
      chat_rooms: {
        Row: {
          id: string
          name: string
          type: string | null
          participants: string[] | null
          created_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          name: string
          type?: string | null
          participants?: string[] | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          type?: string | null
          participants?: string[] | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      chat_messages: {
        Row: {
          id: string
          room_id: string
          user_id: string | null
          content: string
          type: string | null
          timestamp: string | null
          edited: boolean | null
          reply_to: string | null
          reactions: any | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          room_id: string
          user_id?: string | null
          content: string
          type?: string | null
          timestamp?: string | null
          edited?: boolean | null
          reply_to?: string | null
          reactions?: any | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string | null
          content?: string
          type?: string | null
          timestamp?: string | null
          edited?: boolean | null
          reply_to?: string | null
          reactions?: any | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string | null
          type: string
          title: string
          message: string
          data: any | null
          read: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          type: string
          title: string
          message: string
          data?: any | null
          read?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          type?: string
          title?: string
          message?: string
          data?: any | null
          read?: boolean | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}