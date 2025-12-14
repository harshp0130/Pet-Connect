-- Create delete banner function for admins
CREATE OR REPLACE FUNCTION public.delete_banner_as_admin(
  p_admin_id uuid,
  p_banner_id uuid
) 
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (SELECT 1 FROM public.admins WHERE id = p_admin_id) THEN
    RAISE EXCEPTION 'Access denied: User is not an admin';
  END IF;
  
  -- First delete banner-product relationships
  DELETE FROM public.banner_products WHERE banner_id = p_banner_id;
  
  -- Then delete the banner
  DELETE FROM public.banners WHERE id = p_banner_id;
  
  -- Log the activity
  PERFORM public.log_admin_activity(
    p_admin_id,
    'banner_deleted',
    jsonb_build_object('banner_id', p_banner_id),
    'banner',
    p_banner_id
  );
  
  RETURN FOUND;
END;
$$;

-- Create update banner status function for admins
CREATE OR REPLACE FUNCTION public.update_banner_status_as_admin(
  p_admin_id uuid,
  p_banner_id uuid,
  p_is_active boolean
) 
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (SELECT 1 FROM public.admins WHERE id = p_admin_id) THEN
    RAISE EXCEPTION 'Access denied: User is not an admin';
  END IF;
  
  -- Update banner status
  UPDATE public.banners 
  SET is_active = p_is_active, updated_at = now()
  WHERE id = p_banner_id;
  
  -- Log the activity
  PERFORM public.log_admin_activity(
    p_admin_id,
    'banner_status_updated',
    jsonb_build_object('banner_id', p_banner_id, 'is_active', p_is_active),
    'banner',
    p_banner_id
  );
  
  RETURN FOUND;
END;
$$;