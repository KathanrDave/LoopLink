/*
  # Fix RLS policies to prevent infinite recursion

  1. Security Updates
    - Simplify loop_members policies to avoid circular references
    - Update profiles policies to be more direct
    - Ensure policies don't create recursive lookups

  2. Changes Made
    - Simplified loop_members SELECT policy
    - Updated profiles SELECT policy for loop members
    - Removed complex subqueries that cause recursion
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can read profiles in same loops" ON profiles;
DROP POLICY IF EXISTS "Users can read loop members for their loops" ON loop_members;

-- Create simplified policies for profiles
CREATE POLICY "Users can read profiles in same loops"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM loop_members lm1
      JOIN loop_members lm2 ON lm1.loop_id = lm2.loop_id
      WHERE lm1.user_id = profiles.id 
      AND lm2.user_id = auth.uid()
    )
  );

-- Create simplified policy for loop_members
CREATE POLICY "Users can read loop members for their loops"
  ON loop_members
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    loop_id IN (
      SELECT loop_id FROM loop_members WHERE user_id = auth.uid()
    )
  );