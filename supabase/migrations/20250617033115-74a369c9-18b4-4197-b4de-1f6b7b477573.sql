-- Create automatic cleanup for expired admin sessions
-- This helps maintain database performance and removes old/expired session data

-- Create a function to be called by pg_cron or manually for cleanup
CREATE OR REPLACE FUNCTION public.auto_cleanup_admin_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete expired or inactive sessions
  DELETE FROM public.admin_sessions 
  WHERE expires_at < now() OR is_active = false;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Also log the cleanup activity
  INSERT INTO public.admin_activity_logs (
    admin_id,
    action,
    details,
    target_type
  ) 
  SELECT 
    (SELECT id FROM public.admins WHERE is_super_admin = true LIMIT 1), -- Use first super admin for system actions
    'system_cleanup',
    jsonb_build_object(
      'cleaned_sessions', deleted_count,
      'cleanup_time', now()
    ),
    'admin_sessions'
  WHERE deleted_count > 0; -- Only log if something was actually cleaned up
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add additional security policies for admin_sessions table
-- Only allow sessions to be read by their own admin or system functions
CREATE POLICY "Admins can only access their own sessions"
ON public.admin_sessions
FOR ALL
USING (
  admin_id IN (
    SELECT id FROM public.admins 
    WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    AND is_super_admin = true
  )
  OR admin_id = (
    SELECT id FROM public.admins 
    WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
  )
);

-- Create a trigger to automatically log admin session creation
CREATE OR REPLACE FUNCTION public.log_admin_session_creation()
RETURNS TRIGGER AS $$
BEGIN
  -- Log session creation activity
  INSERT INTO public.admin_activity_logs (
    admin_id,
    action,
    details,
    target_type,
    target_id,
    ip_address,
    user_agent
  ) VALUES (
    NEW.admin_id,
    'session_created',
    jsonb_build_object(
      'session_id', NEW.id,
      'expires_at', NEW.expires_at
    ),
    'admin_session',
    NEW.id,
    NEW.ip_address,
    NEW.user_agent
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS log_admin_session_creation_trigger ON public.admin_sessions;
CREATE TRIGGER log_admin_session_creation_trigger
  AFTER INSERT ON public.admin_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.log_admin_session_creation();

-- Create a trigger to log session invalidation
CREATE OR REPLACE FUNCTION public.log_admin_session_invalidation()
RETURNS TRIGGER AS $$
BEGIN
  -- Log session invalidation if is_active changed from true to false
  IF OLD.is_active = true AND NEW.is_active = false THEN
    INSERT INTO public.admin_activity_logs (
      admin_id,
      action,
      details,
      target_type,
      target_id
    ) VALUES (
      NEW.admin_id,
      'session_invalidated',
      jsonb_build_object(
        'session_id', NEW.id,
        'invalidated_at', now()
      ),
      'admin_session',
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS log_admin_session_invalidation_trigger ON public.admin_sessions;
CREATE TRIGGER log_admin_session_invalidation_trigger
  AFTER UPDATE ON public.admin_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.log_admin_session_invalidation();