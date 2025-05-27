
'use client';

import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Search, Edit, Trash2, KeyRound, FilterX } from 'lucide-react';
// Mock data - replace with actual data fetching
const mockUsers = [
  { id: '1', username: 'editor_jane@dodea.mil', email: 'jane.doe@dodea.mil', role: 'Editor', status: 'Active' },
  { id: '2', username: 'temp_user@contractor.com', email: 'temp@contractor.com', role: 'Reviewer', status: 'Pwd Reset Req' },
  { id: '3', username: 'admin_john@dodea.mil', email: 'john.smith@dodea.mil', role: 'Admin, Editor', status: 'Active' },
  { id: '4', username: 'disabled_user@example.com', email: 'disabled@example.com', role: 'Viewer', status: 'Disabled' },
];

export default function UserManagementPage() {
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
            <Input placeholder="Username/Email" />
            <Select>
              <SelectTrigger><SelectValue placeholder="Role: All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="reviewer">Reviewer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger><SelectValue placeholder="Status: All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
                <SelectItem value="pwd_reset">Pwd Reset Req</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex space-x-2 lg:col-span-1 justify-end">
              <Button><Search className="mr-2 h-4 w-4" /> Filter</Button>
              <Button variant="outline"><FilterX className="mr-2 h-4 w-4" /> Clear</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manual User Account List</CardTitle>
            <CardDescription>{mockUsers.length} user account(s) found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username (Login ID)</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role(s)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-700' : user.status === 'Disabled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell className="space-x-1">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/user-management/edit/${user.id}`}><Edit className="h-3 w-3" /></Link>
                      </Button>
                      <Button variant="outline" size="sm" title="Reset Password (placeholder)">
                        <KeyRound className="h-3 w-3" />
                      </Button>
                       <Button variant="destructive" size="sm" title={user.status === 'Disabled' ? 'Enable User' : 'Disable User'}>
                        <Trash2 className="h-3 w-3" /> {/* Icon could change based on action */}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {/* Add Pagination similar to School List if needed */}
         <footer className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>[Internal DoDEA Links] | [Admin Support]</p>
        </footer>
      </main>
    </div>
  );
}
