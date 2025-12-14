-- Add permissions column to admins table for co-admin system
ALTER TABLE public.admins ADD COLUMN IF NOT EXISTS permissions jsonb DEFAULT '{"manage_users": true, "manage_pets": true, "manage_products": true, "manage_admins": false}'::jsonb;

-- Create admin activity logs table
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id uuid NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  action text NOT NULL,
  details jsonb,
  target_type text, -- 'user', 'pet', 'product', 'admin', etc.
  target_id uuid,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user login logs table
CREATE TABLE IF NOT EXISTS public.user_login_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  login_time timestamp with time zone NOT NULL DEFAULT now(),
  logout_time timestamp with time zone,
  ip_address inet,
  user_agent text,
  session_duration interval,
  is_active boolean DEFAULT true
);

-- Create function to log admin activities
CREATE OR REPLACE FUNCTION public.log_admin_activity(
  p_admin_id uuid,
  p_action text,
  p_details jsonb DEFAULT NULL,
  p_target_type text DEFAULT NULL,
  p_target_id uuid DEFAULT NULL,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id uuid;
BEGIN
  INSERT INTO public.admin_activity_logs (
    admin_id, action, details, target_type, target_id, ip_address, user_agent
  )
  VALUES (
    p_admin_id, p_action, p_details, p_target_type, p_target_id, p_ip_address, p_user_agent
  )
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- Create function to track user sessions
CREATE OR REPLACE FUNCTION public.start_user_session(
  p_user_id uuid,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  session_id uuid;
BEGIN
  -- End any active sessions for this user
  UPDATE public.user_login_logs 
  SET logout_time = now(), 
      session_duration = now() - login_time,
      is_active = false
  WHERE user_id = p_user_id AND is_active = true;
  
  -- Start new session
  INSERT INTO public.user_login_logs (user_id, ip_address, user_agent)
  VALUES (p_user_id, p_ip_address, p_user_agent)
  RETURNING id INTO session_id;
  
  RETURN session_id;
END;
$$;

-- Create function to end user session
CREATE OR REPLACE FUNCTION public.end_user_session(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_login_logs 
  SET logout_time = now(), 
      session_duration = now() - login_time,
      is_active = false
  WHERE user_id = p_user_id AND is_active = true;
END;
$$;

-- Enable RLS on new tables
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_login_logs ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_admin_id ON public.admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created_at ON public.admin_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_login_logs_user_id ON public.user_login_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_login_logs_login_time ON public.user_login_logs(login_time DESC);
CREATE INDEX IF NOT EXISTS idx_user_login_logs_is_active ON public.user_login_logs(is_active);