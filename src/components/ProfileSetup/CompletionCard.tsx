import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface CompletionCardProps {
  userType: string;
}

const CompletionCard = ({ userType }: CompletionCardProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          Setup Complete!
        </CardTitle>
        <CardDescription>
          Your profile has been created successfully
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center py-8">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Welcome to PetConnect!</h3>
          <p className="text-muted-foreground">
            Your profile is now live and ready to use. Start connecting with pet lovers in your area!
          </p>
        </div>
        <Button 
          onClick={() => navigate(userType === 'pet_owner' ? '/pet-owner' : '/pet-lover')}
          className="w-full"
        >
          Get Started
        </Button>
      </CardContent>
    </Card>
  );
};

export default CompletionCard;