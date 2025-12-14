-- Create chat messages table for real-time communication
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_room_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Create chat rooms table
CREATE TABLE public.chat_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_care_request_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add participants to chat rooms
CREATE TABLE public.chat_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_room_id UUID NOT NULL,
  user_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_read_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(chat_room_id, user_id)
);

-- Enable RLS on chat tables
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;

-- Chat messages policies
CREATE POLICY "Users can view messages in their chat rooms" 
ON public.chat_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.chat_participants cp 
    WHERE cp.chat_room_id = chat_messages.chat_room_id 
    AND cp.user_id = auth.uid()
  )
);

CREATE POLICY "Users can send messages in their chat rooms" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (
  sender_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.chat_participants cp 
    WHERE cp.chat_room_id = chat_messages.chat_room_id 
    AND cp.user_id = auth.uid()
  )
);

-- Chat rooms policies
CREATE POLICY "Users can view their chat rooms" 
ON public.chat_rooms 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.chat_participants cp 
    WHERE cp.chat_room_id = chat_rooms.id 
    AND cp.user_id = auth.uid()
  )
);

-- Chat participants policies
CREATE POLICY "Users can view participants in their chat rooms" 
ON public.chat_participants 
FOR SELECT 
USING (user_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.chat_participants cp 
    WHERE cp.chat_room_id = chat_participants.chat_room_id 
    AND cp.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own participation" 
ON public.chat_participants 
FOR UPDATE 
USING (user_id = auth.uid());

-- Add geolocation fields to profiles
ALTER TABLE public.profiles ADD COLUMN latitude NUMERIC;
ALTER TABLE public.profiles ADD COLUMN longitude NUMERIC;
ALTER TABLE public.profiles ADD COLUMN location_updated_at TIMESTAMP WITH TIME ZONE;

-- Add geolocation to pet sitter profiles
ALTER TABLE public.pet_sitter_profiles ADD COLUMN service_radius INTEGER DEFAULT 10;
ALTER TABLE public.pet_sitter_profiles ADD COLUMN travel_to_client BOOLEAN DEFAULT true;

-- Add search preferences to profiles
ALTER TABLE public.profiles ADD COLUMN search_preferences JSONB DEFAULT '{}';

-- Enable realtime for chat
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.chat_participants REPLICA IDENTITY FULL;

-- Function to create chat room for care request
CREATE OR REPLACE FUNCTION public.create_chat_room_for_request(request_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  room_id UUID;
  owner_id UUID;
  sitter_id UUID;
  shelter_id UUID;
BEGIN
  -- Get request details
  SELECT pcr.owner_id, pcr.sitter_id, pcr.shelter_id
  INTO owner_id, sitter_id, shelter_id
  FROM public.pet_care_requests pcr
  WHERE pcr.id = request_id;
  
  -- Create chat room
  INSERT INTO public.chat_rooms (pet_care_request_id)
  VALUES (request_id)
  RETURNING id INTO room_id;
  
  -- Add owner as participant
  INSERT INTO public.chat_participants (chat_room_id, user_id)
  VALUES (room_id, owner_id);
  
  -- Add sitter or shelter as participant
  IF sitter_id IS NOT NULL THEN
    INSERT INTO public.chat_participants (chat_room_id, user_id)
    VALUES (room_id, sitter_id);
  ELSIF shelter_id IS NOT NULL THEN
    INSERT INTO public.chat_participants (chat_room_id, user_id)
    VALUES (room_id, shelter_id);
  END IF;
  
  RETURN room_id;
END;
$$;

-- Function to calculate distance between two points
CREATE OR REPLACE FUNCTION public.calculate_distance(
  lat1 NUMERIC, lon1 NUMERIC, 
  lat2 NUMERIC, lon2 NUMERIC
) 
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
  radius NUMERIC := 6371; -- Earth's radius in kilometers
  dlat NUMERIC;
  dlon NUMERIC;
  a NUMERIC;
  c NUMERIC;
BEGIN
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  a := sin(dlat/2) * sin(dlat/2) + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2) * sin(dlon/2);
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  RETURN radius * c;
END;
$$;

-- Trigger to update chat room timestamp on new message
CREATE OR REPLACE FUNCTION public.update_chat_room_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.chat_rooms 
  SET updated_at = now() 
  WHERE id = NEW.chat_room_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_chat_room_timestamp
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_chat_room_timestamp();