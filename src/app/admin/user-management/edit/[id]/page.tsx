
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';
import type { UserAccount, UserRole, UserAccountStatus } from '@/types';
import { UserRoles, UserAccountStatuses } from '@/types'; // Import available roles and statuses
import { Skeleton } from '@/components/ui/skeleton';

export default function EditUserAccountPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [formData, setFormData] = useState<Partial<UserAccount>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    }
  }, [userId]);

  const fetchUserData = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data: UserAccount = await response.json();
      setFormData(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not load user data. ' + (error instanceof Error ? error.message : ''),
        variant: 'destructive',
      });
      router.push('/admin/user-management');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (!formData.email || !formData.roles || formData.roles.length === 0 || !formData.status) {
      toast({
        title: 'Error',
        description: 'Email, at least one role, and status are required.',
        variant: 'destructive',
      });
      setIsSaving(false);
      return;
    }

    try {
      // Ensure roles is an array of strings
      const payload = {
        ...formData,
        roles: Array.isArray(formData.roles) ? formData.roles : [],
      };

      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'User account updated successfully.',
          variant: 'default',
        });
        // Optionally, re-fetch or update local state
        const updatedUser = await response.json();
        setFormData(updatedUser);
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.error || errorData.details || 'Failed to update user account.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'A network error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: keyof UserAccount, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role: UserRole, checked: boolean) => {
    setFormData(prev => {
      const currentRoles = prev.roles ? [...prev.roles] : [];
      if (checked) {
        if (!currentRoles.includes(role)) {
          return { ...prev, roles: [...currentRoles, role] };
        }
      } else {
        return { ...prev, roles: currentRoles.filter(r => r !== role) };
      }
      return prev;
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-muted/40">
        <AdminSidebar />
        <main className="flex-1 p-6">
            <div className="max-w-2xl mx-auto">
                <Skeleton className="h-8 w-3/4 mb-6" />
                <Card>
                    <CardHeader><Skeleton className="h-6 w-1/2 mb-2" /><Skeleton className="h-4 w-3/4" /></CardHeader>
                    <CardContent className="space-y-6">
                        {[...Array(5)].map((_, i) => <div key={i} className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>)}
                         <div className="flex justify-end space-x-4 pt-4">
                            <Skeleton className="h-10 w-24" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <h1 className="text-3xl font-bold text-primary truncate">
              Edit Manual Account: <span className="text-accent">{formData.username || 'Loading...'}</span>
            </h1>
            <Button variant="outline" asChild>
              <Link href="/admin/user-management">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to User List
              </Link>
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>User Account Information</CardTitle>
              <CardDescription>Update the details for this manual user account.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">User Login ID (Username)</Label>
                  <Input id="username" name="username" value={formData.username || ''} readOnly disabled className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" name="email" type="email" value={formData.email || ''} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name (Optional)</Label>
                  <Input id="fullName" name="fullName" value={formData.fullName || ''} onChange={handleChange} />
                </div>
                
                <div className="space-y-3">
                  <Label>Assign Role(s) *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {UserRoles.map(role => (
                      <div key={role} className="flex items-center space-x-2">
                        <Checkbox
                          id={`role-${role.replace(/\s+/g, '-')}`}
                          checked={formData.roles?.includes(role)}
                          onCheckedChange={(checked) => handleRoleChange(role, Boolean(checked))}
                        />
                        <Label htmlFor={`role-${role.replace(/\s+/g, '-')}`} className="font-normal">{role}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Account Status *</Label>
                  <Select 
                    name="status" 
                    value={formData.status || 'Active'} 
                    onValueChange={(value) => handleSelectChange('status', value as UserAccountStatus)} 
                    required
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {UserAccountStatuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                 <div className="space-y-2">
                    <Button type="button" variant="outline" onClick={() => toast({title: "Placeholder", description:"Force password reset functionality not yet implemented."})}>
                        Force Password Reset on Next Login <cite className="text-xs not-italic text-muted-foreground ml-1">[cite: 221]</cite>
                    </Button>
                </div>
                
                {formData.createdAt && (
                  <p className="text-xs text-muted-foreground">
                    Account Created: {new Date(formData.createdAt).toLocaleString()}
                  </p>
                )}
                {formData.updatedAt && (
                     <p className="text-xs text-muted-foreground">
                    Last Updated: {new Date(formData.updatedAt).toLocaleString()}
                  </p>
                )}
                
                <div className="flex justify-end space-x-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => router.push('/admin/user-management')} disabled={isSaving}>
                    Cancel
                  </Button>
                  <Button type="submit" className="min-w-[150px]" disabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
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
