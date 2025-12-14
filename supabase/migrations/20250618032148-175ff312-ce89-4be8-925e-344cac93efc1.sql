-- Add verification system for pet sitters and shelters
-- This will help build trust by ensuring only admin-approved providers can accept requests

-- Add verification fields to pet_sitter_profiles
ALTER TABLE public.pet_sitter_profiles 
ADD COLUMN verification_status verification_status DEFAULT 'pending',
ADD COLUMN verification_requested_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN verified_by UUID REFERENCES public.admins(id),
ADD COLUMN verification_notes TEXT,
ADD COLUMN rejection_reason TEXT;

-- Add verification fields to pet_shelter_profiles  
ALTER TABLE public.pet_shelter_profiles
ADD COLUMN verification_status verification_status DEFAULT 'pending',
ADD COLUMN verification_requested_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN verified_by UUID REFERENCES public.admins(id),
ADD COLUMN verification_notes TEXT,
ADD COLUMN rejection_reason TEXT;

-- Create function to approve pet sitter
CREATE OR REPLACE FUNCTION public.approve_pet_sitter(
  p_sitter_id UUID,
  p_admin_id UUID,
  p_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.pet_sitter_profiles 
  SET 
    verification_status = 'verified',
    verified_at = now(),
    verified_by = p_admin_id,
    verification_notes = p_notes,
    rejection_reason = NULL
  WHERE id = p_sitter_id;
  
  -- Log admin activity
  PERFORM public.log_admin_activity(
    p_admin_id,
    'pet_sitter_approved',
    jsonb_build_object('sitter_id', p_sitter_id, 'notes', p_notes),
    'pet_sitter',
    p_sitter_id
  );
  
  -- Create notification for the sitter
  PERFORM public.create_notification(
    (SELECT user_id FROM public.pet_sitter_profiles WHERE id = p_sitter_id),
    'verification_approved',
    'Pet Sitter Profile Approved!',
    'Congratulations! Your pet sitter profile has been verified and approved. You can now accept pet care requests.',
    jsonb_build_object('profile_type', 'pet_sitter')
  );
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to reject pet sitter
CREATE OR REPLACE FUNCTION public.reject_pet_sitter(
  p_sitter_id UUID,
  p_admin_id UUID,
  p_reason TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.pet_sitter_profiles 
  SET 
    verification_status = 'rejected',
    verified_by = p_admin_id,
    rejection_reason = p_reason,
    verification_notes = NULL
  WHERE id = p_sitter_id;
  
  -- Log admin activity
  PERFORM public.log_admin_activity(
    p_admin_id,
    'pet_sitter_rejected',
    jsonb_build_object('sitter_id', p_sitter_id, 'reason', p_reason),
    'pet_sitter',
    p_sitter_id
  );
  
  -- Create notification for the sitter
  PERFORM public.create_notification(
    (SELECT user_id FROM public.pet_sitter_profiles WHERE id = p_sitter_id),
    'verification_rejected',
    'Pet Sitter Profile Needs Review',
    'Your pet sitter profile requires some changes before approval. Please review the feedback and resubmit.',
    jsonb_build_object('profile_type', 'pet_sitter', 'reason', p_reason)
  );
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to approve pet shelter
CREATE OR REPLACE FUNCTION public.approve_pet_shelter(
  p_shelter_id UUID,
  p_admin_id UUID,
  p_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.pet_shelter_profiles 
  SET 
    verification_status = 'verified',
    verified_at = now(),
    verified_by = p_admin_id,
    verification_notes = p_notes,
    rejection_reason = NULL
  WHERE id = p_shelter_id;
  
  -- Log admin activity
  PERFORM public.log_admin_activity(
    p_admin_id,
    'pet_shelter_approved',
    jsonb_build_object('shelter_id', p_shelter_id, 'notes', p_notes),
    'pet_shelter',
    p_shelter_id
  );
  
  -- Create notification for the shelter
  PERFORM public.create_notification(
    (SELECT user_id FROM public.pet_shelter_profiles WHERE id = p_shelter_id),
    'verification_approved',
    'Pet Shelter Profile Approved!',
    'Congratulations! Your pet shelter profile has been verified and approved. You can now accept pet care requests.',
    jsonb_build_object('profile_type', 'pet_shelter')
  );
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to reject pet shelter
CREATE OR REPLACE FUNCTION public.reject_pet_shelter(
  p_shelter_id UUID,
  p_admin_id UUID,
  p_reason TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.pet_shelter_profiles 
  SET 
    verification_status = 'rejected',
    verified_by = p_admin_id,
    rejection_reason = p_reason,
    verification_notes = NULL
  WHERE id = p_shelter_id;
  
  -- Log admin activity
  PERFORM public.log_admin_activity(
    p_admin_id,
    'pet_shelter_rejected',
    jsonb_build_object('shelter_id', p_shelter_id, 'reason', p_reason),
    'pet_shelter',
    p_shelter_id
  );
  
  -- Create notification for the shelter
  PERFORM public.create_notification(
    (SELECT user_id FROM public.pet_shelter_profiles WHERE id = p_shelter_id),
    'verification_rejected',
    'Pet Shelter Profile Needs Review',
    'Your pet shelter profile requires some changes before approval. Please review the feedback and resubmit.',
    jsonb_build_object('profile_type', 'pet_shelter', 'reason', p_reason)
  );
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;