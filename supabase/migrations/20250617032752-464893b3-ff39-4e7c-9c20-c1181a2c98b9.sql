-- Create admin sessions table for secure session management
CREATE TABLE public.admin_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Add foreign key constraint to admins table
ALTER TABLE public.admin_sessions 
ADD CONSTRAINT admin_sessions_admin_id_fkey 
FOREIGN KEY (admin_id) REFERENCES public.admins(id) ON DELETE CASCADE;

-- Enable RLS on admin_sessions
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Create index for performance
CREATE INDEX idx_admin_sessions_token ON public.admin_sessions(session_token);
CREATE INDEX idx_admin_sessions_admin_id ON public.admin_sessions(admin_id);
CREATE INDEX idx_admin_sessions_expires_at ON public.admin_sessions(expires_at);

-- Function to create secure admin session
CREATE OR REPLACE FUNCTION public.create_admin_session(
  p_admin_id UUID,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS TABLE(
  session_token TEXT,
  admin_data JSONB,
  expires_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
  v_session_token TEXT;
  v_expires_at TIMESTAMP WITH TIME ZONE;
  v_admin_data JSONB;
BEGIN
  -- Generate secure random session token
  v_session_token := encode(gen_random_bytes(32), 'hex');
  
  -- Set session expiration (8 hours)
  v_expires_at := now() + interval '8 hours';
  
  -- Invalidate any existing active sessions for this admin
  UPDATE public.admin_sessions 
  SET is_active = false 
  WHERE admin_id = p_admin_id AND is_active = true;
  
  -- Create new session
  INSERT INTO public.admin_sessions (
    admin_id, 
    session_token, 
    ip_address, 
    user_agent, 
    expires_at
  ) VALUES (
    p_admin_id, 
    v_session_token, 
    p_ip_address, 
    p_user_agent, 
    v_expires_at
  );
  
  -- Get admin data
  SELECT jsonb_build_object(
    'id', a.id,
    'name', a.name,
    'email', a.email,
    'is_super_admin', a.is_super_admin,
    'permissions', a.permissions
  ) INTO v_admin_data
  FROM public.admins a
  WHERE a.id = p_admin_id;
  
  RETURN QUERY SELECT v_session_token, v_admin_data, v_expires_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate admin session
CREATE OR REPLACE FUNCTION public.validate_admin_session(
  p_session_token TEXT
)
RETURNS TABLE(
  admin_data JSONB,
  session_valid BOOLEAN
) AS $$
DECLARE
  v_admin_data JSONB;
  v_session_valid BOOLEAN := false;
BEGIN
  -- Check if session exists and is valid
  SELECT jsonb_build_object(
    'id', a.id,
    'name', a.name,
    'email', a.email,
    'is_super_admin', a.is_super_admin,
    'permissions', a.permissions
  ) INTO v_admin_data
  FROM public.admin_sessions s
  JOIN public.admins a ON s.admin_id = a.id
  WHERE s.session_token = p_session_token
    AND s.is_active = true
    AND s.expires_at > now();
  
  IF v_admin_data IS NOT NULL THEN
    v_session_valid := true;
    
    -- Update session last activity (optional - extends session)
    UPDATE public.admin_sessions 
    SET expires_at = now() + interval '8 hours'
    WHERE session_token = p_session_token;
  END IF;
  
  RETURN QUERY SELECT v_admin_data, v_session_valid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to invalidate admin session (logout)
CREATE OR REPLACE FUNCTION public.invalidate_admin_session(
  p_session_token TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.admin_sessions 
  SET is_active = false 
  WHERE session_token = p_session_token;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_admin_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.admin_sessions 
  WHERE expires_at < now() OR is_active = false;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the verify_admin_password function to use sessions
CREATE OR REPLACE FUNCTION public.verify_admin_password_with_session(
  email_input TEXT,
  password_input TEXT,
  ip_address_input INET DEFAULT NULL,
  user_agent_input TEXT DEFAULT NULL
)
RETURNS TABLE(
  success BOOLEAN,
  session_token TEXT,
  admin_data JSONB,
  expires_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT
) AS $$
DECLARE
  v_admin_id UUID;
  v_password_hash TEXT;
  v_session_data RECORD;
BEGIN
  -- Get admin by email
  SELECT id, password_hash INTO v_admin_id, v_password_hash
  FROM public.admins
  WHERE email = email_input;
  
  IF v_admin_id IS NULL THEN
    RETURN QUERY SELECT false, NULL::TEXT, NULL::JSONB, NULL::TIMESTAMP WITH TIME ZONE, 'Invalid credentials'::TEXT;
    RETURN;
  END IF;
  
  -- Verify password using crypt
  IF NOT crypt(password_input, v_password_hash) = v_password_hash THEN
    RETURN QUERY SELECT false, NULL::TEXT, NULL::JSONB, NULL::TIMESTAMP WITH TIME ZONE, 'Invalid credentials'::TEXT;
    RETURN;
  END IF;
  
  -- Create session
  SELECT * INTO v_session_data
  FROM public.create_admin_session(
    v_admin_id,
    ip_address_input,
    user_agent_input
  );
  
  -- Log admin login activity
  INSERT INTO public.admin_activity_logs (
    admin_id,
    action,
    details,
    ip_address,
    user_agent
  ) VALUES (
    v_admin_id,
    'admin_login',
    jsonb_build_object('login_method', 'password'),
    ip_address_input,
    user_agent_input
  );
  
  RETURN QUERY SELECT 
    true, 
    v_session_data.session_token, 
    v_session_data.admin_data, 
    v_session_data.expires_at,
    NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;