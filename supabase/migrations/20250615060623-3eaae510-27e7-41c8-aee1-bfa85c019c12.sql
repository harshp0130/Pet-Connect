-- Remove the check constraint that's causing the issue
-- This constraint was requiring either sitter_id or shelter_id to be set
-- But for open requests, both should be NULL initially
ALTER TABLE public.pet_care_requests DROP CONSTRAINT IF EXISTS check_sitter_or_shelter;