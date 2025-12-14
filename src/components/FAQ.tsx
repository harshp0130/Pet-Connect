import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const faqs = [
  {
    question: "How do I register my pet?",
    answer: "After creating your account, navigate to the 'Pet Registration' section and fill out the required information about your pet including photos, vaccination records, and medical history."
  },
  {
    question: "How are pet sitters verified?",
    answer: "All pet sitters go through a thorough verification process including background checks, reference verification, and profile review by our admin team before they can accept care requests."
  },
  {
    question: "What if I need to cancel a care request?",
    answer: "You can cancel a care request from your dashboard. Cancellation policies may apply depending on the timing. Please check our Terms of Service for detailed cancellation policies."
  },
  {
    question: "How do payments work?",
    answer: "Payments are processed securely through our platform. You can pay using various methods including credit cards and digital wallets. Payment is typically collected after the care service is completed."
  },
  {
    question: "What happens in case of emergency?",
    answer: "Our platform includes emergency contact features. Pet sitters have access to your emergency contacts and can reach you or your designated emergency contact immediately if needed."
  },
  {
    question: "Can I track my pet during care?",
    answer: "Yes! Pet sitters can send you photo and video updates throughout the care period. You'll receive notifications when updates are posted to keep you connected with your pet."
  },
  {
    question: "What areas do you serve?",
    answer: "We currently serve major metropolitan areas and are expanding rapidly. Check our coverage map or enter your location to see available pet sitters and shelters in your area."
  },
  {
    question: "How do I become a pet sitter?",
    answer: "Sign up for a pet sitter account, complete your profile with experience details, upload required documents, and wait for verification. Once approved, you can start accepting care requests."
  }
];

export const FAQ = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about our pet care platform
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Common Questions</CardTitle>
              <CardDescription>
                Can't find what you're looking for? Contact our support team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
            <p className="text-muted-foreground mb-6">
              Our support team is here to help you 24/7
            </p>
            <div className="space-y-2">
              <p className="text-sm">
                Email: <a href="mailto:support@petcare.com" className="text-primary hover:underline">support@petcare.com</a>
              </p>
              <p className="text-sm">
                Phone: <a href="tel:+1234567890" className="text-primary hover:underline">+1 (234) 567-8900</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};