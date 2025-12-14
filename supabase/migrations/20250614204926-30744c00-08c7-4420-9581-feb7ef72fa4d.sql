-- Drop the incorrect foreign key constraint that points to auth.users
ALTER TABLE public.pets DROP CONSTRAINT IF EXISTS pets_user_id_fkey;

-- Create the correct foreign key constraint that points to public.profiles
ALTER TABLE public.pets 
ADD CONSTRAINT pets_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;