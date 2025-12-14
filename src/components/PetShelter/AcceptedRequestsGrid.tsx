import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, DollarSign, PawPrint, MessageCircle, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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

interface AcceptedRequestsGridProps {
  shelterId?: string;
}

const AcceptedRequestsGrid = ({ shelterId }: AcceptedRequestsGridProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<CareRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAcceptedRequests();
  }, [user]);

  const fetchAcceptedRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('pet_care_requests')
        .select(`
          *,
          pet:pets(id, name, type, breed, size, pet_images)
        `)
        .eq('shelter_id', user.id)
        .in('status', ['accepted', 'completed'])
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

      setRequests(enrichedRequests);
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

  const completeRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('pet_care_requests')
        .update({ status: 'completed' })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Request Completed",
        description: "Care request has been marked as completed."
      });

      fetchAcceptedRequests();
    } catch (error: any) {
      toast({
        title: "Error completing request",
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
        <h2 className="text-2xl font-bold">My Accepted Requests</h2>
        <Badge variant="outline">
          {requests.length} active requests
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
                  {getStatusBadge(request.status)}
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

                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    onClick={() => navigate(`/care-request/${request.id}`)}
                    variant="outline"
                    size="sm"
                    className="flex-1 flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat & Updates
                  </Button>
                  
                  {request.status === 'accepted' && (
                    <Button 
                      onClick={() => completeRequest(request.id)}
                      size="sm"
                      className="flex-1"
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardHeader>
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <PawPrint className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle>No Accepted Requests</CardTitle>
            <CardDescription>
              You haven't accepted any care requests yet. Check the available requests to get started!
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default AcceptedRequestsGrid;