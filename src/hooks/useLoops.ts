import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface Loop {
  id: string;
  name: string;
  code: string;
  type: 'friend' | 'neighborhood' | 'organization';
  description: string;
  settings: any;
  adminId: string;
  subscriptionTier: 'free' | 'pro' | 'enterprise';
  createdAt: string;
  members: any[];
  items: any[];
  events: any[];
}

export function useLoops() {
  const { user } = useAuth();
  const [loops, setLoops] = useState<Loop[]>([]);
  const [currentLoop, setCurrentLoop] = useState<Loop | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchUserLoops = useCallback(async () => {
    if (!user) {
      setLoops([]);
      setCurrentLoop(null);
      setLoading(false);
      setInitialized(true);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch loops where user is a member
      const { data: memberLoops, error } = await supabase
        .from('loop_members')
        .select(`
          loop_id,
          role,
          loops (
            id,
            name,
            code,
            type,
            description,
            settings,
            admin_id,
            subscription_tier,
            created_at
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user loops:', error);
        setLoading(false);
        setInitialized(true);
        return;
      }

      if (!memberLoops || memberLoops.length === 0) {
        setLoops([]);
        setCurrentLoop(null);
        setLoading(false);
        setInitialized(true);
        return;
      }

      const loopsWithData = await Promise.all(
        memberLoops.map(async (memberLoop: any) => {
          const loop = memberLoop.loops;
          
          try {
            // Fetch members
            const { data: members } = await supabase
              .from('loop_members')
              .select(`
                user_id,
                role,
                profiles (
                  id,
                  name,
                  avatar,
                  reputation,
                  badges,
                  location
                )
              `)
              .eq('loop_id', loop.id);

            // Fetch items
            const { data: items } = await supabase
              .from('items')
              .select('*')
              .eq('loop_id', loop.id);

            // Fetch events
            const { data: events } = await supabase
              .from('events')
              .select('*')
              .eq('loop_id', loop.id);

            return {
              id: loop.id,
              name: loop.name,
              code: loop.code,
              type: loop.type,
              description: loop.description,
              settings: loop.settings || {},
              adminId: loop.admin_id,
              subscriptionTier: loop.subscription_tier,
              createdAt: loop.created_at,
              members: members?.map((m: any) => ({
                id: m.profiles?.id,
                name: m.profiles?.name || 'Unknown',
                avatar: m.profiles?.avatar || '👤',
                reputation: m.profiles?.reputation || 50,
                badges: m.profiles?.badges || [],
                role: m.role,
                location: m.profiles?.location
              })).filter(m => m.id) || [],
              items: items || [],
              events: events || []
            };
          } catch (error) {
            console.error('Error fetching loop data for loop:', loop.id, error);
            return {
              id: loop.id,
              name: loop.name,
              code: loop.code,
              type: loop.type,
              description: loop.description,
              settings: loop.settings || {},
              adminId: loop.admin_id,
              subscriptionTier: loop.subscription_tier,
              createdAt: loop.created_at,
              members: [],
              items: [],
              events: []
            };
          }
        })
      );

      setLoops(loopsWithData);
      
      // Set current loop to first one if none selected
      if (!currentLoop && loopsWithData.length > 0) {
        setCurrentLoop(loopsWithData[0]);
      }
    } catch (error) {
      console.error('Error fetching loops:', error);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [user, currentLoop]);

  useEffect(() => {
    if (user && !initialized) {
      fetchUserLoops();
    } else if (!user) {
      setLoops([]);
      setCurrentLoop(null);
      setLoading(false);
      setInitialized(true);
    }
  }, [user, initialized, fetchUserLoops]);

  const createLoop = async (name: string, description: string, type: 'friend' | 'neighborhood' | 'organization') => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Generate loop code
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_loop_code', { loop_type: type });

      if (codeError) throw codeError;

      // Create loop
      const { data: loop, error: loopError } = await supabase
        .from('loops')
        .insert({
          name,
          description,
          type,
          code: codeData,
          admin_id: user.id,
          settings: getDefaultSettings(type)
        })
        .select()
        .single();

      if (loopError) throw loopError;

      // Add creator as admin member
      const { error: memberError } = await supabase
        .from('loop_members')
        .insert({
          loop_id: loop.id,
          user_id: user.id,
          role: 'admin'
        });

      if (memberError) throw memberError;

      // Refresh loops
      setInitialized(false);
      await fetchUserLoops();

      return loop;
    } catch (error) {
      console.error('Error creating loop:', error);
      throw error;
    }
  };

  const joinLoop = async (code: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Find loop by code
      const { data: loop, error: loopError } = await supabase
        .from('loops')
        .select('*')
        .eq('code', code.toUpperCase())
        .single();

      if (loopError || !loop) {
        throw new Error('Loop not found');
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from('loop_members')
        .select('*')
        .eq('loop_id', loop.id)
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        throw new Error('Already a member of this loop');
      }

      // Add as member
      const { error: memberError } = await supabase
        .from('loop_members')
        .insert({
          loop_id: loop.id,
          user_id: user.id,
          role: 'member'
        });

      if (memberError) throw memberError;

      // Refresh loops
      setInitialized(false);
      await fetchUserLoops();

      return loop;
    } catch (error) {
      console.error('Error joining loop:', error);
      throw error;
    }
  };

  const addItem = async (itemData: any) => {
    if (!user || !currentLoop) throw new Error('User or loop not available');

    try {
      const { data: item, error } = await supabase
        .from('items')
        .insert({
          ...itemData,
          owner_id: user.id,
          loop_id: currentLoop.id
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh current loop data
      setInitialized(false);
      await fetchUserLoops();

      return item;
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  };

  const updateItem = async (itemId: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('items')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId);

      if (error) throw error;

      // Refresh current loop data
      setInitialized(false);
      await fetchUserLoops();
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  };

  const addEvent = async (eventData: any) => {
    if (!user || !currentLoop) throw new Error('User or loop not available');

    try {
      const { data: event, error } = await supabase
        .from('events')
        .insert({
          ...eventData,
          organizer_id: user.id,
          loop_id: currentLoop.id
        })
        .select()
        .single();

      if (error) throw error;

      // Add organizer as attendee
      await supabase
        .from('event_attendees')
        .insert({
          event_id: event.id,
          user_id: user.id
        });

      // Refresh current loop data
      setInitialized(false);
      await fetchUserLoops();

      return event;
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  };

  const joinEvent = async (eventId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('event_attendees')
        .insert({
          event_id: eventId,
          user_id: user.id
        });

      if (error) throw error;

      // Refresh current loop data
      setInitialized(false);
      await fetchUserLoops();
    } catch (error) {
      console.error('Error joining event:', error);
      throw error;
    }
  };

  const getDefaultSettings = (type: string) => {
    switch (type) {
      case 'friend':
        return {
          isPrivate: true,
          requireApproval: false,
          maxMembers: 20,
          allowItemSharing: true,
          allowEvents: true
        };
      case 'neighborhood':
        return {
          isPrivate: false,
          requireApproval: true,
          radius: 2,
          maxMembers: 100,
          allowItemSharing: true,
          allowEvents: true
        };
      case 'organization':
        return {
          isPrivate: true,
          requireApproval: true,
          maxMembers: 500,
          allowItemSharing: true,
          allowEvents: true
        };
      default:
        return {};
    }
  };

  return {
    loops,
    currentLoop,
    loading: loading && !initialized,
    setCurrentLoop,
    createLoop,
    joinLoop,
    addItem,
    updateItem,
    addEvent,
    joinEvent,
    refreshLoops: () => {
      setInitialized(false);
      return fetchUserLoops();
    }
  };
}