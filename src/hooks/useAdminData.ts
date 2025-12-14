
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Admin, User, Pet, Product, ProductCategory, ActivityLog, UserLoginLog, AdminStats } from "@/components/AdminPanel/types";

interface PetSitterProfile {
  id: string;
  user_id: string;
  about_me: string;
  hourly_rate: number;
  experience_years: number;
  pet_preferences: string[];
  availability_schedule: any;
  service_radius: number;
  travel_to_client: boolean;
  verification_status: string;
  verification_requested_at: string;
  verified_at: string | null;
  verified_by: string | null;
  rejection_reason: string | null;
  verification_notes: string | null;
  rating: number;
  review_count: number;
  is_available: boolean;
  profile_image_url: string | null;
  introduction_video_url: string | null;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  };
}

interface PetShelterProfile {
  id: string;
  user_id: string;
  shelter_name: string;
  about_shelter: string;
  license_number: string;
  capacity: number;
  verification_status: string;
  verification_requested_at: string;
  verified_at: string | null;
  verified_by: string | null;
  rejection_reason: string | null;
  verification_notes: string | null;
  rating: number;
  review_count: number;
  is_available: boolean;
  profile_image_url: string | null;
  introduction_video_url: string | null;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  };
}

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  shipping_address: any;
  contact_info: any;
  tracking_number?: string;
  estimated_delivery?: string;
  profiles: {
    full_name: string;
    email: string;
  };
  order_items: Array<{
    id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    product: {
      id: string;
      name: string;
      images: string[];
    };
  }>;
}

export const useAdminData = (adminUser: Admin | null) => {
  const [users, setUsers] = useState<User[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [petSitters, setPetSitters] = useState<PetSitterProfile[]>([]);
  const [petShelters, setPetShelters] = useState<PetShelterProfile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [userLoginLogs, setUserLoginLogs] = useState<UserLoginLog[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    petOwners: 0,
    petSitters: 0,
    petShelters: 0,
    totalPets: 0,
    verifiedPets: 0,
    pendingPets: 0,
    activeUsers: 0,
    totalAdmins: 0,
    totalProducts: 0,
    activeProducts: 0
  });

  const fetchData = async () => {
    if (!adminUser) return;
    
    setLoading(true);
    try {
      // Fetch users with profiles
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData || []);

      // Fetch pets
      const { data: petsData, error: petsError } = await supabase
        .from('pets')
        .select(`
          *,
          owner:profiles!pets_user_id_fkey (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (petsError) throw petsError;
      setPets(petsData || []);

      // Fetch pet sitters (only if admin has permission)
      if (adminUser.permissions?.manage_pet_sitter_verification || adminUser.is_super_admin) {
        const { data: sittersData, error: sittersError } = await supabase
          .from('pet_sitter_profiles')
          .select(`
            *,
            profiles!pet_sitter_profiles_user_id_fkey (
              full_name,
              email,
              phone,
              address,
              city,
              state
            )
          `)
          .order('verification_requested_at', { ascending: false });

        if (sittersError) throw sittersError;
        setPetSitters(sittersData || []);
      }

      // Fetch pet shelters (only if admin has permission)
      if (adminUser.permissions?.manage_pet_shelter_verification || adminUser.is_super_admin) {
        const { data: sheltersData, error: sheltersError } = await supabase
          .from('pet_shelter_profiles')
          .select(`
            *,
            profiles!pet_shelter_profiles_user_id_fkey (
              full_name,
              email,
              phone,
              address,
              city,
              state
            )
          `)
          .order('verification_requested_at', { ascending: false });

        if (sheltersError) throw sheltersError;
        setPetShelters(sheltersData || []);
      }

      // Fetch products (only if admin has permission)
      if (adminUser.permissions?.manage_products || adminUser.is_super_admin) {
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            *,
            product_categories (
              name
            )
          `)
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;
        setProducts(productsData || []);

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('product_categories')
          .select('*')
          .order('name');

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);
      }

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          profiles!orders_user_id_fkey (
            full_name,
            email
          ),
          order_items (
            *,
            product:products (
              id,
              name,
              images
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

      // Fetch admins (only for super admin)
      if (adminUser.is_super_admin) {
        const { data: adminsData, error: adminsError } = await supabase
          .from('admins')
          .select('*')
          .order('created_at', { ascending: false });

        if (adminsError) throw adminsError;
        
        // Transform permissions from Json to proper type
        const transformedAdmins = adminsData?.map(admin => ({
          ...admin,
          permissions: typeof admin.permissions === 'string' 
            ? JSON.parse(admin.permissions) 
            : admin.permissions
        })) || [];
        
        setAdmins(transformedAdmins);

        // Fetch activity logs
        const { data: logsData, error: logsError } = await supabase
          .from('admin_activity_logs')
          .select(`
            *,
            admin:admins!admin_activity_logs_admin_id_fkey (
              name,
              email
            )
          `)
          .order('created_at', { ascending: false })
          .limit(100);

        if (logsError) throw logsError;
        setActivityLogs(logsData || []);

        // Fetch user login logs
        const { data: userLogsData, error: userLogsError } = await supabase
          .from('user_login_logs')
          .select(`
            *,
            profiles!user_login_logs_user_id_fkey (
              full_name,
              email
            )
          `)
          .order('login_time', { ascending: false })
          .limit(100);

        if (userLogsError) throw userLogsError;
        
        // Transform session_duration from unknown to string
        const transformedUserLogs = userLogsData?.map(log => ({
          ...log,
          session_duration: log.session_duration ? String(log.session_duration) : null
        })) || [];
        
        setUserLoginLogs(transformedUserLogs);
      }

      // Calculate stats
      const activeUsersCount = userLoginLogs.filter(log => log.is_active).length;
      const petOwners = usersData?.filter(user => user.user_type === 'pet_owner').length || 0;
      const petSittersCount = usersData?.filter(user => user.user_type === 'pet_sitter').length || 0;
      const petSheltersCount = usersData?.filter(user => user.user_type === 'pet_shelter').length || 0;

      setStats({
        totalUsers: usersData?.length || 0,
        petOwners,
        petSitters: petSittersCount,
        petShelters: petSheltersCount,
        totalPets: petsData?.length || 0,
        verifiedPets: petsData?.filter(pet => pet.verification_status === 'verified').length || 0,
        pendingPets: petsData?.filter(pet => pet.verification_status === 'pending').length || 0,
        activeUsers: activeUsersCount,
        totalAdmins: admins.length || 0,
        totalProducts: products.length || 0,
        activeProducts: products.filter(product => product.is_active).length || 0
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [adminUser]);

  return {
    users,
    pets,
    petSitters,
    petShelters,
    products,
    categories,
    admins,
    activityLogs,
    userLoginLogs,
    orders,
    loading,
    stats,
    fetchData
  };
};
