
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, userType?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle login redirect logic without page reload
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(async () => {
            await handleLoginRedirect(session.user);
          }, 100);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginRedirect = async (user: User) => {
    try {
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) {
        // New user without profile - redirect to profile setup
        if (typeof window !== 'undefined') {
          window.history.pushState({}, '', '/profile-setup');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
        return;
      }

      // Check if profile is incomplete
      if (!profile.phone || !profile.city) {
        if (typeof window !== 'undefined') {
          window.history.pushState({}, '', '/profile-setup');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
        return;
      }

      // Redirect based on user type
      const userType = profile.user_type;
      let redirectPath = '/';
      
      if (userType === 'pet_owner') {
        redirectPath = '/pet-owner';
      } else if (userType === 'pet_sitter') {
        // Check if sitter profile exists
        const { data: sitterProfile } = await supabase
          .from('pet_sitter_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (sitterProfile) {
          redirectPath = '/pet-sitter-dashboard';
        } else {
          redirectPath = '/profile-setup';
        }
      } else if (userType === 'pet_shelter') {
        // Check if shelter profile exists
        const { data: shelterProfile } = await supabase
          .from('pet_shelter_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (shelterProfile) {
          redirectPath = '/pet-shelter-dashboard';
        } else {
          redirectPath = '/profile-setup';
        }
      }

      // Use history.pushState instead of window.location.href to avoid page reload
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', redirectPath);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    } catch (error) {
      console.error('Error handling login redirect:', error);
      // Fallback to profile setup on error
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/profile-setup');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
  };

  const signUp = async (email: string, password: string, fullName: string, userType?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          user_type: userType
        },
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
