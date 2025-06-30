/*
  # User Authentication and Database Schema

  1. New Tables
    - `profiles` - User profile information linked to Supabase auth
    - `loops` - Community loops/groups
    - `loop_members` - Many-to-many relationship between users and loops
    - `items` - Shared items within loops
    - `events` - Community events
    - `notifications` - User notifications

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure data access based on loop membership

  3. Functions
    - Auto-create profile on user signup
    - Handle loop membership
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar text DEFAULT '👤',
  reputation integer DEFAULT 50,
  badges text[] DEFAULT '{}',
  subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  location jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create loops table
CREATE TABLE IF NOT EXISTS loops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('friend', 'neighborhood', 'organization')),
  description text,
  settings jsonb DEFAULT '{}',
  admin_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create loop_members table (many-to-many)
CREATE TABLE IF NOT EXISTS loop_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_id uuid REFERENCES loops(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role text DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(loop_id, user_id)
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  status text DEFAULT 'available' CHECK (status IN ('available', 'borrowed', 'maintenance')),
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  borrower_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  loop_id uuid REFERENCES loops(id) ON DELETE CASCADE,
  image text DEFAULT '📦',
  location jsonb,
  due_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date date NOT NULL,
  time time NOT NULL,
  location text NOT NULL,
  coordinates jsonb,
  organizer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  loop_id uuid REFERENCES loops(id) ON DELETE CASCADE,
  max_attendees integer,
  tags text[] DEFAULT '{}',
  is_recurring boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create event_attendees table
CREATE TABLE IF NOT EXISTS event_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE loops ENABLE ROW LEVEL SECURITY;
ALTER TABLE loop_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read profiles in same loops"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT lm.user_id 
      FROM loop_members lm 
      WHERE lm.loop_id IN (
        SELECT loop_id 
        FROM loop_members 
        WHERE user_id = auth.uid()
      )
    )
  );

-- Loops policies
CREATE POLICY "Users can read loops they belong to"
  ON loops FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT loop_id 
      FROM loop_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create loops"
  ON loops FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = admin_id);

CREATE POLICY "Loop admins can update loops"
  ON loops FOR UPDATE
  TO authenticated
  USING (auth.uid() = admin_id);

-- Loop members policies
CREATE POLICY "Users can read loop members for their loops"
  ON loop_members FOR SELECT
  TO authenticated
  USING (
    loop_id IN (
      SELECT loop_id 
      FROM loop_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Loop admins can manage members"
  ON loop_members FOR ALL
  TO authenticated
  USING (
    loop_id IN (
      SELECT id 
      FROM loops 
      WHERE admin_id = auth.uid()
    )
  );

CREATE POLICY "Users can join loops"
  ON loop_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Items policies
CREATE POLICY "Users can read items in their loops"
  ON items FOR SELECT
  TO authenticated
  USING (
    loop_id IN (
      SELECT loop_id 
      FROM loop_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create items in their loops"
  ON items FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = owner_id AND
    loop_id IN (
      SELECT loop_id 
      FROM loop_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Item owners can update their items"
  ON items FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Events policies
CREATE POLICY "Users can read events in their loops"
  ON events FOR SELECT
  TO authenticated
  USING (
    loop_id IN (
      SELECT loop_id 
      FROM loop_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create events in their loops"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = organizer_id AND
    loop_id IN (
      SELECT loop_id 
      FROM loop_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Event organizers can update their events"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = organizer_id);

-- Event attendees policies
CREATE POLICY "Users can read event attendees for their loop events"
  ON event_attendees FOR SELECT
  TO authenticated
  USING (
    event_id IN (
      SELECT id 
      FROM events 
      WHERE loop_id IN (
        SELECT loop_id 
        FROM loop_members 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can join events"
  ON event_attendees FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave events"
  ON event_attendees FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to generate unique loop codes
CREATE OR REPLACE FUNCTION generate_loop_code(loop_type text)
RETURNS text AS $$
DECLARE
  prefix text;
  code text;
  exists boolean;
BEGIN
  prefix := CASE 
    WHEN loop_type = 'friend' THEN 'FRD'
    WHEN loop_type = 'neighborhood' THEN 'NBH'
    WHEN loop_type = 'organization' THEN 'ORG'
    ELSE 'GEN'
  END;
  
  LOOP
    code := prefix || EXTRACT(YEAR FROM NOW()) || LPAD(FLOOR(RANDOM() * 1000)::text, 3, '0');
    SELECT EXISTS(SELECT 1 FROM loops WHERE loops.code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_loop_members_user_id ON loop_members(user_id);
CREATE INDEX IF NOT EXISTS idx_loop_members_loop_id ON loop_members(loop_id);
CREATE INDEX IF NOT EXISTS idx_items_loop_id ON items(loop_id);
CREATE INDEX IF NOT EXISTS idx_items_owner_id ON items(owner_id);
CREATE INDEX IF NOT EXISTS idx_events_loop_id ON events(loop_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);