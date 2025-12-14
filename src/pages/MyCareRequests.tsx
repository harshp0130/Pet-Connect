import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, PawPrint, User, DollarSign, Clock } from "lucide-react";
import { Link } from 'react-router-dom';
import { useCareRequests } from "@/hooks/useCareRequests";

const MyCareRequests = () => {
  const { 
    requests, 
    loading, 
    getUserRole, 
    updateRequestStatus 
  } = useCareRequests();


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Owner':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Sitter':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Shelter':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              My Care Requests
            </h1>
            <p className="text-muted-foreground mt-2">
              Track and manage your pet care requests
            </p>
          </div>
          <Link to="/create-care-request">
            <Button className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Create New Request
            </Button>
          </Link>
        </div>

        {/* Requests Grid */}
        {requests.length > 0 ? (
          <div className="grid gap-6">
            {requests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow animate-fade-in">
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
                        <CardDescription className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <PawPrint className="h-4 w-4" />
                            {request.pet.type} • {request.pet.breed} • {request.pet.size}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                      <Badge className={getRoleBadgeColor(getUserRole(request))}>
                        {getUserRole(request)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <p className="font-medium">Start Date</p>
                        <p className="text-muted-foreground">{formatDate(request.start_date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <p className="font-medium">End Date</p>
                        <p className="text-muted-foreground">{formatDate(request.end_date)}</p>
                      </div>
                    </div>
                    {request.total_amount && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          <p className="font-medium">Total Amount</p>
                          <p className="text-muted-foreground">${request.total_amount}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <p className="font-medium">Assigned to</p>
                        <p className="text-muted-foreground">
                          {request.sitter_profile ? 
                            request.sitter_profile.profiles.full_name : 
                            request.shelter_profile ?
                            request.shelter_profile.shelter_name :
                            'Not assigned yet'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {request.special_instructions && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-1">Special Instructions:</p>
                      <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                        {request.special_instructions}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Created on {formatDate(request.created_at)}
                    </p>
                    <Link to={`/care-request/${request.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
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
              <CardTitle>No care requests yet</CardTitle>
              <CardDescription>
                Create your first care request to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/create-care-request">
                <Button className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Create Care Request
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyCareRequests;