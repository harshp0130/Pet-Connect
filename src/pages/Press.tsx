import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Download, ExternalLink } from "lucide-react";

const Press = () => {
  const pressReleases = [
    {
      title: "PetCare Announces ₹50 Crore Series A Funding Round",
      date: "March 15, 2024",
      description: "Leading pet care platform secures significant funding to expand services across India and enhance technology offerings.",
      downloadUrl: "#",
    },
    {
      title: "PetCare Partners with Leading Veterinary Clinics",
      date: "February 8, 2024", 
      description: "Strategic partnerships with over 500 veterinary clinics nationwide to provide comprehensive pet healthcare services.",
      downloadUrl: "#",
    },
    {
      title: "PetCare Reaches 1 Million Pet Registrations Milestone",
      date: "January 20, 2024",
      description: "Platform celebrates major milestone with over 1 million pets registered and 50,000 verified care providers.",
      downloadUrl: "#",
    },
    {
      title: "PetCare Launches AI-Powered Pet Health Monitoring",
      date: "December 10, 2023",
      description: "Revolutionary AI technology helps pet owners track their pets' health and receive personalized care recommendations.",
      downloadUrl: "#",
    }
  ];

  const mediaKit = [
    {
      type: "Company Logo",
      format: "PNG, SVG",
      size: "High Resolution",
    },
    {
      type: "Brand Guidelines",
      format: "PDF",
      size: "2.5 MB",
    },
    {
      type: "Product Screenshots",
      format: "PNG",
      size: "Various Sizes",
    },
    {
      type: "Executive Photos",
      format: "JPG",
      size: "High Resolution",
    }
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Press & Media</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest news, announcements, and media resources from PetCare
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Press Releases */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Latest Press Releases</CardTitle>
                <CardDescription>
                  Recent news and announcements from PetCare
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {pressReleases.map((release, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold line-clamp-2">{release.title}</h3>
                        <Badge variant="outline" className="flex-shrink-0 ml-2">
                          <Calendar className="h-3 w-3 mr-1" />
                          {release.date}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {release.description}
                      </p>
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Media Kit & Contact */}
          <div className="space-y-6">
            {/* Media Kit */}
            <Card>
              <CardHeader>
                <CardTitle>Media Kit</CardTitle>
                <CardDescription>
                  Brand assets and resources for media use
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mediaKit.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{item.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.format} • {item.size}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4">
                  Download Complete Kit
                </Button>
              </CardContent>
            </Card>

            {/* Media Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Media Contact</CardTitle>
                <CardDescription>
                  Get in touch with our press team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">Head of Communications</p>
                    <p className="text-sm">press@petcare.com</p>
                    <p className="text-sm">+91 9876543210</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Media Inquiry Form
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Facts */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Facts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Founded:</span>
                    <span className="font-medium">2022</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Headquarters:</span>
                    <span className="font-medium">Mumbai, India</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Registered Pets:</span>
                    <span className="font-medium">1M+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Care Providers:</span>
                    <span className="font-medium">50K+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cities:</span>
                    <span className="font-medium">25+</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Press;