
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminProvider } from "./contexts/AdminContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedProfileSetup from "./components/ProtectedProfileSetup";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AnalyticsTracker from "@/components/AnalyticsTracker"; // adjust path if needed


// Page Components
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ProfileSetup from "./pages/ProfileSetup";
import AdminAuth from "./pages/AdminAuth";
import AdminPanel from "./pages/AdminPanel";
import PetOwner from "./pages/PetOwner";
import PetLover from "./pages/PetLover";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import NotFound from "./pages/NotFound";
import PetRegistration from "./pages/PetRegistration";
import CreateCareRequest from "./pages/CreateCareRequest";
import CareRequestDetails from "./pages/CareRequestDetails";
import PetSitterFinder from "./pages/PetSitterFinder";
import PetSitterDashboard from "./pages/PetSitterDashboard";
import PetShelterDashboard from "./pages/PetShelterDashboard";
import MyCareRequests from "./pages/MyCareRequests";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";

// New Page Components
import About from "./components/About/About";
import Blog from "./components/Blog/Blog";
import Careers from "./components/Careers/Careers";
import Contact from "./components/Contact/Contact";
import FAQ from "./pages/FAQ";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import HelpCenter from "./pages/HelpCenter";
import Safety from "./pages/Safety";
import Press from "./pages/Press";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AdminProvider>
          <TooltipProvider delayDuration={300}>
            {/* Toast Notifications */}
            <Toaster />
            <Sonner position="top-right" richColors />

            {/* Router Configuration */}
            <BrowserRouter>
            <AnalyticsTracker /> {/* Add this line just inside BrowserRouter */}

              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile-setup" element={<ProfileSetup />} />
                <Route path="/admin/auth" element={<AdminAuth />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route 
                  path="/checkout" 
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/my-orders" 
                  element={
                    <ProtectedRoute>
                      <MyOrders />
                    </ProtectedRoute>
                  } 
                />

                {/* Authenticated User Routes */}
                <Route
                  path="/pet-owner"
                  element={
                    <ProtectedRoute>
                      <ProtectedProfileSetup>
                        <PetOwner />
                      </ProtectedProfileSetup>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pet-lover"
                  element={
                    <ProtectedRoute>
                      <ProtectedProfileSetup>
                        <PetLover />
                      </ProtectedProfileSetup>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pet-registration"
                  element={
                    <ProtectedRoute>
                      <ProtectedProfileSetup>
                        <PetRegistration />
                      </ProtectedProfileSetup>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create-care-request"
                  element={
                    <ProtectedRoute>
                      <ProtectedProfileSetup>
                        <CreateCareRequest />
                      </ProtectedProfileSetup>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/care-request/:id"
                  element={
                    <ProtectedRoute>
                      <ProtectedProfileSetup>
                        <CareRequestDetails />
                      </ProtectedProfileSetup>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/find-sitters"
                  element={
                    <ProtectedRoute>
                      <ProtectedProfileSetup>
                        <PetSitterFinder />
                      </ProtectedProfileSetup>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-care-requests"
                  element={
                    <ProtectedRoute>
                      <ProtectedProfileSetup>
                        <MyCareRequests />
                      </ProtectedProfileSetup>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pet-sitter-dashboard"
                  element={
                    <ProtectedRoute>
                      <ProtectedProfileSetup>
                        <PetSitterDashboard />
                      </ProtectedProfileSetup>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pet-shelter-dashboard"
                  element={
                    <ProtectedRoute>
                      <ProtectedProfileSetup>
                        <PetShelterDashboard />
                      </ProtectedProfileSetup>
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes - Completely separate from user routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminProtectedRoute>
                      <AdminPanel />
                    </AdminProtectedRoute>
                  }
                />
                
                {/* Public Footer Pages */}
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/help-center" element={<HelpCenter />} />
                <Route path="/safety" element={<Safety />} />
                <Route path="/press" element={<Press />} />
                
                {/* Block any other /admin/* paths for security */}
                <Route path="/admin/*" element={<NotFound />} />

                {/* Catch-all Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AdminProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
