'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

export default function AddSchoolPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    city: '',
    address: '',
    website: '',
    phone: '',
    gradesServed: '',
    instructionInEnglish: false,
    publicPrivate: 'Private',
    boardingOption: false,
    boardingDetails: '',
    accreditation: '',
    lat: 0,
    lng: 0,
    isVirtual: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/schools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          id: `school-${Date.now()}` // Generate a temporary ID
        }),
      });

      if (response.ok) {
        toast(<div data-testid="toast-success">
          <div>
            <h2>Success</h2>
            <p>School added successfully</p>
          </div>
        </div>);
      } else {
        const error = await response.json();
        toast({
          'data-testid': 'toast-error',
          title: 'Error',
          description: error.message || 'Failed to add school',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        'data-testid': 'toast-error',
        title: 'Error',
        description: 'Network error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/admin/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle>Add New School</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">School Name *</Label>
                    <Input 
                      data-testid="school-name"
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select 
                      data-testid="country"
                      name="country" 
                      value={formData.country}
                      onValueChange={(value) => setFormData({...formData, country: value})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="JP">Japan</SelectItem>
                        <SelectItem value="DE">Germany</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input 
                      data-testid="city"
                      id="city" 
                      name="city" 
                      value={formData.city} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input 
                      data-testid="address"
                      id="address" 
                      name="address" 
                      value={formData.address} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website *</Label>
                    <Input 
                      data-testid="website"
                      id="website" 
                      name="website" 
                      type="url" 
                      value={formData.website} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      data-testid="phone"
                      id="phone" 
                      name="phone" 
                      type="tel" 
                      value={formData.phone} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
                
                {/* School Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gradesServed">Grades Served *</Label>
                    <Input 
                      data-testid="grades-served"
                      id="gradesServed" 
                      name="gradesServed" 
                      placeholder="e.g. PK-12" 
                      value={formData.gradesServed} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="publicPrivate">School Type *</Label>
                    <Select 
                      data-testid="school-type"
                      name="publicPrivate" 
                      value={formData.publicPrivate}
                      onValueChange={(value) => setFormData({...formData, publicPrivate: value})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Public">Public</SelectItem>
                        <SelectItem value="Private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accreditation">Accreditation *</Label>
                    <Input 
                      data-testid="accreditation"
                      id="accreditation" 
                      name="accreditation" 
                      value={formData.accreditation} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      data-testid="instruction-in-english"
                      id="instructionInEnglish" 
                      checked={formData.instructionInEnglish} 
                      onCheckedChange={(checked) => setFormData({...formData, instructionInEnglish: checked})} 
                    />
                    <Label htmlFor="instructionInEnglish">Instruction in English</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      data-testid="boarding-option"
                      id="boardingOption" 
                      checked={formData.boardingOption} 
                      onCheckedChange={(checked) => setFormData({...formData, boardingOption: checked})} 
                    />
                    <Label htmlFor="boardingOption">Boarding Option</Label>
                  </div>
                  
                  {formData.boardingOption && (
                    <div className="space-y-2">
                      <Label htmlFor="boardingDetails">Boarding Details</Label>
                      <Input 
                        data-testid="boarding-details"
                        id="boardingDetails" 
                        name="boardingDetails" 
                        value={formData.boardingDetails} 
                        onChange={handleChange} 
                      />
                    </div>
                  )}
                </div>
                
                <Button type="submit" className="w-full">
                  Add School
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
