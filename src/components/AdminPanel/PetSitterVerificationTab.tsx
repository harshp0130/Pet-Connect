import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, XCircle, Clock, Eye, Star, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/contexts/AdminContext";
import { formatINR } from "@/lib/currency";

interface PetSitter {
  id: string;
  user_id: string;
  about_me: string;
  experience_years: number;
  hourly_rate: number;
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

interface PetSitterVerificationTabProps {
  petSitters: PetSitter[];
  onStatusUpdate: () => void;
}

const PetSitterVerificationTab = ({ petSitters, onStatusUpdate }: PetSitterVerificationTabProps) => {
  const [selectedSitter, setSelectedSitter] = useState<PetSitter | null>(null);
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const { admin } = useAdmin();
  const { toast } = useToast();

  const handleApprove = async (sitterId: string) => {
    if (!admin?.id) return;
    
    setIsApproving(true);
    try {
      const { error } = await supabase.rpc('approve_pet_sitter', {
        p_sitter_id: sitterId,
        p_admin_id: admin.id,
        p_notes: notes || null
      });

      if (error) throw error;

      toast({
        title: "Pet Sitter Approved",
        description: "The pet sitter has been successfully verified and can now accept requests."
      });

      onStatusUpdate();
      setSelectedSitter(null);
      setNotes('');
    } catch (error) {
      console.error('Error approving pet sitter:', error);
      toast({
        title: "Error",
        description: "Failed to approve pet sitter. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async (sitterId: string) => {
    if (!admin?.id || !rejectionReason.trim()) return;
    
    setIsRejecting(true);
    try {
      const { error } = await supabase.rpc('reject_pet_sitter', {
        p_sitter_id: sitterId,
        p_admin_id: admin.id,
        p_reason: rejectionReason
      });

      if (error) throw error;

      toast({
        title: "Pet Sitter Rejected",
        description: "The pet sitter has been notified about the required changes."
      });

      onStatusUpdate();
      setSelectedSitter(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting pet sitter:', error);
      toast({
        title: "Error",
        description: "Failed to reject pet sitter. Please try again.",
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

  const pendingSitters = petSitters.filter(s => s.verification_status === 'pending');
  const verifiedSitters = petSitters.filter(s => s.verification_status === 'verified');
  const rejectedSitters = petSitters.filter(s => s.verification_status === 'rejected');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{pendingSitters.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{verifiedSitters.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{rejectedSitters.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Pet Sitter Verification Requests</h3>
        
        {petSitters.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No pet sitter verification requests found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {petSitters.map((sitter) => (
              <Card key={sitter.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {sitter.profile_image_url && (
                        <img 
                          src={sitter.profile_image_url} 
                          alt={sitter.profiles.full_name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{sitter.profiles.full_name}</h4>
                          {getStatusBadge(sitter.verification_status)}
                        </div>
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Email: {sitter.profiles.email}</p>
                          {sitter.profiles.phone && <p>Phone: {sitter.profiles.phone}</p>}
                          {sitter.profiles.city && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{sitter.profiles.city}, {sitter.profiles.state}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-4">
                            <span>Experience: {sitter.experience_years} years</span>
                            <span>Rate: {sitter.hourly_rate ? formatINR(sitter.hourly_rate) : 'Not set'}/hour</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{sitter.rating} ({sitter.review_count} reviews)</span>
                            </div>
                          </div>
                        </div>
                        
                        {sitter.about_me && (
                          <p className="text-sm mt-2 line-clamp-2">{sitter.about_me}</p>
                        )}
                        
                        <p className="text-xs text-muted-foreground mt-2">
                          Requested: {new Date(sitter.verification_requested_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedSitter(sitter)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Pet Sitter Verification - {sitter.profiles.full_name}</DialogTitle>
                            <DialogDescription>
                              Review the pet sitter's profile and approve or reject their verification request.
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedSitter && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Contact Information</h4>
                                  <div className="text-sm space-y-1">
                                    <p>Email: {selectedSitter.profiles.email}</p>
                                    {selectedSitter.profiles.phone && <p>Phone: {selectedSitter.profiles.phone}</p>}
                                    {selectedSitter.profiles.city && (
                                      <p>Location: {selectedSitter.profiles.city}, {selectedSitter.profiles.state}</p>
                                    )}
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium mb-2">Service Details</h4>
                                  <div className="text-sm space-y-1">
                                    <p>Experience: {selectedSitter.experience_years} years</p>
                                    <p>Hourly Rate: {selectedSitter.hourly_rate ? formatINR(selectedSitter.hourly_rate) : 'Not set'}</p>
                                    <div className="flex items-center gap-1">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      <span>{selectedSitter.rating} ({selectedSitter.review_count} reviews)</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {selectedSitter.about_me && (
                                <div>
                                  <h4 className="font-medium mb-2">About</h4>
                                  <p className="text-sm">{selectedSitter.about_me}</p>
                                </div>
                              )}
                              
                              {selectedSitter.verification_status === 'pending' && (
                                <div className="space-y-4 pt-4 border-t">
                                  <div>
                                    <label className="text-sm font-medium">Approval Notes (Optional)</label>
                                    <Textarea
                                      placeholder="Add any notes for the pet sitter..."
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
                                      onClick={() => handleApprove(selectedSitter.id)}
                                      disabled={isApproving}
                                      className="bg-success hover:bg-success/90 text-success-foreground"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      {isApproving ? "Approving..." : "Approve"}
                                    </Button>
                                    
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleReject(selectedSitter.id)}
                                      disabled={isRejecting || !rejectionReason.trim()}
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      {isRejecting ? "Rejecting..." : "Reject"}
                                    </Button>
                                  </div>
                                </div>
                              )}
                              
                              {selectedSitter.verification_status === 'rejected' && selectedSitter.rejection_reason && (
                                <div className="pt-4 border-t">
                                  <h4 className="font-medium mb-2 text-destructive">Rejection Reason</h4>
                                  <p className="text-sm">{selectedSitter.rejection_reason}</p>
                                </div>
                              )}
                              
                              {selectedSitter.verification_status === 'verified' && selectedSitter.verification_notes && (
                                <div className="pt-4 border-t">
                                  <h4 className="font-medium mb-2 text-success">Approval Notes</h4>
                                  <p className="text-sm">{selectedSitter.verification_notes}</p>
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

export default PetSitterVerificationTab;