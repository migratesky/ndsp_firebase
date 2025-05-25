// Placeholder for Admin School DB Management
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { LayoutDashboard, School, Users, FileEdit, LogOut, PlusCircle, Edit, Trash2, Search } from "lucide-react";

// Mock data for schools
const mockAdminSchools = [
  { id: '1', name: 'Example International School', country: 'Germany', city: 'Frankfurt', accreditation: 'CIS' },
  { id: '2', name: 'Global Learning Academy', country: 'Japan', city: 'Tokyo', accreditation: 'WASC' },
  { id: '3', name: 'Roma International School', country: 'Italy', city: 'Rome', accreditation: 'NEASC' },
  { id: '4', name: 'Seoul Global Academy', country: 'South Korea', city: 'Seoul', accreditation: 'WASC' },
];

export default function AdminSchoolManagementPage() {
  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Admin Sidebar Placeholder */}
      <aside className="w-64 bg-primary text-primary-foreground p-4 space-y-2 hidden md:flex md:flex-col">
        <h2 className="text-xl font-semibold mb-6">Admin Panel</h2>
        <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:bg-primary/80" asChild>
          <Link href="/admin/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
        </Button>
        <Button variant="secondary" className="w-full justify-start" asChild>
          <Link href="/admin/school-management"><School className="mr-2 h-4 w-4" /> School DB Mgt</Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:bg-primary/80" asChild>
          <Link href="/admin/user-management"><Users className="mr-2 h-4 w-4" /> User Mgt</Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:bg-primary/80" asChild>
          <Link href="/admin/content-management"><FileEdit className="mr-2 h-4 w-4" /> Content Mgt</Link>
        </Button>
        <div className="mt-auto"> {/* Pushes logout to the bottom */}
             <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:bg-primary/80" asChild>
                <Link href="/"><LogOut className="mr-2 h-4 w-4" /> Logout</Link>
            </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-primary">School Database Management</h1>
            <span className="text-sm text-muted-foreground">Welcome, AdminName</span>
        </header>
        
        <Card>
          <CardHeader>
            <CardTitle>Manage Schools</CardTitle>
            <CardDescription>Add, edit, or remove school entries from the database.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Input placeholder="Search schools..." className="max-w-sm" />
                <Button variant="outline"><Search className="mr-2 h-4 w-4" /> Search</Button>
              </div>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New School
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School Name</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Accreditation</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAdminSchools.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell>{school.name}</TableCell>
                    <TableCell>{school.country}</TableCell>
                    <TableCell>{school.city}</TableCell>
                    <TableCell>{school.accreditation}</TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="outline" size="icon" title="Edit School"><Edit className="h-4 w-4" /></Button>
                      <Button variant="destructive" size="icon" title="Delete School"><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
                <PaginationItem><PaginationNext href="#" /></PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
