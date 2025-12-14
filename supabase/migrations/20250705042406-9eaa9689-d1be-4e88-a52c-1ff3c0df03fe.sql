-- Fix storage policies to only allow admins to manage banner images
DROP POLICY IF EXISTS "Allow authenticated users to upload banner images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update banner images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete banner images" ON storage.objects;

-- Create admin-only policies for banner management
CREATE POLICY "Only admins can upload banner images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'images' 
  AND (storage.foldername(name))[1] = 'banners'
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.admins 
    WHERE id = auth.uid()
  )
);

CREATE POLICY "Only admins can update banner images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'images' 
  AND (storage.foldername(name))[1] = 'banners'
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.admins 
    WHERE id = auth.uid()
  )
);

CREATE POLICY "Only admins can delete banner images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'images' 
  AND (storage.foldername(name))[1] = 'banners'
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.admins 
    WHERE id = auth.uid()
  )
);