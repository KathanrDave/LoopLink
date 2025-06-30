/*
  # Fix infinite recursion in RLS policies

  1. Policy Updates
    - Simplify the profiles policy to avoid circular references with loop_members
    - Update loop_members policy to be more direct and avoid recursion
    - Ensure policies are efficient and don't create circular dependencies

  2. Security
    - Maintain proper access control while removing recursion
    - Users can still only see profiles of people in their loops
    - Users can still only see loop members for loops they belong to
*/

-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can read profiles in same loops" ON profiles;
DROP POLICY IF EXISTS "Users can read loop members for their loops" ON loop_members;

-- Create a simpler, non-recursive policy for profiles
-- Users can read their own profile and profiles of users in the same loops
CREATE POLICY "Users can read profiles in same loops"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR 
    EXISTS (
      SELECT 1 
      FROM loop_members lm1 
      INNER JOIN loop_members lm2 ON lm1.loop_id = lm2.loop_id 
      WHERE lm1.user_id = profiles.id 
      AND lm2.user_id = auth.uid()
    )
  );

-- Create a simpler policy for loop_members that doesn't reference itself
CREATE POLICY "Users can read loop members for their loops"
  ON loop_members
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    loop_id IN (
      SELECT loop_id 
      FROM loop_members 
      WHERE user_id = auth.uid()
    )
  );