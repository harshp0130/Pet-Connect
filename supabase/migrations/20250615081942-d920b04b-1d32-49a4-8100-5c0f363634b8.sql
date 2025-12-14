-- Storage policies for video-updates bucket
DO $$
BEGIN
    -- Create storage policies for video-updates bucket
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND policyname = 'Public Access for video-updates'
    ) THEN
        CREATE POLICY "Public Access for video-updates" ON storage.objects
        FOR SELECT USING (bucket_id = 'video-updates');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND policyname = 'Authenticated users can upload video-updates'
    ) THEN
        CREATE POLICY "Authenticated users can upload video-updates" ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = 'video-updates' AND auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND policyname = 'Users can update their own video-updates'
    ) THEN
        CREATE POLICY "Users can update their own video-updates" ON storage.objects
        FOR UPDATE USING (bucket_id = 'video-updates' AND auth.uid()::text = (storage.foldername(name))[1]);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND policyname = 'Users can delete their own video-updates'
    ) THEN
        CREATE POLICY "Users can delete their own video-updates" ON storage.objects
        FOR DELETE USING (bucket_id = 'video-updates' AND auth.uid()::text = (storage.foldername(name))[1]);
    END IF;

    -- Storage policies for pet-documents bucket
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND policyname = 'Public Access for pet-documents'
    ) THEN
        CREATE POLICY "Public Access for pet-documents" ON storage.objects
        FOR SELECT USING (bucket_id = 'pet-documents');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage'
        AND policyname = 'Authenticated users can upload pet-documents'
    ) THEN
        CREATE POLICY "Authenticated users can upload pet-documents" ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = 'pet-documents' AND auth.role() = 'authenticated');
    END IF;
END $$;