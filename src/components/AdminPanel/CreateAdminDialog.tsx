import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus } from "lucide-react";

interface CreateAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAdmin: (adminData: NewAdminData) => void;
}

export interface NewAdminData {
  name: string;
  email: string;
  password: string;
  permissions: {
    manage_users: boolean;
    manage_pets: boolean;
    manage_products: boolean;
    manage_admins: boolean;
    manage_pet_sitter_verification: boolean;
    manage_pet_shelter_verification: boolean;
  };
}

export const CreateAdminDialog = ({ open, onOpenChange, onCreateAdmin }: CreateAdminDialogProps) => {
  const [newAdmin, setNewAdmin] = useState<NewAdminData>({
    name: '',
    email: '',
    password: '',
    permissions: {
      manage_users: true,
      manage_pets: true,
      manage_products: false,
      manage_admins: false,
      manage_pet_sitter_verification: false,
      manage_pet_shelter_verification: false
    }
  });

  const handleSubmit = () => {
    onCreateAdmin(newAdmin);
    setNewAdmin({
      name: '',
      email: '',
      password: '',
      permissions: {
        manage_users: true,
        manage_pets: true,
        manage_products: false,
        manage_admins: false,
        manage_pet_sitter_verification: false,
        manage_pet_shelter_verification: false
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Co-Admin
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Co-Admin</DialogTitle>
          <DialogDescription>
            Add a new co-administrator with specific permissions
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={newAdmin.name}
              onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
              placeholder="Enter full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={newAdmin.email}
              onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
              placeholder="Enter email address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={newAdmin.password}
              onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
              placeholder="Set password"
            />
          </div>
          <div className="space-y-3">
            <Label>Permissions</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="manage_users"
                  checked={newAdmin.permissions.manage_users}
                  onCheckedChange={(checked) => 
                    setNewAdmin({
                      ...newAdmin, 
                      permissions: {...newAdmin.permissions, manage_users: checked === true}
                    })
                  }
                />
                <Label htmlFor="manage_users">Manage Users</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="manage_pets"
                  checked={newAdmin.permissions.manage_pets}
                  onCheckedChange={(checked) => 
                    setNewAdmin({
                      ...newAdmin, 
                      permissions: {...newAdmin.permissions, manage_pets: checked === true}
                    })
                  }
                />
                <Label htmlFor="manage_pets">Manage Pet Verification</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="manage_products"
                  checked={newAdmin.permissions.manage_products}
                  onCheckedChange={(checked) => 
                    setNewAdmin({
                      ...newAdmin, 
                      permissions: {...newAdmin.permissions, manage_products: checked === true}
                    })
                  }
                />
                <Label htmlFor="manage_products">Manage Products</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="manage_pet_sitter_verification"
                  checked={newAdmin.permissions.manage_pet_sitter_verification}
                  onCheckedChange={(checked) => 
                    setNewAdmin({
                      ...newAdmin, 
                      permissions: {...newAdmin.permissions, manage_pet_sitter_verification: checked === true}
                    })
                  }
                />
                <Label htmlFor="manage_pet_sitter_verification">Pet Sitter Verification</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="manage_pet_shelter_verification"
                  checked={newAdmin.permissions.manage_pet_shelter_verification}
                  onCheckedChange={(checked) => 
                    setNewAdmin({
                      ...newAdmin, 
                      permissions: {...newAdmin.permissions, manage_pet_shelter_verification: checked === true}
                    })
                  }
                />
                <Label htmlFor="manage_pet_shelter_verification">Pet Shelter Verification</Label>
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSubmit} className="flex-1">
              Create Co-Admin
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