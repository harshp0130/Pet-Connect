import { Link } from 'react-router-dom';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Heart, Users } from "lucide-react";

interface QuickActionsProps {
  showActions: boolean;
}

export const QuickActions = ({ showActions }: QuickActionsProps) => {
  if (!showActions) return null;

  return (
    <div className="mt-12 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/create-care-request">
          <Card className="cursor-pointer hover:shadow-md transition-shadow hover-scale">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Request Pet Care
              </CardTitle>
              <CardDescription>
                Find trusted sitters for your pets
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <div
          className="cursor-pointer hover:shadow-md transition-shadow hover-scale"
          onClick={() => {
            const healthTab = document.querySelector('[data-tab="health"]') as HTMLButtonElement;
            if (healthTab) {
              healthTab.click();
            }
          }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Pet Health Records
              </CardTitle>
              <CardDescription>
                Manage vaccination and medical records
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Link to="/my-care-requests">
          <Card className="cursor-pointer hover:shadow-md transition-shadow hover-scale">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                My Care Requests
              </CardTitle>
              <CardDescription>
                View and manage your care requests
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
};