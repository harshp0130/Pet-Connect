import { Progress } from "@/components/ui/progress";
import { PawPrint, Users, Home } from "lucide-react";

interface ProfileSetupHeaderProps {
  userType: string;
  step: number;
  totalSteps: number;
}

const ProfileSetupHeader = ({ userType, step, totalSteps }: ProfileSetupHeaderProps) => {
  const getUserTypeIcon = () => {
    switch (userType) {
      case 'pet_owner': return <PawPrint className="h-6 w-6 text-blue-500" />;
      case 'pet_sitter': return <Users className="h-6 w-6 text-green-500" />;
      case 'pet_shelter': return <Home className="h-6 w-6 text-purple-500" />;
      default: return <PawPrint className="h-6 w-6" />;
    }
  };

  const getUserTypeTitle = () => {
    switch (userType) {
      case 'pet_owner': return 'Pet Owner Profile';
      case 'pet_sitter': return 'Pet Sitter Profile';
      case 'pet_shelter': return 'Pet Shelter Profile';
      default: return 'Profile Setup';
    }
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="mb-8 text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        {getUserTypeIcon()}
        <h1 className="text-3xl font-bold">{getUserTypeTitle()}</h1>
      </div>
      <p className="text-muted-foreground">
        Let's complete your profile to get started on PetConnect
      </p>
      <div className="mt-6">
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground mt-2">
          Step {step} of {totalSteps}
        </p>
      </div>
    </div>
  );
};

export default ProfileSetupHeader;