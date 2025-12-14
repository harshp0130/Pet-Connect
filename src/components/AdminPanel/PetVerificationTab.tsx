import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PawPrint, Check, X, Eye, Shield } from "lucide-react";
import { Pet } from "./types";

interface PetVerificationTabProps {
  pets: Pet[];
  onVerifyPet: (petId: string, status: 'verified' | 'rejected') => void;
}

export const PetVerificationTab = ({ pets, onVerifyPet }: PetVerificationTabProps) => {
  const pendingPets = pets.filter(pet => pet.verification_status === 'pending');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pet Verification</CardTitle>
          <CardDescription>Review and verify pet registrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {pendingPets.map((pet) => (
              <div key={pet.id} className="border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {pet.pet_images.length > 0 ? (
                      <img
                        src={pet.pet_images[0]}
                        alt={pet.name}
                        className="w-16 h-16 rounded-lg object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <PawPrint className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{pet.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {pet.breed || pet.type} • {pet.size} size
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Owner: {pet.owner?.full_name} ({pet.owner?.email})
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">Pending Review</Badge>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Pet Photos ({pet.pet_images.length})</h4>
                    <div className="flex gap-2">
                      {pet.pet_images.slice(0, 3).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${pet.name} ${index + 1}`}
                          className="w-12 h-12 rounded object-cover border"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      ))}
                      {pet.pet_images.length > 3 && (
                        <div className="w-12 h-12 rounded border flex items-center justify-center text-xs">
                          +{pet.pet_images.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Vaccination Documents ({pet.vaccination_documents?.length || 0})
                    </h4>
                    {pet.vaccination_documents && pet.vaccination_documents.length > 0 ? (
                      <div className="space-y-1">
                        {pet.vaccination_documents.slice(0, 2).map((doc, index) => (
                          <div key={index} className="text-xs bg-muted p-2 rounded">
                            Document {index + 1}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">No documents uploaded</p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => onVerifyPet(pet.id, 'verified')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Verify Pet
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onVerifyPet(pet.id, 'rejected')}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
            
            {pendingPets.length === 0 && (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No pending verifications</h3>
                <p className="text-muted-foreground">All pets have been reviewed.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};