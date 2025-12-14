import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { PawPrint, Plus } from "lucide-react";

export const PetOwnerHeader = () => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <PawPrint className="h-8 w-8 text-primary" />
          My Pets
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your pets and find care services
        </p>
      </div>
      <Link to="/pet-registration">
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Pet
        </Button>
      </Link>
    </div>
  );
};