import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import FileUpload from "@/components/FileUpload";

interface Pet {
  id: string;
  name: string;
  type: string;
  breed?: string;
  size: string;
  age?: number;
  description?: string;
  special_needs?: string;
  medical_conditions?: string;
  vaccination_status: boolean;
  pet_images: string[];
  vaccination_documents?: string[];
}

interface PetEditDialogProps {
  pet: Pet | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const PetEditDialog = ({ pet, isOpen, onClose, onUpdate }: PetEditDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [petData, setPetData] = useState<Partial<Pet>>({});

  // Initialize form data when pet changes
  useEffect(() => {
    if (pet) {
      setPetData({ ...pet });
    }
  }, [pet]);

  const handleInputChange = (field: string, value: any) => {
    setPetData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (urls: string[]) => {
    setPetData(prev => ({
      ...prev,
      pet_images: [...(prev.pet_images || []), ...urls]
    }));
  };

  const handleDocumentUpload = (urls: string[]) => {
    setPetData(prev => ({
      ...prev,
      vaccination_documents: [...(prev.vaccination_documents || []), ...urls]
    }));
  };

  const handleImageRemove = (url: string) => {
    setPetData(prev => ({
      ...prev,
      pet_images: (prev.pet_images || []).filter(img => img !== url)
    }));
  };

  const handleDocumentRemove = (url: string) => {
    setPetData(prev => ({
      ...prev,
      vaccination_documents: (prev.vaccination_documents || []).filter(doc => doc !== url)
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

    if (!petData.pet_images || petData.pet_images.length === 0) {
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
        .update({
          ...petData,
          age: petData.age ? parseInt(petData.age.toString()) : null
        })
        .eq('id', pet?.id);

      if (error) throw error;

      toast({
        title: "Pet updated successfully!",
        description: "Your pet information has been updated.",
        className: "bg-green-50 border-green-200 text-green-800"
      });
      
      onUpdate();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error updating pet",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!pet) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Pet Information</DialogTitle>
          <DialogDescription>
            Update your pet's information and images
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Pet Name *</Label>
              <Input
                id="name"
                value={petData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your pet's name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age (years)</Label>
              <Input
                id="age"
                type="number"
                value={petData.age || ''}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="e.g. 3"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Pet Type *</Label>
              <Select value={petData.type || ''} onValueChange={(value) => handleInputChange('type', value)}>
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
                value={petData.breed || ''}
                onChange={(e) => handleInputChange('breed', e.target.value)}
                placeholder="e.g. Golden Retriever"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Size *</Label>
              <Select value={petData.size || ''} onValueChange={(value) => handleInputChange('size', value)}>
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
              value={petData.description || ''}
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
                checked={petData.vaccination_status || false}
                onCheckedChange={(checked) => handleInputChange('vaccination_status', checked)}
              />
              <Label htmlFor="vaccination_status">Up to date with vaccinations</Label>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="special_needs">Special Needs</Label>
                <Textarea
                  id="special_needs"
                  value={petData.special_needs || ''}
                  onChange={(e) => handleInputChange('special_needs', e.target.value)}
                  placeholder="Any special care requirements..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medical_conditions">Medical Conditions</Label>
                <Textarea
                  id="medical_conditions"
                  value={petData.medical_conditions || ''}
                  onChange={(e) => handleInputChange('medical_conditions', e.target.value)}
                  placeholder="Any known medical conditions..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="space-y-6">
            <FileUpload
              onUpload={handleImageUpload}
              onRemove={handleImageRemove}
              uploadedFiles={petData.pet_images || []}
              maxFiles={5}
              acceptedTypes={['image/*']}
              bucketName="pet-images"
              label="Pet Photos *"
              description="Upload clear photos of your pet (at least 1 required)"
            />

            <FileUpload
              onUpload={handleDocumentUpload}
              onRemove={handleDocumentRemove}
              uploadedFiles={petData.vaccination_documents || []}
              maxFiles={3}
              acceptedTypes={['image/*', 'application/pdf']}
              bucketName="pet-documents"
              label="Vaccination Documents"
              description="Upload vaccination certificates and medical records"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Pet"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};