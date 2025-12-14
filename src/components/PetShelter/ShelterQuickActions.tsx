import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, Star, Settings, Users, Calendar, Video, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ShelterProfile {
  id: string;
  user_id: string;
  shelter_name: string;
  capacity: number;
  is_available: boolean;
  rating: number;
  review_count: number;
}

interface ShelterQuickActionsProps {
  shelterProfile: ShelterProfile;
}

const ShelterQuickActions = ({ shelterProfile }: ShelterQuickActionsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(shelterProfile.is_available);
  const [updating, setUpdating] = useState(false);

  const handleAvailabilityToggle = async () => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('pet_shelter_profiles')
        .update({ is_available: !isAvailable })
        .eq('user_id', user?.id);

      if (error) throw error;

      setIsAvailable(!isAvailable);
      toast({
        title: "Availability Updated",
        description: `You are now ${!isAvailable ? 'available' : 'unavailable'} for new requests.`
      });
    } catch (error: any) {
      toast({
        title: "Error updating availability",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const quickActions = [
    {
      title: 'Edit Profile',
      description: 'Update your shelter information and settings',
      icon: Settings,
      action: () => navigate('/profile-setup?edit=true'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'View Reviews',
      description: `${shelterProfile.review_count} reviews with ${shelterProfile.rating.toFixed(1)} average`,
      icon: Star,
      action: () => {
        // Navigate to reviews or show modal
        toast({
          title: "Reviews",
          description: "Reviews feature coming soon!"
        });
      },
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'My Care Requests',
      description: 'View all your care request history',
      icon: Calendar,
      action: () => navigate('/my-care-requests'),
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pet Products Store',
      description: 'Browse and purchase pet supplies',
      icon: Shield,
      action: () => navigate('/products'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Quick Actions</h2>

      {/* Availability Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Availability Status
          </CardTitle>
          <CardDescription>
            Control whether you're accepting new care requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="availability"
              checked={isAvailable}
              onCheckedChange={handleAvailabilityToggle}
              disabled={updating}
            />
            <Label htmlFor="availability">
              {isAvailable ? 'Available for new requests' : 'Not accepting new requests'}
            </Label>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            When available, your shelter will appear in search results and you'll receive request notifications.
          </p>
        </CardContent>
      </Card>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <Card key={action.title} className="hover:shadow-md transition-shadow cursor-pointer" onClick={action.action}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full ${action.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${action.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {action.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Shelter Information Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Shelter Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="font-medium text-lg">{shelterProfile.capacity}</p>
              <p className="text-muted-foreground">Capacity</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="font-medium text-lg">{shelterProfile.rating.toFixed(1)}</p>
              <p className="text-muted-foreground">Average Rating</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="font-medium text-lg">{shelterProfile.review_count}</p>
              <p className="text-muted-foreground">Total Reviews</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShelterQuickActions;