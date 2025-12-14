
export interface User {
  id: string;
  email: string;
  full_name: string;
  user_type: string;
  created_at: string;
  is_verified: boolean;
}

export interface Pet {
  id: string;
  name: string;
  type: string;
  breed?: string;
  size: string;
  verification_status: string;
  owner: {
    full_name: string;
    email: string;
  };
  pet_images: string[];
  vaccination_documents: string[] | null;
  created_at: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  is_super_admin: boolean;
  permissions?: {
    manage_users: boolean;
    manage_pets: boolean;
    manage_products: boolean;
    manage_admins: boolean;
    manage_pet_sitter_verification: boolean;
    manage_pet_shelter_verification: boolean;
  };
  created_at?: string;
}

export interface ActivityLog {
  id: string;
  admin_id: string;
  action: string;
  details: any;
  target_type: string;
  target_id: string;
  created_at: string;
  admin: {
    name: string;
    email: string;
  };
}

export interface UserLoginLog {
  id: string;
  user_id: string;
  login_time: string;
  logout_time: string | null;
  session_duration: string | null;
  is_active: boolean;
  profiles: {
    full_name: string;
    email: string;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  mrp?: number;
  discount_percentage?: number;
  discount_type?: string;
  discount_amount?: number;
  images: string[];
  category_id: string;
  stock_quantity: number;
  rating: number;
  review_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product_categories?: {
    name: string;
  };
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at: string;
}

export interface AdminStats {
  totalUsers: number;
  petOwners: number;
  petSitters: number;
  petShelters: number;
  totalPets: number;
  verifiedPets: number;
  pendingPets: number;
  activeUsers: number;
  totalAdmins: number;
  totalProducts: number;
  activeProducts: number;
}
