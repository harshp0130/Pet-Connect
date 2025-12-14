-- Create admins table for admin users
CREATE TABLE public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  is_super_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.admins(id)
);

-- Enable Row Level Security
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can view all admins" 
ON public.admins 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()));

CREATE POLICY "Super admins can create admins" 
ON public.admins 
FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid() AND is_super_admin = true));

CREATE POLICY "Super admins can update admins" 
ON public.admins 
FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid() AND is_super_admin = true));

CREATE POLICY "Super admins can delete admins" 
ON public.admins 
FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid() AND is_super_admin = true));

-- Create function to hash passwords (simple hash for demo - in production use bcrypt)
CREATE OR REPLACE FUNCTION public.hash_password(password TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  -- Simple hash function for demo purposes
  -- In production, use a proper password hashing library
  RETURN encode(digest(password || 'salt123', 'sha256'), 'hex');
END;
$$;

-- Create function to verify passwords
CREATE OR REPLACE FUNCTION public.verify_admin_password(email_input TEXT, password_input TEXT)
RETURNS TABLE(admin_id UUID, admin_name TEXT, admin_email TEXT, is_super_admin BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, a.name, a.email, a.is_super_admin
  FROM public.admins a
  WHERE a.email = email_input 
    AND a.password_hash = public.hash_password(password_input);
END;
$$;

-- Insert the super admin user
INSERT INTO public.admins (name, email, password_hash, is_super_admin)
VALUES (
  'Rohit Kumar',
  'rohitkumarunable@gmail.com',
  public.hash_password('Rohit7292@'),
  true
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_admins_updated_at
BEFORE UPDATE ON public.admins
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();