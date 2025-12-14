
-- Add RLS policies for banners table to allow admin access
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Allow admins to view all banners
CREATE POLICY "Admins can view all banners" 
  ON public.banners 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE admins.id = auth.uid()
    )
  );

-- Allow admins to insert banners
CREATE POLICY "Admins can create banners" 
  ON public.banners 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE admins.id = auth.uid()
    )
  );

-- Allow admins to update banners
CREATE POLICY "Admins can update banners" 
  ON public.banners 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE admins.id = auth.uid()
    )
  );

-- Allow admins to delete banners
CREATE POLICY "Admins can delete banners" 
  ON public.banners 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE admins.id = auth.uid()
    )
  );

-- Allow public read access to active banners (for displaying on frontend)
CREATE POLICY "Public can view active banners" 
  ON public.banners 
  FOR SELECT 
  USING (is_active = true);
