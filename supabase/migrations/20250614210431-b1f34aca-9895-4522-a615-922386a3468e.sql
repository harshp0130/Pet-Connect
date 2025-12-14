-- Drop the incorrect check constraint on profiles table
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_type_check;

-- Add the correct check constraint to match the user_type enum
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_user_type_check 
CHECK (user_type IS NULL OR user_type = ANY (ARRAY['pet_owner'::text, 'pet_sitter'::text, 'pet_shelter'::text]));