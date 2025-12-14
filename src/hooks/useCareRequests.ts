import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CareRequest {
  id: string;
  owner_id: string;
  sitter_id: string | null;
  shelter_id: string | null;
  start_date: string;
  end_date: string;
  status: string;
  total_amount: number | null;
  special_instructions: string | null;
  created_at: string;
  pet: {
    id: string;
    name: string;
    type: string;
    breed: string | null;
    size: string;
    pet_images: string[];
  };
  owner?: {
    full_name: string;
    avatar_url: string | null;
    phone?: string;
    address?: string;
    city?: string;
  };
  sitter_profile?: {
    user_id: string;
    hourly_rate: number | null;
    profiles: {
      full_name: string;
      avatar_url: string | null;
    };
  } | null;
  shelter_profile?: {
    user_id: string;
    shelter_name: string;
    profiles: {
      full_name: string;
      avatar_url: string | null;
    };
  } | null;
}

export const useCareRequests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<CareRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCareRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('pet_care_requests')
        .select(`
          *,
          pet:pets(id, name, type, breed, size, pet_images)
        `)
        .or(`owner_id.eq.${user.id},sitter_id.eq.${user.id},shelter_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch additional profile data
      const enrichedRequests = await Promise.all(
        (data || []).map(async (request: any) => {
          const enrichedRequest = { ...request };

          // Fetch owner profile
          if (request.owner_id) {
            const { data: ownerData } = await supabase
              .from('profiles')
              .select('full_name, avatar_url, phone, address, city')
              .eq('id', request.owner_id)
              .single();
            
            if (ownerData) {
              enrichedRequest.owner = ownerData;
            }
          }

          // Fetch sitter profile if exists
          if (request.sitter_id) {
            const { data: sitterData } = await supabase
              .from('profiles')
              .select('full_name, avatar_url')
              .eq('id', request.sitter_id)
              .single();
            
            const { data: sitterProfileData } = await supabase
              .from('pet_sitter_profiles')
              .select('hourly_rate')
              .eq('user_id', request.sitter_id)
              .single();

            if (sitterData) {
              enrichedRequest.sitter_profile = {
                user_id: request.sitter_id,
                hourly_rate: sitterProfileData?.hourly_rate || null,
                profiles: sitterData
              };
            }
          }

          // Fetch shelter profile if exists
          if (request.shelter_id) {
            const { data: shelterData } = await supabase
              .from('profiles')
              .select('full_name, avatar_url')
              .eq('id', request.shelter_id)
              .single();
            
            const { data: shelterProfileData } = await supabase
              .from('pet_shelter_profiles')
              .select('shelter_name')
              .eq('user_id', request.shelter_id)
              .single();

            if (shelterData) {
              enrichedRequest.shelter_profile = {
                user_id: request.shelter_id,
                shelter_name: shelterProfileData?.shelter_name || 'Unknown Shelter',
                profiles: shelterData
              };
            }
          }

          return enrichedRequest;
        })
      );

      setRequests(enrichedRequests);
    } catch (error: any) {
      toast({
        title: "Error loading care requests",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('pet_care_requests')
        .update({ status: status as any })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Request status changed to ${status}`
      });

      await fetchCareRequests();
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getUserRole = (request: CareRequest) => {
    if (request.owner_id === user?.id) return 'Owner';
    if (request.sitter_id === user?.id) return 'Sitter';
    if (request.shelter_id === user?.id) return 'Shelter';
    return 'Unknown';
  };

  const getMyRequests = () => requests.filter(r => r.owner_id === user?.id);
  const getMySitterRequests = () => requests.filter(r => r.sitter_id === user?.id);
  const getMyShelterRequests = () => requests.filter(r => r.shelter_id === user?.id);
  const getAvailableRequests = () => requests.filter(r => r.status === 'pending' && r.owner_id !== user?.id && !r.sitter_id && !r.shelter_id);
  const getAcceptedRequests = () => requests.filter(r => (r.sitter_id === user?.id || r.shelter_id === user?.id) && r.status === 'accepted');
  const getCompletedRequests = () => requests.filter(r => (r.owner_id === user?.id || r.sitter_id === user?.id || r.shelter_id === user?.id) && r.status === 'completed');

  useEffect(() => {
    if (user) {
      fetchCareRequests();
    }
  }, [user]);

  return {
    requests,
    loading,
    fetchCareRequests,
    updateRequestStatus,
    getUserRole,
    getMyRequests,
    getMySitterRequests,
    getMyShelterRequests,
    getAvailableRequests,
    getAcceptedRequests,
    getCompletedRequests
  };
};