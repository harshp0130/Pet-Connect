import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import { User, UserLoginLog } from "./types";

interface UsersTabProps {
  users: User[];
  userLoginLogs: UserLoginLog[];
}

export const UsersTab = ({ users, userLoginLogs }: UsersTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Registered Users & Login History</CardTitle>
          <CardDescription>Manage platform users and track their activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => {
              const userSessions = userLoginLogs.filter(log => log.user_id === user.id);
              const lastLogin = userSessions[0];
              const isActive = userSessions.some(session => session.is_active);
              
              return (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        <Users className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.full_name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      {lastLogin && (
                        <p className="text-xs text-muted-foreground">
                          Last login: {new Date(lastLogin.login_time).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={
                      user.user_type === 'pet_owner' ? 'default' :
                      user.user_type === 'pet_sitter' ? 'secondary' : 'outline'
                    }>
                      {user.user_type?.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge variant={isActive ? 'default' : 'secondary'}>
                      {isActive ? 'Online' : 'Offline'}
                    </Badge>
                    <Badge variant={user.is_verified ? 'default' : 'secondary'}>
                      {user.is_verified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};