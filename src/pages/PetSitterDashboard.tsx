import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Star, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Video, 
  Phone, 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Upload,
  Heart,
  LogOut,
  Settings,
  Bell,
  PawPrint,
  Camera
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface SitterProfile {
  id: string;
  user_id: string;
  hourly_rate: number;
  experience_years: number;
  about_me: string;
  pet_preferences: string[];
  availability_schedule: any;
  rating: number;
  review_count: number;
  is_available: boolean;
  profile_image_url?: string;
  introduction_video_url?: string;
  travel_to_client: boolean;
  service_radius: number;
}

interface CareRequest {
  id: string;
  start_date: string;
  end_date: string;
  status: string;
  total_amount: number;
  special_instructions?: string;
  pet: {
    name: string;
    type: string;
    breed?: string;
    pet_images: string[];
  };
  owner: {
    full_name: string;
    phone?: string;
    address?: string;
    city?: string;
  };
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer: {
    full_name: string;
    avatar_url?: string;
  };
  pet_care_request?: {
    pet: {
      name: string;
      type: string;
    };
  };
}

const PetSitterDashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<SitterProfile | null>(null);
  const [requests, setRequests] = useState<CareRequest[]>([]);
  const [availableRequests, setAvailableRequests] = useState<CareRequest[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      fetchSitterProfile();
      fetchCareRequests();
      fetchAvailableRequests();
      fetchReviews();
    }
  }, [user]);

  const fetchSitterProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('pet_sitter_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error('Error fetching sitter profile:', error);
      toast({
        title: "Error",
        description: "Failed to load your profile",
        variant: "destructive"
      });
    }
  };

  const fetchCareRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('pet_care_requests')
        .select(`
          *,
          pet:pets(*),
          owner:profiles!pet_care_requests_owner_id_fkey(*)
        `)
        .eq('sitter_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      console.error('Error fetching care requests:', error);
      toast({
        title: "Error",
        description: "Failed to load care requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('pet_care_requests')
        .select(`
          *,
          pet:pets(*),
          owner:profiles!pet_care_requests_owner_id_fkey(*)
        `)
        .eq('status', 'pending')
        .is('sitter_id', null)
        .is('shelter_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAvailableRequests(data || []);
    } catch (error: any) {
      console.error('Error fetching available requests:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:profiles!reviews_reviewer_id_fkey(*),
          pet_care_request:pet_care_requests!reviews_pet_care_request_id_fkey(
            pet:pets(*)
          )
        `)
        .eq('reviewee_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews((data || []).map(review => ({
        ...review,
        pet_care_request: review.pet_care_request
      })));
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
    }
  };

  const updateRequestStatus = async (requestId: string, status: 'pending' | 'accepted' | 'rejected' | 'completed') => {
    try {
      const { error } = await supabase
        .from('pet_care_requests')
        .update({ status })
        .eq('id', requestId);

      if (error) throw error;

      setRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, status } : req
        )
      );

      toast({
        title: "Success",
        description: `Request ${status} successfully`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive"
      });
    }
  };

  const acceptRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('pet_care_requests')
        .update({ 
          status: 'accepted',
          sitter_id: user?.id 
        })
        .eq('id', requestId);

      if (error) throw error;

      // Remove from available requests and add to my requests
      const acceptedRequest = availableRequests.find(req => req.id === requestId);
      if (acceptedRequest) {
        setAvailableRequests(prev => prev.filter(req => req.id !== requestId));
        setRequests(prev => [...prev, { ...acceptedRequest, status: 'accepted', sitter_id: user?.id }]);
      }

      toast({
        title: "Request accepted!",
        description: "You've successfully accepted the care request"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to accept request",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    totalEarnings: requests
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + (r.total_amount || 0), 0),
    activeBookings: requests.filter(r => r.status === 'accepted').length,
    completedJobs: requests.filter(r => r.status === 'completed').length,
    avgRating: profile?.rating || 0,
    totalReviews: profile?.review_count || 0
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
            <Badge variant="secondary">Pet Sitter Dashboard</Badge>
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
                <AvatarImage src={profile?.profile_image_url} />
                <AvatarFallback>
                  {user?.user_metadata?.full_name?.[0] || 'S'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden md:block">
                {user?.user_metadata?.full_name || 'Pet Sitter'}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="grid gap-6 mb-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                    <p className="text-2xl font-bold">${stats.totalEarnings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Bookings</p>
                    <p className="text-2xl font-bold">{stats.activeBookings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed Jobs</p>
                    <p className="text-2xl font-bold">{stats.completedJobs}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rating</p>
                    <p className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Reviews</p>
                    <p className="text-2xl font-bold">{stats.totalReviews}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="available">Available Requests</TabsTrigger>
            <TabsTrigger value="requests">My Requests</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Recent Requests */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Requests</CardTitle>
                  <CardDescription>Latest care requests from pet owners</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {requests.slice(0, 3).map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <PawPrint className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{request.pet.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {request.owner.full_name}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reviews</CardTitle>
                  <CardDescription>What pet owners are saying about you</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={review.reviewer.avatar_url} />
                              <AvatarFallback>
                                {review.reviewer.full_name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">
                              {review.reviewer.full_name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="available" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Care Requests</CardTitle>
                <CardDescription>Browse and accept care requests from pet owners in your area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableRequests.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <div className="text-lg mb-2">No available requests</div>
                      <p>Check back later for new care requests from pet owners</p>
                    </div>
                  ) : (
                    availableRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                              {request.pet.pet_images?.[0] ? (
                                <img
                                  src={request.pet.pet_images[0]}
                                  alt={request.pet.name}
                                  className="w-full h-full object-cover rounded-full"
                                />
                              ) : (
                                <PawPrint className="h-6 w-6 text-primary" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{request.pet.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {request.pet.type} • {request.pet.breed}
                              </p>
                              <p className="text-sm font-medium">Owner: {request.owner.full_name}</p>
                              {request.owner.city && (
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {request.owner.city}
                                </p>
                              )}
                            </div>
                          </div>
                          <Badge variant="secondary">New Request</Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Start Date</p>
                            <p className="font-medium">
                              {new Date(request.start_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">End Date</p>
                            <p className="font-medium">
                              {new Date(request.end_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Duration</p>
                            <p className="font-medium">
                              {Math.ceil(
                                (new Date(request.end_date).getTime() - 
                                 new Date(request.start_date).getTime()) / 
                                (1000 * 60 * 60 * 24)
                              )} days
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Payment</p>
                            <p className="font-medium text-green-600">
                              ${request.total_amount || 'TBD'}
                            </p>
                          </div>
                        </div>

                        {request.special_instructions && (
                          <div className="mb-4 p-3 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Special Instructions</p>
                            <p className="text-sm">{request.special_instructions}</p>
                          </div>
                        )}

                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // View details functionality could be added here
                              toast({
                                title: "Pet Details",
                                description: `${request.pet.name} is a ${request.pet.type} looking for care`
                              });
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => acceptRequest(request.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accept Request
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Care Requests</CardTitle>
                <CardDescription>Manage your accepted pet care bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            {request.pet.pet_images?.[0] ? (
                              <img
                                src={request.pet.pet_images[0]}
                                alt={request.pet.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <PawPrint className="h-6 w-6 text-primary" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">{request.pet.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {request.pet.type} • {request.pet.breed}
                            </p>
                            <p className="text-sm font-medium">{request.owner.full_name}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Start Date</p>
                          <p className="font-medium">
                            {new Date(request.start_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">End Date</p>
                          <p className="font-medium">
                            {new Date(request.end_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Amount</p>
                          <p className="font-medium">${request.total_amount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Duration</p>
                          <p className="font-medium">
                            {Math.ceil(
                              (new Date(request.end_date).getTime() - 
                               new Date(request.start_date).getTime()) / 
                              (1000 * 60 * 60 * 24)
                            )} days
                          </p>
                        </div>
                      </div>

                      {request.special_instructions && (
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground">Special Instructions</p>
                          <p className="text-sm">{request.special_instructions}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {request.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateRequestStatus(request.id, 'accepted')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateRequestStatus(request.id, 'rejected')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Decline
                            </Button>
                          </>
                        )}
                        
                        {request.status === 'accepted' && (
                          <>
                            <Button size="sm" variant="outline">
                              <Video className="h-4 w-4 mr-1" />
                              Send Update
                            </Button>
                            <Button size="sm" variant="outline">
                              <Phone className="h-4 w-4 mr-1" />
                              Video Call
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => updateRequestStatus(request.id, 'completed')}
                            >
                              Complete Care
                            </Button>
                          </>
                        )}

                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reviews & Ratings</CardTitle>
                <CardDescription>Feedback from pet owners you've helped</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={review.reviewer.avatar_url} />
                            <AvatarFallback>
                              {review.reviewer.full_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{review.reviewer.full_name}</p>
                            <p className="text-sm text-muted-foreground">
                              Pet: {review.pet_care_request?.pet?.name} ({review.pet_care_request?.pet?.type})
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Manage your pet sitter profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {profile && (
                  <>
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={profile.profile_image_url} />
                          <AvatarFallback className="text-lg">
                            {user?.user_metadata?.full_name?.[0] || 'S'}
                          </AvatarFallback>
                        </Avatar>
                        <Button size="sm" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0">
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">
                          {user?.user_metadata?.full_name}
                        </h3>
                        <p className="text-muted-foreground">Pet Sitter</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{profile.rating.toFixed(1)}</span>
                            <span className="text-muted-foreground">
                              ({profile.review_count} reviews)
                            </span>
                          </div>
                          <Badge variant={profile.is_available ? "default" : "secondary"}>
                            {profile.is_available ? "Available" : "Unavailable"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Hourly Rate</p>
                        <p className="font-medium">${profile.hourly_rate}/hour</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Experience</p>
                        <p className="font-medium">{profile.experience_years} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Service Radius</p>
                        <p className="font-medium">{profile.service_radius}km</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Pet Preferences</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.pet_preferences?.map((pref) => (
                          <Badge key={pref} variant="outline">
                            {pref}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">About Me</p>
                      <p className="text-sm">{profile.about_me}</p>
                    </div>

                    <Button onClick={() => navigate('/profile-setup?edit=true')}>
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PetSitterDashboard;