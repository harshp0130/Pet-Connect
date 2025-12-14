
import { useState } from 'react';
import { PetEditDialog } from "@/components/PetEditDialog";
import { PetOwnerHeader } from "@/components/PetOwner/PetOwnerHeader";
import { NavigationMenu } from "@/components/PetOwner/NavigationMenu";
import { StatsCards } from "@/components/PetOwner/StatsCards";
import { PetsGrid } from "@/components/PetOwner/PetsGrid";
import { QuickActions } from "@/components/PetOwner/QuickActions";
import { PetHealthRecords } from "@/components/PetOwner/PetHealthRecords";
import { usePets } from "@/hooks/usePets";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const PetOwner = () => {
  const { pets, loading, fetchPets, handlePetDeleted } = usePets();
  const { user, signOut } = useAuth();
  const [editingPet, setEditingPet] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    signOut();
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
        {/* Header with Logout */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Pet Owner Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.user_metadata?.full_name || user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/profile-setup?edit=true">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
        
        <PetOwnerHeader />
        
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                data-tab="health"
                onClick={() => setActiveTab('health')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'health'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Health Records
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'overview' ? (
          <>
            <NavigationMenu />
            <StatsCards pets={pets} />
            
            <PetsGrid 
              pets={pets}
              onDelete={handlePetDeleted}
              onEdit={(pet) => {
                setEditingPet(pet);
                setIsEditDialogOpen(true);
              }}
            />

            <QuickActions showActions={pets.length > 0} />
          </>
        ) : (
          <PetHealthRecords />
        )}

        <PetEditDialog
          pet={editingPet}
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setEditingPet(null);
          }}
          onUpdate={() => {
            fetchPets();
            setIsEditDialogOpen(false);
            setEditingPet(null);
          }}
        />
      </div>
    </div>
  );
};

export default PetOwner;
