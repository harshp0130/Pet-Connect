
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Plus, Stethoscope, Syringe, Heart, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface HealthRecord {
  id: string;
  pet_id: string;
  record_type: 'vaccination' | 'checkup' | 'treatment' | 'medication' | 'emergency';
  title: string;
  description: string;
  date: string;
  veterinarian: string;
  notes?: string;
  next_due_date?: string;
  created_at: string;
}

interface Pet {
  id: string;
  name: string;
  type: string;
  breed?: string;
}

export const PetHealthRecords = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<string>('');
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    record_type: 'checkup' as const,
    title: '',
    description: '',
    date: '',
    veterinarian: '',
    notes: '',
    next_due_date: ''
  });

  useEffect(() => {
    if (user) {
      fetchPets();
    }
  }, [user]);

  useEffect(() => {
    if (selectedPet) {
      fetchHealthRecords();
    }
  }, [selectedPet]);

  const fetchPets = async () => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('id, name, type, breed')
        .eq('user_id', user?.id);

      if (error) throw error;
      setPets(data || []);
      if (data && data.length > 0) {
        setSelectedPet(data[0].id);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching pets",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const fetchHealthRecords = async () => {
    if (!selectedPet) return;

    try {
      const { data, error } = await (supabase as any)
        .from('pet_health_records')
        .select('*')
        .eq('pet_id', selectedPet)
        .order('date', { ascending: false });

      if (error) throw error;
      setHealthRecords(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching health records",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet) return;

    setLoading(true);
    try {
      const { error } = await (supabase as any)
        .from('pet_health_records')
        .insert([{
          pet_id: selectedPet,
          ...formData
        }]);

      if (error) throw error;

      toast({
        title: "Health record added",
        description: "Pet health record has been saved successfully",
        className: "bg-green-50 border-green-200 text-green-800"
      });

      setFormData({
        record_type: 'checkup',
        title: '',
        description: '',
        date: '',
        veterinarian: '',
        notes: '',
        next_due_date: ''
      });
      setShowAddRecord(false);
      fetchHealthRecords();
    } catch (error: any) {
      toast({
        title: "Error adding record",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'vaccination': return <Syringe className="h-4 w-4" />;
      case 'checkup': return <Stethoscope className="h-4 w-4" />;
      case 'treatment': return <Heart className="h-4 w-4" />;
      case 'medication': return <FileText className="h-4 w-4" />;
      case 'emergency': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getRecordColor = (type: string) => {
    switch (type) {
      case 'vaccination': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'checkup': return 'bg-green-100 text-green-800 border-green-200';
      case 'treatment': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'medication': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (pets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Pet Health Records
          </CardTitle>
          <CardDescription>
            Add your pets first to start tracking their health records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No pets found. Please add a pet first.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Pet Health Records
              </CardTitle>
              <CardDescription>
                Track vaccinations, checkups, treatments and more
              </CardDescription>
            </div>
            <Dialog open={showAddRecord} onOpenChange={setShowAddRecord}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Record
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Health Record</DialogTitle>
                  <DialogDescription>
                    Record a new health entry for your pet
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="record_type">Record Type</Label>
                      <select
                        id="record_type"
                        value={formData.record_type}
                        onChange={(e) => setFormData({...formData, record_type: e.target.value as any})}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="checkup">Regular Checkup</option>
                        <option value="vaccination">Vaccination</option>
                        <option value="treatment">Treatment</option>
                        <option value="medication">Medication</option>
                        <option value="emergency">Emergency</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g., Annual Checkup, Rabies Vaccination"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="veterinarian">Veterinarian</Label>
                    <Input
                      id="veterinarian"
                      value={formData.veterinarian}
                      onChange={(e) => setFormData({...formData, veterinarian: e.target.value})}
                      placeholder="Dr. Smith at ABC Veterinary Clinic"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Details about the health record"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Any additional observations or instructions"
                    />
                  </div>

                  <div>
                    <Label htmlFor="next_due_date">Next Due Date (if applicable)</Label>
                    <Input
                      id="next_due_date"
                      type="date"
                      value={formData.next_due_date}
                      onChange={(e) => setFormData({...formData, next_due_date: e.target.value})}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowAddRecord(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Record'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Pet Selection */}
          <div className="mb-6">
            <Label>Select Pet</Label>
            <select
              value={selectedPet}
              onChange={(e) => setSelectedPet(e.target.value)}
              className="w-full p-2 border rounded-md mt-1"
            >
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} ({pet.type} - {pet.breed})
                </option>
              ))}
            </select>
          </div>

          {/* Health Records */}
          <div className="space-y-4">
            {healthRecords.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No health records yet</h3>
                <p className="text-muted-foreground">Add your first health record to get started.</p>
              </div>
            ) : (
              healthRecords.map((record) => (
                <Card key={record.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          {getRecordIcon(record.record_type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{record.title}</h4>
                            <Badge className={getRecordColor(record.record_type)}>
                              {record.record_type.charAt(0).toUpperCase() + record.record_type.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{record.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(record.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Stethoscope className="h-3 w-3" />
                              {record.veterinarian}
                            </div>
                          </div>
                          {record.next_due_date && (
                            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                              <strong>Next due:</strong> {new Date(record.next_due_date).toLocaleDateString()}
                            </div>
                          )}
                          {record.notes && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                              <strong>Notes:</strong> {record.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
