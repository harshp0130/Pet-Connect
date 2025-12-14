-- Ensure RLS is enabled on admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for admin activity logs
CREATE POLICY "Admins can view their own activity logs"
ON public.admin_activity_logs
FOR SELECT
USING (public.is_admin_user(auth.uid()));

CREATE POLICY "System can insert activity logs"
ON public.admin_activity_logs
FOR INSERT
WITH CHECK (true);

-- Add RLS policies for user login logs (super admin only)
CREATE POLICY "Super admins can view all login logs"
ON public.user_login_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE id = auth.uid() AND is_super_admin = true
  )
);

CREATE POLICY "System can insert login logs"
ON public.user_login_logs
FOR INSERT
WITH CHECK (true);

CREATE POLICY "System can update login logs"
ON public.user_login_logs
FOR UPDATE
USING (true);