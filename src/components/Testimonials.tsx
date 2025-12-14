import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Pet Owner",
    content: "Amazing service! My dog Max was so well taken care of while I was away. The daily updates with photos gave me such peace of mind.",
    rating: 5,
    avatar: "/placeholder.svg",
    location: "Mumbai, India"
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    role: "Pet Sitter",
    content: "Being a pet sitter on this platform has been incredible. The verification process made me feel secure, and I love caring for these wonderful pets.",
    rating: 5,
    avatar: "/placeholder.svg",
    location: "Delhi, India"
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "Pet Owner",
    content: "The shelter care option was perfect when I needed extended care for my cats. Professional, caring, and transparent throughout.",
    rating: 5,
    avatar: "/placeholder.svg",
    location: "Bangalore, India"
  },
  {
    id: 4,
    name: "Mike Chen",
    role: "Pet Owner",
    content: "Great platform with verified sitters. The video updates feature is fantastic - I could see my pets were happy and healthy.",
    rating: 5,
    avatar: "/placeholder.svg",
    location: "Pune, India"
  },
  {
    id: 5,
    name: "Lisa Rodriguez",
    role: "Pet Shelter Owner",
    content: "Joining as a shelter has brought us many caring pet parents. The admin verification process ensures quality service for everyone.",
    rating: 5,
    avatar: "/placeholder.svg",
    location: "Chennai, India"
  },
  {
    id: 6,
    name: "David Thompson",
    role: "Pet Owner",
    content: "The emergency contact feature saved the day when my cat needed immediate attention. Responsive and professional service.",
    rating: 5,
    avatar: "/placeholder.svg",
    location: "Hyderabad, India"
  }
];

export const Testimonials = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">What Our Users Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of happy pet parents and caregivers who trust our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-muted-foreground mb-6 italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};