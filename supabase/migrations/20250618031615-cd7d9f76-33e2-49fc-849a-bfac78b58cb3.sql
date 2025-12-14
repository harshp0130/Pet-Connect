-- Fix password verification in verify_admin_password_with_session function
-- The issue was using crypt() instead of the original hash_password function
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
  
  -- Verify password using the original hash_password function (not crypt)
  IF NOT public.hash_password(password_input) = v_password_hash THEN
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