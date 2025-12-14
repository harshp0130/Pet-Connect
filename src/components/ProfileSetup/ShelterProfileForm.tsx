import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Shield, Upload } from "lucide-react";

interface ShelterData {
  shelter_name: string;
  capacity: string;
  license_number: string;
  about_shelter: string;
  profile_image_url: string;
  introduction_video_url: string;
}

interface ShelterProfileFormProps {
  shelterData: ShelterData;
  setShelterData: (data: ShelterData) => void;
  onSubmit: () => void;
  loading: boolean;
}

const ShelterProfileForm = ({ 
  shelterData, 
  setShelterData, 
  onSubmit, 
  loading 
}: ShelterProfileFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Shelter Information
        </CardTitle>
        <CardDescription>
          Provide details about your pet shelter or facility
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="shelter_name">Shelter Name *</Label>
            <Input
              id="shelter_name"
              value={shelterData.shelter_name}
              onChange={(e) => setShelterData({ ...shelterData, shelter_name: e.target.value })}
              placeholder="e.g. Happy Paws Shelter"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={shelterData.capacity}
              onChange={(e) => setShelterData({ ...shelterData, capacity: e.target.value })}
              placeholder="e.g. 50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="license_number">License Number</Label>
          <Input
            id="license_number"
            value={shelterData.license_number}
            onChange={(e) => setShelterData({ ...shelterData, license_number: e.target.value })}
            placeholder="Enter your shelter license number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="about_shelter">About Shelter</Label>
          <Textarea
            id="about_shelter"
            value={shelterData.about_shelter}
            onChange={(e) => setShelterData({ ...shelterData, about_shelter: e.target.value })}
            placeholder="Describe your shelter, facilities, and services offered..."
            rows={4}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Media (Optional)
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shelter_image">Shelter Image URL</Label>
              <Input
                id="shelter_image"
                value={shelterData.profile_image_url}
                onChange={(e) => setShelterData({ ...shelterData, profile_image_url: e.target.value })}
                placeholder="https://example.com/shelter.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shelter_video">Introduction Video URL</Label>
              <Input
                id="shelter_video"
                value={shelterData.introduction_video_url}
                onChange={(e) => setShelterData({ ...shelterData, introduction_video_url: e.target.value })}
                placeholder="https://example.com/video.mp4"
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button 
            onClick={onSubmit}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Creating Profile..." : "Complete Shelter Profile"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShelterProfileForm;