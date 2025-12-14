-- Update RLS policies for pet_care_requests to properly handle shelter access

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Pet sitters can accept available requests" ON public.pet_care_requests;
DROP POLICY IF EXISTS "Assigned sitters can update request status" ON public.pet_care_requests;

-- Create enhanced policy for pet sitters and shelters to accept available requests
CREATE POLICY "Pet sitters and shelters can accept available requests" 
ON public.pet_care_requests 
FOR UPDATE 
USING (
  status = 'pending' 
  AND sitter_id IS NULL 
  AND shelter_id IS NULL
)
WITH CHECK (
  (auth.uid() = sitter_id AND status IN ('accepted', 'rejected'))
  OR
  (auth.uid() = shelter_id AND status IN ('accepted', 'rejected'))
);

-- Create enhanced policy for assigned caregivers to update request status
CREATE POLICY "Assigned caregivers can update request status" 
ON public.pet_care_requests 
FOR UPDATE 
USING (auth.uid() = sitter_id OR auth.uid() = shelter_id)
WITH CHECK (auth.uid() = sitter_id OR auth.uid() = shelter_id);

-- Ensure shelters can view available requests (same as sitters)
-- This policy already exists but let's make sure it covers both sitters and shelters
DROP POLICY IF EXISTS "Pet sitters can view available requests" ON public.pet_care_requests;

CREATE POLICY "Pet sitters and shelters can view available requests" 
ON public.pet_care_requests 
FOR SELECT 
USING (
  status = 'pending' 
  AND sitter_id IS NULL 
  AND shelter_id IS NULL
);

-- Add policy for city-based prioritization (optional but helpful for performance)
CREATE POLICY "City-based request visibility" 
ON public.pet_care_requests 
FOR SELECT 
USING (
  -- Allow viewing all pending requests regardless of city for now
  -- This can be enhanced later with city-based filtering at the application level
  status = 'pending' 
  AND sitter_id IS NULL 
  AND shelter_id IS NULL
);