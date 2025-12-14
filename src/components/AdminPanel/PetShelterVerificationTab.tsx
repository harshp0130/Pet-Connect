import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, XCircle, Clock, Eye, Star, MapPin, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/contexts/AdminContext";

interface PetShelter {
  id: string;
  user_id: string;
  shelter_name: string;
  about_shelter: string;
  capacity: number;
  license_number?: string;
  rating: number;
  review_count: number;
  verification_status: 'pending' | 'verified' | 'rejected';
  verification_requested_at: string;
  verified_at?: string;
  verification_notes?: string;
  rejection_reason?: string;
  profile_image_url?: string;
  profiles: {
    full_name: string;
    email: string;
    phone?: string;
    city?: string;
    state?: string;
  };
}

interface PetShelterVerificationTabProps {
  petShelters: PetShelter[];
  onStatusUpdate: () => void;
}

const PetShelterVerificationTab = ({ petShelters, onStatusUpdate }: PetShelterVerificationTabProps) => {
  const [selectedShelter, setSelectedShelter] = useState<PetShelter | null>(null);
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const { admin } = useAdmin();
  const { toast } = useToast();

  const handleApprove = async (shelterId: string) => {
    if (!admin?.id) return;
    
    setIsApproving(true);
    try {
      const { error } = await supabase.rpc('approve_pet_shelter', {
        p_shelter_id: shelterId,
        p_admin_id: admin.id,
        p_notes: notes || null
      });

      if (error) throw error;

      toast({
        title: "Pet Shelter Approved",
        description: "The pet shelter has been successfully verified and can now accept requests."
      });

      onStatusUpdate();
      setSelectedShelter(null);
      setNotes('');
    } catch (error) {
      console.error('Error approving pet shelter:', error);
      toast({
        title: "Error",
        description: "Failed to approve pet shelter. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async (shelterId: string) => {
    if (!admin?.id || !rejectionReason.trim()) return;
    
    setIsRejecting(true);
    try {
      const { error } = await supabase.rpc('reject_pet_shelter', {
        p_shelter_id: shelterId,
        p_admin_id: admin.id,
        p_reason: rejectionReason
      });

      if (error) throw error;

      toast({
        title: "Pet Shelter Rejected",
        description: "The pet shelter has been notified about the required changes."
      });

      onStatusUpdate();
      setSelectedShelter(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting pet shelter:', error);
      toast({
        title: "Error",
        description: "Failed to reject pet shelter. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRejecting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  const pendingShelters = petShelters.filter(s => s.verification_status === 'pending');
  const verifiedShelters = petShelters.filter(s => s.verification_status === 'verified');
  const rejectedShelters = petShelters.filter(s => s.verification_status === 'rejected');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{pendingShelters.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{verifiedShelters.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{rejectedShelters.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Pet Shelter Verification Requests</h3>
        
        {petShelters.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No pet shelter verification requests found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {petShelters.map((shelter) => (
              <Card key={shelter.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {shelter.profile_image_url && (
                        <img 
                          src={shelter.profile_image_url} 
                          alt={shelter.shelter_name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{shelter.shelter_name}</h4>
                          {getStatusBadge(shelter.verification_status)}
                        </div>
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Contact: {shelter.profiles.full_name}</p>
                          <p>Email: {shelter.profiles.email}</p>
                          {shelter.profiles.phone && <p>Phone: {shelter.profiles.phone}</p>}
                          {shelter.profiles.city && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{shelter.profiles.city}, {shelter.profiles.state}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              <span>Capacity: {shelter.capacity} pets</span>
                            </div>
                            {shelter.license_number && (
                              <span>License: {shelter.license_number}</span>
                            )}
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{shelter.rating} ({shelter.review_count} reviews)</span>
                            </div>
                          </div>
                        </div>
                        
                        {shelter.about_shelter && (
                          <p className="text-sm mt-2 line-clamp-2">{shelter.about_shelter}</p>
                        )}
                        
                        <p className="text-xs text-muted-foreground mt-2">
                          Requested: {new Date(shelter.verification_requested_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedShelter(shelter)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Pet Shelter Verification - {shelter.shelter_name}</DialogTitle>
                            <DialogDescription>
                              Review the pet shelter's profile and approve or reject their verification request.
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedShelter && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Contact Information</h4>
                                  <div className="text-sm space-y-1">
                                    <p>Contact Person: {selectedShelter.profiles.full_name}</p>
                                    <p>Email: {selectedShelter.profiles.email}</p>
                                    {selectedShelter.profiles.phone && <p>Phone: {selectedShelter.profiles.phone}</p>}
                                    {selectedShelter.profiles.city && (
                                      <p>Location: {selectedShelter.profiles.city}, {selectedShelter.profiles.state}</p>
                                    )}
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium mb-2">Shelter Details</h4>
                                  <div className="text-sm space-y-1">
                                    <p>Capacity: {selectedShelter.capacity} pets</p>
                                    {selectedShelter.license_number && (
                                      <p>License: {selectedShelter.license_number}</p>
                                    )}
                                    <div className="flex items-center gap-1">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      <span>{selectedShelter.rating} ({selectedShelter.review_count} reviews)</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {selectedShelter.about_shelter && (
                                <div>
                                  <h4 className="font-medium mb-2">About Shelter</h4>
                                  <p className="text-sm">{selectedShelter.about_shelter}</p>
                                </div>
                              )}
                              
                              {selectedShelter.verification_status === 'pending' && (
                                <div className="space-y-4 pt-4 border-t">
                                  <div>
                                    <label className="text-sm font-medium">Approval Notes (Optional)</label>
                                    <Textarea
                                      placeholder="Add any notes for the pet shelter..."
                                      value={notes}
                                      onChange={(e) => setNotes(e.target.value)}
                                      className="mt-1"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-medium">Rejection Reason (Required for rejection)</label>
                                    <Textarea
                                      placeholder="Explain why the application is being rejected..."
                                      value={rejectionReason}
                                      onChange={(e) => setRejectionReason(e.target.value)}
                                      className="mt-1"
                                    />
                                  </div>
                                  
                                  <div className="flex gap-3">
                                    <Button
                                      onClick={() => handleApprove(selectedShelter.id)}
                                      disabled={isApproving}
                                      className="bg-success hover:bg-success/90 text-success-foreground"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      {isApproving ? "Approving..." : "Approve"}
                                    </Button>
                                    
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleReject(selectedShelter.id)}
                                      disabled={isRejecting || !rejectionReason.trim()}
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      {isRejecting ? "Rejecting..." : "Reject"}
                                    </Button>
                                  </div>
                                </div>
                              )}
                              
                              {selectedShelter.verification_status === 'rejected' && selectedShelter.rejection_reason && (
                                <div className="pt-4 border-t">
                                  <h4 className="font-medium mb-2 text-destructive">Rejection Reason</h4>
                                  <p className="text-sm">{selectedShelter.rejection_reason}</p>
                                </div>
                              )}
                              
                              {selectedShelter.verification_status === 'verified' && selectedShelter.verification_notes && (
                                <div className="pt-4 border-t">
                                  <h4 className="font-medium mb-2 text-success">Approval Notes</h4>
                                  <p className="text-sm">{selectedShelter.verification_notes}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PetShelterVerificationTab;