import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";

interface TermsAcceptanceProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export const TermsAcceptance = ({ isOpen, onAccept, onDecline }: TermsAcceptanceProps) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);

  const canProceed = termsAccepted && privacyAccepted;

  const handleAccept = () => {
    if (canProceed) {
      // Store acceptance in localStorage
      localStorage.setItem('termsAccepted', 'true');
      localStorage.setItem('privacyAccepted', 'true');
      localStorage.setItem('marketingAccepted', marketingAccepted.toString());
      localStorage.setItem('termsAcceptedDate', new Date().toISOString());
      onAccept();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Terms & Privacy Agreement</DialogTitle>
          <DialogDescription>
            Please review and accept our terms and privacy policy to continue using PetCare.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-64 border rounded-lg p-4">
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold mb-2">Terms of Service Summary</h3>
              <p className="text-muted-foreground">
                By using PetCare, you agree to our terms including responsible pet care, 
                accurate information provision, and compliance with all applicable laws. 
                Our platform connects pet owners with verified care providers.
              </p>
            </section>
            
            <section>
              <h3 className="font-semibold mb-2">Privacy Policy Summary</h3>
              <p className="text-muted-foreground">
                We collect and process your personal information to provide pet care services, 
                including contact details, pet information, and location data. Your data is 
                protected and only shared with care providers as necessary.
              </p>
            </section>
            
            <section>
              <h3 className="font-semibold mb-2">Data Usage</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Account creation and management</li>
                <li>Matching with suitable care providers</li>
                <li>Payment processing and order fulfillment</li>
                <li>Safety and security monitoring</li>
                <li>Customer support and communication</li>
              </ul>
            </section>
          </div>
        </ScrollArea>

        <div className="space-y-4">
          <div className="flex items-top space-x-2">
            <Checkbox 
              id="terms" 
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I accept the{" "}
                <Link to="/terms-of-service" target="_blank" className="underline text-primary hover:text-primary/80">
                  Terms of Service
                </Link>
              </label>
              <p className="text-xs text-muted-foreground">
                Required to use PetCare services
              </p>
            </div>
          </div>

          <div className="flex items-top space-x-2">
            <Checkbox 
              id="privacy" 
              checked={privacyAccepted}
              onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="privacy" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I accept the{" "}
                <Link to="/privacy-policy" target="_blank" className="underline text-primary hover:text-primary/80">
                  Privacy Policy
                </Link>
              </label>
              <p className="text-xs text-muted-foreground">
                Required for data processing
              </p>
            </div>
          </div>

          <div className="flex items-top space-x-2">
            <Checkbox 
              id="marketing" 
              checked={marketingAccepted}
              onCheckedChange={(checked) => setMarketingAccepted(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="marketing" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I agree to receive marketing communications
              </label>
              <p className="text-xs text-muted-foreground">
                Optional - you can unsubscribe anytime
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onDecline}>
            Decline
          </Button>
          <Button 
            onClick={handleAccept} 
            disabled={!canProceed}
            className="min-w-[100px]"
          >
            Accept & Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};