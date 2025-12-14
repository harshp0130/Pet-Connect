import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint, Plus } from "lucide-react";
import PetCard from "@/components/PetCard";

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

interface PetsGridProps {
  pets: Pet[];
  onDelete: (petId: string) => void;
  onEdit: (pet: Pet) => void;
}

export const PetsGrid = ({ pets, onDelete, onEdit }: PetsGridProps) => {
  if (pets.length > 0) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {pets.map((pet) => (
          <PetCard
            key={pet.id}
            pet={pet}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    );
  }

  return (
    <Card className="text-center py-12 animate-fade-in">
      <CardHeader>
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <PawPrint className="h-8 w-8 text-muted-foreground" />
        </div>
        <CardTitle>No pets registered yet</CardTitle>
        <CardDescription>
          Start by adding your first pet to your profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link to="/pet-registration">
          <Button className="flex items-center gap-2 hover-scale">
            <Plus className="h-4 w-4" />
            Register Your First Pet
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};