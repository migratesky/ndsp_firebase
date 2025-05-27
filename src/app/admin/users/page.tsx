'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Toast } from '@/components/ui/toast';
import { Skeleton } from '@/components/ui/skeleton';
import { EditUserDialog } from '@/components/admin/EditUserDialog';
import { AddUserDialog } from '@/components/admin/AddUserDialog';
import { useSession } from 'next-auth/react';

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [addUserOpen, setAddUserOpen] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (status === 'authenticated' && session.user.role !== 'admin') {
      router.push('/');
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
        Toast({ title: "Error loading users", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    
    if (status === 'authenticated') {
      fetchUsers();
    }
  }, [status, session, router]);

  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: userId })
      });
      if (!response.ok) throw new Error('Delete failed');
      setUsers(users.filter(user => user._id !== userId));
      Toast({ title: "User deleted successfully" });
    } catch (error) {
      Toast({ title: "Error deleting user", variant: "destructive" });
    }
  };

  const handleSave = async (updatedUser: User) => {
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });
      if (!response.ok) throw new Error('Update failed');
      
      setUsers(users.map(u => u._id === updatedUser._id ? updatedUser : u));
      Toast({ title: "User updated successfully" });
    } catch (error) {
      console.error('Error updating user:', error);
      Toast({ title: "Error updating user", variant: "destructive" });
    }
  };

  const handleAdd = async (newUser: Omit<User, '_id'>) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      
      if (!response.ok) throw new Error('Add failed');
      
      const result = await response.json();
      setUsers([...users, { ...newUser, _id: result.id }]);
      Toast({ title: "User added successfully" });
    } catch (error) {
      console.error('Error adding user:', error);
      Toast({ title: "Error adding user", variant: "destructive" });
    }
  };

  if (loading) return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-[200px]" />
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="text-center py-8">
      <p className="text-red-500">{error}</p>
      <Button 
        variant="outline" 
        onClick={() => window.location.reload()}
        className="mt-4"
      >
        Retry
      </Button>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button 
          data-testid="add-user-button"
          onClick={() => setAddUserOpen(true)}
        >
          Add New User
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell className="space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  data-testid="edit-user"
                  onClick={() => setEditingUser(user)}
                >
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDelete(user._id)}
                  data-testid="delete-user"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <EditUserDialog
        user={editingUser!}
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleSave}
      />
      <AddUserDialog
        open={addUserOpen}
        onClose={() => setAddUserOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  );
}
