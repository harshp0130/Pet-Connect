import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, LogIn, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAdmin } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";

// Rate limiting configuration
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

const AdminAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  
  const { signIn, admin } = useAdmin();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize rate limiting state from localStorage
  useEffect(() => {
    const savedAttempts = localStorage.getItem('admin_login_attempts');
    const savedLockout = localStorage.getItem('admin_lockout_end');
    
    if (savedAttempts) {
      setAttemptCount(parseInt(savedAttempts, 10));
    }
    
    if (savedLockout) {
      const lockoutEnd = parseInt(savedLockout, 10);
      if (Date.now() < lockoutEnd) {
        setIsLocked(true);
        setLockoutEndTime(lockoutEnd);
      } else {
        // Lockout expired, clear stored data
        localStorage.removeItem('admin_login_attempts');
        localStorage.removeItem('admin_lockout_end');
      }
    }
  }, []);

  // Update remaining time for lockout countdown
  useEffect(() => {
    if (isLocked && lockoutEndTime) {
      const interval = setInterval(() => {
        const remaining = lockoutEndTime - Date.now();
        if (remaining <= 0) {
          setIsLocked(false);
          setLockoutEndTime(null);
          setAttemptCount(0);
          setRemainingTime(0);
          localStorage.removeItem('admin_login_attempts');
          localStorage.removeItem('admin_lockout_end');
        } else {
          setRemainingTime(remaining);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isLocked, lockoutEndTime]);

  useEffect(() => {
    if (admin) {
      navigate('/admin');
    }
  }, [admin, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if account is locked
    if (isLocked) {
      toast({
        title: "Account temporarily locked",
        description: `Too many failed attempts. Try again in ${Math.ceil(remainingTime / 60000)} minutes.`,
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      // Increment failed attempts
      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);
      localStorage.setItem('admin_login_attempts', newAttemptCount.toString());
      
      // Check if should lock account
      if (newAttemptCount >= MAX_ATTEMPTS) {
        const lockoutEnd = Date.now() + LOCKOUT_DURATION;
        setIsLocked(true);
        setLockoutEndTime(lockoutEnd);
        localStorage.setItem('admin_lockout_end', lockoutEnd.toString());
        
        toast({
          title: "Account locked",
          description: `Too many failed login attempts. Account locked for 15 minutes.`,
          variant: "destructive"
        });
      } else {
        const remainingAttempts = MAX_ATTEMPTS - newAttemptCount;
        toast({
          title: "Login failed",
          description: `Invalid credentials. ${remainingAttempts} attempts remaining before lockout.`,
          variant: "destructive"
        });
      }
    } else {
      // Successful login, reset attempts
      setAttemptCount(0);
      localStorage.removeItem('admin_login_attempts');
      localStorage.removeItem('admin_lockout_end');
      
      toast({
        title: "Welcome Admin!",
        description: "You have successfully logged in to the admin panel."
      });
      navigate('/admin');
    }
    
    setLoading(false);
  };

  // Format remaining time for display
  const formatRemainingTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2 text-2xl font-bold">
            <Shield className="h-8 w-8 text-primary" />
            <span>Admin Portal</span>
          </Link>
          <p className="text-muted-foreground">
            Administrative access only
          </p>
        </div>

        {/* Auth Form */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your admin credentials to access the control panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Lockout Alert */}
            {isLocked && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Account temporarily locked due to too many failed login attempts.
                  <br />
                  Time remaining: <strong>{formatRemainingTime(remainingTime)}</strong>
                </AlertDescription>
              </Alert>
            )}

            {/* Attempt Warning */}
            {!isLocked && attemptCount > 0 && attemptCount < MAX_ATTEMPTS && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {attemptCount} failed login attempt{attemptCount > 1 ? 's' : ''}. 
                  {MAX_ATTEMPTS - attemptCount} attempt{MAX_ATTEMPTS - attemptCount > 1 ? 's' : ''} remaining before lockout.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLocked}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLocked}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || isLocked}
              >
                <LogIn className="h-4 w-4 mr-2" />
                {loading ? "Signing in..." : isLocked ? "Account Locked" : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back to home */}
        <div className="text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;