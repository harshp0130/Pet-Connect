
-- Add discount and MRP fields to products table
ALTER TABLE public.products 
ADD COLUMN mrp NUMERIC,
ADD COLUMN discount_percentage INTEGER DEFAULT 0,
ADD COLUMN discount_type TEXT DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
ADD COLUMN discount_amount NUMERIC DEFAULT 0;

-- Update existing products to have MRP same as current price
UPDATE public.products SET mrp = price WHERE mrp IS NULL;

-- Create banners table for sales management
CREATE TABLE public.banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  banner_type TEXT DEFAULT 'sale' CHECK (banner_type IN ('sale', 'promotion', 'announcement')),
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  discount_percentage INTEGER DEFAULT 0,
  target_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.admins(id)
);

-- Create banner_products junction table for sale banners
CREATE TABLE public.banner_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  banner_id UUID REFERENCES public.banners(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(banner_id, product_id)
);

-- Create function to calculate discounted price
CREATE OR REPLACE FUNCTION public.calculate_discounted_price(
  p_mrp NUMERIC,
  p_discount_type TEXT,
  p_discount_percentage INTEGER,
  p_discount_amount NUMERIC
) RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_discount_type = 'percentage' THEN
    RETURN p_mrp - (p_mrp * p_discount_percentage / 100);
  ELSIF p_discount_type = 'fixed' THEN
    RETURN GREATEST(p_mrp - p_discount_amount, 0);
  ELSE
    RETURN p_mrp;
  END IF;
END;
$$;

-- Add trigger to automatically update price when discount changes
CREATE OR REPLACE FUNCTION public.update_product_price()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.price = public.calculate_discounted_price(
    NEW.mrp,
    NEW.discount_type,
    NEW.discount_percentage,
    NEW.discount_amount
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_product_price_trigger
  BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_product_price();

-- Enable RLS on banners table
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Enable RLS on banner_products table  
ALTER TABLE public.banner_products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active banners
CREATE POLICY "Anyone can view active banners" ON public.banners
  FOR SELECT USING (is_active = true);

-- Allow public read access to banner products
CREATE POLICY "Anyone can view banner products" ON public.banner_products
  FOR SELECT USING (true);

-- Add updated_at trigger for banners
CREATE TRIGGER update_banners_updated_at
  BEFORE UPDATE ON public.banners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
