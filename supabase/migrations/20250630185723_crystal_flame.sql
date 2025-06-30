/*
  # Demo Data Migration

  1. New Tables
    - Creates demo user profiles for testing
    - Creates sample loop with demo data
    - Adds sample items and events for realistic demo experience

  2. Security
    - Uses proper conditional logic to prevent duplicates
    - Maintains referential integrity
    - Follows existing RLS policies

  3. Demo Content
    - 3 demo user profiles (Alex, Sarah, Mike)
    - 1 neighborhood loop for testing
    - Sample items and events
    - Proper relationships between all entities
*/

-- Insert demo profiles using proper conditional logic
DO $$
BEGIN
  -- Insert Alex's profile
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE email = 'alex@looplink.com') THEN
    INSERT INTO public.profiles (
      id, email, name, avatar, reputation, badges, subscription_tier, created_at, updated_at
    ) VALUES (
      '11111111-1111-1111-1111-111111111111',
      'alex@looplink.com',
      'Alex Chen',
      '👨‍💻',
      75,
      ARRAY['Early Adopter', 'Community Helper'],
      'free',
      now(),
      now()
    );
  END IF;

  -- Insert Sarah's profile
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE email = 'sarah@looplink.com') THEN
    INSERT INTO public.profiles (
      id, email, name, avatar, reputation, badges, subscription_tier, created_at, updated_at
    ) VALUES (
      '22222222-2222-2222-2222-222222222222',
      'sarah@looplink.com',
      'Sarah Johnson',
      '👩‍🎨',
      85,
      ARRAY['Super Sharer', 'Event Organizer'],
      'pro',
      now(),
      now()
    );
  END IF;

  -- Insert Mike's profile
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE email = 'mike@looplink.com') THEN
    INSERT INTO public.profiles (
      id, email, name, avatar, reputation, badges, subscription_tier, created_at, updated_at
    ) VALUES (
      '33333333-3333-3333-3333-333333333333',
      'mike@looplink.com',
      'Mike Rodriguez',
      '👨‍🔧',
      60,
      ARRAY['Tool Master'],
      'free',
      now(),
      now()
    );
  END IF;
END $$;

-- Create demo loop
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.loops WHERE code = 'DEMO2024') THEN
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
      '44444444-4444-4444-4444-444444444444',
      'Demo Neighborhood',
      'DEMO2024',
      'neighborhood',
      'A sample neighborhood loop for testing the app',
      '11111111-1111-1111-1111-111111111111',
      'free',
      '{"isPrivate": false, "requireApproval": true, "radius": 2, "maxMembers": 100, "allowItemSharing": true, "allowEvents": true}',
      now(),
      now()
    );
  END IF;
END $$;

-- Add demo users to the sample loop
DO $$
BEGIN
  -- Add Alex as admin
  IF NOT EXISTS (
    SELECT 1 FROM public.loop_members 
    WHERE loop_id = '44444444-4444-4444-4444-444444444444' 
    AND user_id = '11111111-1111-1111-1111-111111111111'
  ) THEN
    INSERT INTO public.loop_members (
      loop_id, user_id, role, joined_at
    ) VALUES (
      '44444444-4444-4444-4444-444444444444',
      '11111111-1111-1111-1111-111111111111',
      'admin',
      now()
    );
  END IF;

  -- Add Sarah as member
  IF NOT EXISTS (
    SELECT 1 FROM public.loop_members 
    WHERE loop_id = '44444444-4444-4444-4444-444444444444' 
    AND user_id = '22222222-2222-2222-2222-222222222222'
  ) THEN
    INSERT INTO public.loop_members (
      loop_id, user_id, role, joined_at
    ) VALUES (
      '44444444-4444-4444-4444-444444444444',
      '22222222-2222-2222-2222-222222222222',
      'member',
      now()
    );
  END IF;

  -- Add Mike as member
  IF NOT EXISTS (
    SELECT 1 FROM public.loop_members 
    WHERE loop_id = '44444444-4444-4444-4444-444444444444' 
    AND user_id = '33333333-3333-3333-3333-333333333333'
  ) THEN
    INSERT INTO public.loop_members (
      loop_id, user_id, role, joined_at
    ) VALUES (
      '44444444-4444-4444-4444-444444444444',
      '33333333-3333-3333-3333-333333333333',
      'member',
      now()
    );
  END IF;
END $$;

