import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Pet {
  id: string;
  name: string;
  type: string;
  breed?: string;
  size: string;
  age?: number;
  description?: string;
  special_needs?: string;
  medical_conditions?: string;
  vaccination_status: boolean;
  pet_images: string[];
  verification_status: string;
  created_at: string;
}

export const usePets = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPets = async () => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPets(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading pets",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePetDeleted = (petId: string) => {
    setPets(prev => prev.filter(pet => pet.id !== petId));
  };

  useEffect(() => {
    if (user) {
      fetchPets();
    }
  }, [user]);

  return {
    pets,
    loading,
    fetchPets,
    handlePetDeleted
  };
};