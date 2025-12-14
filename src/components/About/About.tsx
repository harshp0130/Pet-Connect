import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Heart, Shield, Users, Award, Target } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/Footer";

const About = () => {
  useEffect(() => {
    document.title = "About Pet Care | Connecting Pet Owners with Caregivers";
  }, []);

  const teamMembers = [
    { id: 1, name: "Rohit Kumar", position: "Founder & CEO", image: "/images/team1.jpg" },
    { id: 2, name: "Krish Kavathia", position: "Head of Operations", image: "/images/team2.jpg" },
    { id: 3, name: "Rishav Kumar", position: "Lead Developer", image: "/images/team3.jpg" },
    { id: 4, name: "Emma Davis", position: "Customer Success", image: "/images/team4.jpg" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Love for Pets",
      description: "Every pet deserves love, care, and attention when their owners are away"
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Verified caregivers and secure platform for peace of mind"
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a community of pet lovers who care for each other's companions"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <PawPrint className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Pet Care</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
                Home
              </Link>
              <Link to="/about" className="text-sm font-medium text-primary">
                About
              </Link>
              <Link to="/contact" className="text-sm font-medium transition-colors hover:text-primary">
                Contact
              </Link>
              <Link to="/products" className="text-sm font-medium transition-colors hover:text-primary">
                Shop
              </Link>
            </nav>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container text-center">
          <Badge variant="secondary" className="mb-4">Our Story</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Connecting Pet Owners with 
            <span className="text-primary"> Trusted Caregivers</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Since 2024, we've been building a platform that makes finding trusted pet caregivers 
            simple, safe, and reliable. Every pet deserves loving care when their owners are away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/auth">Join Our Community</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">Our Mission</Badge>
              <h2 className="text-3xl font-bold mb-6">Making Pet Care Accessible to Everyone</h2>
              <p className="text-lg text-muted-foreground mb-6">
                At Pet Care, we believe every pet deserves loving care when their owners are away. 
                We've created a platform that connects responsible pet owners with verified, 
                trusted caregivers in their local community.
              </p>
              <p className="text-muted-foreground mb-8">
                Our mission is to provide peace of mind to pet parents while ensuring pets 
                receive the love, attention, and care they need in a safe, nurturing environment.
              </p>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Happy Pets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">5K+</div>
                  <div className="text-sm text-muted-foreground">Verified Caregivers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">100+</div>
                  <div className="text-sm text-muted-foreground">Cities</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                <PawPrint className="h-32 w-32 text-primary/40" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-muted/20">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Our Values</Badge>
            <h2 className="text-3xl font-bold mb-4">What Drives Us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our core values guide everything we do, from platform development to community building
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Our Team</Badge>
            <h2 className="text-3xl font-bold mb-4">Meet the People Behind Pet Care</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Passionate pet lovers working to create the best experience for you and your furry friends
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.id} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PawPrint className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.position}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container text-center">
          <Badge variant="secondary" className="mb-4">Join Us</Badge>
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of pet parents who trust our platform for their pet care needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/auth">Sign Up Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;