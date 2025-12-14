-- Remove the check constraint that requires either sitter_id or shelter_id
ALTER TABLE public.pet_care_requests 
DROP CONSTRAINT IF EXISTS check_sitter_or_shelter;