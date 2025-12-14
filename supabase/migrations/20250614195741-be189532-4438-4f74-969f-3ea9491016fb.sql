-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('pet-images', 'pet-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('pet-documents', 'pet-documents', false);

-- Create policies for pet images (public access for viewing)
CREATE POLICY "Pet images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'pet-images');

CREATE POLICY "Users can upload pet images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'pet-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their pet images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'pet-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their pet images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'pet-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policies for pet documents (private access)
CREATE POLICY "Users can view their own pet documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'pet-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload pet documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'pet-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their pet documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'pet-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their pet documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'pet-documents' AND auth.uid()::text = (storage.foldername(name))[1]);