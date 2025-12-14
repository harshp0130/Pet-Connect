import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon, PawPrint, MapPin, Clock, 
  DollarSign, User, Heart, ArrowLeft 
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Pet {
  id: string;
  name: string;
  type: string;
  breed?: string;
  size: string;
  age?: number;
}

const CreateCareRequest = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  
  const [requestData, setRequestData] = useState({
    pet_id: '',
    service_type: '',
    special_instructions: '',
    budget_range: ''
  });

  useEffect(() => {
    fetchUserPets();
  }, [user]);

  const fetchUserPets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('pets')
        .select('id, name, type, breed, size, age')
        .eq('user_id', user.id);

      if (error) throw error;
      setPets(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading pets",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!requestData.pet_id || !startDate || !endDate) {
      toast({
        title: "Please fill required fields",
        description: "Pet, start date, and end date are required.",
        variant: "destructive"
      });
      return;
    }

    if (endDate <= startDate) {
      toast({
        title: "Invalid dates",
        description: "End date must be after start date.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('pet_care_requests')
        .insert({
          owner_id: user?.id,
          pet_id: requestData.pet_id,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          special_instructions: requestData.special_instructions || null,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Care request created!",
        description: "Your request has been posted. Sitters will be notified.",
        className: "bg-green-50 border-green-200 text-green-800"
      });
      
      navigate('/pet-owner');
    } catch (error: any) {
      toast({
        title: "Error creating request",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedPet = pets.find(p => p.id === requestData.pet_id);
  const daysDiff = startDate && endDate ? 
    Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-2xl">
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
              <Heart className="h-8 w-8 text-primary" />
              Request Pet Care
            </h1>
            <p className="text-muted-foreground mt-2">
              Find trusted sitters for your beloved pet
            </p>
          </div>
        </div>

        {pets.length === 0 ? (
          <Card className="text-center py-12">
            <CardHeader>
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <PawPrint className="h-8 w-8 text-muted-foreground" />
              </div>
              <CardTitle>No pets found</CardTitle>
              <CardDescription>
                You need to register at least one pet before requesting care
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/pet-registration')}>
                Register Your Pet
              </Button>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Care Request Details</CardTitle>
                <CardDescription>
                  Tell us about your care needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Pet Selection */}
                <div className="space-y-2">
                  <Label htmlFor="pet">Select Pet *</Label>
                  <Select 
                    value={requestData.pet_id} 
                    onValueChange={(value) => setRequestData({...requestData, pet_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your pet" />
                    </SelectTrigger>
                    <SelectContent>
                      {pets.map((pet) => (
                        <SelectItem key={pet.id} value={pet.id}>
                          <div className="flex items-center gap-2">
                            <PawPrint className="h-4 w-4 text-primary" />
                            <span>
                              {pet.name} ({pet.type.charAt(0).toUpperCase() + pet.type.slice(1)})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Pet Info Display */}
                {selectedPet && (
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <PawPrint className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{selectedPet.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {selectedPet.breed || selectedPet.type} • {selectedPet.size} size
                            {selectedPet.age && ` • ${selectedPet.age} years old`}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Date Selection */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Select start date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>End Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "Select end date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          disabled={(date) => date < (startDate || new Date())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Duration Info */}
                {daysDiff > 0 && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-blue-800">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">
                          Duration: {daysDiff} {daysDiff === 1 ? 'day' : 'days'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Service Type */}
                <div className="space-y-2">
                  <Label htmlFor="service_type">Service Type</Label>
                  <Select 
                    value={requestData.service_type} 
                    onValueChange={(value) => setRequestData({...requestData, service_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pet_sitting">Pet Sitting (at your home)</SelectItem>
                      <SelectItem value="pet_boarding">Pet Boarding (at sitter's home)</SelectItem>
                      <SelectItem value="dog_walking">Dog Walking</SelectItem>
                      <SelectItem value="daycare">Pet Daycare</SelectItem>
                      <SelectItem value="overnight">Overnight Care</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Special Instructions */}
                <div className="space-y-2">
                  <Label htmlFor="instructions">Special Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={requestData.special_instructions}
                    onChange={(e) => setRequestData({...requestData, special_instructions: e.target.value})}
                    placeholder="Any special care instructions, feeding schedules, medication, etc..."
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={loading || !requestData.pet_id || !startDate || !endDate}
                    className="w-full"
                  >
                    {loading ? "Creating Request..." : "Post Care Request"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Your request will be visible to verified pet sitters in your area
                  </p>
                </div>
              </CardContent>
            </Card>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateCareRequest;