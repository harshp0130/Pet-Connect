import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, PawPrint, Search, Calendar, Heart, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Create Your Account",
    description: "Sign up and complete your profile as a pet owner, sitter, or shelter.",
    details: "Choose your role and provide essential information to get started on our platform."
  },
  {
    icon: PawPrint,
    number: "02",
    title: "Register Your Pet",
    description: "Add your pet's details, photos, and care requirements.",
    details: "Upload vaccination records, medical history, and special care instructions."
  },
  {
    icon: Search,
    number: "03",
    title: "Find Care or Offer Services",
    description: "Browse available sitters/shelters or wait for care requests.",
    details: "Use our advanced search filters to find the perfect match for your needs."
  },
  {
    icon: Calendar,
    number: "04",
    title: "Book & Confirm",
    description: "Schedule care services and confirm all details.",
    details: "Set dates, discuss special requirements, and finalize arrangements."
  },
  {
    icon: MessageCircle,
    number: "05",
    title: "Stay Connected",
    description: "Receive updates, photos, and videos during care.",
    details: "Real-time communication and media updates keep you connected with your pet."
  },
  {
    icon: Heart,
    number: "06",
    title: "Rate & Review",
    description: "Share your experience and help build our community.",
    details: "Your feedback helps maintain high-quality service standards."
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">How It Works</Badge>
          <h2 className="text-3xl font-bold text-foreground mb-4">Simple Steps to Pet Care</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes and connect with trusted pet care providers in your area
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
          {steps.map((step, index) => (
            <Card key={index} className="relative hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 relative">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {step.number}
                  </div>
                </div>
                <CardTitle className="text-xl mb-2">{step.title}</CardTitle>
                <CardDescription className="text-base">{step.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground text-center">
                  {step.details}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-4">Ready to Get Started?</h3>
          <p className="text-muted-foreground mb-6">
            Join thousands of pet parents who trust our platform for their pet care needs
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/auth">Get Started Today</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};