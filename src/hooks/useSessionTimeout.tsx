import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseSessionTimeoutProps {
  timeoutMinutes?: number;
  warningMinutes?: number;
  isAdmin?: boolean;
}

export const useSessionTimeout = ({ 
  timeoutMinutes = 30, 
  warningMinutes = 5,
  isAdmin = false 
}: UseSessionTimeoutProps = {}) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningRef = useRef<NodeJS.Timeout>();
  const lastActivityRef = useRef<number>(Date.now());

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    
    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);

    if (!user) return;

    // Set warning timer
    warningRef.current = setTimeout(() => {
      toast({
        title: "Session Warning",
        description: `Your session will expire in ${warningMinutes} minutes due to inactivity.`,
        variant: "destructive",
      });
    }, (timeoutMinutes - warningMinutes) * 60 * 1000);

    // Set logout timer
    timeoutRef.current = setTimeout(async () => {
      toast({
        title: "Session Expired",
        description: "You have been logged out due to inactivity.",
        variant: "destructive",
      });
      
      if (isAdmin) {
        // For admin, also invalidate admin session
        try {
          await supabase.rpc('invalidate_admin_session', {
            p_session_token: localStorage.getItem('admin_session_token') || ''
          });
          localStorage.removeItem('admin_session_token');
          localStorage.removeItem('admin_data');
        } catch (error) {
          console.error('Error invalidating admin session:', error);
        }
      }
      
      await signOut();
      window.location.href = isAdmin ? '/admin/auth' : '/auth';
    }, timeoutMinutes * 60 * 1000);
  }, [user, timeoutMinutes, warningMinutes, toast, signOut, isAdmin]);

  const handleActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    if (!user) return;

    // Activity events to monitor
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initialize timer
    resetTimer();

    return () => {
      // Cleanup
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, [user, handleActivity, resetTimer]);

  return {
    resetTimer,
    lastActivity: lastActivityRef.current
  };
};