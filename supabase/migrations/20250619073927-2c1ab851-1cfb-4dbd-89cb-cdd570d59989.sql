-- Add new permissions for pet sitter and shelter verification to admins table
UPDATE public.admins 
SET permissions = permissions || '{"manage_pet_sitter_verification": false, "manage_pet_shelter_verification": false}'::jsonb
WHERE permissions IS NOT NULL;

-- Update default permissions for new admins
ALTER TABLE public.admins 
ALTER COLUMN permissions 
SET DEFAULT '{"manage_users": true, "manage_pets": true, "manage_products": true, "manage_admins": false, "manage_pet_sitter_verification": false, "manage_pet_shelter_verification": false}'::jsonb;