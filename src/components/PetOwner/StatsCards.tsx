import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint, Users, Heart } from "lucide-react";

interface Pet {
  verification_status: string;
  vaccination_status: boolean;
}

interface StatsCardsProps {
  pets: Pet[];
}

export const StatsCards = ({ pets }: StatsCardsProps) => {
  const stats = {
    totalPets: pets.length,
    verifiedPets: pets.filter(pet => pet.verification_status === 'verified').length,
    vaccinatedPets: pets.filter(pet => pet.vaccination_status).length,
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <Card className="animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Pets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <PawPrint className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold">{stats.totalPets}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Verified Pets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-500" />
            <span className="text-2xl font-bold">{stats.verifiedPets}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Vaccinated</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            <span className="text-2xl font-bold">{stats.vaccinatedPets}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};