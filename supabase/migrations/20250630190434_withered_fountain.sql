/*
  # Demo Data Setup for LoopLink

  1. Demo Data
    - Creates sample loops, items, events, and chat rooms
    - Uses generic UUIDs that will be replaced when real users sign up
    - Provides realistic demo content for testing

  2. Security
    - All tables have proper RLS policies
    - Demo data respects existing constraints
    - Safe for production deployment
*/

-- First, let's create some demo loops that don't require specific user IDs
-- We'll use placeholder UUIDs that can be updated later when real users sign up

-- Create demo loops with generic admin IDs
DO $$
BEGIN
  -- Create Friend Loop demo
  IF NOT EXISTS (SELECT 1 FROM public.loops WHERE code = 'FRIENDS2024') THEN
    INSERT INTO public.loops (
      id,
      name,
      code,
      type,
      description,
      admin_id,
      subscription_tier,
      settings,
      created_at,
      updated_at
    ) VALUES (
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'College Friends',
      'FRIENDS2024',
      'friend',
      'Our tight-knit college friend group for planning hangouts and events',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', -- Will be updated when real user signs up
      'free',
      '{"isPrivate": true, "requireApproval": false, "maxMembers": 20, "allowItemSharing": true, "allowEvents": true}',
      now(),
      now()
    );
  END IF;

  -- Create Neighborhood Loop demo
  IF NOT EXISTS (SELECT 1 FROM public.loops WHERE code = 'UWS2024') THEN
    INSERT INTO public.loops (
      id,
      name,
      code,
      type,
      description,
      admin_id,
      subscription_tier,
      settings,
      created_at,
      updated_at
    ) VALUES (
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      'Upper West Side',
      'UWS2024',
      'neighborhood',
      'Neighbors sharing resources and organizing local events',
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', -- Will be updated when real user signs up
      'pro',
      '{"isPrivate": false, "requireApproval": true, "radius": 2, "centerPoint": {"lat": 40.7831, "lng": -73.9712, "address": "Upper West Side, NYC"}, "maxMembers": 100, "allowItemSharing": true, "allowEvents": true}',
      now(),
      now()
    );
  END IF;

  -- Create Organization Loop demo
  IF NOT EXISTS (SELECT 1 FROM public.loops WHERE code = 'TECH2024') THEN
    INSERT INTO public.loops (
      id,
      name,
      code,
      type,
      description,
      admin_id,
      subscription_tier,
      settings,
      created_at,
      updated_at
    ) VALUES (
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      'TechCorp Team',
      'TECH2024',
      'organization',
      'Company team for coordination and team building',
      'cccccccc-cccc-cccc-cccc-cccccccccccc', -- Will be updated when real user signs up
      'enterprise',
      '{"isPrivate": true, "requireApproval": true, "maxMembers": 500, "allowItemSharing": true, "allowEvents": true}',
      now(),
      now()
    );
  END IF;
END $$;

-- Add sample items to the neighborhood loop
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.items WHERE title = 'Power Drill') THEN
    INSERT INTO public.items (
      id,
      title,
      description,
      category,
      status,
      owner_id,
      loop_id,
      image,
      created_at,
      updated_at
    ) VALUES (
      'dddddddd-dddd-dddd-dddd-dddddddddddd',
      'Power Drill',
      'Cordless drill with bits - perfect for home projects',
      'Tools',
      'available',
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', -- Placeholder owner
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', -- UWS loop
      '🔧',
      now(),
      now()
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.items WHERE title = 'JavaScript: The Good Parts') THEN
    INSERT INTO public.items (
      id,
      title,
      description,
      category,
      status,
      owner_id,
      borrower_id,
      loop_id,
      image,
      due_date,
      created_at,
      updated_at
    ) VALUES (
      'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
      'JavaScript: The Good Parts',
      'Classic programming book by Douglas Crockford',
      'Books',
      'borrowed',
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', -- Placeholder owner
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', -- Placeholder borrower
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', -- UWS loop
      '📚',
      (CURRENT_DATE + INTERVAL '14 days')::date,
      now(),
      now()
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.items WHERE title = 'Board Game Collection') THEN
    INSERT INTO public.items (
      id,
      title,
      description,
      category,
      status,
      owner_id,
      loop_id,
      image,
      created_at,
      updated_at
    ) VALUES (
      'ffffffff-ffff-ffff-ffff-ffffffffffff',
      'Board Game Collection',
      'Settlers of Catan, Ticket to Ride, and more!',
      'Games',
      'available',
      'cccccccc-cccc-cccc-cccc-cccccccccccc', -- Placeholder owner
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', -- UWS loop
      '🎲',
      now(),
      now()
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.items WHERE title = 'Stand Mixer') THEN
    INSERT INTO public.items (
      id,
      title,
      description,
      category,
      status,
      owner_id,
      loop_id,
      image,
      created_at,
      updated_at
    ) VALUES (
      '11111111-2222-3333-4444-555555555555',
      'Stand Mixer',
      'KitchenAid stand mixer with attachments',
      'Kitchen',
      'available',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', -- Placeholder owner
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', -- UWS loop
      '🍽️',
      now(),
      now()
    );
  END IF;
END $$;

