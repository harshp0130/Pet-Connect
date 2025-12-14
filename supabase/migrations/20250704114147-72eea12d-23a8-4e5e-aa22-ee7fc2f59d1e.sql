-- Fix storage permissions for admin users
CREATE POLICY "Admins can upload banner images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'images' 
  AND (storage.foldername(name))[1] = 'banners'
  AND EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

CREATE POLICY "Admins can update banner images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'images' 
  AND (storage.foldername(name))[1] = 'banners'
  AND EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

CREATE POLICY "Public can view banner images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'images' AND (storage.foldername(name))[1] = 'banners');