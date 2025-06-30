/*
  # Create Demo Accounts Migration

  1. Demo Users Setup
    - Creates demo user profiles that can be used for testing
    - Sets up a sample neighborhood loop
    - Adds demo users to the loop

  2. Security
    - Uses proper RLS policies
    - Creates profiles that will work with auth system
*/

-- First, let's create the demo profiles
-- Note: In Supabase, users are typically created through the auth API, 
-- but we can create profiles that will be linked when users sign up

-- Insert demo profiles (these will be linked to auth users when they sign up)
INSERT INTO public.profiles (
  id,
  email,
  name,
  avatar,
  reputation,
  badges,
  subscription_tier,
  created_at,
  updated_at
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'alex@looplink.com',
  'Alex Chen',
  '👨‍💻',
  75,
  ARRAY['Early Adopter', 'Community Helper'],
  'free',
  now(),
  now()
),
(
  '22222222-2222-2222-2222-222222222222',
  'sarah@looplink.com',
  'Sarah Johnson',
  '👩‍🎨',
  85,
  ARRAY['Super Sharer', 'Event Organizer'],
  'pro',
  now(),
  now()
),
(
  '33333333-3333-3333-3333-333333333333',
  'mike@looplink.com',
  'Mike Rodriguez',
  '👨‍🔧',
  60,
  ARRAY['Tool Master'],
  'free',
  now(),
  now()
)
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE email = 'alex@looplink.com'
);

-- Only insert if they don't already exist
DO $$
BEGIN
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

-- Create a sample loop for demo purposes
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

-- Add some sample items to make the demo more interesting
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
END $$;

-- Add a sample event
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
      '77777777-7777-7777-7777-777777777777',
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
END $$;

-- Add event attendees
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.event_attendees 
    WHERE event_id = '77777777-7777-7777-7777-777777777777' 
    AND user_id = '22222222-2222-2222-2222-222222222222'
  ) THEN
    INSERT INTO public.event_attendees (
      event_id, user_id, joined_at
    ) VALUES (
      '77777777-7777-7777-7777-777777777777',
      '22222222-2222-2222-2222-222222222222',
      now()
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.event_attendees 
    WHERE event_id = '77777777-7777-7777-7777-777777777777' 
    AND user_id = '11111111-1111-1111-1111-111111111111'
  ) THEN
    INSERT INTO public.event_attendees (
      event_id, user_id, joined_at
    ) VALUES (
      '77777777-7777-7777-7777-777777777777',
      '11111111-1111-1111-1111-111111111111',
      now()
    );
  END IF;
END $$;