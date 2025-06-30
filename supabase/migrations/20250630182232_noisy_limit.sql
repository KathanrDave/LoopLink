/*
  # Fix Authentication and Profile Issues

  1. Database Setup
    - Create or update the handle_new_user trigger function
    - Ensure proper RLS policies for profiles table
    - Fix any missing constraints or defaults

  2. Security
    - Update RLS policies to allow profile creation during signup
    - Ensure authenticated users can read/update their own profiles

  3. Trigger Function
    - Create trigger to automatically create profile when user signs up
    - Handle user metadata properly (name, email, etc.)
*/

-- Create or replace the trigger function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar, reputation, badges, subscription_tier, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    '👤',
    50,
    '{}',
    'free',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to automatically create profile for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update RLS policies to ensure proper access during signup and normal operations
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read profiles in same loops" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to read profiles of people in their loops
CREATE POLICY "Users can read profiles in same loops"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT lm.user_id
      FROM loop_members lm
      WHERE lm.loop_id IN (
        SELECT loop_members.loop_id
        FROM loop_members
        WHERE loop_members.user_id = auth.uid()
      )
    )
  );

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow profile creation during signup (this is handled by the trigger with SECURITY DEFINER)
CREATE POLICY "Enable insert for service role"
  ON profiles
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Ensure the profiles table has proper constraints
DO $$
BEGIN
  -- Check if the foreign key constraint exists, if not add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_id_fkey' 
    AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles 
    ADD CONSTRAINT profiles_id_fkey 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Update any existing users who might not have profiles
INSERT INTO public.profiles (id, email, name, avatar, reputation, badges, subscription_tier, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', au.email),
  '👤',
  50,
  '{}',
  'free',
  NOW(),
  NOW()
FROM auth.users au
WHERE au.id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;