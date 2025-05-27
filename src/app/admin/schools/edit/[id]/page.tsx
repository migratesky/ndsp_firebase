
// Screen Admin-4: School Database Management - Edit School Form (Update)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';
import type { School } from '@/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Mock countries for dropdown, replace with dynamic fetching if needed
const mockCountriesList = ["United States", "United Kingdom", "Japan", "Germany", "Italy", "South Korea", "Spain", "France", "Canada", "Australia", "Online"];

export default function EditSchoolPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const schoolId = params.id as string;

  const [formData, setFormData] = useState<Partial<School>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null); // Placeholder for audit info

  useEffect(() => {
    if (schoolId) {
      fetchSchoolData(schoolId);
    }
  }, [schoolId]);

  const fetchSchoolData = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/schools/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch school data');
      }
      const data = await response.json();
      setFormData(data);
      // Placeholder for last updated - in a real app, this would come from the data
      setLastUpdated(data.updatedAt ? new Date(data.updatedAt).toLocaleString() : new Date().toLocaleString()); 
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not load school data. ' + (error instanceof Error ? error.message : ''),
        variant: 'destructive',
      });
      router.push('/admin/schools');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Basic validation
    if (!formData.name || !formData.country || !formData.city || !formData.address || !formData.website || !formData.publicPrivate || !formData.accreditation || !formData.gradesServed) {
        toast({
          title: 'Error',
          description: 'Please fill in all required fields (*).',
          variant: 'destructive',
        });
        setIsSaving(false);
        return;
    }

    try {
      const response = await fetch(`/api/schools/${schoolId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'School updated successfully.',
          variant: 'default',
        });
        fetchSchoolData(schoolId); // Refresh data to show any backend-applied changes
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to update school.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'A network error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteSchool = async () => {
    setShowDeleteConfirm(false); // Close dialog
    setIsSaving(true); // Use isSaving to disable buttons during delete
    try {
      const response = await fetch(`/api/schools/${schoolId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete school');
      }
      toast({ title: "Success", description: "School deleted successfully." });
      router.push('/admin/schools');
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Could not delete school.", variant: "destructive" });
      setIsSaving(false);
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-muted/40">
        <AdminSidebar />
        <main className="flex-1 p-6 text-center">Loading school data...</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <h1 className="text-3xl font-bold text-primary truncate">
              Edit School: <span className="text-accent">{formData.name || 'Loading...'}</span>
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
              <CardDescription>Update the details for the school. Fields marked with * are required.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">School Name *</Label>
                    <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select name="country" value={formData.country || ''} onValueChange={(value) => handleSelectChange('country', value)} required>
                      <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                      <SelectContent>
                        {mockCountriesList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" name="city" value={formData.city || ''} onChange={handleChange} required disabled={formData.isVirtual} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">School Address *</Label>
                    <Textarea id="address" name="address" value={formData.address || ''} onChange={handleChange} required disabled={formData.isVirtual} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">School Website URL *</Label>
                    <Input id="website" name="website" type="url" placeholder="https://example.com" value={formData.website || ''} onChange={handleChange} required />
                    {/* TODO: Add URL Verified Active checkbox if needed as separate field */}
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="phone">School Phone</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone || ''} onChange={handleChange} />
                  </div>
                </div>

                <hr/>

                {/* School Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <Label htmlFor="publicPrivate">Public/Private *</Label>
                    <Select name="publicPrivate" value={formData.publicPrivate || 'Private'} onValueChange={(value) => handleSelectChange('publicPrivate', value as 'Public' | 'Private')} required>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Private">Private</SelectItem>
                        <SelectItem value="Public">Public</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="gradesServed">Grade Levels Served *</Label>
                    <Input id="gradesServed" name="gradesServed" placeholder="e.g., PK-12, 9-12" value={formData.gradesServed || ''} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="accreditation">Accreditation Information *</Label>
                    <Textarea id="accreditation" name="accreditation" value={formData.accreditation || ''} onChange={handleChange} required />
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch id="instructionInEnglish" name="instructionInEnglish" checked={!!formData.instructionInEnglish} onCheckedChange={(checked) => handleSwitchChange('instructionInEnglish', checked)} />
                    <Label htmlFor="instructionInEnglish">Instruction in English *</Label>
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch id="boardingOption" name="boardingOption" checked={!!formData.boardingOption} onCheckedChange={(checked) => handleSwitchChange('boardingOption', checked)} />
                    <Label htmlFor="boardingOption">Boarding School *</Label>
                  </div>
                   {formData.boardingOption && (
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="boardingDetails">Boarding Details (capacity, grade levels)</Label>
                      <Textarea id="boardingDetails" name="boardingDetails" value={formData.boardingDetails || ''} onChange={handleChange} />
                    </div>
                  )}
                </div>

                <hr/>
                
                {/* Additional PWS Fields */}
                <h3 className="text-lg font-semibold text-primary pt-2">Additional Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="genderSpecificPolicies">Gender-Specific Policies</Label>
                    <Textarea id="genderSpecificPolicies" name="genderSpecificPolicies" value={formData.genderSpecificPolicies || ''} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="religiousAffiliation">Religious Affiliation/Restrictions</Label>
                    <Textarea id="religiousAffiliation" name="religiousAffiliation" value={formData.religiousAffiliation || ''} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="typicalClassSizes">Typical Class Sizes</Label>
                    <Input id="typicalClassSizes" name="typicalClassSizes" placeholder="e.g., 15-20" value={formData.typicalClassSizes || ''} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedEnrollmentCount">Estimated Enrollment Count</Label>
                    <Input id="estimatedEnrollmentCount" name="estimatedEnrollmentCount" placeholder="e.g., 300-400" value={formData.estimatedEnrollmentCount || ''} onChange={handleChange} />
                  </div>
                   <div className="flex items-center space-x-2 pt-2">
                    <Switch id="isVirtual" name="isVirtual" checked={!!formData.isVirtual} onCheckedChange={(checked) => handleSwitchChange('isVirtual', checked)} />
                    <Label htmlFor="isVirtual">Is Virtual School?</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lat">Latitude</Label>
                    <Input id="lat" name="lat" type="number" step="any" value={formData.lat ?? 0} onChange={handleChange} disabled={!!formData.isVirtual} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lng">Longitude</Label>
                    <Input id="lng" name="lng" type="number" step="any" value={formData.lng ?? 0} onChange={handleChange} disabled={!!formData.isVirtual} />
                  </div>
                </div>
                
                {lastUpdated && (
                  <p className="text-xs text-muted-foreground mt-4">Last Updated: {lastUpdated} (by UserX - Placeholder)</p>
                )}

                <div className="flex justify-between items-center pt-4">
                  <AlertDialogTrigger asChild>
                     <Button type="button" variant="destructive" onClick={() => setShowDeleteConfirm(true)} disabled={isSaving}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete This School
                    </Button>
                  </AlertDialogTrigger>
                  <div className="flex space-x-4">
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/schools')} disabled={isSaving}>
                      Cancel
                    </Button>
                    <Button type="submit" className="min-w-[150px]" disabled={isSaving}>
                      <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm School Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to delete the school: <strong>{formData.name}</strong> ({formData.city}, {formData.country}). This action cannot be undone. Are you sure?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>NO, CANCEL</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteSchool} className="bg-destructive hover:bg-destructive/90">YES, DELETE THIS SCHOOL</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

         <footer className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>[Internal DoDEA Links] | [Admin Support]</p>
        </footer>
      </main>
    </div>
  );
}
