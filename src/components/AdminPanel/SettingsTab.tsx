
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Admin, AdminStats, ActivityLog } from "./types";

interface SettingsTabProps {
  admin: Admin | null;
  stats: AdminStats;
  activityLogs: ActivityLog[];
  onExportLogs: () => void;
}

export const SettingsTab = ({ admin, stats, activityLogs, onExportLogs }: SettingsTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Settings</CardTitle>
          <CardDescription>Manage admin panel configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Admin Account</h4>
                <p className="text-sm text-muted-foreground">
                  Logged in as {admin?.name} ({admin?.email})
                </p>
              </div>
              <Badge variant={admin?.is_super_admin ? 'default' : 'secondary'}>
                {admin?.is_super_admin ? 'Super Admin' : 'Co-Admin'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">System Status</h4>
                <p className="text-sm text-muted-foreground">All systems operational</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Online</Badge>
            </div>

            {admin?.is_super_admin && (
              <>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Database Status</h4>
                    <p className="text-sm text-muted-foreground">
                      {stats.totalUsers} users, {stats.totalPets} pets, {stats.totalAdmins} admins
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Connected</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Activity Logs</h4>
                    <p className="text-sm text-muted-foreground">
                      {activityLogs.length} recent admin activities recorded
                    </p>
                  </div>
                  <Button onClick={onExportLogs} size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Logs
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
