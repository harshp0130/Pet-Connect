import { useState } from 'react';
import { Shield, Settings, Star, Users, Home, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ShelterProfile {
  id: string;
  user_id: string;
  shelter_name: string;
  capacity: number;
  license_number: string;
  about_shelter: string;
  profile_image_url: string;
  introduction_video_url: string;
  rating: number;
  review_count: number;
  is_available: boolean;
}

interface ShelterHeaderProps {
  shelterProfile: ShelterProfile;
  onProfileUpdate: () => void;
}

const ShelterHeader = ({ shelterProfile, onProfileUpdate }: ShelterHeaderProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="bg-card border-b">
      <div className="container max-w-7xl py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={shelterProfile.profile_image_url} />
              <AvatarFallback className="bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{shelterProfile.shelter_name}</h1>
                {shelterProfile.is_available && (
                  <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                    Available
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{shelterProfile.rating.toFixed(1)}</span>
                  <span>({shelterProfile.review_count} reviews)</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>Capacity: {shelterProfile.capacity}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  <span>License: {shelterProfile.license_number}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/profile-setup?edit=true')}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Edit Profile
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/products')}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Pet Store
            </Button>
            
            <Button
              variant="outline"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
        
        {shelterProfile.about_shelter && (
          <div className="mt-4">
            <p className="text-muted-foreground max-w-3xl">{shelterProfile.about_shelter}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShelterHeader;