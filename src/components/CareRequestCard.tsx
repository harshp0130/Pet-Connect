import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, Clock, MapPin, PawPrint, User, 
  MessageSquare, CheckCircle, XCircle, Eye
} from "lucide-react";
import { format } from "date-fns";

interface Pet {
  id: string;
  name: string;
  type: string;
  breed?: string;
  size: string;
  age?: number;
  pet_images: string[];
}

interface Owner {
  id: string;
  full_name: string;
  avatar_url?: string;
  city?: string;
}

interface CareRequest {
  id: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  special_instructions?: string;
  total_amount?: number;
  created_at: string;
  pet: Pet;
  owner: Owner;
}

interface CareRequestCardProps {
  request: CareRequest;
  onAccept?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  onMessage?: (requestId: string) => void;
  onViewDetails?: (requestId: string) => void;
  showActions?: boolean;
  userType?: 'owner' | 'sitter';
}

const CareRequestCard = ({ 
  request, 
  onAccept, 
  onReject, 
  onMessage, 
  onViewDetails,
  showActions = true,
  userType = 'sitter'
}: CareRequestCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const getStatusBadge = () => {
    const statusConfig = {
      pending: { variant: "secondary" as const, text: "Pending", icon: Clock },
      accepted: { variant: "default" as const, text: "Accepted", icon: CheckCircle },
      rejected: { variant: "destructive" as const, text: "Rejected", icon: XCircle },
      completed: { variant: "default" as const, text: "Completed", icon: CheckCircle }
    };

    const config = statusConfig[request.status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const calculateDays = () => {
    const start = new Date(request.start_date);
    const end = new Date(request.end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await onAccept?.(request.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await onReject?.(request.id);
    } finally {
      setIsLoading(false);
    }
  };

  const days = calculateDays();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userType === 'sitter' ? request.owner.avatar_url : undefined} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                {userType === 'sitter' ? request.owner.full_name : 'Care Request'}
              </CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {request.owner.city || 'Location not specified'}
              </CardDescription>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Pet Information */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <PawPrint className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{request.pet.name}</h3>
            <p className="text-sm text-muted-foreground">
              {request.pet.breed || request.pet.type} • {request.pet.size} size
              {request.pet.age && ` • ${request.pet.age} years old`}
            </p>
          </div>
          {request.pet.pet_images.length > 0 && (
            <img
              src={request.pet.pet_images[0]}
              alt={request.pet.name}
              className="w-12 h-12 rounded-lg object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </div>

        {/* Date Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Start Date</p>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {format(new Date(request.start_date), "MMM dd, yyyy")}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">End Date</p>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {format(new Date(request.end_date), "MMM dd, yyyy")}
              </span>
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>Duration: {days} {days === 1 ? 'day' : 'days'}</span>
        </div>

        {/* Special Instructions */}
        {request.special_instructions && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Special Instructions</p>
            <p className="text-sm bg-muted/50 p-3 rounded-lg">
              {request.special_instructions}
            </p>
          </div>
        )}

        {/* Amount */}
        {request.total_amount && (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <span className="text-sm font-medium text-green-800">Total Amount</span>
            <span className="text-lg font-bold text-green-800">₹{request.total_amount}</span>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-4">
            {request.status === 'pending' && userType === 'sitter' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReject}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Decline
                </Button>
                <Button
                  size="sm"
                  onClick={handleAccept}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Accept
                </Button>
              </>
            )}
            
            {request.status !== 'pending' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMessage?.(request.id)}
                className="flex-1"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Message
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails?.(request.id)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-1" />
              Details
            </Button>
          </div>
        )}

        {/* Request Date */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Requested on {format(new Date(request.created_at), "MMM dd, yyyy 'at' h:mm a")}
        </div>
      </CardContent>
    </Card>
  );
};

export default CareRequestCard;