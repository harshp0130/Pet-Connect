import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdvancedSearch } from '@/components/AdvancedSearch';
import { GeolocationService } from '@/components/GeolocationService';
import { Star, MapPin, DollarSign, Heart, MessageCircle, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { VerificationBadge } from '@/components/ui/verification-badge';

interface SitterProfile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  rating: number;
  review_count: number;
  hourly_rate?: number;
  about_me?: string;
  distance?: number;
  pet_preferences?: string[];
  experience_years?: number;
  is_available: boolean;
}

export default function PetSitterFinder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [searchResults, setSearchResults] = useState<SitterProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    loadFavorites();
    // Load initial results
    loadInitialSitters();
  }, []);

  const loadInitialSitters = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pet_sitter_profiles')
        .select(`
          *,
          user:profiles!pet_sitter_profiles_user_id_fkey(
            full_name,
            avatar_url,
            latitude,
            longitude
          )
        `)
        .eq('verification_status', 'verified')
        .eq('is_available', true)
        .limit(10);

      if (error) throw error;

      const results = (data || []).map(profile => ({
        id: profile.id,
        user_id: profile.user_id,
        full_name: profile.user?.full_name || '',
        avatar_url: profile.user?.avatar_url,
        rating: profile.rating || 0,
        review_count: profile.review_count || 0,
        hourly_rate: profile.hourly_rate,
        about_me: profile.about_me,
        pet_preferences: profile.pet_preferences,
        experience_years: profile.experience_years,
        is_available: profile.is_available
      }));

      setSearchResults(results);
    } catch (error) {
      console.error('Error loading initial sitters:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    if (!user) return;
    
    try {
      // For now, we'll use localStorage for favorites
      // In a real app, you'd store this in the database
      const saved = localStorage.getItem(`favorites_${user.id}`);
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = (sitterId: string) => {
    const newFavorites = favorites.includes(sitterId)
      ? favorites.filter(id => id !== sitterId)
      : [...favorites, sitterId];
    
    setFavorites(newFavorites);
    localStorage.setItem(`favorites_${user?.id}`, JSON.stringify(newFavorites));
  };

  const handleSearchResults = (results: SitterProfile[]) => {
    setSearchResults(results);
  };

  const createCareRequest = (sitterId: string) => {
    navigate('/create-care-request', { 
      state: { selectedSitterId: sitterId } 
    });
  };

  const SitterCard = ({ sitter }: { sitter: SitterProfile }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center overflow-hidden">
            {sitter.avatar_url ? (
              <img
                src={sitter.avatar_url}
                alt={sitter.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold text-muted-foreground">
                {sitter.full_name.charAt(0)}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg">{sitter.full_name}</h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  {sitter.rating > 0 && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{sitter.rating.toFixed(1)}</span>
                      <span>({sitter.review_count} reviews)</span>
                    </div>
                  )}
                  
                  {sitter.distance && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{sitter.distance.toFixed(1)}km away</span>
                    </div>
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite(sitter.id)}
                className="p-2"
              >
                <Heart
                  className={`h-4 w-4 ${
                    favorites.includes(sitter.id)
                      ? 'fill-red-500 text-red-500'
                      : 'text-muted-foreground'
                  }`}
                />
              </Button>
            </div>

            {/* About */}
            {sitter.about_me && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {sitter.about_me}
              </p>
            )}

            {/* Pet Preferences */}
            {sitter.pet_preferences && sitter.pet_preferences.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {sitter.pet_preferences.map((pet) => (
                  <Badge key={pet} variant="outline" className="text-xs">
                    {pet}
                  </Badge>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm">
                {sitter.hourly_rate && (
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>${sitter.hourly_rate}/hour</span>
                  </div>
                )}
                
                {sitter.experience_years && (
                  <span>{sitter.experience_years} years experience</span>
                )}

                <Badge
                  variant={sitter.is_available ? "default" : "secondary"}
                  className="text-xs"
                >
                  {sitter.is_available ? "Available" : "Busy"}
                </Badge>
                
                <VerificationBadge 
                  status="verified" 
                  size="sm" 
                  showText={false}
                  className="ml-2"
                />
              </div>

              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Message
                </Button>
                
                <Button
                  size="sm"
                  onClick={() => createCareRequest(sitter.id)}
                  disabled={!sitter.is_available}
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Find Pet Sitters</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <Tabs defaultValue="search" className="space-y-6">
        <TabsList>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="location">Location Settings</TabsTrigger>
          <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          <AdvancedSearch
            searchType="sitters"
            onResults={handleSearchResults}
          />

          {/* Search Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Search Results ({searchResults.length})
              </h2>
              
              {searchResults.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Showing {searchResults.length} pet sitters
                </div>
              )}
            </div>

            {loading ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-4">Loading pet sitters...</p>
                </CardContent>
              </Card>
            ) : searchResults.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-muted-foreground">
                    <p className="text-lg mb-2">No verified pet sitters found</p>
                    <p>Try adjusting your search criteria or check back later</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {searchResults.map((sitter) => (
                  <SitterCard key={sitter.id} sitter={sitter} />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="location">
          <GeolocationService
            showServiceRadius={false}
            onLocationUpdate={(location) => {
              console.log('Location updated:', location);
            }}
          />
        </TabsContent>

        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle>Your Favorite Sitters</CardTitle>
            </CardHeader>
            <CardContent>
              {favorites.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No favorites yet</p>
                  <p className="text-sm">Heart a sitter to add them to your favorites</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults
                    .filter(sitter => favorites.includes(sitter.id))
                    .map((sitter) => (
                      <SitterCard key={sitter.id} sitter={sitter} />
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}