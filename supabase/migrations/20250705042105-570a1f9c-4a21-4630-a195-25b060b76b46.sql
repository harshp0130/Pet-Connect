-- Fix storage policies for banner images to work with admin authentication
DROP POLICY IF EXISTS "Allow admin banner image upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin banner image update" ON storage.objects;
DROP POLICY IF EXISTS "Public can view banner images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin banner image delete" ON storage.objects;

-- Create more permissive policies that work with the current admin system
CREATE POLICY "Allow authenticated users to upload banner images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'images' 
  AND (storage.foldername(name))[1] = 'banners'
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Allow authenticated users to update banner images"
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

CREATE POLICY "Allow authenticated users to delete banner images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'images' 
  AND (storage.foldername(name))[1] = 'banners'
  AND auth.uid() IS NOT NULL
);