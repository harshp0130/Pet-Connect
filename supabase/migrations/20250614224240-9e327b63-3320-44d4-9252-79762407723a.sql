-- Allow admins to update pet verification status
CREATE POLICY "Admins can update pet verification status" 
ON public.pets 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Allow admins to insert pets if needed
CREATE POLICY "Admins can insert pets" 
ON public.pets 
FOR INSERT 
WITH CHECK (true);

-- Allow admins to delete pets if needed
CREATE POLICY "Admins can delete pets" 
ON public.pets 
FOR DELETE 
USING (true);