-- Add sample items
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.items WHERE title = 'Demo Power Drill') THEN
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
      '55555555-5555-5555-5555-555555555555',
      'Demo Power Drill',
      'Cordless drill with various bits, perfect for home projects',
      'Tools',
      'available',
      '11111111-1111-1111-1111-111111111111',
      '44444444-4444-4444-4444-444444444444',
      '🔧',
      now(),
      now()
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.items WHERE title = 'JavaScript Programming Book') THEN
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
      '66666666-6666-6666-6666-666666666666',
      'JavaScript Programming Book',
      'Learn modern JavaScript development techniques',
      'Books',
      'available',
      '22222222-2222-2222-2222-222222222222',
      '44444444-4444-4444-4444-444444444444',
      '📚',
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
      '77777777-7777-7777-7777-777777777777',
      'Board Game Collection',
      'Various board games including Settlers of Catan and Ticket to Ride',
      'Games',
      'available',
      '33333333-3333-3333-3333-333333333333',
      '44444444-4444-4444-4444-444444444444',
      '🎲',
      now(),
      now()
    );
  END IF;
END $$;

-- Add sample events
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'Demo Community Meetup') THEN
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
      created_at,
      updated_at
    ) VALUES (
      '88888888-8888-8888-8888-888888888888',
      'Demo Community Meetup',
      'Join us for a friendly neighborhood gathering',
      (CURRENT_DATE + INTERVAL '7 days')::date,
      '18:00:00',
      'Community Center',
      '22222222-2222-2222-2222-222222222222',
      '44444444-4444-4444-4444-444444444444',
      20,
      ARRAY['community', 'social', 'meetup'],
      now(),
      now()
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'Tool Sharing Workshop') THEN
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
      created_at,
      updated_at
    ) VALUES (
      '99999999-9999-9999-9999-999999999999',
      'Tool Sharing Workshop',
      'Learn about proper tool maintenance and sharing etiquette',
      (CURRENT_DATE + INTERVAL '14 days')::date,
      '14:00:00',
      'Alex''s Garage',
      '11111111-1111-1111-1111-111111111111',
      '44444444-4444-4444-4444-444444444444',
      10,
      ARRAY['workshop', 'tools', 'education'],
      now(),
      now()
    );
  END IF;
END $$;

-- Add event attendees
DO $$
BEGIN
  -- Sarah attending her own meetup
  IF NOT EXISTS (
    SELECT 1 FROM public.event_attendees 
    WHERE event_id = '88888888-8888-8888-8888-888888888888' 
    AND user_id = '22222222-2222-2222-2222-222222222222'
  ) THEN
    INSERT INTO public.event_attendees (
      event_id, user_id, joined_at
    ) VALUES (
      '88888888-8888-8888-8888-888888888888',
      '22222222-2222-2222-2222-222222222222',
      now()
    );
  END IF;

  -- Alex attending Sarah's meetup
  IF NOT EXISTS (
    SELECT 1 FROM public.event_attendees 
    WHERE event_id = '88888888-8888-8888-8888-888888888888' 
    AND user_id = '11111111-1111-1111-1111-111111111111'
  ) THEN
    INSERT INTO public.event_attendees (
      event_id, user_id, joined_at
    ) VALUES (
      '88888888-8888-8888-8888-888888888888',
      '11111111-1111-1111-1111-111111111111',
      now()
    );
  END IF;

  -- Alex attending his own workshop
  IF NOT EXISTS (
    SELECT 1 FROM public.event_attendees 
    WHERE event_id = '99999999-9999-9999-9999-999999999999' 
    AND user_id = '11111111-1111-1111-1111-111111111111'
  ) THEN
    INSERT INTO public.event_attendees (
      event_id, user_id, joined_at
    ) VALUES (
      '99999999-9999-9999-9999-999999999999',
      '11111111-1111-1111-1111-111111111111',
      now()
    );
  END IF;

  -- Mike attending Alex's workshop
  IF NOT EXISTS (
    SELECT 1 FROM public.event_attendees 
    WHERE event_id = '99999999-9999-9999-9999-999999999999' 
    AND user_id = '33333333-3333-3333-3333-333333333333'
  ) THEN
    INSERT INTO public.event_attendees (
      event_id, user_id, joined_at
    ) VALUES (
      '99999999-9999-9999-9999-999999999999',
      '33333333-3333-3333-3333-333333333333',
      now()
    );
  END IF;
END $$;

-- Create demo chat room
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.chat_rooms WHERE id = '44444444-4444-4444-4444-444444444444') THEN
    INSERT INTO public.chat_rooms (
      id,
      name,
      type,
      participants,
      created_by,
      created_at,
      updated_at
    ) VALUES (
      '44444444-4444-4444-4444-444444444444',
      'Demo Neighborhood Chat',
      'loop',
      ARRAY['11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333'],
      '11111111-1111-1111-1111-111111111111',
      now(),
      now()
    );
  END IF;
END $$;