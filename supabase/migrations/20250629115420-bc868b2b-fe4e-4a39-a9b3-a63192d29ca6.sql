
-- Create the images storage bucket for banners and products
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true);

-- Create storage policies for the images bucket
CREATE POLICY "Anyone can view images" ON storage.objects 
FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own images" ON storage.objects 
FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own images" ON storage.objects 
FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Create RLS policies for banners table to allow admin operations
CREATE POLICY "Admins can manage banners" ON public.banners 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE id = auth.uid()
  )
);

-- Enable RLS on banners table
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
