
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';
import type { UserAccount, UserRole } from '@/types';
import { UserRoles } from '@/types'; // Import available roles

export default function AddUserAccountPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<UserAccount>>({
    username: '',
    email: '',
    fullName: '',
    roles: [],
    status: 'Active', // Default status
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.username || !formData.email || !formData.roles || formData.roles.length === 0) {
      toast({
        title: 'Error',
        description: 'Username, email, and at least one role are required.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'User account created successfully.',
          variant: 'default',
        });
        router.push('/admin/user-management');
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.error || errorData.details || 'Failed to create user account.',
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
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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

  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <h1 className="text-3xl font-bold text-primary flex items-center">
              <PlusCircle className="mr-3 h-8 w-8 text-accent" /> Create New Manual Account
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
              <CardDescription>Fill in the details for the new manual user account. <cite className="text-xs not-italic text-muted-foreground ml-1">[cite: 220]</cite></CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">User Login Identification (Username) *</Label>
                  <Input id="username" name="username" value={formData.username} onChange={handleChange} required placeholder="e.g., user@dodea.mil" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="user.name@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name (Optional)</Label>
                  <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} />
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
                    <p className="text-sm text-muted-foreground">
                        Initial Action: User will be required to reset password on first login (placeholder functionality). <cite className="text-xs not-italic">[cite: 221]</cite>
                    </p>
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => router.push('/admin/user-management')} disabled={isLoading}>
                    Cancel
                  </Button>
                  <Button type="submit" className="min-w-[150px]" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
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
