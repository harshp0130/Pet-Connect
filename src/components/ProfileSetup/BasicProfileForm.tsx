import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin } from "lucide-react";

interface BasicProfileData {
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface BasicProfileFormProps {
  profileData: BasicProfileData;
  setProfileData: (data: BasicProfileData) => void;
  onSubmit: () => void;
  loading: boolean;
  userType: string;
}

const BasicProfileForm = ({ 
  profileData, 
  setProfileData, 
  onSubmit, 
  loading, 
  userType 
}: BasicProfileFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Basic Information
        </CardTitle>
        <CardDescription>
          Tell us about yourself and your location
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              value={profileData.full_name}
              onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
              placeholder="Enter your full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              placeholder="Enter your phone number"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={profileData.address}
            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
            placeholder="Enter your full address"
            rows={3}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={profileData.city}
              onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
              placeholder="City"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={profileData.state}
              onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
              placeholder="State"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              value={profileData.pincode}
              onChange={(e) => setProfileData({ ...profileData, pincode: e.target.value })}
              placeholder="Pincode"
            />
          </div>
        </div>

        <div className="pt-4">
          <Button 
            onClick={onSubmit}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Saving..." : userType === 'pet_owner' ? "Complete Setup" : "Continue"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicProfileForm;