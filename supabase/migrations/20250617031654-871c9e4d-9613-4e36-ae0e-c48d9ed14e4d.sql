-- Enable RLS on reviews table if not already enabled
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view product reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can create product reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews;

-- Create fresh policies for reviews
CREATE POLICY "Anyone can view product reviews" 
ON public.reviews 
FOR SELECT 
USING (product_id IS NOT NULL);

CREATE POLICY "Authenticated users can create product reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (auth.uid() = reviewer_id AND product_id IS NOT NULL);

CREATE POLICY "Users can update their own reviews" 
ON public.reviews 
FOR UPDATE 
USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete their own reviews" 
ON public.reviews 
FOR DELETE 
USING (auth.uid() = reviewer_id);

-- Function to update product rating and review count
CREATE OR REPLACE FUNCTION public.update_product_rating()
RETURNS TRIGGER AS $$
DECLARE
  avg_rating NUMERIC;
  review_count INTEGER;
  target_product_id UUID;
BEGIN
  -- Determine which product to update
  IF TG_OP = 'DELETE' THEN
    target_product_id := OLD.product_id;
  ELSE
    target_product_id := NEW.product_id;
  END IF;

  -- Only update if it's a product review
  IF target_product_id IS NOT NULL THEN
    -- Calculate new average rating and count
    SELECT 
      COALESCE(AVG(rating), 0),
      COUNT(*)
    INTO avg_rating, review_count
    FROM public.reviews 
    WHERE product_id = target_product_id;

    -- Update the product
    UPDATE public.products 
    SET 
      rating = ROUND(avg_rating, 1),
      review_count = review_count
    WHERE id = target_product_id;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic rating updates
DROP TRIGGER IF EXISTS update_product_rating_on_insert ON public.reviews;
CREATE TRIGGER update_product_rating_on_insert
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_product_rating();

DROP TRIGGER IF EXISTS update_product_rating_on_update ON public.reviews;
CREATE TRIGGER update_product_rating_on_update
  AFTER UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_product_rating();

DROP TRIGGER IF EXISTS update_product_rating_on_delete ON public.reviews;
CREATE TRIGGER update_product_rating_on_delete
  AFTER DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_product_rating();