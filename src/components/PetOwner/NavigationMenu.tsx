
import { Link } from 'react-router-dom';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PawPrint, 
  Plus, 
  Users, 
  Calendar, 
  Heart, 
  Search, 
  ShoppingBag,
  Package
} from "lucide-react";

const navigationItems = [
  {
    to: "/pet-registration",
    icon: Plus,
    title: "Register Pet",
    description: "Add a new pet to your profile",
    color: "text-primary"
  },
  {
    to: "/create-care-request",
    icon: Calendar,
    title: "Create Care Request",
    description: "Request pet sitting services",
    color: "text-blue-500"
  },
  {
    to: "/find-sitters",
    icon: Search,
    title: "Find Sitters",
    description: "Browse available pet sitters",
    color: "text-green-500"
  },
  {
    to: "/my-care-requests",
    icon: Users,
    title: "My Care Requests",
    description: "View and manage your care requests",
    color: "text-orange-500"
  },
  {
    to: "/products",
    icon: ShoppingBag,
    title: "Pet Products",
    description: "Shop for pet supplies",
    color: "text-purple-500"
  },
  {
    to: "/my-orders",
    icon: Package,
    title: "My Orders",
    description: "Track your product orders",
    color: "text-indigo-500"
  },
  {
    to: "/profile-setup",
    icon: Users,
    title: "Profile Setup",
    description: "Update your profile settings",
    color: "text-teal-500"
  },
  {
    to: "/",
    icon: PawPrint,
    title: "Home",
    description: "Back to homepage",
    color: "text-primary"
  }
];

export const NavigationMenu = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Navigation</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {navigationItems.map((item) => (
          <Link key={item.to} to={item.to}>
            <Card className="cursor-pointer hover:shadow-md transition-shadow h-full hover-scale">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                  {item.title}
                </CardTitle>
                <CardDescription className="text-xs">
                  {item.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
