import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedProfileSetupProps {
  children: React.ReactNode;
}

const ProtectedProfileSetup = ({ children }: ProtectedProfileSetupProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    const checkProfileComplete = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      try {
        // Check if user has completed their basic profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!profile || !profile.phone || !profile.city) {
          // Profile incomplete, redirect to setup
          navigate('/profile-setup');
          return;
        }

        // Check if user is accessing the right dashboard for their type
        const userType = profile.user_type;
        const currentPath = window.location.pathname;
        
        // Redirect users to their appropriate dashboard if they're on the wrong one
        if (userType === 'pet_owner' && currentPath === '/pet-sitter-dashboard') {
          navigate('/pet-owner');
          return;
        }
        
        if (userType === 'pet_sitter' && currentPath !== '/pet-sitter-dashboard') {
          // Check if sitter profile exists
          const { data: sitterProfile, error } = await supabase
            .from('pet_sitter_profiles')
            .select('id')
            .eq('user_id', user.id)
            .limit(1)
            .maybeSingle();

          if (!sitterProfile || error) {
            navigate('/profile-setup');
            return;
          }
        } else if (userType === 'pet_shelter') {
          // Check if shelter profile exists  
          const { data: shelterProfile, error } = await supabase
            .from('pet_shelter_profiles')
            .select('id')
            .eq('user_id', user.id)
            .limit(1)
            .maybeSingle();

          if (!shelterProfile || error) {
            navigate('/profile-setup');
            return;
          }
        }

        setCheckingProfile(false);
      } catch (error) {
        console.error('Error checking profile:', error);
        navigate('/profile-setup');
      }
    };

    if (!loading) {
      checkProfileComplete();
    }
  }, [user, loading, navigate]);

  if (loading || checkingProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedProfileSetup;