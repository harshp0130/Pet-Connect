
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Banner {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  banner_type: string;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  discount_percentage: number;
  target_url: string | null;
  display_order: number;
}

export const BannerCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBanners();
  }, []);

  // Auto-advance banners every 5 seconds
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(5);
      
      if (error) throw error;
      
      setBanners(data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextBanner = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleBannerClick = (banner: Banner) => {
    if (banner.target_url) {
      if (banner.target_url.startsWith('http')) {
        window.open(banner.target_url, '_blank');
      } else {
        navigate(banner.target_url);
      }
    } else if (banner.banner_type === 'sale') {
      navigate(`/products?sale=${banner.id}`);
    } else {
      navigate('/products');
    }
  };

  const handleShopNowClick = (e: React.MouseEvent, banner: Banner) => {
    e.stopPropagation();
    handleBannerClick(banner);
  };

  if (loading || banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative w-full mb-8">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
            <div 
              className="relative h-64 md:h-80 bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-between cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={() => handleBannerClick(currentBanner)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleBannerClick(currentBanner);
                }
              }}
            >
            {currentBanner.image_url ? (
              <img
                src={currentBanner.image_url}
                alt={currentBanner.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
            )}
            
            <div className="relative z-10 flex-1 p-8 text-white">
              <div className="max-w-lg">
                <Badge variant="secondary" className="mb-2">
                  {currentBanner.banner_type === 'sale' ? 'Sale' : 'Promotion'}
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-shadow">
                  {currentBanner.title}
                </h2>
                {currentBanner.description && (
                  <p className="text-lg mb-4 text-shadow">
                    {currentBanner.description}
                  </p>
                )}
                {currentBanner.discount_percentage > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="h-5 w-5" />
                    <span className="text-xl font-semibold">
                      Up to {currentBanner.discount_percentage}% OFF
                    </span>
                  </div>
                )}
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-100"
                  onClick={(e) => handleShopNowClick(e, currentBanner)}
                >
                  Shop Now
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {banners.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
            onClick={prevBanner}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
            onClick={nextBanner}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
