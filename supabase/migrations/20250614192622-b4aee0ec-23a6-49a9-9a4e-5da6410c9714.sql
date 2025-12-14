-- Create user types enum
CREATE TYPE user_type AS ENUM ('pet_owner', 'pet_sitter', 'pet_shelter');

-- Create status enums
CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'rejected', 'completed');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');
CREATE TYPE blog_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');

-- Update profiles table to include user type
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_type user_type;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pincode text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;

-- Create pet sitter profiles table
CREATE TABLE public.pet_sitter_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  experience_years integer,
  pet_preferences text[],
  availability_schedule jsonb,
  hourly_rate decimal(10,2),
  about_me text,
  profile_image_url text,
  introduction_video_url text,
  rating decimal(3,2) DEFAULT 0,
  review_count integer DEFAULT 0,
  is_available boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create pet shelter profiles table
CREATE TABLE public.pet_shelter_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  shelter_name text NOT NULL,
  capacity integer,
  license_number text,
  about_shelter text,
  profile_image_url text,
  introduction_video_url text,
  rating decimal(3,2) DEFAULT 0,
  review_count integer DEFAULT 0,
  is_available boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Update pets table with verification and additional fields
ALTER TABLE public.pets ADD COLUMN IF NOT EXISTS verification_status verification_status DEFAULT 'pending';
ALTER TABLE public.pets ADD COLUMN IF NOT EXISTS vaccination_documents text[];
ALTER TABLE public.pets ADD COLUMN IF NOT EXISTS pet_images text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.pets ADD COLUMN IF NOT EXISTS description text;

-- Create pet care requests table
CREATE TABLE public.pet_care_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id uuid NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sitter_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  shelter_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  special_instructions text,
  status request_status DEFAULT 'pending',
  total_amount decimal(10,2),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT check_sitter_or_shelter CHECK (
    (sitter_id IS NOT NULL AND shelter_id IS NULL) OR 
    (sitter_id IS NULL AND shelter_id IS NOT NULL)
  )
);

-- Create product categories table
CREATE TABLE public.product_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  category_id uuid REFERENCES product_categories(id) ON DELETE SET NULL,
  images text[] NOT NULL DEFAULT '{}',
  stock_quantity integer DEFAULT 0,
  rating decimal(3,2) DEFAULT 0,
  review_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  total_amount decimal(10,2) NOT NULL,
  shipping_address jsonb NOT NULL,
  contact_info jsonb NOT NULL,
  status order_status DEFAULT 'pending',
  payment_id text,
  tracking_number text,
  estimated_delivery date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create order items table
CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  pet_care_request_id uuid REFERENCES pet_care_requests(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  images text[],
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT check_review_target CHECK (
    (reviewee_id IS NOT NULL AND product_id IS NULL) OR 
    (reviewee_id IS NULL AND product_id IS NOT NULL)
  )
);

-- Create blog posts table
CREATE TABLE public.blog_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  featured_image text,
  status blog_status DEFAULT 'pending',
  category text,
  tags text[],
  is_featured boolean DEFAULT false,
  view_count integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create job postings table
CREATE TABLE public.job_postings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  experience_required text,
  salary_range text,
  job_type text,
  is_active boolean DEFAULT true,
  created_by uuid NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create job applications table
CREATE TABLE public.job_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id uuid NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
  applicant_name text NOT NULL,
  applicant_email text NOT NULL,
  resume_url text NOT NULL,
  cover_letter text,
  status text DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create contact inquiries table
CREATE TABLE public.contact_inquiries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  status text DEFAULT 'unresolved',
  admin_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create video updates table
CREATE TABLE public.video_updates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_care_request_id uuid NOT NULL REFERENCES pet_care_requests(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  video_url text NOT NULL,
  caption text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert some default product categories
INSERT INTO public.product_categories (name, description) VALUES
  ('Food & Treats', 'Pet food, treats, and nutrition supplements'),
  ('Toys & Entertainment', 'Toys, games, and entertainment items for pets'),
  ('Health & Care', 'Medical supplies, grooming products, and health items'),
  ('Accessories', 'Collars, leashes, beds, and other pet accessories'),
  ('Training', 'Training aids and educational materials');