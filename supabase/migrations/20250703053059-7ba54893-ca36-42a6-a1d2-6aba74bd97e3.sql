
-- Create pet health records table
CREATE TABLE public.pet_health_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  record_type TEXT NOT NULL CHECK (record_type IN ('vaccination', 'checkup', 'treatment', 'medication', 'emergency')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  veterinarian TEXT NOT NULL,
  notes TEXT,
  next_due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pet_health_records ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their pets' health records" 
  ON public.pet_health_records 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.pets 
    WHERE pets.id = pet_health_records.pet_id 
    AND pets.user_id = auth.uid()
  ));

CREATE POLICY "Users can create health records for their pets" 
  ON public.pet_health_records 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.pets 
    WHERE pets.id = pet_health_records.pet_id 
    AND pets.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their pets' health records" 
  ON public.pet_health_records 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.pets 
    WHERE pets.id = pet_health_records.pet_id 
    AND pets.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their pets' health records" 
  ON public.pet_health_records 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.pets 
    WHERE pets.id = pet_health_records.pet_id 
    AND pets.user_id = auth.uid()
  ));

-- Add updated_at trigger
CREATE TRIGGER update_pet_health_records_updated_at
  BEFORE UPDATE ON public.pet_health_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Add columns to orders table for enhanced functionality
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reschedule_count INTEGER DEFAULT 0;
