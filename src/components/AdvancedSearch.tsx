import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, MapPin, Star, Clock, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatINR } from '@/lib/currency';

interface SearchFilters {
  query: string;
  location: string;
  radius: number;
  rating: number;
  priceRange: [number, number];
  availability: string;
  petTypes: string[];
  services: string[];
}

interface SearchResult {
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

interface AdvancedSearchProps {
  searchType: 'sitters' | 'shelters' | 'products';
  onResults: (results: SearchResult[]) => void;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ searchType, onResults }) => {
  const { user } = useAuth();
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    radius: 10,
    rating: 0,
    priceRange: [0, 100],
    availability: 'any',
    petTypes: [],
    services: []
  });
  
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    loadUserLocation();
  }, []);

  const loadUserLocation = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('latitude, longitude')
        .eq('id', user.id)
        .single();

      if (error) return;

      if (data?.latitude && data?.longitude) {
        setUserLocation({ lat: data.latitude, lng: data.longitude });
      }
    } catch (error) {
      console.error('Error loading user location:', error);
    }
  };

  const performSearch = async () => {
    setLoading(true);
    try {
      let query = supabase.from('pet_sitter_profiles').select(`
        *,
        user:profiles!pet_sitter_profiles_user_id_fkey(
          full_name,
          avatar_url,
          latitude,
          longitude
        )
      `);

      // Only show verified sitters
      query = query.eq('verification_status', 'verified');

      // Apply filters
      if (filters.query) {
        query = query.or(
          `about_me.ilike.%${filters.query}%,pet_preferences.cs.{${filters.query}}`
        );
      }

      if (filters.rating > 0) {
        query = query.gte('rating', filters.rating);
      }

      if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100) {
        query = query.gte('hourly_rate', filters.priceRange[0]);
        query = query.lte('hourly_rate', filters.priceRange[1]);
      }

      if (filters.availability === 'available') {
        query = query.eq('is_available', true);
      }

      if (filters.petTypes.length > 0) {
        query = query.overlaps('pet_preferences', filters.petTypes);
      }

      const { data, error } = await query;

      if (error) throw error;

      let results: SearchResult[] = (data || []).map(profile => ({
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

      // Calculate distances if user location is available
      if (userLocation) {
        results = results.map(result => {
          const rawResult = data?.find(p => p.id === result.id);
          const sitterLat = rawResult?.user?.latitude;
          const sitterLng = rawResult?.user?.longitude;
          
          if (sitterLat && sitterLng) {
            const distance = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              sitterLat,
              sitterLng
            );
            return { ...result, distance };
          }
          return result;
        });

        // Filter by radius
        results = results.filter(result => 
          !result.distance || result.distance <= filters.radius
        );

        // Sort by distance
        results.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
      }

      onResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const addPetType = (petType: string) => {
    if (!filters.petTypes.includes(petType)) {
      updateFilter('petTypes', [...filters.petTypes, petType]);
    }
  };

  const removePetType = (petType: string) => {
    updateFilter('petTypes', filters.petTypes.filter(type => type !== petType));
  };

  const petTypes = ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Reptile'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-5 w-5" />
          <span>Search {searchType === 'sitters' ? 'Pet Sitters' : 'Pet Shelters'}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div className="flex space-x-2">
          <Input
            placeholder={`Search ${searchType}...`}
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
            className="flex-1"
          />
          <Button onClick={performSearch} disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* Advanced Filters Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
        </Button>

        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t">
            {/* Location & Radius */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Input
                  placeholder="Enter location"
                  value={filters.location}
                  onChange={(e) => updateFilter('location', e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Radius: {filters.radius}km
                </label>
                <Slider
                  value={[filters.radius]}
                  onValueChange={(value) => updateFilter('radius', value[0])}
                  max={50}
                  min={1}
                  step={1}
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Minimum Rating
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant={filters.rating >= rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilter('rating', rating)}
                  >
                    <Star className="h-4 w-4" />
                    {rating}+
                  </Button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Price Range: {formatINR(filters.priceRange[0])} - {formatINR(filters.priceRange[1])}/hour
              </label>
              <div className="px-3">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
                  max={100}
                  min={0}
                  step={5}
                />
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="text-sm font-medium mb-2 block">Availability</label>
              <Select value={filters.availability} onValueChange={(value) => updateFilter('availability', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="available">Available Now</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pet Types */}
            <div>
              <label className="text-sm font-medium mb-2 block">Pet Types</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {filters.petTypes.map((type) => (
                  <Badge
                    key={type}
                    variant="default"
                    className="cursor-pointer"
                    onClick={() => removePetType(type)}
                  >
                    {type} ×
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {petTypes.filter(type => !filters.petTypes.includes(type)).map((type) => (
                  <Button
                    key={type}
                    variant="outline"
                    size="sm"
                    onClick={() => addPetType(type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateFilter('rating', 4)}
          >
            <Star className="h-4 w-4 mr-1" />
            Highly Rated
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateFilter('availability', 'available')}
          >
            <Clock className="h-4 w-4 mr-1" />
            Available Now
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateFilter('priceRange', [0, 30])}
          >
            <DollarSign className="h-4 w-4 mr-1" />
            Budget Friendly
          </Button>
          
          {userLocation && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateFilter('radius', 5)}
            >
              <MapPin className="h-4 w-4 mr-1" />
              Nearby
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};