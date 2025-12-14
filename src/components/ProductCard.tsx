
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { formatINR } from "@/lib/currency";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  mrp?: number;
  discount_percentage?: number;
  images: string[];
  category_name?: string;
  stock_quantity: number;
  rating: number;
  review_count: number;
  is_active: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => Promise<void>;
  onAddToWishlist: (productId: string) => Promise<void>;
}

export const ProductCard = ({ product, onAddToCart, onAddToWishlist }: ProductCardProps) => {
  const { toast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await onAddToCart(product.id);
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
        className: "bg-green-50 border-green-200 text-green-800",
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await onAddToWishlist(product.id);
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-muted-foreground'
        }`}
      />
    ));
  };

  const hasDiscount = product.mrp && product.mrp > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.mrp! - product.price) / product.mrp!) * 100)
    : 0;

  return (
    <Link to={`/products/${product.id}`}>
      <Card className="group hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full">
        <CardContent className="p-0">
          <div className="relative">
            <div className="aspect-square bg-muted overflow-hidden rounded-t-lg">
              {product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>
            
            {hasDiscount && (
              <Badge 
                variant="destructive" 
                className="absolute top-2 left-2 z-10"
              >
                {discountPercentage}% OFF
              </Badge>
            )}
            
            {product.stock_quantity === 0 && (
              <Badge 
                variant="secondary" 
                className="absolute top-2 right-2 z-10"
              >
                Out of Stock
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 z-10 h-8 w-8 p-0 bg-white/80 hover:bg-white"
              onClick={handleAddToWishlist}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-4 space-y-3">
            {product.category_name && (
              <Badge variant="outline" className="text-xs">
                {product.category_name}
              </Badge>
            )}
            
            <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-1">
              <div className="flex">
                {renderStars(product.rating)}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.review_count})
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">
                  {formatINR(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatINR(product.mrp!)}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <p className="text-xs text-green-600 font-medium">
                  You save {formatINR(product.mrp! - product.price)}
                </p>
              )}
            </div>

            <Button
              className="w-full gap-2"
              size="sm"
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
            >
              <ShoppingCart className="h-4 w-4" />
              {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
