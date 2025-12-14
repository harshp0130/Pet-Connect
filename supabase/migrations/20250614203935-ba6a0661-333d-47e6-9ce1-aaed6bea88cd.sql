-- First, check if there are any existing foreign keys on pets table
DO $$
DECLARE
    constraint_exists BOOLEAN;
BEGIN
    -- Check if foreign key already exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'pets_user_id_fkey' 
        AND table_name = 'pets'
    ) INTO constraint_exists;
    
    -- If it doesn't exist, create it
    IF NOT constraint_exists THEN
        ALTER TABLE public.pets 
        ADD CONSTRAINT pets_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
END $$;