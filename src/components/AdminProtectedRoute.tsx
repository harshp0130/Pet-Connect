import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { supabase } from '@/integrations/supabase/client';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { admin, loading } = useAdmin();
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateAdminAccess = async () => {
      // If admin context is still loading, wait
      if (loading) {
        return;
      }

      // If no admin in context, redirect to auth
      if (!admin) {
        navigate('/admin/auth', { replace: true });
        return;
      }

      // Additional server-side validation to ensure session is still valid
      try {
        const sessionToken = sessionStorage.getItem('admin_session_token');
        if (!sessionToken) {
          console.warn('No session token found, redirecting to auth');
          navigate('/admin/auth', { replace: true });
          return;
        }

        // Validate session with server
        const { data, error } = await supabase.rpc('validate_admin_session', {
          p_session_token: sessionToken
        });

        if (error || !data || !data[0]?.session_valid) {
          console.warn('Invalid session detected, redirecting to auth');
          sessionStorage.removeItem('admin_session_token');
          navigate('/admin/auth', { replace: true });
          return;
        }

        setIsValidating(false);
      } catch (error) {
        console.error('Session validation error:', error);
        navigate('/admin/auth', { replace: true });
      }
    };

    validateAdminAccess();
  }, [admin, loading, navigate]);

  // Show loading state while validating
  if (loading || isValidating || !admin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Validating access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;