-- Add sample events
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'Neighborhood Cleanup') THEN
    INSERT INTO public.events (
      id,
      title,
      description,
      date,
      time,
      location,
      organizer_id,
      loop_id,
      max_attendees,
      tags,
      is_recurring,
      created_at,
      updated_at
    ) VALUES (
      '22222222-3333-4444-5555-666666666666',
      'Neighborhood Cleanup',
      'Community cleanup event in Central Park',
      (CURRENT_DATE + INTERVAL '7 days')::date,
      '10:00:00',
      'Central Park South Entrance',
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', -- Placeholder organizer
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', -- UWS loop
      20,
      ARRAY['community', 'environment', 'outdoor'],
      false,
      now(),
      now()
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'Friend Game Night') THEN
    INSERT INTO public.events (
      id,
      title,
      description,
      date,
      time,
      location,
      organizer_id,
      loop_id,
      max_attendees,
      tags,
      is_recurring,
      created_at,
      updated_at
    ) VALUES (
      '33333333-4444-5555-6666-777777777777',
      'Friend Game Night',
      'Board games and snacks at my place',
      (CURRENT_DATE + INTERVAL '3 days')::date,
      '19:00:00',
      'Alex''s Apartment',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', -- Placeholder organizer
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', -- Friends loop
      6,
      ARRAY['games', 'social', 'indoor'],
      false,
      now(),
      now()
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'Team Building Workshop') THEN
    INSERT INTO public.events (
      id,
      title,
      description,
      date,
      time,
      location,
      organizer_id,
      loop_id,
      max_attendees,
      tags,
      is_recurring,
      created_at,
      updated_at
    ) VALUES (
      '44444444-5555-6666-7777-888888888888',
      'Team Building Workshop',
      'Professional development and team coordination',
      (CURRENT_DATE + INTERVAL '10 days')::date,
      '14:00:00',
      'Conference Room A',
      'cccccccc-cccc-cccc-cccc-cccccccccccc', -- Placeholder organizer
      'cccccccc-cccc-cccc-cccc-cccccccccccc', -- Tech loop
      25,
      ARRAY['workshop', 'professional', 'team'],
      false,
      now(),
      now()
    );
  END IF;
END $$;

-- Create chat rooms for each loop
DO $$
BEGIN
  -- Friends loop chat
  IF NOT EXISTS (SELECT 1 FROM public.chat_rooms WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa') THEN
    INSERT INTO public.chat_rooms (
      id,
      name,
      type,
      participants,
      created_by,
      created_at,
      updated_at
    ) VALUES (
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'College Friends Chat',
      'loop',
      ARRAY['aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'],
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      now(),
      now()
    );
  END IF;

  -- Neighborhood loop chat
  IF NOT EXISTS (SELECT 1 FROM public.chat_rooms WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb') THEN
    INSERT INTO public.chat_rooms (
      id,
      name,
      type,
      participants,
      created_by,
      created_at,
      updated_at
    ) VALUES (
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      'Upper West Side Chat',
      'loop',
      ARRAY['bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'],
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      now(),
      now()
    );
  END IF;

  -- Organization loop chat
  IF NOT EXISTS (SELECT 1 FROM public.chat_rooms WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccccccc') THEN
    INSERT INTO public.chat_rooms (
      id,
      name,
      type,
      participants,
      created_by,
      created_at,
      updated_at
    ) VALUES (
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      'TechCorp Team Chat',
      'loop',
      ARRAY['cccccccc-cccc-cccc-cccc-cccccccccccc'],
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      now(),
      now()
    );
  END IF;
END $$;

-- Add some sample chat messages
DO $$
BEGIN
  -- Welcome message in UWS chat
  IF NOT EXISTS (SELECT 1 FROM public.chat_messages WHERE id = 'msg-welcome-uws') THEN
    INSERT INTO public.chat_messages (
      id,
      room_id,
      user_id,
      content,
      type,
      timestamp,
      created_at,
      updated_at
    ) VALUES (
      'msg-welcome-uws',
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      'Welcome to the Upper West Side community! Feel free to share items and organize events.',
      'text',
      now(),
      now(),
      now()
    );
  END IF;

  -- Welcome message in Friends chat
  IF NOT EXISTS (SELECT 1 FROM public.chat_messages WHERE id = 'msg-welcome-friends') THEN
    INSERT INTO public.chat_messages (
      id,
      room_id,
      user_id,
      content,
      type,
      timestamp,
      created_at,
      updated_at
    ) VALUES (
      'msg-welcome-friends',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'Hey everyone! Our friend group chat is now live. Let''s plan some awesome hangouts! 🎉',
      'text',
      now(),
      now(),
      now()
    );
  END IF;

  -- Welcome message in Tech chat
  IF NOT EXISTS (SELECT 1 FROM public.chat_messages WHERE id = 'msg-welcome-tech') THEN
    INSERT INTO public.chat_messages (
      id,
      room_id,
      user_id,
      content,
      type,
      timestamp,
      created_at,
      updated_at
    ) VALUES (
      'msg-welcome-tech',
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      'Welcome to the TechCorp team coordination space. Use this for project updates and team events.',
      'text',
      now(),
      now(),
      now()
    );
  END IF;
END $$;

-- Add some notifications for demo purposes
DO $$
BEGIN
  -- Sample notification about new item
  IF NOT EXISTS (SELECT 1 FROM public.notifications WHERE title = 'Welcome to LoopLink!') THEN
    INSERT INTO public.notifications (
      id,
      user_id,
      type,
      title,
      message,
      data,
      read,
      created_at
    ) VALUES (
      '55555555-6666-7777-8888-999999999999',
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', -- Placeholder user
      'welcome',
      'Welcome to LoopLink!',
      'Start by exploring your neighborhood and sharing your first item.',
      '{"type": "welcome", "action": "explore"}',
      false,
      now()
    );
  END IF;
END $$;