import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Components
import ProfileSetupHeader from "@/components/ProfileSetup/ProfileSetupHeader";
import BasicProfileForm from "@/components/ProfileSetup/BasicProfileForm";
import SitterProfileForm from "@/components/ProfileSetup/SitterProfileForm";
import ShelterProfileForm from "@/components/ProfileSetup/ShelterProfileForm";
import CompletionCard from "@/components/ProfileSetup/CompletionCard";

const ProfileSetup = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('');
  
  // Basic profile data
  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  // Pet Sitter specific data
  const [sitterData, setSitterData] = useState({
    experience_years: '',
    pet_preferences: [] as string[],
    availability_schedule: {},
    hourly_rate: '',
    about_me: '',
    profile_image_url: '',
    introduction_video_url: ''
  });

  // Pet Shelter specific data
  const [shelterData, setShelterData] = useState({
    shelter_name: '',
    capacity: '',
    license_number: '',
    about_shelter: '',
    profile_image_url: '',
    introduction_video_url: ''
  });

  const totalSteps = userType === 'pet_owner' ? 2 : 3;

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Check if user already has completed profiles
    const checkExistingProfiles = async () => {
      const userTypeFromMeta = user.user_metadata?.user_type;
      const urlParams = new URLSearchParams(window.location.search);
      const isEditMode = urlParams.get('edit') === 'true';
      
      if (userTypeFromMeta) {
        setUserType(userTypeFromMeta);
        setProfileData(prev => ({
          ...prev,
          full_name: user.user_metadata?.full_name || ''
        }));

        // Only check for existing profiles if NOT in edit mode
        if (!isEditMode) {
          // Check if specialized profile already exists
          if (userTypeFromMeta === 'pet_sitter') {
            const { data: sitterProfile, error } = await supabase
              .from('pet_sitter_profiles')
              .select('id')
              .eq('user_id', user.id)
              .limit(1)
              .single();
            
            if (sitterProfile && !error) {
              // User already has a sitter profile, redirect to dashboard
              console.log('Existing sitter profile found, redirecting to dashboard');
              navigate('/pet-sitter-dashboard');
              return;
            }
          } else if (userTypeFromMeta === 'pet_shelter') {
            const { data: shelterProfile, error } = await supabase
              .from('pet_shelter_profiles')
              .select('id')
              .eq('user_id', user.id)
              .limit(1)
              .single();
            
            if (shelterProfile && !error) {
              // User already has a shelter profile, redirect to shelter dashboard
              console.log('Existing shelter profile found, redirecting to shelter dashboard');
              navigate('/pet-shelter-dashboard');
              return;
            }
          }
        }
      }
    };

    checkExistingProfiles();
  }, [user, navigate]);

  const handleBasicProfileSave = async () => {
    if (!profileData.full_name || !profileData.phone || !profileData.city) {
      toast({
        title: "Please fill required fields",
        description: "Full name, phone, and city are required.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          ...profileData,
          user_type: userType,
          email: user?.email
        });

      if (error) throw error;

      if (userType === 'pet_owner') {
        // Pet owners are done after basic profile
        toast({
          title: "Profile completed!",
          description: "Welcome to PetConnect! You can now start using the platform.",
          className: "bg-green-50 border-green-200 text-green-800"
        });
        navigate('/pet-owner');
      } else {
        setStep(2);
      }
    } catch (error: any) {
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSpecializedProfileSave = async () => {
    setLoading(true);
    try {
      if (userType === 'pet_sitter') {
        // Use upsert instead of insert to handle duplicates
        const { error } = await supabase
          .from('pet_sitter_profiles')
          .upsert({
            user_id: user?.id,
            ...sitterData,
            experience_years: parseInt(sitterData.experience_years) || 0,
            hourly_rate: parseFloat(sitterData.hourly_rate) || 0
          }, {
            onConflict: 'user_id'
          });

        if (error) throw error;
        
        toast({
          title: "Sitter profile completed!",
          description: "Your profile is now live. Start receiving requests!",
          className: "bg-green-50 border-green-200 text-green-800"
        });
        
        // Add small delay to ensure toast is visible before redirect
        setTimeout(() => {
          navigate('/pet-sitter-dashboard');
        }, 1000);
        
      } else if (userType === 'pet_shelter') {
        // Use upsert instead of insert to handle duplicates
        const { error } = await supabase
          .from('pet_shelter_profiles')
          .upsert({
            user_id: user?.id,
            ...shelterData,
            capacity: parseInt(shelterData.capacity) || 0
          }, {
            onConflict: 'user_id'
          });

        if (error) throw error;
        
        toast({
          title: "Shelter profile completed!",
          description: "Your shelter is now listed on PetConnect!",
          className: "bg-green-50 border-green-200 text-green-800"
        });
        
        setTimeout(() => {
          navigate('/pet-shelter-dashboard');
        }, 1000);
      }
    } catch (error: any) {
      console.error('Error saving specialized profile:', error);
      toast({
        title: "Error saving specialized profile",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePetPreferenceToggle = (preference: string) => {
    setSitterData(prev => ({
      ...prev,
      pet_preferences: prev.pet_preferences.includes(preference)
        ? prev.pet_preferences.filter(p => p !== preference)
        : [...prev.pet_preferences, preference]
    }));
  };

  if (!userType) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-2xl">
        <ProfileSetupHeader 
          userType={userType} 
          step={step} 
          totalSteps={totalSteps} 
        />

        {step === 1 && (
          <BasicProfileForm
            profileData={profileData}
            setProfileData={setProfileData}
            onSubmit={handleBasicProfileSave}
            loading={loading}
            userType={userType}
          />
        )}

        {step === 2 && userType === 'pet_sitter' && (
          <SitterProfileForm
            sitterData={sitterData}
            setSitterData={setSitterData}
            onSubmit={handleSpecializedProfileSave}
            loading={loading}
            onPetPreferenceToggle={handlePetPreferenceToggle}
          />
        )}

        {step === 2 && userType === 'pet_shelter' && (
          <ShelterProfileForm
            shelterData={shelterData}
            setShelterData={setShelterData}
            onSubmit={handleSpecializedProfileSave}
            loading={loading}
          />
        )}

        {step === 3 && (
          <CompletionCard userType={userType} />
        )}
      </div>
    </div>
  );
};

export default ProfileSetup;