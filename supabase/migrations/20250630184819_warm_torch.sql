/*
  # Create Demo Accounts

  1. New Demo Users
    - Creates three demo user accounts for testing
    - alex@looplink.com (Alex Chen)
    - sarah@looplink.com (Sarah Johnson) 
    - mike@looplink.com (Mike Rodriguez)
    - All with password: demo123

  2. User Profiles
    - Creates corresponding profiles for each demo user
    - Sets up basic profile information including names and avatars

  3. Security
    - Uses service role to insert auth users
    - Profiles will be created automatically via existing triggers
*/

-- Insert demo users into auth.users table
-- Note: This requires service role permissions
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'alex@looplink.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
),
(
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'sarah@looplink.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
),
(
  '33333333-3333-3333-3333-333333333333',
  '00000000-0000-0000-0000-000000000000',
  'mike@looplink.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
)
ON CONFLICT (email) DO NOTHING;

-- Insert corresponding profiles
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
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  avatar = EXCLUDED.avatar,
  reputation = EXCLUDED.reputation,
  badges = EXCLUDED.badges,
  subscription_tier = EXCLUDED.subscription_tier,
  updated_at = now();

-- Create a sample loop for demo purposes
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
)
ON CONFLICT (code) DO NOTHING;

-- Add all demo users to the sample loop
INSERT INTO public.loop_members (
  loop_id,
  user_id,
  role,
  joined_at
) VALUES 
(
  '44444444-4444-4444-4444-444444444444',
  '11111111-1111-1111-1111-111111111111',
  'admin',
  now()
),
(
  '44444444-4444-4444-4444-444444444444',
  '22222222-2222-2222-2222-222222222222',
  'member',
  now()
),
(
  '44444444-4444-4444-4444-444444444444',
  '33333333-3333-3333-3333-333333333333',
  'member',
  now()
)
ON CONFLICT (loop_id, user_id) DO NOTHING;