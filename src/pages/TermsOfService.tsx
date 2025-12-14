import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Terms of Service</CardTitle>
            <p className="text-muted-foreground">
              Last updated: January 1, 2024
            </p>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using PetCare's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">2. Service Description</h2>
              <p className="text-muted-foreground">
                PetCare is a platform that connects pet owners with verified pet care providers including pet sitters and shelters. We also offer a marketplace for pet products and supplies.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Provide accurate and complete information during registration</li>
                <li>Maintain the security of your account credentials</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Treat pets with care and respect during care services</li>
                <li>Pay for services and products as agreed</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">4. Pet Care Services</h2>
              <p className="text-muted-foreground">
                Pet care providers on our platform are independent contractors. PetCare facilitates connections but is not responsible for the quality of care provided. All users must ensure their pets are vaccinated and healthy before using care services.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">5. Payment Terms</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>All payments are processed securely through our platform</li>
                <li>Service fees are due upon completion of services</li>
                <li>Product payments are due at time of purchase</li>
                <li>Refunds are subject to our refund policy</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">6. Liability and Insurance</h2>
              <p className="text-muted-foreground">
                Users are responsible for maintaining appropriate insurance for their pets. PetCare is not liable for injuries, damages, or losses that may occur during pet care services. Pet care providers are encouraged to maintain liability insurance.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">7. Prohibited Activities</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Misrepresenting yourself or your qualifications</li>
                <li>Engaging in fraudulent activities</li>
                <li>Harassing or abusing other users</li>
                <li>Violating any local, state, or national laws</li>
                <li>Using the platform for illegal activities</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">8. Account Termination</h2>
              <p className="text-muted-foreground">
                PetCare reserves the right to terminate user accounts that violate these terms of service. Users may also terminate their accounts at any time by contacting customer support.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">9. Changes to Terms</h2>
              <p className="text-muted-foreground">
                PetCare reserves the right to modify these terms at any time. Users will be notified of significant changes and continued use of the service constitutes acceptance of new terms.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">10. Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about these Terms of Service, please contact us at:
                <br />
                Email: legal@petcare.com
                <br />
                Phone: +91 1234567890
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;