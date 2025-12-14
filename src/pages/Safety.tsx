import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle, AlertTriangle, Phone } from "lucide-react";

const Safety = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl">
        <div className="text-center mb-8">
          <Shield className="h-12 w-12 mx-auto text-primary mb-4" />
          <h1 className="text-3xl font-bold mb-4">Safety & Trust</h1>
          <p className="text-muted-foreground">
            Your pet's safety and your peace of mind are our top priorities
          </p>
        </div>

        <div className="grid gap-6">
          {/* Verification Process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Rigorous Verification Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">For Pet Sitters</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Background checks and identity verification</li>
                    <li>• Reference checks from previous clients</li>
                    <li>• Pet care experience verification</li>
                    <li>• Training certification review</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">For Pet Shelters</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• License and permit verification</li>
                    <li>• Facility inspection reports</li>
                    <li>• Staff qualification checks</li>
                    <li>• Insurance verification</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Safety Guidelines for Pet Owners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Before Booking</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Review sitter profiles and ratings carefully</li>
                    <li>• Read previous client reviews</li>
                    <li>• Meet the sitter before leaving your pet</li>
                    <li>• Ensure your pet is up-to-date on vaccinations</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">During Care</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Provide detailed care instructions</li>
                    <li>• Share emergency contact information</li>
                    <li>• Request regular updates and photos</li>
                    <li>• Keep communication lines open</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Protocols */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Emergency Protocols
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">24/7 Emergency Support</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Our emergency hotline is available round the clock for urgent situations.
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4" />
                    <span className="font-medium">Emergency Hotline: +91 9876543210</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">What to do in an Emergency</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Contact the nearest veterinary clinic immediately</li>
                    <li>Notify the pet owner immediately</li>
                    <li>Call our emergency hotline</li>
                    <li>Follow any specific instructions provided by the owner</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insurance & Protection */}
          <Card>
            <CardHeader>
              <CardTitle>Insurance & Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Coverage Options</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Basic accident coverage included for all bookings</li>
                    <li>• Optional premium insurance for extended coverage</li>
                    <li>• Veterinary expense reimbursement</li>
                    <li>• Third-party liability protection</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Reporting Issues</h3>
                  <p className="text-sm text-muted-foreground">
                    If you experience any safety concerns or issues, please report them immediately through our platform or contact our support team. We take all reports seriously and investigate thoroughly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trust Features */}
          <Card>
            <CardHeader>
              <CardTitle>Trust & Security Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Secure Platform</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• End-to-end encrypted messaging</li>
                    <li>• Secure payment processing</li>
                    <li>• Identity verification</li>
                    <li>• GPS tracking for walk services</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Community Standards</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Mutual rating system</li>
                    <li>• Community guidelines enforcement</li>
                    <li>• Zero tolerance for misconduct</li>
                    <li>• Regular safety training</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Safety;