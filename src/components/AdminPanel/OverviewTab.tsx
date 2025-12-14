import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, PawPrint, Shield, UserCheck } from "lucide-react";
import { AdminStats, Admin } from "./types";

interface OverviewTabProps {
  stats: AdminStats;
  admin: Admin | null;
}

export const OverviewTab = ({ stats, admin }: OverviewTabProps) => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{stats.totalUsers}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{stats.activeUsers}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <PawPrint className="h-5 w-5 text-orange-500" />
              <span className="text-2xl font-bold">{stats.totalPets}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              <span className="text-2xl font-bold">{stats.pendingPets}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Pet Owners</span>
              <span className="font-medium">{stats.petOwners}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Pet Sitters</span>
              <span className="font-medium">{stats.petSitters}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Pet Shelters</span>
              <span className="font-medium">{stats.petShelters}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Verified Pets</span>
              <Badge className="bg-green-100 text-green-800">{stats.verifiedPets}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Pending Pets</span>
              <Badge variant="secondary">{stats.pendingPets}</Badge>
            </div>
            {admin?.is_super_admin && (
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Admins</span>
                <span className="font-medium">{stats.totalAdmins}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};