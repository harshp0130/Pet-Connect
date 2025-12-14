-- Add RLS policies for video_updates table
ALTER TABLE public.video_updates ENABLE ROW LEVEL SECURITY;

-- Users can view video updates for their care requests (as owner or sitter)
CREATE POLICY "Users can view video updates for their requests" 
ON public.video_updates 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.pet_care_requests pcr 
    WHERE pcr.id = video_updates.pet_care_request_id 
    AND (pcr.owner_id = auth.uid() OR pcr.sitter_id = auth.uid() OR pcr.shelter_id = auth.uid())
  )
);

-- Sitters/shelters can create video updates for their accepted requests
CREATE POLICY "Sitters can create video updates" 
ON public.video_updates 
FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.pet_care_requests pcr 
    WHERE pcr.id = video_updates.pet_care_request_id 
    AND (pcr.sitter_id = auth.uid() OR pcr.shelter_id = auth.uid())
    AND pcr.status = 'accepted'
  )
);

-- Add RLS policies for reviews table
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Users can view reviews they wrote or received
CREATE POLICY "Users can view their reviews" 
ON public.reviews 
FOR SELECT 
USING (reviewer_id = auth.uid() OR reviewee_id = auth.uid());

-- Users can create reviews for completed care requests
CREATE POLICY "Users can create reviews for completed requests" 
ON public.reviews 
FOR INSERT 
WITH CHECK (
  reviewer_id = auth.uid() AND
  (
    (product_id IS NOT NULL) OR
    (pet_care_request_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.pet_care_requests pcr 
      WHERE pcr.id = reviews.pet_care_request_id 
      AND pcr.owner_id = auth.uid()
      AND pcr.status = 'completed'
    ))
  )
);

-- Add notification system for real-time updates
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (user_id = auth.uid());

-- System can create notifications (handled by triggers/functions)
CREATE POLICY "System can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (user_id = auth.uid());

-- Function to create notifications
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_data JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, data)
  VALUES (p_user_id, p_type, p_title, p_message, p_data)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Function to notify when video update is posted
CREATE OR REPLACE FUNCTION public.notify_video_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  owner_id UUID;
  pet_name TEXT;
BEGIN
  -- Get the owner of the pet care request
  SELECT pcr.owner_id, p.name INTO owner_id, pet_name
  FROM public.pet_care_requests pcr
  JOIN public.pets p ON p.id = pcr.pet_id
  WHERE pcr.id = NEW.pet_care_request_id;
  
  -- Create notification for the owner
  IF owner_id IS NOT NULL AND owner_id != NEW.sender_id THEN
    PERFORM public.create_notification(
      owner_id,
      'video_update',
      'New Video Update',
      'You received a new video update for ' || pet_name,
      jsonb_build_object('pet_care_request_id', NEW.pet_care_request_id, 'video_update_id', NEW.id)
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for video update notifications
CREATE TRIGGER trigger_notify_video_update
  AFTER INSERT ON public.video_updates
  FOR EACH ROW EXECUTE FUNCTION public.notify_video_update();