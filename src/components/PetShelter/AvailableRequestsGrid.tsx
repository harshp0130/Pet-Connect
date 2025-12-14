import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, DollarSign, PawPrint, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface CareRequest {
  id: string;
  owner_id: string;
  start_date: string;
  end_date: string;
  status: string;
  total_amount: number | null;
  special_instructions: string | null;
  created_at: string;
  pet: {
    id: string;
    name: string;
    type: string;
    breed: string;
    size: string;
    pet_images: string[];
  };
  owner: {
    full_name: string;
    city: string;
    phone: string;
  };
}

interface AvailableRequestsGridProps {
  shelterId?: string;
}

const AvailableRequestsGrid = ({ shelterId }: AvailableRequestsGridProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<CareRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCity, setUserCity] = useState<string>('');

  useEffect(() => {
    fetchAvailableRequests();
    fetchUserCity();
  }, [user]);

  const fetchUserCity = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('profiles')
        .select('city')
        .eq('id', user.id)
        .single();
      
      if (data?.city) {
        setUserCity(data.city);
      }
    } catch (error) {
      console.error('Error fetching user city:', error);
    }
  };

  const fetchAvailableRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('pet_care_requests')
        .select(`
          *,
          pet:pets(id, name, type, breed, size, pet_images)
        `)
        .eq('status', 'pending')
        .is('shelter_id', null)
        .is('sitter_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch owner profiles for each request
      const enrichedRequests = await Promise.all(
        (data || []).map(async (request: any) => {
          const { data: ownerData } = await supabase
            .from('profiles')
            .select('full_name, city, phone')
            .eq('id', request.owner_id)
            .single();

          return {
            ...request,
            owner: ownerData || { full_name: 'Unknown Owner', city: '', phone: '' }
          };
        })
      );

      // Sort by city priority (same city first)
      const sortedRequests = enrichedRequests.sort((a, b) => {
        const aIsSameCity = a.owner.city === userCity;
        const bIsSameCity = b.owner.city === userCity;
        
        if (aIsSameCity && !bIsSameCity) return -1;
        if (!aIsSameCity && bIsSameCity) return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setRequests(sortedRequests);
    } catch (error: any) {
      toast({
        title: "Error loading requests",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('pet_care_requests')
        .update({ 
          shelter_id: user?.id,
          status: 'accepted'
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Request Accepted",
        description: "You have successfully accepted this care request."
      });

      fetchAvailableRequests();
    } catch (error: any) {
      toast({
        title: "Error accepting request",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Available Care Requests</h2>
        <Badge variant="outline">
          {requests.length} requests available
        </Badge>
      </div>

      {requests.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <PawPrint className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Care for {request.pet.name}
                      </CardTitle>
                      <CardDescription>
                        {request.pet.type} • {request.pet.breed} • {request.pet.size}
                      </CardDescription>
                    </div>
                  </div>
                  {request.owner.city === userCity && (
                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                      Same City
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Start</p>
                      <p className="text-muted-foreground">{formatDate(request.start_date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">End</p>
                      <p className="text-muted-foreground">{formatDate(request.end_date)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Owner:</span>
                    <span>{request.owner.full_name}</span>
                  </div>
                  
                  {request.owner.city && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Location:</span>
                      <span>{request.owner.city}</span>
                    </div>
                  )}

                  {request.total_amount && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Payment:</span>
                      <span>${request.total_amount}</span>
                    </div>
                  )}
                </div>

                {request.special_instructions && (
                  <div className="text-sm">
                    <p className="font-medium mb-1">Special Instructions:</p>
                    <p className="text-muted-foreground bg-muted p-2 rounded text-xs">
                      {request.special_instructions}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-xs text-muted-foreground">
                    Posted {formatDistanceToNow(new Date(request.created_at))} ago
                  </span>
                  <Button 
                    onClick={() => acceptRequest(request.id)}
                    size="sm"
                  >
                    Accept Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardHeader>
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle>No Available Requests</CardTitle>
            <CardDescription>
              There are currently no care requests available in your area. Check back later!
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default AvailableRequestsGrid;