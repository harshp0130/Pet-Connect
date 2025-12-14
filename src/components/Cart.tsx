
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingCart, Plus, Minus, X, Truck, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { formatINR } from "@/lib/currency";

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    stock_quantity: number;
  };
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onCartUpdate?: () => void;
}

export const Cart = ({ isOpen, onClose, onCartUpdate }: CartProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (user && isOpen) {
      fetchCartItems();
    }
  }, [user, isOpen]);

  const fetchCartItems = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products!inner(
            id,
            name,
            price,
            images,
            stock_quantity
          )
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      setCartItems(data || []);
      onCartUpdate?.();
    } catch (error: any) {
      console.error('Error fetching cart items:', error);
      toast({
        title: "Error",
        description: "Failed to load cart items.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (!user) return;

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    // Find the item to check stock
    const item = cartItems.find(item => item.product_id === productId);
    if (item && newQuantity > item.product.stock_quantity) {
      toast({
        title: "Stock Limit",
        description: `Only ${item.product.stock_quantity} items available in stock.`,
        variant: "destructive"
      });
      return;
    }

    setUpdating(productId);
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('user_id', user.id)
        .eq('product_id', productId);
      
      if (error) throw error;
      
      await fetchCartItems();

      toast({
        title: "Cart Updated",
        description: "Item quantity has been updated.",
        className: "bg-green-50 border-green-200 text-green-800"
      });
    } catch (error: any) {
      console.error('Error updating cart:', error);
      toast({
        title: "Error",
        description: "Failed to update cart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUpdating(null);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;

    setUpdating(productId);
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
      
      if (error) throw error;
      
      await fetchCartItems();

      toast({
        title: "Removed from Cart",
        description: "Item has been removed from your cart.",
        className: "bg-blue-50 border-blue-200 text-blue-800"
      });
    } catch (error: any) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUpdating(null);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0
    );
  };

  const calculateItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}>
      <div 
        className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="h-full rounded-none border-0 flex flex-col">
          <CardHeader className="border-b flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Shopping Cart ({calculateItemCount()})
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-auto p-0">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading cart...</span>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-4">
                  Add some products to get started!
                </p>
                <Button onClick={onClose} asChild>
                  <Link to="/products">
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                    <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      {item.product.images?.length > 0 ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                          <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium line-clamp-2 text-sm">
                        {item.product.name}
                      </h4>
                       <p className="text-sm text-primary font-semibold">
                         {formatINR(item.product.price)}
                       </p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            disabled={updating === item.product_id}
                          >
                            {updating === item.product_id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Minus className="h-3 w-3" />
                            )}
                          </Button>
                          
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            disabled={updating === item.product_id || item.quantity >= item.product.stock_quantity}
                          >
                            {updating === item.product_id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Plus className="h-3 w-3" />
                            )}
                          </Button>
                        </div>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-red-600 hover:text-red-700"
                          onClick={() => removeFromCart(item.product_id)}
                          disabled={updating === item.product_id}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>

                      {item.quantity >= item.product.stock_quantity && (
                        <Badge variant="destructive" className="text-xs mt-1">
                          Max quantity reached
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>

          {cartItems.length > 0 && (
            <div className="border-t p-4 space-y-4 flex-shrink-0">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-4 w-4" />
                Free shipping on orders over {formatINR(500)}
              </div>

              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span className="text-primary">{formatINR(calculateTotal())}</span>
              </div>

              <Button className="w-full" size="lg" asChild onClick={onClose}>
                <Link to="/checkout">
                  Proceed to Checkout
                </Link>
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
