import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, MapPin, Clock, DollarSign, Users, Heart, Coffee, Zap, Trophy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Footer } from "@/components/Footer";

interface JobOpening {
  id: number;
  title: string;
  department: string;
  type: string;
  location: string;
  salary?: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

const Careers = () => {
  const [activeTab, setActiveTab] = useState('all');

  const jobOpenings: JobOpening[] = [
    { 
      id: 1, 
      title: "Senior Frontend Developer", 
      department: "Engineering", 
      type: "Full-time", 
      location: "Remote",
      salary: "₹8-15 LPA",
      description: "Join our engineering team to build cutting-edge pet care platform features. You'll work with React, TypeScript, and modern web technologies to create exceptional user experiences.",
      requirements: [
        "5+ years of React/TypeScript experience",
        "Experience with modern CSS frameworks",
        "Strong understanding of web performance",
        "Experience with testing frameworks"
      ],
      benefits: [
        "Competitive salary and equity",
        "Remote-first culture",
        "Health insurance",
        "Learning & development budget"
      ]
    },
    { 
      id: 2, 
      title: "Pet Care Specialist", 
      department: "Operations", 
      type: "Full-time", 
      location: "Mumbai, India",
      salary: "₹4-6 LPA",
      description: "Help ensure quality standards for pet caregivers on our platform. You'll be responsible for vetting sitters, conducting training, and maintaining safety protocols.",
      requirements: [
        "Veterinary background or pet care experience",
        "Strong communication skills",
        "Attention to detail",
        "Passion for animal welfare"
      ],
      benefits: [
        "Work with pets daily",
        "Health insurance",
        "Professional development",
        "Flexible hours"
      ]
    },
    { 
      id: 3, 
      title: "Customer Success Manager", 
      department: "Support", 
      type: "Full-time", 
      location: "Bangalore, India",
      salary: "₹5-8 LPA",
      description: "Help pet owners and caregivers have the best experience possible on our platform. Build relationships, solve problems, and drive product adoption.",
      requirements: [
        "2+ years in customer success",
        "Excellent communication skills",
        "Problem-solving mindset",
        "Experience with CRM tools"
      ],
      benefits: [
        "Performance bonuses",
        "Career growth opportunities",
        "Health benefits",
        "Team outings"
      ]
    },
    {
      id: 4,
      title: "Product Designer",
      department: "Design",
      type: "Full-time",
      location: "Remote",
      salary: "₹6-12 LPA",
      description: "Shape the future of pet care by designing intuitive, delightful experiences for pet owners and caregivers. Work closely with engineering and product teams.",
      requirements: [
        "3+ years of product design experience",
        "Proficiency in Figma/Sketch",
        "Strong portfolio",
        "User research experience"
      ],
      benefits: [
        "Creative freedom",
        "Latest design tools",
        "Remote work",
        "Conference attendance"
      ]
    },
    {
      id: 5,
      title: "Marketing Specialist",
      department: "Marketing",
      type: "Full-time",
      location: "Delhi, India",
      salary: "₹4-7 LPA",
      description: "Drive growth through creative marketing campaigns, content creation, and community building. Help more pet parents discover our platform.",
      requirements: [
        "2+ years in digital marketing",
        "Content creation skills",
        "Social media expertise",
        "Analytics experience"
      ],
      benefits: [
        "Creative projects",
        "Marketing budget",
        "Skill development",
        "Team events"
      ]
    },
    {
      id: 6,
      title: "Backend Engineer",
      department: "Engineering",
      type: "Full-time",
      location: "Remote",
      salary: "₹10-18 LPA",
      description: "Build robust, scalable backend systems that power our pet care platform. Work with Node.js, PostgreSQL, and cloud technologies.",
      requirements: [
        "4+ years of backend development",
        "Experience with Node.js/Python",
        "Database design skills",
        "Cloud platform experience"
      ],
      benefits: [
        "Technical challenges",
        "Latest technologies",
        "Mentorship opportunities",
        "Equity participation"
      ]
    }
  ];

  const departments = ['all', 'Engineering', 'Operations', 'Support', 'Design', 'Marketing'];

  const benefits = [
    {
      icon: Heart,
      title: "Pet-Friendly Workplace",
      description: "Bring your furry friends to work in our pet-friendly offices."
    },
    {
      icon: Zap,
      title: "Flexible Work",
      description: "Remote and hybrid options with flexible scheduling."
    },
    {
      icon: Trophy,
      title: "Growth Opportunities",
      description: "Career development programs and learning budgets."
    },
    {
      icon: Users,
      title: "Amazing Team",
      description: "Work with passionate pet lovers who care about making a difference."
    },
    {
      icon: Coffee,
      title: "Great Perks",
      description: "Health insurance, team outings, and wellness programs."
    },
    {
      icon: DollarSign,
      title: "Competitive Compensation",
      description: "Fair salaries, equity options, and performance bonuses."
    }
  ];

  const filteredJobs = activeTab === 'all' 
    ? jobOpenings 
    : jobOpenings.filter(job => job.department.toLowerCase() === activeTab);

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
              <Link to="/careers" className="text-sm font-medium text-primary">
                Careers
              </Link>
              <Link to="/about" className="text-sm font-medium transition-colors hover:text-primary">
                About
              </Link>
              <Link to="/contact" className="text-sm font-medium transition-colors hover:text-primary">
                Contact
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
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container text-center">
          <Badge variant="secondary" className="mb-4">Join Our Pack</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Build the Future of <span className="text-primary">Pet Care</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join our mission to connect pets with loving caregivers worldwide. 
            Work with passionate people who care about making a real difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => document.getElementById('openings')?.scrollIntoView({ behavior: 'smooth' })}>
              View Open Positions
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-16 bg-muted/20">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <p className="text-muted-foreground">Team Members</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10+</div>
              <p className="text-muted-foreground">Countries</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">100K+</div>
              <p className="text-muted-foreground">Happy Pets</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <p className="text-muted-foreground">Employee Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Why Join Us</Badge>
            <h2 className="text-3xl font-bold mb-4">Amazing Benefits & Perks</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We believe in taking care of our team so they can take care of pets and their families
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section id="openings" className="py-16 md:py-24 bg-muted/20">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Open Positions</Badge>
            <h2 className="text-3xl font-bold mb-4">Join Our Growing Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're always looking for talented individuals who share our passion for pets
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 lg:grid-cols-6">
              {departments.map((dept) => (
                <TabsTrigger key={dept} value={dept}>
                  {dept === 'all' ? 'All' : dept}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="space-y-6">
              {filteredJobs.length === 0 ? (
                <div className="text-center py-12">
                  <PawPrint className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No openings in this department</h3>
                  <p className="text-muted-foreground">
                    Check back soon or explore other departments.
                  </p>
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <Badge variant="secondary">{job.department}</Badge>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {job.type}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </div>
                            {job.salary && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {job.salary}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button asChild>
                          <Link to={`/careers/${job.id}`}>Apply Now</Link>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-6">{job.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Requirements</h4>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            {job.requirements.map((req, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-3">Benefits</h4>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            {job.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </Tabs>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Our Culture</Badge>
            <h2 className="text-3xl font-bold mb-4">Life at Pet Care</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We foster a culture of innovation, collaboration, and genuine care for pets and people
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-3">Passion-Driven</h3>
                <p className="text-muted-foreground">
                  We're all here because we love pets and want to make their lives better
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-3">Collaborative</h3>
                <p className="text-muted-foreground">
                  We work together across teams to solve problems and create amazing experiences
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-3">Growth-Focused</h3>
                <p className="text-muted-foreground">
                  We invest in our people's growth and celebrate their achievements
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container text-center">
          <Badge variant="secondary" className="mb-4">Ready to Join?</Badge>
          <h2 className="text-3xl font-bold mb-4">Don't See the Perfect Role?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're always interested in meeting talented people. Send us your resume and 
            tell us how you'd like to contribute to our mission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/contact">Send Us Your Resume</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/about">Learn More About Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Careers;