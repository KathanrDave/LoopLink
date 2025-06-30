-- Create chat_messages table for real-time messaging
CREATE TABLE IF NOT EXISTS chat_messages (
  id text PRIMARY KEY,
  room_id text NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  type text DEFAULT 'text' CHECK (type IN ('text', 'image', 'file', 'system')),
  timestamp timestamptz DEFAULT now(),
  edited boolean DEFAULT false,
  reply_to text,
  reactions jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
  id text PRIMARY KEY,
  name text NOT NULL,
  type text DEFAULT 'loop' CHECK (type IN ('loop', 'direct', 'group')),
  participants text[] DEFAULT '{}',
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;

-- Chat messages policies
CREATE POLICY "Users can read messages in their loops"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (
    room_id IN (
      SELECT loop_id::text 
      FROM loop_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages in their loops"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    room_id IN (
      SELECT loop_id::text 
      FROM loop_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can edit their own messages"
  ON chat_messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages"
  ON chat_messages
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Chat rooms policies
CREATE POLICY "Users can read rooms they participate in"
  ON chat_rooms
  FOR SELECT
  TO authenticated
  USING (
    auth.uid()::text = ANY(participants) OR
    id IN (
      SELECT loop_id::text 
      FROM loop_members 
      WHERE user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_participants ON chat_rooms USING GIN(participants);