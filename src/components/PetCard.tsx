import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  PawPrint, Edit, Trash2, Calendar, Heart, 
  Shield, AlertCircle, CheckCircle, Camera 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Pet {
  id: string;
  name: string;
  type: string;
  breed?: string;
  size: string;
  age?: number;
  description?: string;
  special_needs?: string;
  medical_conditions?: string;
  vaccination_status: boolean;
  pet_images: string[];
  verification_status: string;
  created_at: string;
}

interface PetCardProps {
  pet: Pet;
  onEdit?: (pet: Pet) => void;
  onDelete?: (petId: string) => void;
  showActions?: boolean;
}

const PetCard = ({ pet, onEdit, onDelete, showActions = true }: PetCardProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to remove ${pet.name} from your profile?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', pet.id);

      if (error) throw error;

      toast({
        title: "Pet removed",
        description: `${pet.name} has been removed from your profile.`,
      });
      
      onDelete?.(pet.id);
    } catch (error: any) {
      toast({
        title: "Error removing pet",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getVerificationIcon = () => {
    switch (pet.verification_status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getVerificationBadge = () => {
    switch (pet.verification_status) {
      case 'verified':
        return <Badge variant="default" className="bg-green-100 text-green-800">Verified</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending Review</Badge>;
      default:
        return <Badge variant="outline">Not Verified</Badge>;
    }
  };

  const getSizeBadge = () => {
    const sizeColors: Record<string, string> = {
      small: "bg-blue-100 text-blue-800",
      medium: "bg-purple-100 text-purple-800",
      large: "bg-orange-100 text-orange-800",
      extra_large: "bg-red-100 text-red-800"
    };

    return (
      <Badge className={sizeColors[pet.size] || "bg-gray-100 text-gray-800"}>
        {pet.size.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        {pet.pet_images.length > 0 ? (
          <img
            src={pet.pet_images[0]}
            alt={pet.name}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        ) : (
          <div className="w-full h-48 bg-muted flex items-center justify-center">
            <Camera className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        
        <div className="absolute top-2 right-2 flex gap-2">
          {getVerificationBadge()}
        </div>
        
        {pet.pet_images.length > 1 && (
          <div className="absolute bottom-2 right-2">
            <Badge variant="secondary" className="bg-black/50 text-white">
              +{pet.pet_images.length - 1} more
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <PawPrint className="h-5 w-5 text-primary" />
              {pet.name}
              {pet.vaccination_status && (
                <Shield className="h-4 w-4 text-green-500" />
              )}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <span className="capitalize">{pet.type}</span>
              {pet.breed && <span>• {pet.breed}</span>}
              {pet.age && (
                <span className="flex items-center gap-1">
                  • <Calendar className="h-3 w-3" /> {pet.age} years
                </span>
              )}
            </CardDescription>
          </div>
          {getVerificationIcon()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex gap-2">
          {getSizeBadge()}
          {pet.vaccination_status && (
            <Badge className="bg-green-100 text-green-800">
              <Shield className="h-3 w-3 mr-1" />
              Vaccinated
            </Badge>
          )}
        </div>

        {pet.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {pet.description}
          </p>
        )}

        {(pet.special_needs || pet.medical_conditions) && (
          <div className="space-y-2">
            {pet.special_needs && (
              <div className="flex items-start gap-2">
                <Heart className="h-4 w-4 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-orange-700">Special Needs</p>
                  <p className="text-xs text-muted-foreground">{pet.special_needs}</p>
                </div>
              </div>
            )}
            
            {pet.medical_conditions && (
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-red-700">Medical Conditions</p>
                  <p className="text-xs text-muted-foreground">{pet.medical_conditions}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(pet)}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {isDeleting ? "..." : "Remove"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PetCard;