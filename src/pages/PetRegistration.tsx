import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { PawPrint, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import FileUpload from "@/components/FileUpload";

const PetRegistration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [petData, setPetData] = useState({
    name: '',
    type: '',
    breed: '',
    size: '',
    age: '',
    description: '',
    special_needs: '',
    medical_conditions: '',
    vaccination_status: false,
    pet_images: [] as string[],
    vaccination_documents: [] as string[]
  });

  const handleInputChange = (field: string, value: any) => {
    setPetData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUrlAdd = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      setPetData(prev => ({
        ...prev,
        pet_images: [...prev.pet_images, url]
      }));
    }
  };

  const handleDocumentUrlAdd = () => {
    const url = prompt('Enter vaccination document URL:');
    if (url) {
      setPetData(prev => ({
        ...prev,
        vaccination_documents: [...prev.vaccination_documents, url]
      }));
    }
  };

  const handleImageUpload = (urls: string[]) => {
    setPetData(prev => ({
      ...prev,
      pet_images: [...prev.pet_images, ...urls]
    }));
  };

  const handleDocumentUpload = (urls: string[]) => {
    setPetData(prev => ({
      ...prev,
      vaccination_documents: [...prev.vaccination_documents, ...urls]
    }));
  };

  const handleImageRemove = (url: string) => {
    setPetData(prev => ({
      ...prev,
      pet_images: prev.pet_images.filter(img => img !== url)
    }));
  };

  const handleDocumentRemove = (url: string) => {
    setPetData(prev => ({
      ...prev,
      vaccination_documents: prev.vaccination_documents.filter(doc => doc !== url)
    }));
  };

  const removeImage = (index: number) => {
    setPetData(prev => ({
      ...prev,
      pet_images: prev.pet_images.filter((_, i) => i !== index)
    }));
  };

  const removeDocument = (index: number) => {
    setPetData(prev => ({
      ...prev,
      vaccination_documents: prev.vaccination_documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!petData.name || !petData.type || !petData.size) {
      toast({
        title: "Please fill required fields",
        description: "Name, type, and size are required.",
        variant: "destructive"
      });
      return;
    }

    if (petData.pet_images.length === 0) {
      toast({
        title: "Pet image required",
        description: "Please upload at least one photo of your pet.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('pets')
        .insert({
          user_id: user?.id,
          ...petData,
          age: petData.age ? parseInt(petData.age) : null
        });

      if (error) throw error;

      toast({
        title: "Pet registered successfully!",
        description: "Your pet has been added to your profile.",
        className: "bg-green-50 border-green-200 text-green-800"
      });
      
      navigate('/pet-owner');
    } catch (error: any) {
      toast({
        title: "Error registering pet",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/pet-owner')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <PawPrint className="h-8 w-8 text-primary" />
              Register Your Pet
            </h1>
            <p className="text-muted-foreground mt-2">
              Add your pet to your profile to start finding care services
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Pet Information</CardTitle>
              <CardDescription>
                Tell us about your furry friend
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Pet Name *</Label>
                  <Input
                    id="name"
                    value={petData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your pet's name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age (years)</Label>
                  <Input
                    id="age"
                    type="number"
                    value={petData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="e.g. 3"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Pet Type *</Label>
                  <Select onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dog">Dog</SelectItem>
                      <SelectItem value="cat">Cat</SelectItem>
                      <SelectItem value="bird">Bird</SelectItem>
                      <SelectItem value="fish">Fish</SelectItem>
                      <SelectItem value="rabbit">Rabbit</SelectItem>
                      <SelectItem value="hamster">Hamster</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breed">Breed</Label>
                  <Input
                    id="breed"
                    value={petData.breed}
                    onChange={(e) => handleInputChange('breed', e.target.value)}
                    placeholder="e.g. Golden Retriever"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Size *</Label>
                  <Select onValueChange={(value) => handleInputChange('size', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="extra_large">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={petData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Tell us about your pet's personality, habits, and other details..."
                  rows={3}
                />
              </div>

              {/* Health Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Health Information</h3>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="vaccination_status"
                    checked={petData.vaccination_status}
                    onCheckedChange={(checked) => handleInputChange('vaccination_status', checked)}
                  />
                  <Label htmlFor="vaccination_status">Up to date with vaccinations</Label>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="special_needs">Special Needs</Label>
                    <Textarea
                      id="special_needs"
                      value={petData.special_needs}
                      onChange={(e) => handleInputChange('special_needs', e.target.value)}
                      placeholder="Any special care requirements..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medical_conditions">Medical Conditions</Label>
                    <Textarea
                      id="medical_conditions"
                      value={petData.medical_conditions}
                      onChange={(e) => handleInputChange('medical_conditions', e.target.value)}
                      placeholder="Any known medical conditions..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Media */}
              <div className="space-y-6">
                <Separator />
                
                <FileUpload
                  onUpload={handleImageUpload}
                  onRemove={handleImageRemove}
                  uploadedFiles={petData.pet_images}
                  maxFiles={5}
                  acceptedTypes={['image/*']}
                  bucketName="pet-images"
                  label="Pet Photos *"
                  description="Upload clear photos of your pet (at least 1 required)"
                />

                <FileUpload
                  onUpload={handleDocumentUpload}
                  onRemove={handleDocumentRemove}
                  uploadedFiles={petData.vaccination_documents}
                  maxFiles={3}
                  acceptedTypes={['image/*', 'application/pdf']}
                  bucketName="pet-documents"
                  label="Vaccination Documents"
                  description="Upload vaccination certificates and medical records"
                />
              </div>

              <div className="pt-6">
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Registering Pet..." : "Register Pet"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default PetRegistration;