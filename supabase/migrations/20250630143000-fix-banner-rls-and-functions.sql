
-- Create RLS policies for banners table
CREATE POLICY "Admins can view all banners" ON public.banners 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE id = auth.uid()
  )
);

CREATE POLICY "Admins can insert banners" ON public.banners 
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE id = auth.uid()
  )
);

CREATE POLICY "Admins can update banners" ON public.banners 
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE id = auth.uid()
  )
);

CREATE POLICY "Admins can delete banners" ON public.banners 
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE id = auth.uid()
  )
);

-- Create function to get banners for admin
CREATE OR REPLACE FUNCTION public.get_banners_for_admin(admin_id uuid)
 RETURNS TABLE(
   id uuid,
   title text,
   description text,
   image_url text,
   banner_type text,
   is_active boolean,
   start_date timestamp with time zone,
   end_date timestamp with time zone,
   discount_percentage integer,
   target_url text,
   display_order integer,
   created_at timestamp with time zone,
   updated_at timestamp with time zone,
   created_by uuid
 )
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (SELECT 1 FROM public.admins WHERE public.admins.id = admin_id) THEN
    RAISE EXCEPTION 'Access denied: User is not an admin';
  END IF;
  
  RETURN QUERY
  SELECT b.id, b.title, b.description, b.image_url, b.banner_type, 
         b.is_active, b.start_date, b.end_date, b.discount_percentage,
         b.target_url, b.display_order, b.created_at, b.updated_at, b.created_by
  FROM public.banners b
  ORDER BY b.display_order ASC;
END;
$function$;

-- Create function to create banner as admin
CREATE OR REPLACE FUNCTION public.create_banner_as_admin(
  p_admin_id uuid,
  p_title text,
  p_description text DEFAULT NULL,
  p_image_url text DEFAULT NULL,
  p_banner_type text DEFAULT 'sale',
  p_is_active boolean DEFAULT true,
  p_start_date timestamp with time zone DEFAULT NULL,
  p_end_date timestamp with time zone DEFAULT NULL,
  p_discount_percentage integer DEFAULT 0,
  p_target_url text DEFAULT NULL,
  p_display_order integer DEFAULT 0
)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  new_banner_id uuid;
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (SELECT 1 FROM public.admins WHERE id = p_admin_id) THEN
    RAISE EXCEPTION 'Access denied: User is not an admin';
  END IF;
  
  -- Insert the banner
  INSERT INTO public.banners (
    title, description, image_url, banner_type, is_active,
    start_date, end_date, discount_percentage, target_url, 
    display_order, created_by
  ) VALUES (
    p_title, p_description, p_image_url, p_banner_type, p_is_active,
    p_start_date, p_end_date, p_discount_percentage, p_target_url,
    p_display_order, p_admin_id
  ) RETURNING id INTO new_banner_id;
  
  -- Log the activity
  PERFORM public.log_admin_activity(
    p_admin_id,
    'banner_created',
    jsonb_build_object('banner_id', new_banner_id, 'title', p_title),
    'banner',
    new_banner_id
  );
  
  RETURN new_banner_id;
END;
$function$;

-- Create function to update banner as admin
CREATE OR REPLACE FUNCTION public.update_banner_as_admin(
  p_admin_id uuid,
  p_banner_id uuid,
  p_title text,
  p_description text DEFAULT NULL,
  p_image_url text DEFAULT NULL,
  p_banner_type text DEFAULT 'sale',
  p_is_active boolean DEFAULT true,
  p_start_date timestamp with time zone DEFAULT NULL,
  p_end_date timestamp with time zone DEFAULT NULL,
  p_discount_percentage integer DEFAULT 0,
  p_target_url text DEFAULT NULL,
  p_display_order integer DEFAULT 0
)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (SELECT 1 FROM public.admins WHERE id = p_admin_id) THEN
    RAISE EXCEPTION 'Access denied: User is not an admin';
  END IF;
  
  -- Update the banner
  UPDATE public.banners SET
    title = p_title,
    description = p_description,
    image_url = p_image_url,
    banner_type = p_banner_type,
    is_active = p_is_active,
    start_date = p_start_date,
    end_date = p_end_date,
    discount_percentage = p_discount_percentage,
    target_url = p_target_url,
    display_order = p_display_order,
    updated_at = now()
  WHERE id = p_banner_id;
  
  -- Log the activity
  PERFORM public.log_admin_activity(
    p_admin_id,
    'banner_updated',
    jsonb_build_object('banner_id', p_banner_id, 'title', p_title),
    'banner',
    p_banner_id
  );
  
  RETURN FOUND;
END;
$function$;
