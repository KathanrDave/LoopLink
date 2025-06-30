/*
  # Demo Data Setup for LoopLink

  1. Demo Content
    - Creates sample loops without requiring specific user profiles
    - Adds sample items, events, and chat messages
    - Sets up realistic demo data for testing

  2. Security
    - Uses NULL admin_id to avoid foreign key constraints
    - Will be updated when real users join loops
    - Maintains data integrity while allowing demo functionality
*/

-- Create demo loops with NULL admin_id to avoid foreign key constraints
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
      NULL, -- Will be set when a real user becomes admin
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
      NULL, -- Will be set when a real user becomes admin
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
      NULL, -- Will be set when a real user becomes admin
      'enterprise',
      '{"isPrivate": true, "requireApproval": true, "maxMembers": 500, "allowItemSharing": true, "allowEvents": true}',
      now(),
      now()
    );
  END IF;
END $$;

-- Add sample items to the loops with NULL owner_id to avoid foreign key constraints
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
      NULL, -- Will be set when a real user claims ownership
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
      'available', -- Changed to available since we can't have borrower without owner
      NULL, -- Will be set when a real user claims ownership
      NULL, -- Will be set when someone borrows it
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', -- UWS loop
      '📚',
      NULL,
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
      NULL, -- Will be set when a real user claims ownership
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
      NULL, -- Will be set when a real user claims ownership
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', -- UWS loop
      '🍽️',
      now(),
      now()
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.items WHERE title = 'Bluetooth Speaker') THEN
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
      '22222222-3333-4444-5555-666666666666',
      'Bluetooth Speaker',
      'Portable speaker perfect for outdoor events',
      'Electronics',
      'available',
      NULL, -- Will be set when a real user claims ownership
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', -- Friends loop
      '📱',
      now(),
      now()
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.items WHERE title = 'Projector') THEN
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
      '33333333-4444-5555-6666-777777777777',
      'Projector',
      'HD projector for presentations and movie nights',
      'Electronics',
      'available',
      NULL, -- Will be set when a real user claims ownership
      'cccccccc-cccc-cccc-cccc-cccccccccccc', -- Tech loop
      '📱',
      now(),
      now()
    );
  END IF;
END $$;

-- Add sample events with NULL organizer_id to avoid foreign key constraints
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
      '44444444-5555-6666-7777-888888888888',
      'Neighborhood Cleanup',
      'Community cleanup event in Central Park',
      (CURRENT_DATE + INTERVAL '7 days')::date,
      '10:00:00',
      'Central Park South Entrance',
      NULL, -- Will be set when a real user becomes organizer
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
      '55555555-6666-7777-8888-999999999999',
      'Friend Game Night',
      'Board games and snacks at my place',
      (CURRENT_DATE + INTERVAL '3 days')::date,
      '19:00:00',
      'Community Room',
      NULL, -- Will be set when a real user becomes organizer
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
      '66666666-7777-8888-9999-aaaaaaaaaaaa',
      'Team Building Workshop',
      'Professional development and team coordination',
      (CURRENT_DATE + INTERVAL '10 days')::date,
      '14:00:00',
      'Conference Room A',
      NULL, -- Will be set when a real user becomes organizer
      'cccccccc-cccc-cccc-cccc-cccccccccccc', -- Tech loop
      25,
      ARRAY['workshop', 'professional', 'team'],
      false,
      now(),
      now()
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'Coffee & Code') THEN
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
      '77777777-8888-9999-aaaa-bbbbbbbbbbbb',
      'Coffee & Code',
      'Casual coding session with coffee and pastries',
      (CURRENT_DATE + INTERVAL '5 days')::date,
      '09:00:00',
      'Local Coffee Shop',
      NULL, -- Will be set when a real user becomes organizer
      'cccccccc-cccc-cccc-cccc-cccccccccccc', -- Tech loop
      15,
      ARRAY['coding', 'coffee', 'casual'],
      true,
      now(),
      now()
    );
  END IF;
END $$;

-- Create chat rooms for each loop with NULL created_by to avoid foreign key constraints
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
      ARRAY[]::text[], -- Empty array, will be populated when users join
      NULL, -- Will be set when a real user creates the room
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
      ARRAY[]::text[], -- Empty array, will be populated when users join
      NULL, -- Will be set when a real user creates the room
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
      ARRAY[]::text[], -- Empty array, will be populated when users join
      NULL, -- Will be set when a real user creates the room
      now(),
      now()
    );
  END IF;
END $$;

-- Add some sample chat messages with NULL user_id to avoid foreign key constraints
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
      NULL, -- System message, no specific user
      'Welcome to the Upper West Side community! Feel free to share items and organize events.',
      'system',
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
      NULL, -- System message, no specific user
      'Hey everyone! Your friend group chat is now live. Let''s plan some awesome hangouts! 🎉',
      'system',
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
      NULL, -- System message, no specific user
      'Welcome to the TechCorp team coordination space. Use this for project updates and team events.',
      'system',
      now(),
      now(),
      now()
    );
  END IF;

  -- Sample item sharing message
  IF NOT EXISTS (SELECT 1 FROM public.chat_messages WHERE id = 'msg-item-shared') THEN
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
      'msg-item-shared',
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      NULL, -- System message, no specific user
      'A new Power Drill has been shared in the community! Check it out in the Items section.',
      'system',
      now() - INTERVAL '2 hours',
      now() - INTERVAL '2 hours',
      now() - INTERVAL '2 hours'
    );
  END IF;

  -- Sample event announcement
  IF NOT EXISTS (SELECT 1 FROM public.chat_messages WHERE id = 'msg-event-announced') THEN
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
      'msg-event-announced',
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      NULL, -- System message, no specific user
      'New event: Neighborhood Cleanup scheduled for next week! Join us to make our community beautiful.',
      'system',
      now() - INTERVAL '1 hour',
      now() - INTERVAL '1 hour',
      now() - INTERVAL '1 hour'
    );
  END IF;
END $$;