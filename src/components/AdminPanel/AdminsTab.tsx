
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield, UserPlus, Eye, Activity, User, Mail, Calendar, Settings, Edit3, Trash2 } from "lucide-react";
import { Admin, ActivityLog } from "./types";
import { CreateAdminDialog, NewAdminData } from "./CreateAdminDialog";
import { EditAdminDialog } from "./EditAdminDialog";

interface AdminsTabProps {
  admins: Admin[];
  currentAdmin: Admin | null;
  onCreateAdmin: (adminData: NewAdminData) => Promise<void>;
  onAdminUpdate: () => Promise<void>;
}

export const AdminsTab = ({ admins, currentAdmin, onCreateAdmin, onAdminUpdate }: AdminsTabProps) => {
  const { toast } = useToast();
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  
  const coAdmins = admins.filter(admin => !admin.is_super_admin);
  
  const getAdminActivityLogs = (adminId: string) => {
    // Since activityLogs are not passed as props, return empty array for now
    return [];
  };

  const handleDeleteAdmin = async (adminId: string, adminName: string) => {
    try {
      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('id', adminId);

      if (error) throw error;

      toast({
        title: "Co-Admin deleted",
        description: `${adminName} has been removed from the system.`,
        className: "bg-green-50 border-green-200 text-green-800"
      });

      onAdminUpdate();
    } catch (error: any) {
      toast({
        title: "Error deleting admin",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEditClick = (admin: Admin) => {
    setEditingAdmin(admin);
    setShowEditDialog(true);
  };

  const AdminDetailDialog = ({ admin }: { admin: Admin }) => {
    const adminLogs = getAdminActivityLogs(admin.id);
    
    return (
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Co-Admin Details: {admin.name}
          </DialogTitle>
          <DialogDescription>
            Complete information and activity logs for this co-administrator
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Admin Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{admin.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{admin.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Created: {admin.created_at ? new Date(admin.created_at).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="pt-2">
                  <Badge variant="secondary">Co-Administrator</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {admin.permissions && Object.entries(admin.permissions).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-sm capitalize">
                        {key.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Recent Activity ({adminLogs.length} actions)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {adminLogs.length > 0 ? (
                  adminLogs.slice(0, 10).map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{log.action.replace('_', ' ').toUpperCase()}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.created_at).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {log.target_type}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No activity recorded yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Co-Admin Management</CardTitle>
              <CardDescription>Create and manage co-administrator accounts</CardDescription>
            </div>
            <CreateAdminDialog
              open={showAddAdmin}
              onOpenChange={setShowAddAdmin}
              onCreateAdmin={onCreateAdmin}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {coAdmins.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      <Shield className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{admin.name}</p>
                    <p className="text-sm text-muted-foreground">{admin.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Created: {admin.created_at ? new Date(admin.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs space-y-1">
                      {admin.permissions?.manage_users && <div className="text-green-600">• Users</div>}
                      {admin.permissions?.manage_pets && <div className="text-blue-600">• Pets</div>}
                      {admin.permissions?.manage_products && <div className="text-purple-600">• Products</div>}
                      {admin.permissions?.manage_admins && <div className="text-orange-600">• Admins</div>}
                      {admin.permissions?.manage_pet_sitter_verification && <div className="text-cyan-600">• Sitter Verification</div>}
                      {admin.permissions?.manage_pet_shelter_verification && <div className="text-indigo-600">• Shelter Verification</div>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge variant="secondary">Co-Admin</Badge>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedAdmin(admin)}>
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        {selectedAdmin && <AdminDetailDialog admin={selectedAdmin} />}
                      </Dialog>
                      <Button size="sm" variant="outline" onClick={() => handleEditClick(admin)}>
                        <Edit3 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Co-Admin</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {admin.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {coAdmins.length === 0 && (
              <div className="text-center py-8">
                <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No co-admins yet</h3>
                <p className="text-muted-foreground">Create your first co-administrator account.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Admin Dialog */}
      <EditAdminDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        admin={editingAdmin}
        onSuccess={() => {
          onAdminUpdate();
          setEditingAdmin(null);
        }}
      />
    </div>
  );
};
