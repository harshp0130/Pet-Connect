-- Enable RLS on pet_care_requests if not already enabled
ALTER TABLE public.pet_care_requests ENABLE ROW LEVEL SECURITY;

-- Create policy for pet sitters to view all pending requests (not assigned to anyone)
CREATE POLICY "Pet sitters can view available requests" 
ON public.pet_care_requests 
FOR SELECT 
USING (
  status = 'pending' 
  AND sitter_id IS NULL 
  AND shelter_id IS NULL
);

-- Create policy for pet owners to view their own requests
CREATE POLICY "Pet owners can view their own requests" 
ON public.pet_care_requests 
FOR SELECT 
USING (auth.uid() = owner_id);

-- Create policy for pet sitters to view their accepted requests
CREATE POLICY "Pet sitters can view their accepted requests" 
ON public.pet_care_requests 
FOR SELECT 
USING (auth.uid() = sitter_id);

-- Create policy for shelters to view their accepted requests
CREATE POLICY "Shelters can view their accepted requests" 
ON public.pet_care_requests 
FOR SELECT 
USING (auth.uid() = shelter_id);

-- Create policy for pet owners to insert their own requests
CREATE POLICY "Pet owners can create care requests" 
ON public.pet_care_requests 
FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

-- Create policy for pet sitters to update requests they want to accept
CREATE POLICY "Pet sitters can accept available requests" 
ON public.pet_care_requests 
FOR UPDATE 
USING (
  status = 'pending' 
  AND sitter_id IS NULL 
  AND shelter_id IS NULL
)
WITH CHECK (
  auth.uid() = sitter_id 
  AND status IN ('accepted', 'rejected')
);

-- Create policy for pet owners to update their own requests
CREATE POLICY "Pet owners can update their own requests" 
ON public.pet_care_requests 
FOR UPDATE 
USING (auth.uid() = owner_id);

-- Create policy for assigned sitters to update request status
CREATE POLICY "Assigned sitters can update request status" 
ON public.pet_care_requests 
FOR UPDATE 
USING (auth.uid() = sitter_id)
WITH CHECK (auth.uid() = sitter_id);