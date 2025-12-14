-- Remove duplicate pet sitter profiles, keeping only the most recent one
WITH ranked_profiles AS (
  SELECT id, 
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
  FROM public.pet_sitter_profiles
)
DELETE FROM public.pet_sitter_profiles 
WHERE id IN (
  SELECT id FROM ranked_profiles WHERE rn > 1
);

-- Remove duplicate pet shelter profiles if any exist
WITH ranked_shelter_profiles AS (
  SELECT id, 
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
  FROM public.pet_shelter_profiles
)
DELETE FROM public.pet_shelter_profiles 
WHERE id IN (
  SELECT id FROM ranked_shelter_profiles WHERE rn > 1
);

-- Now add unique constraints
ALTER TABLE public.pet_sitter_profiles 
ADD CONSTRAINT pet_sitter_profiles_user_id_unique UNIQUE (user_id);

ALTER TABLE public.pet_shelter_profiles 
ADD CONSTRAINT pet_shelter_profiles_user_id_unique UNIQUE (user_id);