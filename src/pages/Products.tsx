import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { Cart } from "@/components/Cart";
import { BannerCarousel } from "@/components/Banner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  mrp?: number;
  discount_percentage?: number;
  images: string[];
  category_id: string;
  category_name?: string;
  stock_quantity: number;
  rating: number;
  review_count: number;
  is_active: boolean;
}

interface FilterState {
  search: string;
  category: string;
  sortBy: string;
  priceRange: [number, number];
  inStock: boolean;
}

const Products = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    sortBy: 'featured',
    priceRange: [0, 50000], // Updated for INR
    inStock: false
  });

  useEffect(() => {
    fetchProducts();
    if (user) {
      fetchCartItemCount();
    }
  }, [user]);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  // Check for sale parameter
  useEffect(() => {
    const saleId = searchParams.get('sale');
    if (saleId) {
      fetchSaleProducts(saleId);
    }
  }, [searchParams]);

  const fetchSaleProducts = async (saleId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('banner_products')
        .select(`
          products!inner(
            *,
            product_categories!inner(name)
          )
        `)
        .eq('banner_id', saleId);
      
      if (error) throw error;
      
      const saleProducts = data?.map(item => ({
        ...item.products,
        category_name: item.products.product_categories?.name
      })) || [];
      
      setProducts(saleProducts);
    } catch (error) {
      console.error('Error fetching sale products:', error);
      toast({
        title: "Error",
        description: "Failed to load sale products. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('products')
        .select(`
          *,
          product_categories!inner(name)
        `)
        .eq('is_active', true);

      // Apply filters
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }
      
      if (filters.category !== 'all') {
        query = query.eq('category_id', filters.category);
      }
      
      if (filters.inStock) {
        query = query.gt('stock_quantity', 0);
      }
      
      if (filters.priceRange[0] > 0 || filters.priceRange[1] < 50000) {
        query = query.gte('price', filters.priceRange[0]).lte('price', filters.priceRange[1]);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'name':
          query = query.order('name', { ascending: true });
          break;
        case 'discount':
          query = query.order('discount_percentage', { ascending: false });
          break;
        default:
          query = query.order('rating', { ascending: false });
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      const productsWithCategory = data?.map(product => ({
        ...product,
        category_name: product.product_categories?.name
      })) || [];
      
      setProducts(productsWithCategory);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCartItemCount = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const totalItems = data?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartItemCount(totalItems);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your cart.",
        variant: "destructive",
        action: (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = '/auth'}
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Login
          </Button>
        )
      });
      return;
    }

    try {
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);
        
        if (error) throw error;
      } else {
        // Insert new item
        const { error } = await supabase
          .from('cart_items')
          .insert([{
            user_id: user.id,
            product_id: productId,
            quantity: 1
          }]);
        
        if (error) throw error;
      }
      
      fetchCartItemCount();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your wishlist.",
        variant: "destructive",
        action: (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = '/auth'}
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Login
          </Button>
        )
      });
      return;
    }

    try {
      const { data: existingItem } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (existingItem) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlist_items')
          .delete()
          .eq('id', existingItem.id);
        
        if (error) throw error;
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('wishlist_items')
          .insert([{
            user_id: user.id,
            product_id: productId
          }]);
        
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Pet Connect</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-6">
              <Link to="/pet-owner" className="text-sm font-medium transition-colors hover:text-primary">
                For Pet Owners
              </Link>
              <Link to="/pet-lover" className="text-sm font-medium transition-colors hover:text-primary">
                For Pet Lovers
              </Link>
              <Link to="/products" className="text-sm font-medium text-primary">
                Pet Products
              </Link>
              {user && (
                <Link to="/my-orders" className="text-sm font-medium transition-colors hover:text-primary">
                  My Orders
                </Link>
              )}
            </nav>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart ({cartItemCount})
              </Button>
              {user ? (
                <Button variant="ghost" size="sm">
                  {user.email}
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/auth">Login</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/auth">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container py-8">
        {/* Banners */}
        <BannerCarousel />

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Pet Products Store</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything your furry friends need - from premium food to fun toys and essential accessories
          </p>
        </div>

        {/* Filters */}
        <ProductFilters
          filters={filters}
          onFiltersChange={setFilters}
          totalProducts={products.length}
        />

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted h-64 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters to see more products.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cart */}
      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        onCartUpdate={fetchCartItemCount}
      />
    </div>
  );
};

export default Products;
