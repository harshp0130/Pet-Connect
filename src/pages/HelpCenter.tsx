import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageCircle, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      question: "How do I find a pet sitter?",
      answer: "You can find pet sitters by visiting our 'Find Pet Sitters' page, where you can filter by location, price, and availability. All our sitters are verified for your peace of mind."
    },
    {
      question: "How do I register my pet?",
      answer: "To register your pet, go to the 'Pet Registration' page and fill out the required information including your pet's name, breed, age, and vaccination records."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and digital wallets. All payments are processed securely through our platform."
    },
    {
      question: "How do I become a pet sitter?",
      answer: "To become a pet sitter, create an account and complete your profile setup. You'll need to provide verification documents and undergo our approval process."
    },
    {
      question: "What if my pet has special needs?",
      answer: "You can specify your pet's special needs when creating care requests. Our sitters are experienced with various special needs and medical conditions."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order is placed, you'll receive a tracking number via email. You can also check your order status in the 'My Orders' section of your account."
    },
    {
      question: "What is your cancellation policy?",
      answer: "You can cancel care requests up to 24 hours before the scheduled time without penalty. Product orders can be cancelled before shipping."
    },
    {
      question: "How do I update my profile?",
      answer: "You can update your profile by logging into your account and navigating to the profile settings section."
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Help Center</h1>
          <p className="text-muted-foreground">
            Find answers to common questions or get in touch with our support team
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Help Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <MessageCircle className="h-8 w-8 mx-auto text-primary mb-2" />
              <CardTitle>Live Chat</CardTitle>
              <CardDescription>
                Chat with our support team in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Start Chat</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Phone className="h-8 w-8 mx-auto text-primary mb-2" />
              <CardTitle>Call Us</CardTitle>
              <CardDescription>
                Speak directly with our support team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                +91 1234567890
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Mail className="h-8 w-8 mx-auto text-primary mb-2" />
              <CardTitle>Email Support</CardTitle>
              <CardDescription>
                Send us a detailed message
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/contact">Send Email</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQs */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Find quick answers to the most common questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            {filteredFaqs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No results found for "{searchQuery}"
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpCenter;