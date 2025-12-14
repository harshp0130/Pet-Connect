import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Star, Upload } from "lucide-react";

interface SitterData {
  experience_years: string;
  pet_preferences: string[];
  availability_schedule: {};
  hourly_rate: string;
  about_me: string;
  profile_image_url: string;
  introduction_video_url: string;
}

interface SitterProfileFormProps {
  sitterData: SitterData;
  setSitterData: (data: SitterData) => void;
  onSubmit: () => void;
  loading: boolean;
  onPetPreferenceToggle: (preference: string) => void;
}

const SitterProfileForm = ({ 
  sitterData, 
  setSitterData, 
  onSubmit, 
  loading, 
  onPetPreferenceToggle 
}: SitterProfileFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Pet Sitter Details
        </CardTitle>
        <CardDescription>
          Tell pet owners about your experience and services
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              type="number"
              value={sitterData.experience_years}
              onChange={(e) => setSitterData({ ...sitterData, experience_years: e.target.value })}
              placeholder="e.g. 3"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hourly_rate">Hourly Rate (₹)</Label>
            <Input
              id="hourly_rate"
              type="number"
              value={sitterData.hourly_rate}
              onChange={(e) => setSitterData({ ...sitterData, hourly_rate: e.target.value })}
              placeholder="e.g. 200"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label>Pet Preferences</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['Dogs', 'Cats', 'Birds', 'Fish', 'Rabbits', 'Other'].map((pet) => (
              <div key={pet} className="flex items-center space-x-2">
                <Checkbox
                  id={pet}
                  checked={sitterData.pet_preferences.includes(pet)}
                  onCheckedChange={() => onPetPreferenceToggle(pet)}
                />
                <Label htmlFor={pet} className="text-sm">{pet}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="about_me">About Me</Label>
          <Textarea
            id="about_me"
            value={sitterData.about_me}
            onChange={(e) => setSitterData({ ...sitterData, about_me: e.target.value })}
            placeholder="Tell pet owners about yourself, your experience, and why you love caring for pets..."
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
              <Label htmlFor="profile_image">Profile Image URL</Label>
              <Input
                id="profile_image"
                value={sitterData.profile_image_url}
                onChange={(e) => setSitterData({ ...sitterData, profile_image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="intro_video">Introduction Video URL</Label>
              <Input
                id="intro_video"
                value={sitterData.introduction_video_url}
                onChange={(e) => setSitterData({ ...sitterData, introduction_video_url: e.target.value })}
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
            {loading ? "Creating Profile..." : "Complete Sitter Profile"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SitterProfileForm;