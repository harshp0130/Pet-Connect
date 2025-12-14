
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PawPrint, Search, User, Calendar, MapPin } from "lucide-react";
import { Pet } from "./types";
import { useState } from "react";

interface AllPetsTabProps {
  pets: Pet[];
  onPetUpdate: () => Promise<void>;
}

export const AllPetsTab = ({ pets, onPetUpdate }: AllPetsTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.owner?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.owner?.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || pet.verification_status === statusFilter;
    const matchesType = typeFilter === "all" || pet.type.toLowerCase() === typeFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const uniqueTypes = [...new Set(pets.map(pet => pet.type).filter(type => type && type.trim() !== ''))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>All Registered Pets</CardTitle>
          <CardDescription>Complete overview of all pets and their owners in the system</CardDescription>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pets, owners, or emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueTypes.map(type => (
                  <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPets.map((pet) => (
              <div key={pet.id} className="border rounded-lg p-6 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {pet.pet_images.length > 0 ? (
                      <img
                        src={pet.pet_images[0]}
                        alt={pet.name}
                        className="w-16 h-16 rounded-lg object-cover border-2"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center border-2">
                        <PawPrint className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{pet.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{pet.breed || pet.type}</span>
                        <span>•</span>
                        <span className="capitalize">{pet.size} size</span>
                      </div>
                    </div>
                  </div>
                  
                  <Badge className={getStatusColor(pet.verification_status)}>
                    {pet.verification_status.charAt(0).toUpperCase() + pet.verification_status.slice(1)}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Pet Details */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Pet Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Registered: {new Date(pet.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Owner Details */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Owner Information</h4>
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="font-medium">{pet.owner?.full_name}</p>
                        <p className="text-sm text-muted-foreground">{pet.owner?.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Photos:</span> {pet.pet_images.length}
                      </div>
                      <div>
                        <span className="font-medium">Documents:</span> {pet.vaccination_documents?.length || 0}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pet Images Preview */}
                {pet.pet_images.length > 1 && (
                  <div className="mt-4 pt-4 border-t">
                    <h5 className="text-sm font-medium mb-2">Additional Photos</h5>
                    <div className="flex gap-2">
                      {pet.pet_images.slice(1, 5).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${pet.name} ${index + 2}`}
                          className="w-12 h-12 rounded object-cover border"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      ))}
                      {pet.pet_images.length > 5 && (
                        <div className="w-12 h-12 rounded border flex items-center justify-center text-xs bg-muted">
                          +{pet.pet_images.length - 5}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {filteredPets.length === 0 && (
              <div className="text-center py-12">
                <PawPrint className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No pets found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== "all" || typeFilter !== "all" 
                    ? "Try adjusting your filters" 
                    : "No pets have been registered yet"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
