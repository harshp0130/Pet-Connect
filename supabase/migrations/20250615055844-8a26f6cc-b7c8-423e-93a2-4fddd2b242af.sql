-- Enable RLS on tables that might not have it enabled
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

-- Create RLS policies (using DO block to handle existing policies)
DO $$
BEGIN
  -- RLS policies for pets
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

  -- RLS policies for profiles
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view all profiles') THEN
    EXECUTE 'CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert their own profile') THEN
    EXECUTE 'CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update their own profile') THEN
    EXECUTE 'CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id)';
  END IF;

  -- RLS policies for pet sitter profiles
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pet_sitter_profiles' AND policyname = 'Anyone can view pet sitter profiles') THEN
    EXECUTE 'CREATE POLICY "Anyone can view pet sitter profiles" ON public.pet_sitter_profiles FOR SELECT USING (true)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pet_sitter_profiles' AND policyname = 'Users can insert their own sitter profile') THEN
    EXECUTE 'CREATE POLICY "Users can insert their own sitter profile" ON public.pet_sitter_profiles FOR INSERT WITH CHECK (auth.uid() = user_id)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pet_sitter_profiles' AND policyname = 'Users can update their own sitter profile') THEN
    EXECUTE 'CREATE POLICY "Users can update their own sitter profile" ON public.pet_sitter_profiles FOR UPDATE USING (auth.uid() = user_id)';
  END IF;

  -- RLS policies for pet shelter profiles
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pet_shelter_profiles' AND policyname = 'Anyone can view pet shelter profiles') THEN
    EXECUTE 'CREATE POLICY "Anyone can view pet shelter profiles" ON public.pet_shelter_profiles FOR SELECT USING (true)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pet_shelter_profiles' AND policyname = 'Users can insert their own shelter profile') THEN
    EXECUTE 'CREATE POLICY "Users can insert their own shelter profile" ON public.pet_shelter_profiles FOR INSERT WITH CHECK (auth.uid() = user_id)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pet_shelter_profiles' AND policyname = 'Users can update their own shelter profile') THEN
    EXECUTE 'CREATE POLICY "Users can update their own shelter profile" ON public.pet_shelter_profiles FOR UPDATE USING (auth.uid() = user_id)';
  END IF;

  -- RLS policies for notifications
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can view their own notifications') THEN
    EXECUTE 'CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can update their own notifications') THEN
    EXECUTE 'CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id)';
  END IF;

  -- RLS policies for reviews
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Anyone can view reviews') THEN
    EXECUTE 'CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Users can create reviews') THEN
    EXECUTE 'CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Users can update their own reviews') THEN
    EXECUTE 'CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = reviewer_id)';
  END IF;
END $$;