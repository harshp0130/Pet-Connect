import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PawPrint, Bell, Settings, LogOut } from "lucide-react";

// Components
import ShelterHeader from "@/components/PetShelter/ShelterHeader";
import ShelterStatsCards from "@/components/PetShelter/ShelterStatsCards";
import AvailableRequestsGrid from "@/components/PetShelter/AvailableRequestsGrid";
import AcceptedRequestsGrid from "@/components/PetShelter/AcceptedRequestsGrid";
import ShelterQuickActions from "@/components/PetShelter/ShelterQuickActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const PetShelterDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [shelterProfile, setShelterProfile] = useState<ShelterProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchShelterProfile();
  }, [user, navigate]);

  const fetchShelterProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('pet_shelter_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found, redirect to profile setup
          navigate('/profile-setup?edit=true');
          return;
        }
        throw error;
      }

      setShelterProfile(data);
    } catch (error: any) {
      toast({
        title: "Error loading shelter profile",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!shelterProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Shelter Profile Found</h1>
          <p className="text-muted-foreground mb-4">Please complete your shelter profile to continue.</p>
          <button
            onClick={() => navigate('/profile-setup?edit=true')}
            className="bg-primary text-primary-foreground px-4 py-2 rounded"
          >
            Complete Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-card/95">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <PawPrint className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Pet Care</span>
            </Link>
            <Badge variant="secondary">Pet Shelter Dashboard</Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/profile-setup?edit=true')}>
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Settings</span>
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={shelterProfile?.profile_image_url} />
                <AvatarFallback>
                  {shelterProfile?.shelter_name?.[0] || 'S'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden md:block">
                {shelterProfile?.shelter_name || 'Pet Shelter'}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate('/'); }}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Logout</span>
            </Button>
          </div>
        </div>
      </header>
      
      <ShelterHeader 
        shelterProfile={shelterProfile} 
        onProfileUpdate={fetchShelterProfile}
      />
      
      <div className="container max-w-7xl py-8">
        <ShelterStatsCards shelterProfile={shelterProfile} />
        
        <div className="mt-8">
          <Tabs defaultValue="available" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="available">Available Requests</TabsTrigger>
              <TabsTrigger value="accepted">My Accepted Requests</TabsTrigger>
              <TabsTrigger value="actions">Quick Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="available">
              <AvailableRequestsGrid shelterId={user?.id} />
            </TabsContent>

            <TabsContent value="accepted">
              <AcceptedRequestsGrid shelterId={user?.id} />
            </TabsContent>

            <TabsContent value="actions">
              <ShelterQuickActions shelterProfile={shelterProfile} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PetShelterDashboard;