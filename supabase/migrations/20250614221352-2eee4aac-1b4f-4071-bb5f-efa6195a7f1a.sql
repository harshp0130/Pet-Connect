-- Update RLS policies for admin access to pets table
DROP POLICY IF EXISTS "Users can view their own pets" ON public.pets;
DROP POLICY IF EXISTS "Admins can view all pets" ON public.pets;

-- Create new policies for pets
CREATE POLICY "Users can view their own pets" 
ON public.pets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Allow public read access for pets" 
ON public.pets 
FOR SELECT 
USING (true);

-- Update RLS policies for admins table
DROP POLICY IF EXISTS "Admins can view all admins" ON public.admins;

CREATE POLICY "Allow public read access for admins" 
ON public.admins 
FOR SELECT 
USING (true);

-- Update RLS policies for admin activity logs
DROP POLICY IF EXISTS "Admins can view their own activity logs" ON public.admin_activity_logs;

CREATE POLICY "Allow public read access for admin activity logs" 
ON public.admin_activity_logs 
FOR SELECT 
USING (true);

-- Update user login logs to allow admin access
CREATE POLICY "Allow public read access for user login logs" 
ON public.user_login_logs 
FOR SELECT 
USING (true);