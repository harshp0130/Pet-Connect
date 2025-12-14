import { Link } from 'react-router-dom';
import { PawPrint, Bell, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DashboardHeaderProps {
  title: string;
  userDisplayName: string;
  avatarUrl?: string;
  onSettingsClick: () => void;
  onLogoutClick: () => void;
}

export const DashboardHeader = ({
  title,
  userDisplayName,
  avatarUrl,
  onSettingsClick,
  onLogoutClick,
}: DashboardHeaderProps) => {
  return (
    <header className="border-b bg-card sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-card/95">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <PawPrint className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Pet Care</span>
          </Link>
          <Badge variant="secondary">{title}</Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onSettingsClick}>
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Settings</span>
          </Button>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>
                {userDisplayName?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden md:block">
              {userDisplayName}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={onLogoutClick}>
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};