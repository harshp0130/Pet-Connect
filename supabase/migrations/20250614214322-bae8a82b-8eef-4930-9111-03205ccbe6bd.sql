-- Create function to create admin with proper permissions
CREATE OR REPLACE FUNCTION public.create_admin(
  p_name TEXT,
  p_email TEXT,
  p_password TEXT,
  p_permissions JSONB,
  p_created_by UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_admin_id UUID;
BEGIN
  -- Insert the new admin
  INSERT INTO public.admins (
    name, 
    email, 
    password_hash, 
    permissions, 
    is_super_admin, 
    created_by
  )
  VALUES (
    p_name,
    p_email,
    public.hash_password(p_password),
    p_permissions,
    false,
    p_created_by
  )
  RETURNING id INTO new_admin_id;
  
  -- Log the activity
  PERFORM public.log_admin_activity(
    p_created_by,
    'admin_created',
    jsonb_build_object('admin_email', p_email),
    'admin',
    new_admin_id
  );
  
  RETURN new_admin_id;
END;
$$;