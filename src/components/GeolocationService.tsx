import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { MapPin, Navigation, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

interface GeolocationServiceProps {
  onLocationUpdate?: (location: LocationData) => void;
  showServiceRadius?: boolean;
  currentRadius?: number;
  onRadiusChange?: (radius: number) => void;
}

export const GeolocationService: React.FC<GeolocationServiceProps> = ({
  onLocationUpdate,
  showServiceRadius = false,
  currentRadius = 10,
  onRadiusChange
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [serviceRadius, setServiceRadius] = useState(currentRadius);

  useEffect(() => {
    loadSavedLocation();
  }, []);

  useEffect(() => {
    let watchId: number | undefined;
    
    if (autoUpdate && 'geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        handleLocationSuccess,
        handleLocationError,
        { enableHighAccuracy: true, maximumAge: 300000, timeout: 5000 }
      );
    }

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [autoUpdate]);

  const loadSavedLocation = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('latitude, longitude, address')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data?.latitude && data?.longitude) {
        setLocation({
          latitude: data.latitude,
          longitude: data.longitude,
          address: data.address || undefined
        });
      }
    } catch (error) {
      console.error('Error loading saved location:', error);
    }
  };

  const getCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      handleLocationSuccess,
      handleLocationError,
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleLocationSuccess = async (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    
    try {
      // Reverse geocoding to get address
      const address = await reverseGeocode(latitude, longitude);
      
      const locationData: LocationData = {
        latitude,
        longitude,
        address
      };

      setLocation(locationData);
      await saveLocation(locationData);
      onLocationUpdate?.(locationData);

      toast({
        title: "Location updated",
        description: address || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
      });
    } catch (error) {
      console.error('Error processing location:', error);
      toast({
        title: "Error",
        description: "Failed to process location",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLocationError = (error: GeolocationPositionError) => {
    setLoading(false);
    let message = "Failed to get location";
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = "Location access denied. Please enable location permissions.";
        break;
      case error.POSITION_UNAVAILABLE:
        message = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        message = "Location request timed out.";
        break;
    }

    toast({
      title: "Location Error",
      description: message,
      variant: "destructive"
    });
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string | undefined> => {
    try {
      // Using a simple reverse geocoding service (you might want to use a more robust solution)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      
      if (response.ok) {
        const data = await response.json();
        return data.display_name || data.locality || undefined;
      }
    } catch (error) {
      console.log('Reverse geocoding failed, using coordinates');
    }
    return undefined;
  };

  const saveLocation = async (locationData: LocationData) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          address: locationData.address,
          location_updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving location:', error);
      throw error;
    }
  };

  const handleRadiusChange = (value: number[]) => {
    const newRadius = value[0];
    setServiceRadius(newRadius);
    onRadiusChange?.(newRadius);
  };

  const saveServiceRadius = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('pet_sitter_profiles')
        .update({ service_radius: serviceRadius })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Service radius updated",
        description: `Now serving within ${serviceRadius}km`
      });
    } catch (error) {
      console.error('Error saving service radius:', error);
      toast({
        title: "Error",
        description: "Failed to update service radius",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Location Services</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Location */}
        <div className="space-y-3">
          <Label>Current Location</Label>
          
          {location ? (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="font-medium">Location Found</span>
              </div>
              
              {location.address && (
                <p className="text-sm text-foreground mb-1">{location.address}</p>
              )}
              
              <p className="text-xs text-muted-foreground">
                {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </p>
            </div>
          ) : (
            <div className="p-3 border-2 border-dashed border-muted rounded-lg text-center">
              <MapPin className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No location set</p>
            </div>
          )}

          <div className="flex space-x-2">
            <Button
              onClick={getCurrentLocation}
              disabled={loading}
              className="flex-1"
            >
              <Navigation className="h-4 w-4 mr-2" />
              {loading ? 'Getting Location...' : 'Get Current Location'}
            </Button>
          </div>
        </div>

        {/* Auto-update toggle */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="auto-update">Auto-update location</Label>
            <p className="text-sm text-muted-foreground">
              Automatically update your location when it changes
            </p>
          </div>
          <Switch
            id="auto-update"
            checked={autoUpdate}
            onCheckedChange={setAutoUpdate}
          />
        </div>

        {/* Service Radius (for pet sitters) */}
        {showServiceRadius && (
          <div className="space-y-3">
            <Label>Service Radius</Label>
            <div className="px-3">
              <Slider
                value={[serviceRadius]}
                onValueChange={handleRadiusChange}
                max={50}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>1km</span>
                <span className="font-medium">{serviceRadius}km</span>
                <span>50km</span>
              </div>
            </div>
            
            <Button onClick={saveServiceRadius} size="sm" className="w-full">
              Save Service Radius
            </Button>
          </div>
        )}

        {/* Location permissions help */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-1">
            Enable Location Access
          </h4>
          <p className="text-xs text-blue-700">
            Allow location access in your browser to find nearby pet sitters and improve search results.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};