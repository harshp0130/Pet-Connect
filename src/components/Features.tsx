import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  MapPin, 
  Camera, 
  Clock, 
  Heart, 
  Users, 
  Star, 
  MessageSquare,
  Phone,
  CreditCard,
  FileCheck,
  Bell
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Verified Caregivers",
    description: "All pet sitters and shelters undergo thorough background verification",
    category: "Safety"
  },
  {
    icon: MapPin,
    title: "Location-Based Matching",
    description: "Find nearby pet care services in your area with GPS precision",
    category: "Convenience"
  },
  {
    icon: Camera,
    title: "Live Updates",
    description: "Receive photos and videos of your pet throughout their care",
    category: "Communication"
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description: "Book care services that fit your schedule, from hours to weeks",
    category: "Flexibility"
  },
  {
    icon: Heart,
    title: "Pet Health Tracking",
    description: "Maintain detailed health records and vaccination schedules",
    category: "Health"
  },
  {
    icon: Users,
    title: "Multiple Pet Support",
    description: "Manage care for multiple pets from a single dashboard",
    category: "Management"
  },
  {
    icon: Star,
    title: "Rating System",
    description: "Rate and review caregivers to maintain service quality",
    category: "Quality"
  },
  {
    icon: MessageSquare,
    title: "In-App Messaging",
    description: "Direct communication with caregivers through secure chat",
    category: "Communication"
  },
  {
    icon: Phone,
    title: "Emergency Contacts",
    description: "Quick access to emergency contacts and veterinary services",
    category: "Safety"
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Safe and secure payment processing with multiple options",
    category: "Payment"
  },
  {
    icon: FileCheck,
    title: "Care Reports",
    description: "Detailed reports of your pet's activities and care",
    category: "Documentation"
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Stay informed with timely updates and reminders",
    category: "Convenience"
  }
];

const categories = ["All", "Safety", "Communication", "Convenience", "Health", "Quality"];

export const Features = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Features</Badge>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Everything You Need for Pet Care
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive features designed to make pet care safe, convenient, and stress-free
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                </div>
                <Badge variant="outline" className="mb-2 text-xs">
                  {feature.category}
                </Badge>
                <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-4">More Features Coming Soon</h3>
          <p className="text-muted-foreground mb-6">
            We're constantly improving our platform with new features based on user feedback
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary">AI-Powered Matching</Badge>
            <Badge variant="secondary">Pet Insurance Integration</Badge>
            <Badge variant="secondary">Veterinary Partnerships</Badge>
            <Badge variant="secondary">Group Care Options</Badge>
          </div>
        </div>
      </div>
    </section>
  );
};