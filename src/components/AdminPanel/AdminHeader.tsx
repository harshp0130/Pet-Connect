import { Button } from "@/components/ui/button";
import { Shield, LogOut } from "lucide-react";
import { Admin } from "./types";

interface AdminHeaderProps {
  admin: Admin | null;
  onSignOut: () => void;
}

export const AdminHeader = ({ admin, onSignOut }: AdminHeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">
              {admin?.is_super_admin ? 'Super Admin' : 'Co-Admin'} - PetConnect Management
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium">{admin?.name}</p>
            <p className="text-xs text-muted-foreground">
              {admin?.is_super_admin ? 'Super Admin' : 'Co-Admin'}
            </p>
          </div>
          <Button variant="ghost" onClick={onSignOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};