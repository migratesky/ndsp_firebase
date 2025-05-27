
// Screen Admin-3: School Database Management - Add New School Form (Create)
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';
import type { School } from '@/types'; // Ensure School type includes all fields

// Mock countries for dropdown, replace with dynamic fetching if needed
const mockCountriesList = ["United States", "United Kingdom", "Japan", "Germany", "Italy", "South Korea", "Spain", "France", "Canada", "Australia", "Online"];


export default function AddSchoolPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<School>>({
    name: '',
    country: '',
    city: '',
    address: '',
    website: '',
    phone: '',
    publicPrivate: 'Private', // Default value
    instructionInEnglish: true, // Default value
    boardingOption: false, // Default value
    boardingDetails: '',
    accreditation: '',
    gradesServed: '',
    genderSpecificPolicies: '',
    religiousAffiliation: '',
    typicalClassSizes: '',
    estimatedEnrollmentCount: '',
    lat: 0, // Default or prompt user
    lng: 0, // Default or prompt user
    isVirtual: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Basic validation
    if (!formData.name || !formData.country || !formData.city || !formData.address || !formData.website || !formData.publicPrivate || !formData.accreditation || !formData.gradesServed) {
        toast({
          title: 'Error',
          description: 'Please fill in all required fields (*).',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
    }

    try {
      const response = await fetch('/api/schools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'School added successfully.',
          variant: 'default'
        });
        router.push('/admin/schools'); // Redirect to schools list
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to add school. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'A network error occurred. Please check your connection and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof School, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: keyof School, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
     if (name === 'boardingOption' && !checked) {
      setFormData(prev => ({ ...prev, boardingDetails: '' }));
    }
    if (name === 'isVirtual' && checked) {
      setFormData(prev => ({...prev, country: 'Online', city: 'Global'}));
    }
  };


  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <h1 className="text-3xl font-bold text-primary flex items-center">
              <PlusCircle className="mr-3 h-8 w-8 text-accent" /> Add New School to Database
            </h1>
            <Button variant="outline" asChild>
              <Link href="/admin/schools">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to School List
              </Link>
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
              <CardDescription>Fill in the details for the new school. Fields marked with * are required.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">School Name *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select name="country" value={formData.country} onValueChange={(value) => handleSelectChange('country', value)} required>
                      <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                      <SelectContent>
                        {mockCountriesList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleChange} required disabled={formData.isVirtual} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">School Address *</Label>
                    <Textarea id="address" name="address" value={formData.address} onChange={handleChange} required disabled={formData.isVirtual} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">School Website URL *</Label>
                    <Input id="website" name="website" type="url" placeholder="https://example.com" value={formData.website} onChange={handleChange} required />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="phone">School Phone</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                  </div>
                </div>

                <hr/>

                {/* School Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <Label htmlFor="publicPrivate">Public/Private *</Label>
                    <Select name="publicPrivate" value={formData.publicPrivate} onValueChange={(value) => handleSelectChange('publicPrivate', value as 'Public' | 'Private')} required>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Private">Private</SelectItem>
                        <SelectItem value="Public">Public</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="gradesServed">Grade Levels Served *</Label>
                    <Input id="gradesServed" name="gradesServed" placeholder="e.g., PK-12, 9-12" value={formData.gradesServed} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="accreditation">Accreditation Information *</Label>
                    <Textarea id="accreditation" name="accreditation" value={formData.accreditation} onChange={handleChange} required />
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch id="instructionInEnglish" name="instructionInEnglish" checked={formData.instructionInEnglish} onCheckedChange={(checked) => handleSwitchChange('instructionInEnglish', checked)} />
                    <Label htmlFor="instructionInEnglish">Instruction in English *</Label>
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch id="boardingOption" name="boardingOption" checked={formData.boardingOption} onCheckedChange={(checked) => handleSwitchChange('boardingOption', checked)} />
                    <Label htmlFor="boardingOption">Boarding School *</Label>
                  </div>
                   {formData.boardingOption && (
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="boardingDetails">Boarding Details (capacity, grade levels)</Label>
                      <Textarea id="boardingDetails" name="boardingDetails" value={formData.boardingDetails} onChange={handleChange} />
                    </div>
                  )}
                </div>

                <hr/>
                
                {/* Additional PWS Fields */}
                <h3 className="text-lg font-semibold text-primary pt-2">Additional Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="genderSpecificPolicies">Gender-Specific Policies</Label>
                    <Textarea id="genderSpecificPolicies" name="genderSpecificPolicies" value={formData.genderSpecificPolicies} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="religiousAffiliation">Religious Affiliation/Restrictions</Label>
                    <Textarea id="religiousAffiliation" name="religiousAffiliation" value={formData.religiousAffiliation} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="typicalClassSizes">Typical Class Sizes</Label>
                    <Input id="typicalClassSizes" name="typicalClassSizes" placeholder="e.g., 15-20" value={formData.typicalClassSizes} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedEnrollmentCount">Estimated Enrollment Count</Label>
                    <Input id="estimatedEnrollmentCount" name="estimatedEnrollmentCount" placeholder="e.g., 300-400" value={formData.estimatedEnrollmentCount} onChange={handleChange} />
                  </div>
                   <div className="flex items-center space-x-2 pt-2">
                    <Switch id="isVirtual" name="isVirtual" checked={formData.isVirtual} onCheckedChange={(checked) => handleSwitchChange('isVirtual', checked)} />
                    <Label htmlFor="isVirtual">Is Virtual School?</Label>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="lat">Latitude</Label>
                    <Input id="lat" name="lat" type="number" step="any" value={formData.lat} onChange={handleChange} disabled={formData.isVirtual} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lng">Longitude</Label>
                    <Input id="lng" name="lng" type="number" step="any" value={formData.lng} onChange={handleChange} disabled={formData.isVirtual} />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => router.push('/admin/schools')} disabled={isLoading}>
                    Cancel
                  </Button>
                  <Button type="submit" className="min-w-[150px]" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save New School'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
         <footer className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>[Internal DoDEA Links] | [Admin Support]</p>
        </footer>
      </main>
    </div>
  );
}
