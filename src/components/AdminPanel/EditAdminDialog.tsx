import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Admin } from "./types";

interface EditAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin: Admin | null;
  onSuccess: () => void;
}

export const EditAdminDialog = ({ open, onOpenChange, admin, onSuccess }: EditAdminDialogProps) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [permissions, setPermissions] = useState({
    manage_users: admin?.permissions?.manage_users ?? true,
    manage_pets: admin?.permissions?.manage_pets ?? true,
    manage_products: admin?.permissions?.manage_products ?? false,
    manage_admins: admin?.permissions?.manage_admins ?? false,
    manage_pet_sitter_verification: admin?.permissions?.manage_pet_sitter_verification ?? false,
    manage_pet_shelter_verification: admin?.permissions?.manage_pet_shelter_verification ?? false
  });

  const handleSubmit = async () => {
    if (!admin) return;
    
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('admins')
        .update({ permissions })
        .eq('id', admin.id);

      if (error) throw error;

      toast({
        title: "Permissions updated",
        description: `${admin.name}'s permissions have been updated successfully.`,
        className: "bg-green-50 border-green-200 text-green-800"
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error updating permissions",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!admin) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Co-Admin Permissions</DialogTitle>
          <DialogDescription>
            Update permissions for {admin.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Admin Details</Label>
            <div className="text-sm text-muted-foreground">
              <p>Name: {admin.name}</p>
              <p>Email: {admin.email}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>Permissions</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit_manage_users"
                  checked={permissions.manage_users}
                  onCheckedChange={(checked) => 
                    setPermissions({...permissions, manage_users: checked === true})
                  }
                />
                <Label htmlFor="edit_manage_users">Manage Users</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit_manage_pets"
                  checked={permissions.manage_pets}
                  onCheckedChange={(checked) => 
                    setPermissions({...permissions, manage_pets: checked === true})
                  }
                />
                <Label htmlFor="edit_manage_pets">Manage Pet Verification</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit_manage_products"
                  checked={permissions.manage_products}
                  onCheckedChange={(checked) => 
                    setPermissions({...permissions, manage_products: checked === true})
                  }
                />
                <Label htmlFor="edit_manage_products">Manage Products</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit_manage_pet_sitter_verification"
                  checked={permissions.manage_pet_sitter_verification}
                  onCheckedChange={(checked) => 
                    setPermissions({...permissions, manage_pet_sitter_verification: checked === true})
                  }
                />
                <Label htmlFor="edit_manage_pet_sitter_verification">Pet Sitter Verification</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit_manage_pet_shelter_verification"
                  checked={permissions.manage_pet_shelter_verification}
                  onCheckedChange={(checked) => 
                    setPermissions({...permissions, manage_pet_shelter_verification: checked === true})
                  }
                />
                <Label htmlFor="edit_manage_pet_shelter_verification">Pet Shelter Verification</Label>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSubmit} disabled={submitting} className="flex-1">
              {submitting ? 'Updating...' : 'Update Permissions'}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};