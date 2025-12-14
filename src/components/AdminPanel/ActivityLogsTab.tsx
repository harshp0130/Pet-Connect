import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Download, LogIn, LogOut } from "lucide-react";
import { ActivityLog, UserLoginLog } from "./types";

interface ActivityLogsTabProps {
  activityLogs: ActivityLog[];
  userLoginLogs: UserLoginLog[];
  onExportLogs: () => void;
}

export const ActivityLogsTab = ({ activityLogs, userLoginLogs, onExportLogs }: ActivityLogsTabProps) => {
  // Combine admin activities and user login/logout activities
  const allActivities = [
    // Admin activities
    ...activityLogs.map(log => ({
      ...log,
      type: 'admin' as const,
      timestamp: new Date(log.created_at).getTime()
    })),
    // User login activities
    ...userLoginLogs.map(log => ({
      ...log,
      type: 'user_login' as const,
      timestamp: new Date(log.login_time).getTime(),
      action: 'user_login',
      user: log.profiles || { full_name: 'Unknown User', email: 'unknown@example.com' }
    })),
    // User logout activities (only for completed sessions)
    ...userLoginLogs
      .filter(log => log.logout_time)
      .map(log => ({
        ...log,
        type: 'user_logout' as const,
        timestamp: new Date(log.logout_time!).getTime(),
        action: 'user_logout',
        user: log.profiles || { full_name: 'Unknown User', email: 'unknown@example.com' }
      }))
  ].sort((a, b) => b.timestamp - a.timestamp);

  const getActivityIcon = (activity: any) => {
    if (activity.type === 'admin') {
      return <Activity className="h-4 w-4" />;
    } else if (activity.type === 'user_login') {
      return <LogIn className="h-4 w-4" />;
    } else {
      return <LogOut className="h-4 w-4" />;
    }
  };

  const getActivityColor = (activity: any) => {
    if (activity.type === 'admin') {
      return 'bg-blue-100 text-blue-600';
    } else if (activity.type === 'user_login') {
      return 'bg-green-100 text-green-600';
    } else {
      return 'bg-orange-100 text-orange-600';
    }
  };

  const getActivityTitle = (activity: any) => {
    if (activity.type === 'admin') {
      return activity.action.replace('_', ' ').toUpperCase();
    } else if (activity.type === 'user_login') {
      return 'USER LOGIN';
    } else {
      return 'USER LOGOUT';
    }
  };

  const getActivityDescription = (activity: any) => {
    if (activity.type === 'admin') {
      return `by ${activity.admin.name} (${activity.admin.email})`;
    } else {
      return `${activity.user.full_name} (${activity.user.email})`;
    }
  };

  const getActivityTime = (activity: any) => {
    if (activity.type === 'admin') {
      return new Date(activity.created_at).toLocaleString();
    } else if (activity.type === 'user_login') {
      return new Date(activity.login_time).toLocaleString();
    } else {
      return new Date(activity.logout_time).toLocaleString();
    }
  };

  const getActivityBadge = (activity: any) => {
    if (activity.type === 'admin') {
      return activity.target_type;
    } else if (activity.type === 'user_login') {
      return activity.is_active ? 'Active Session' : 'Login';
    } else {
      return `Session: ${activity.session_duration || 'Unknown'}`;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Activity Logs</CardTitle>
              <CardDescription>Track all administrative actions and user login/logout activities</CardDescription>
            </div>
            <Button onClick={onExportLogs} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allActivities.map((activity, index) => (
              <div key={`${activity.type}-${activity.id}-${index}`} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getActivityColor(activity)}`}>
                    {getActivityIcon(activity)}
                  </div>
                  <div>
                    <p className="font-medium">{getActivityTitle(activity)}</p>
                    <p className="text-sm text-muted-foreground">
                      {getActivityDescription(activity)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getActivityTime(activity)}
                    </p>
                  </div>
                </div>
                <Badge variant="outline">{getActivityBadge(activity)}</Badge>
              </div>
            ))}
            {allActivities.length === 0 && (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No activity logs</h3>
                <p className="text-muted-foreground">Administrative actions and user activities will appear here.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};