-- Fix storage policies for admin banner uploads
DROP POLICY IF EXISTS "Admins can upload banner images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update banner images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view banner images" ON storage.objects;

-- Create proper storage policies for banner uploads
CREATE POLICY "Allow admin banner image upload"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'images' 
  AND (storage.foldername(name))[1] = 'banners'
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Allow admin banner image update"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'images' 
  AND (storage.foldername(name))[1] = 'banners'
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Public can view banner images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'images' AND (storage.foldername(name))[1] = 'banners');

CREATE POLICY "Allow admin banner image delete"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'images' 
  AND (storage.foldername(name))[1] = 'banners'
  AND auth.uid() IS NOT NULL
);