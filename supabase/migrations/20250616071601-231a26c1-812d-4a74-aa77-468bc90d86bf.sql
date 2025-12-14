-- Drop and recreate the verify_admin_password function to include permissions
DROP FUNCTION IF EXISTS public.verify_admin_password(text, text);

CREATE OR REPLACE FUNCTION public.verify_admin_password(email_input text, password_input text)
 RETURNS TABLE(admin_id uuid, admin_name text, admin_email text, is_super_admin boolean, permissions jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT a.id, a.name, a.email, a.is_super_admin, a.permissions
  FROM public.admins a
  WHERE a.email = email_input 
    AND a.password_hash = public.hash_password(password_input);
END;
$function$