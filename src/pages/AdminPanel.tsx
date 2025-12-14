
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader } from "@/components/AdminPanel/AdminHeader";
import { OverviewTab } from "@/components/AdminPanel/OverviewTab";
import { UsersTab } from "@/components/AdminPanel/UsersTab";
import { PetVerificationTab } from "@/components/AdminPanel/PetVerificationTab";
import PetSitterVerificationTab from "@/components/AdminPanel/PetSitterVerificationTab";
import PetShelterVerificationTab from "@/components/AdminPanel/PetShelterVerificationTab";
import { AllPetsTab } from "@/components/AdminPanel/AllPetsTab";
import { ProductsTab } from "@/components/AdminPanel/ProductsTab";
import { AdminsTab } from "@/components/AdminPanel/AdminsTab";
import { ActivityLogsTab } from "@/components/AdminPanel/ActivityLogsTab";
import { SettingsTab } from "@/components/AdminPanel/SettingsTab";
import { useAdminData } from "@/hooks/useAdminData";
import { NewAdminData } from "@/components/AdminPanel/CreateAdminDialog";
import { OrdersTab } from "@/components/AdminPanel/OrdersTab";
import { BannersTab } from "@/components/AdminPanel/BannersTab";

const AdminPanel = () => {
  const { signOut } = useAuth();
  const { admin: adminUser, signOut: adminSignOut } = useAdmin();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const {
    users,
    pets,
    petSitters,
    petShelters,
    products,
    categories,
    admins,
    activityLogs,
    userLoginLogs,
    orders,
    loading,
    stats,
    fetchData
  } = useAdminData(adminUser);

  const [activeTab, setActiveTab] = useState("overview");
  const [showAddAdmin, setShowAddAdmin] = useState(false);

  useEffect(() => {
    if (!adminUser) {
      navigate('/admin/auth');
      return;
    }
  }, [adminUser, navigate]);

  const handleVerifyPet = async (petId: string, status: 'verified' | 'rejected') => {
    try {
      console.log(`🔄 Starting pet verification: ${petId} -> ${status}`);
      
      const { error } = await supabase
        .from('pets')
        .update({ verification_status: status })
        .eq('id', petId);

      if (error) throw error;

      console.log(`✅ Pet ${status} successfully in database`);

      // Log the activity
      await supabase.rpc('log_admin_activity', {
        p_admin_id: adminUser?.id,
        p_action: `pet_${status}`,
        p_details: { pet_id: petId },
        p_target_type: 'pet',
        p_target_id: petId
      });

      console.log(`📝 Admin activity logged for pet ${status}`);

      toast({
        title: `Pet ${status}`,
        description: `Pet verification status updated successfully.`,
        className: status === 'verified' ? "bg-green-50 border-green-200 text-green-800" : undefined
      });

      // Immediately refresh data to ensure UI updates
      console.log('🔄 Refreshing data after pet verification...');
      await fetchData();
      console.log('✅ Data refresh completed');
      
    } catch (error: any) {
      console.error('❌ Error during pet verification:', error);
      toast({
        title: "Error updating pet",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleCreateAdmin = async (adminData: NewAdminData) => {
    if (!adminUser?.is_super_admin) {
      toast({
        title: "Access denied",
        description: "Only super admins can create co-admins.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Use the create_admin function to bypass RLS issues
      const { data, error } = await supabase.rpc('create_admin', {
        p_name: adminData.name,
        p_email: adminData.email,
        p_password: adminData.password,
        p_permissions: adminData.permissions,
        p_created_by: adminUser.id
      });

      if (error) throw error;

      toast({
        title: "Co-Admin created",
        description: `${adminData.name} has been added as a co-admin.`,
        className: "bg-green-50 border-green-200 text-green-800"
      });

      setShowAddAdmin(false);
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error creating admin",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const exportActivityLogs = () => {
    const csv = [
      ['Date', 'Admin', 'Action', 'Target Type', 'Details'],
      ...activityLogs.map(log => [
        new Date(log.created_at).toLocaleString(),
        log.admin.name,
        log.action,
        log.target_type,
        JSON.stringify(log.details)
      ])
    ].map(row => row.join(',')).join('\\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'admin_activity_logs.csv';
    a.click();
  };

  const handleSignOut = async () => {
    await adminSignOut();
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader admin={adminUser} onSignOut={handleSignOut} />

      <div className="container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <ScrollArea className="w-full">
            <TabsList className="grid w-full grid-cols-10 min-w-[1000px] lg:grid-cols-10">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="pets">Pets</TabsTrigger>
              <TabsTrigger value="all-pets">All Pets</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="banners">Banners</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="verification">Verification</TabsTrigger>
              <TabsTrigger value="admins">Admins</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </ScrollArea>

          <TabsContent value="overview" className="space-y-6">
            <OverviewTab stats={stats} admin={adminUser} />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UsersTab users={users} userLoginLogs={userLoginLogs} />
          </TabsContent>

          <TabsContent value="pets" className="space-y-6">
            <PetVerificationTab pets={pets} onVerifyPet={handleVerifyPet} />
          </TabsContent>

          <TabsContent value="all-pets" className="space-y-6">
            <AllPetsTab pets={pets} onPetUpdate={fetchData} />
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <ProductsTab 
              products={products}
              categories={categories}
              onProductChange={fetchData}
            />
          </TabsContent>

          <TabsContent value="banners" className="space-y-6">
            <BannersTab adminId={adminUser?.id || ''} />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <OrdersTab orders={orders} onOrderUpdate={fetchData} />
          </TabsContent>

          <TabsContent value="verification" className="space-y-6">
            <PetSitterVerificationTab petSitters={petSitters as any} onStatusUpdate={fetchData} />
            <PetShelterVerificationTab petShelters={petShelters as any} onStatusUpdate={fetchData} />
          </TabsContent>

          <TabsContent value="admins" className="space-y-6">
            <AdminsTab 
              admins={admins} 
              currentAdmin={adminUser} 
              onCreateAdmin={handleCreateAdmin}
              onAdminUpdate={fetchData}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsTab 
              admin={adminUser} 
              stats={stats}
              activityLogs={activityLogs}
              onExportLogs={exportActivityLogs}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
