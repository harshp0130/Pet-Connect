import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoUpdate } from '@/components/VideoUpdate';
import { ReviewSystem } from '@/components/ReviewSystem';
import { ChatRoom } from '@/components/ChatRoom';
import { ArrowLeft, Calendar, MapPin, DollarSign, User, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface CareRequest {
  id: string;
  pet_id: string;
  owner_id: string;
  sitter_id: string | null;
  shelter_id: string | null;
  start_date: string;
  end_date: string;
  status: string;
  total_amount: number | null;
  special_instructions: string | null;
  created_at: string;
  pet: {
    name: string;
    type: string;
    breed: string;
    age: number;
    pet_images: string[];
  };
  owner: {
    full_name: string;
  };
  sitter?: {
    full_name: string;
  };
}

export default function CareRequestDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [request, setRequest] = useState<CareRequest | null>(null);
  const [videoUpdates, setVideoUpdates] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchRequestDetails();
      fetchVideoUpdates();
      fetchReviews();
    }
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('pet_care_requests')
        .select(`
          *,
          pet:pets(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Fetch owner profile
      const { data: ownerData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', data.owner_id)
        .single();

      // Fetch sitter profile if exists
      let sitterData = null;
      if (data.sitter_id) {
        const { data: sitter } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', data.sitter_id)
          .single();
        sitterData = sitter;
      }

      // Fetch shelter profile if exists
      let shelterData = null;
      if (data.shelter_id) {
        const { data: shelter } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', data.shelter_id)
          .single();
        shelterData = shelter;
      }

      const enrichedRequest = {
        ...data,
        owner: ownerData || { full_name: 'Unknown Owner' },
        sitter: sitterData || null,
        shelter: shelterData || null
      };

      setRequest(enrichedRequest);
    } catch (error) {
      console.error('Error fetching request details:', error);
      toast({
        title: "Error",
        description: "Failed to load request details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVideoUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from('video_updates')
        .select(`
          *
        `)
        .eq('pet_care_request_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch sender profile for each video update
      const enrichedUpdates = await Promise.all(
        (data || []).map(async (update: any) => {
          const { data: senderData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', update.sender_id)
            .single();

          return {
            ...update,
            sender: senderData || { full_name: 'Unknown Sender' }
          };
        })
      );

      setVideoUpdates(enrichedUpdates);
    } catch (error) {
      console.error('Error fetching video updates:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *
        `)
        .eq('pet_care_request_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch reviewer profile for each review
      const enrichedReviews = await Promise.all(
        (data || []).map(async (review: any) => {
          const { data: reviewerData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', review.reviewer_id)
            .single();

          return {
            ...review,
            reviewer: reviewerData || { full_name: 'Unknown Reviewer' }
          };
        })
      );

      setReviews(enrichedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const updateRequestStatus = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('pet_care_requests')
        .update({ status: newStatus as any })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Request status changed to ${newStatus}`
      });

      fetchRequestDetails();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-64 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Request Not Found</h1>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const isOwner = user?.id === request.owner_id;
  const isSitter = user?.id === request.sitter_id;
  const isCaregiver = isSitter || user?.id === request.shelter_id;
  const canPostUpdates = isCaregiver && request.status === 'accepted';
  const canReview = isOwner && request.status === 'completed';

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      accepted: "default",
      completed: "secondary",
      cancelled: "destructive"
    };
    const variant = variants[status] || "outline";
    return <Badge variant={variant}>{status}</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        
        {getStatusBadge(request.status)}
      </div>

      {/* Request Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5" />
            <span>Care for {request.pet.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Owner: {request.owner.full_name}</span>
              </div>
              
              {request.sitter && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Sitter: {request.sitter.full_name}</span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                </span>
              </div>

              {request.total_amount && (
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>${request.total_amount}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Pet Details</h4>
                <p>{request.pet.type} • {request.pet.breed} • {request.pet.age} years old</p>
              </div>

              {request.special_instructions && (
                <div>
                  <h4 className="font-medium mb-2">Special Instructions</h4>
                  <p className="text-sm text-muted-foreground">{request.special_instructions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {isCaregiver && request.status === 'pending' && (
            <div className="flex space-x-2 pt-4">
              <Button onClick={() => updateRequestStatus('accepted')}>
                Accept Request
              </Button>
              <Button variant="outline" onClick={() => updateRequestStatus('cancelled')}>
                Decline
              </Button>
            </div>
          )}

          {isCaregiver && request.status === 'accepted' && (
            <div className="pt-4">
              <Button onClick={() => updateRequestStatus('completed')}>
                Mark as Completed
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs for Updates and Reviews */}
      <Tabs defaultValue="updates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="updates">Video Updates</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="updates">
          <VideoUpdate
            petCareRequestId={request.id}
            updates={videoUpdates}
            canPost={canPostUpdates}
            onUpdate={fetchVideoUpdates}
          />
        </TabsContent>

        <TabsContent value="chat">
          <ChatRoom
            careRequestId={request.id}
            participants={[
              { user_id: request.owner_id, full_name: request.owner.full_name },
              ...(request.sitter ? [{ user_id: request.sitter_id!, full_name: request.sitter.full_name }] : []),
              ...(request.shelter_id ? [{ user_id: request.shelter_id, full_name: 'Pet Shelter' }] : [])
            ]}
          />
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewSystem
            reviews={reviews}
            canReview={canReview}
            revieweeId={request.sitter_id || request.shelter_id || undefined}
            petCareRequestId={request.id}
            onReviewSubmitted={fetchReviews}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}