import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Admin {
  id: string;
  name: string;
  email: string;
  is_super_admin: boolean;
  permissions?: {
    manage_users: boolean;
    manage_pets: boolean;
    manage_products: boolean;
    manage_admins: boolean;
    manage_pet_sitter_verification: boolean;
    manage_pet_shelter_verification: boolean;
  };
}

interface AdminContextType {
  admin: Admin | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  createCoAdmin: (name: string, email: string, password: string) => Promise<{ error: any }>;
}

// Secure session storage using httpOnly-like approach
const ADMIN_SESSION_KEY = 'admin_session_token';

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to get client info
  const getClientInfo = () => {
    return {
      ip_address: null, // Browser can't access real IP, will be null
      user_agent: navigator.userAgent
    };
  };

  // Secure session validation on component mount
  useEffect(() => {
    const validateSession = async () => {
      setLoading(true);
      try {
        const sessionToken = sessionStorage.getItem(ADMIN_SESSION_KEY);
        if (!sessionToken) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.rpc('validate_admin_session', {
          p_session_token: sessionToken
        });

        if (error || !data || !data[0]?.session_valid) {
          // Invalid session, clear it
          sessionStorage.removeItem(ADMIN_SESSION_KEY);
          setAdmin(null);
          setLoading(false);
          return;
        }

        // Valid session, set admin data
        const adminData = data[0].admin_data as any;
        setAdmin({
          id: adminData.id,
          name: adminData.name,
          email: adminData.email,
          is_super_admin: adminData.is_super_admin,
          permissions: adminData.permissions || {
            manage_users: true,
            manage_pets: true,
            manage_products: adminData.is_super_admin,
            manage_admins: false,
            manage_pet_sitter_verification: false,
            manage_pet_shelter_verification: false
          }
        });
        setLoading(false);
      } catch (error) {
        console.error('Session validation error:', error);
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        setAdmin(null);
        setLoading(false);
      }
    };

    validateSession();
  }, []);

  // Periodic session validation every 5 minutes
  useEffect(() => {
    if (!admin) return;

    const interval = setInterval(async () => {
      const sessionToken = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (!sessionToken) {
        setAdmin(null);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('validate_admin_session', {
          p_session_token: sessionToken
        });

        if (error || !data || !data[0]?.session_valid) {
          sessionStorage.removeItem(ADMIN_SESSION_KEY);
          setAdmin(null);
        }
      } catch (error) {
        console.error('Periodic session validation error:', error);
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        setAdmin(null);
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [admin]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const clientInfo = getClientInfo();
      
      const { data, error } = await supabase.rpc('verify_admin_password_with_session', {
        email_input: email,
        password_input: password,
        ip_address_input: clientInfo.ip_address,
        user_agent_input: clientInfo.user_agent
      });

      if (error) {
        setLoading(false);
        return { error };
      }

      if (data && data.length > 0 && data[0].success) {
        const result = data[0];
        
        // Store secure session token
        sessionStorage.setItem(ADMIN_SESSION_KEY, result.session_token);
        
        // Set admin data
        const adminData = result.admin_data as any;
        setAdmin({
          id: adminData.id,
          name: adminData.name,
          email: adminData.email,
          is_super_admin: adminData.is_super_admin,
          permissions: adminData.permissions || {
            manage_users: true,
            manage_pets: true,
            manage_products: adminData.is_super_admin,
            manage_admins: false,
            manage_pet_sitter_verification: false,
            manage_pet_shelter_verification: false
          }
        });
        
        setLoading(false);
        return { error: null };
      } else {
        setLoading(false);
        const errorMessage = data && data[0] ? data[0].error_message : 'Invalid credentials';
        return { error: { message: errorMessage } };
      }
    } catch (error) {
      setLoading(false);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const sessionToken = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (sessionToken) {
        // Invalidate session on server
        await supabase.rpc('invalidate_admin_session', {
          p_session_token: sessionToken
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Always clear local state and storage
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      setAdmin(null);
    }
  };

  const createCoAdmin = async (name: string, email: string, password: string) => {
    if (!admin?.is_super_admin) {
      return { error: { message: 'Only super admins can create co-admins' } };
    }

    try {
      const { data: hashedPassword, error: hashError } = await supabase
        .rpc('hash_password', { password });

      if (hashError) {
        return { error: hashError };
      }

      const { error } = await supabase
        .from('admins')
        .insert({
          name,
          email,
          password_hash: hashedPassword,
          is_super_admin: false,
          created_by: admin.id
        });

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    admin,
    loading,
    signIn,
    signOut,
    createCoAdmin
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};