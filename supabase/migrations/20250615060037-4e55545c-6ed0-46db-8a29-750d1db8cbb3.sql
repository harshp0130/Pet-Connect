-- Add storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('pet-images', 'pet-images', true),
  ('pet-documents', 'pet-documents', true),
  ('video-updates', 'video-updates', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on tables
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_sitter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_shelter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_care_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;

-- Create RLS policies only if they don't exist
DO $$
BEGIN
  -- Pets policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pets' AND policyname = 'Users can view all pets') THEN
    EXECUTE 'CREATE POLICY "Users can view all pets" ON public.pets FOR SELECT USING (true)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pets' AND policyname = 'Users can insert their own pets') THEN
    EXECUTE 'CREATE POLICY "Users can insert their own pets" ON public.pets FOR INSERT WITH CHECK (auth.uid() = user_id)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pets' AND policyname = 'Users can update their own pets') THEN
    EXECUTE 'CREATE POLICY "Users can update their own pets" ON public.pets FOR UPDATE USING (auth.uid() = user_id)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pets' AND policyname = 'Users can delete their own pets') THEN
    EXECUTE 'CREATE POLICY "Users can delete their own pets" ON public.pets FOR DELETE USING (auth.uid() = user_id)';
  END IF;

  -- Profiles policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view all profiles') THEN
    EXECUTE 'CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert their own profile') THEN
    EXECUTE 'CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update their own profile') THEN
    EXECUTE 'CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id)';
  END IF;

  -- Pet sitter profiles policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pet_sitter_profiles' AND policyname = 'Anyone can view pet sitter profiles') THEN
    EXECUTE 'CREATE POLICY "Anyone can view pet sitter profiles" ON public.pet_sitter_profiles FOR SELECT USING (true)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pet_sitter_profiles' AND policyname = 'Users can insert their own sitter profile') THEN
    EXECUTE 'CREATE POLICY "Users can insert their own sitter profile" ON public.pet_sitter_profiles FOR INSERT WITH CHECK (auth.uid() = user_id)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pet_sitter_profiles' AND policyname = 'Users can update their own sitter profile') THEN
    EXECUTE 'CREATE POLICY "Users can update their own sitter profile" ON public.pet_sitter_profiles FOR UPDATE USING (auth.uid() = user_id)';
  END IF;

  -- Pet shelter profiles policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pet_shelter_profiles' AND policyname = 'Anyone can view pet shelter profiles') THEN
    EXECUTE 'CREATE POLICY "Anyone can view pet shelter profiles" ON public.pet_shelter_profiles FOR SELECT USING (true)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pet_shelter_profiles' AND policyname = 'Users can insert their own shelter profile') THEN
    EXECUTE 'CREATE POLICY "Users can insert their own shelter profile" ON public.pet_shelter_profiles FOR INSERT WITH CHECK (auth.uid() = user_id)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pet_shelter_profiles' AND policyname = 'Users can update their own shelter profile') THEN
    EXECUTE 'CREATE POLICY "Users can update their own shelter profile" ON public.pet_shelter_profiles FOR UPDATE USING (auth.uid() = user_id)';
  END IF;

  -- Pet care requests policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pet_care_requests' AND policyname = 'Users can view requests they are involved in') THEN
    EXECUTE 'CREATE POLICY "Users can view requests they are involved in" ON public.pet_care_requests FOR SELECT USING (auth.uid() = owner_id OR auth.uid() = sitter_id OR auth.uid() = shelter_id)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pet_care_requests' AND policyname = 'Pet owners can create requests') THEN
    EXECUTE 'CREATE POLICY "Pet owners can create requests" ON public.pet_care_requests FOR INSERT WITH CHECK (auth.uid() = owner_id)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pet_care_requests' AND policyname = 'Users can update requests they are involved in') THEN
    EXECUTE 'CREATE POLICY "Users can update requests they are involved in" ON public.pet_care_requests FOR UPDATE USING (auth.uid() = owner_id OR auth.uid() = sitter_id OR auth.uid() = shelter_id)';
  END IF;

  -- Video updates policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'video_updates' AND policyname = 'Users can view video updates for their requests') THEN
    EXECUTE 'CREATE POLICY "Users can view video updates for their requests" ON public.video_updates FOR SELECT USING (EXISTS (SELECT 1 FROM public.pet_care_requests pcr WHERE pcr.id = pet_care_request_id AND (pcr.owner_id = auth.uid() OR pcr.sitter_id = auth.uid() OR pcr.shelter_id = auth.uid())))';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'video_updates' AND policyname = 'Sitters and shelters can create video updates') THEN
    EXECUTE 'CREATE POLICY "Sitters and shelters can create video updates" ON public.video_updates FOR INSERT WITH CHECK (auth.uid() = sender_id AND EXISTS (SELECT 1 FROM public.pet_care_requests pcr WHERE pcr.id = pet_care_request_id AND (pcr.sitter_id = auth.uid() OR pcr.shelter_id = auth.uid())))';
  END IF;

  -- Reviews policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Anyone can view reviews') THEN
    EXECUTE 'CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Users can create reviews') THEN
    EXECUTE 'CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Users can update their own reviews') THEN
    EXECUTE 'CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = reviewer_id)';
  END IF;

  -- Notifications policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can view their own notifications') THEN
    EXECUTE 'CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can update their own notifications') THEN
    EXECUTE 'CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id)';
  END IF;

  -- Chat rooms policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_rooms' AND policyname = 'Users can view chat rooms they participate in') THEN
    EXECUTE 'CREATE POLICY "Users can view chat rooms they participate in" ON public.chat_rooms FOR SELECT USING (EXISTS (SELECT 1 FROM public.chat_participants cp WHERE cp.chat_room_id = id AND cp.user_id = auth.uid()))';
  END IF;

  -- Chat messages policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_messages' AND policyname = 'Users can view messages in their chat rooms') THEN
    EXECUTE 'CREATE POLICY "Users can view messages in their chat rooms" ON public.chat_messages FOR SELECT USING (EXISTS (SELECT 1 FROM public.chat_participants cp WHERE cp.chat_room_id = chat_room_id AND cp.user_id = auth.uid()))';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_messages' AND policyname = 'Users can send messages in their chat rooms') THEN
    EXECUTE 'CREATE POLICY "Users can send messages in their chat rooms" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = sender_id AND EXISTS (SELECT 1 FROM public.chat_participants cp WHERE cp.chat_room_id = chat_room_id AND cp.user_id = auth.uid()))';
  END IF;

  -- Chat participants policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_participants' AND policyname = 'Users can view participants in their chat rooms') THEN
    EXECUTE 'CREATE POLICY "Users can view participants in their chat rooms" ON public.chat_participants FOR SELECT USING (EXISTS (SELECT 1 FROM public.chat_participants cp WHERE cp.chat_room_id = chat_room_id AND cp.user_id = auth.uid()))';
  END IF;
END $$;