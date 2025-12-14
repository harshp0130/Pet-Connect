-- Create storage bucket for video updates if it doesn't exist (it already exists based on query)
-- Create storage policies for video-updates bucket
CREATE POLICY "Public Access for video-updates" ON storage.objects
FOR SELECT USING (bucket_id = 'video-updates');

CREATE POLICY "Authenticated users can upload video-updates" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'video-updates' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own video-updates" ON storage.objects
FOR UPDATE USING (bucket_id = 'video-updates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own video-updates" ON storage.objects
FOR DELETE USING (bucket_id = 'video-updates' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Ensure pet-documents bucket has proper policies for video uploads
CREATE POLICY "Public Access for pet-documents" ON storage.objects
FOR SELECT USING (bucket_id = 'pet-documents');

CREATE POLICY "Authenticated users can upload pet-documents" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'pet-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own pet-documents" ON storage.objects
FOR UPDATE USING (bucket_id = 'pet-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own pet-documents" ON storage.objects
FOR DELETE USING (bucket_id = 'pet-documents' AND auth.uid()::text = (storage.foldername(name))[1]);