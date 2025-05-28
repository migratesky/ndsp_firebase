'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Search, Edit, Trash2, KeyRound, FilterX, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { UserAccount, UserRole, UserAccountStatus } from '@/types';
import { UserRoles, UserAccountStatuses } from '@/types';

const ITEMS_PER_PAGE = 10;

export default function UserManagementPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<UserAccountStatus | 'all'>('all');

  const [userToDelete, setUserToDelete] = useState<UserAccount | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData?.error || 'Failed to fetch users');
      }
      const responseData = await response.json() as { data?: UserAccount[] };
      setUsers(responseData.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      toast({ title: "Error", description: err instanceof Error ? err.message : "Could not fetch users.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearchTerm = searchTerm === '' || 
                                user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRole = roleFilter === 'all' || (user.roles && user.roles.includes(roleFilter));
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearchTerm && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setStatusFilter('all');
  };
  
  const handleDeleteUser = async () => {
    if (!userToDelete || !userToDelete._id) return;
    try {
      const response = await fetch(`/api/users/${userToDelete._id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }
      toast({ title: "Success", description: "User account deleted successfully." });
      setUserToDelete(null); // Close dialog
      fetchUsers(); // Refresh list
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Could not delete user account.", variant: "destructive" });
    }
  };

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (loading) return <div className="flex min-h-screen bg-muted/40"><AdminSidebar /><main className="flex-1 p-6 text-center">Loading user accounts...</main></div>;
  // Error is displayed via toast

  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-primary">Manual User Account Management <cite className="text-xs not-italic text-muted-foreground ml-2">[cite: 220]</cite></h1>
          <Button asChild>
            <Link href="/admin/user-management/add"><PlusCircle className="mr-2 h-4 w-4" /> Create New Manual Account</Link>
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <Input placeholder="Username/Email/Name" value={searchTerm} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)} />
            <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as UserRole | 'all')}>
              <SelectTrigger><SelectValue placeholder="Role: All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {UserRoles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as UserAccountStatus | 'all')}>
              <SelectTrigger><SelectValue placeholder="Status: All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                 {UserAccountStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="flex space-x-2 lg:col-span-1 justify-end items-center"> {/* Ensure buttons are on the same line and aligned */}
               <Button onClick={handleClearFilters} variant="outline"><FilterX className="mr-2 h-4 w-4" /> Clear</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manual User Account List</CardTitle>
            <CardDescription>{filteredUsers.length} user account(s) found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username (Login ID)</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Role(s)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.fullName || '-'}</TableCell>
                    <TableCell>{user.roles?.join(', ') || '-'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.status === 'Active' ? 'bg-green-100 text-green-700' 
                        : user.status === 'Disabled' ? 'bg-red-100 text-red-700' 
                        : 'bg-yellow-100 text-yellow-700'}`
                      }>
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell className="space-x-1">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/user-management/edit/${user._id}`}><Edit className="h-3 w-3" /></Link>
                      </Button>
                      <Button variant="outline" size="sm" title="Reset Password (placeholder)" onClick={() => toast({title: "Placeholder", description:"Password reset functionality not yet implemented."})}>
                        <KeyRound className="h-3 w-3" />
                      </Button>
                      <Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" title="Delete User" onClick={() => setUserToDelete(user)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirm User Account Deletion</AlertDialogTitle>
                              <AlertDialogDescription>
                                You are about to permanently delete the user account: <strong>{userToDelete?.username}</strong> ({userToDelete?.email}). This action cannot be undone. Are you sure?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setUserToDelete(null)}>NO, CANCEL</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90">YES, DELETE THIS ACCOUNT</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {paginatedUsers.length === 0 && <p className="text-center text-muted-foreground py-4">No users match your current filters.</p>}
             {error && <p className="text-center text-destructive py-4">Error fetching users: {error}</p>}
          </CardContent>
        </Card>
        
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            <Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1 || loading}><ChevronsLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || loading}><ChevronLeft className="h-4 w-4" /></Button>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || loading}><ChevronRight className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || loading}><ChevronsRight className="h-4 w-4" /></Button>
          </div>
        )}
        
        <footer className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>[Internal DoDEA Links] | [Admin Support]</p>
        </footer>
      </main>
    </div>
  );
}
