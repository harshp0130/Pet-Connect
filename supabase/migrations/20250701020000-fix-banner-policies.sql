
-- Drop existing banner policies if they exist
DROP POLICY IF EXISTS "Admins can view all banners" ON public.banners;
DROP POLICY IF EXISTS "Admins can create banners" ON public.banners;
DROP POLICY IF EXISTS "Admins can update banners" ON public.banners;
DROP POLICY IF EXISTS "Admins can delete banners" ON public.banners;
DROP POLICY IF EXISTS "Public can view active banners" ON public.banners;

-- Recreate banner policies with proper conditions
CREATE POLICY "Admins can view all banners" 
  ON public.banners 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE admins.id = auth.uid()
    )
  );

CREATE POLICY "Admins can create banners" 
  ON public.banners 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE admins.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update banners" 
  ON public.banners 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE admins.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE admins.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete banners" 
  ON public.banners 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.admins 
      WHERE admins.id = auth.uid()
    )
  );

-- Allow public read access to active banners
CREATE POLICY "Public can view active banners" 
  ON public.banners 
  FOR SELECT 
  USING (is_active = true);

-- Ensure RLS is enabled
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
