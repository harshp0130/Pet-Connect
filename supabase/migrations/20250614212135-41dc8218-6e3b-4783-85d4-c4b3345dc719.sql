-- Drop existing policies that might cause conflicts
DROP POLICY IF EXISTS "Admins can view all admins" ON public.admins;
DROP POLICY IF EXISTS "Super admins can create admins" ON public.admins;
DROP POLICY IF EXISTS "Super admins can update admins" ON public.admins;
DROP POLICY IF EXISTS "Super admins can delete admins" ON public.admins;
DROP POLICY IF EXISTS "Super admins can insert new admins" ON public.admins;

-- Create security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins 
    WHERE id = user_id
  );
$$;

-- Create RLS policies for admins table using the security definer function
CREATE POLICY "Admins can view all admins"
ON public.admins
FOR SELECT
USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Super admins can insert new admins"
ON public.admins
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE id = auth.uid() AND is_super_admin = true
  )
);

CREATE POLICY "Super admins can update admins"
ON public.admins
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE id = auth.uid() AND is_super_admin = true
  )
);

CREATE POLICY "Super admins can delete admins"
ON public.admins
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE id = auth.uid() AND is_super_admin = true
  )
);