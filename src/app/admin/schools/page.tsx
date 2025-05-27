
// Screen Admin-2: School Database Management - List View (Read)
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { School as SchoolType } from '@/types';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { PlusCircle, Search, Edit, Trash2, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, FilterX } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 10;

export default function SchoolsListPage() {
  const { toast } = useToast();
  const [schools, setSchools] = useState<SchoolType[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<SchoolType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [countryFilter, setCountryFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [boardingFilter, setBoardingFilter] = useState('any'); // 'any', 'yes', 'no'

  const [schoolToDelete, setSchoolToDelete] = useState<SchoolType | null>(null);

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [schools, countryFilter, cityFilter, nameFilter, boardingFilter]);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/schools');
      if (!response.ok) throw new Error('Failed to fetch schools');
      const data = await response.json();
      setSchools(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let tempSchools = schools;
    if (countryFilter) {
      tempSchools = tempSchools.filter(s => s.country.toLowerCase().includes(countryFilter.toLowerCase()));
    }
    if (cityFilter) {
      tempSchools = tempSchools.filter(s => s.city.toLowerCase().includes(cityFilter.toLowerCase()));
    }
    if (nameFilter) {
      tempSchools = tempSchools.filter(s => s.name.toLowerCase().includes(nameFilter.toLowerCase()));
    }
    if (boardingFilter !== 'any') {
      tempSchools = tempSchools.filter(s => s.boardingOption === (boardingFilter === 'yes'));
    }
    setFilteredSchools(tempSchools);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleClearFilters = () => {
    setCountryFilter('');
    setCityFilter('');
    setNameFilter('');
    setBoardingFilter('any');
  };
  
  const handleDeleteSchool = async () => {
    if (!schoolToDelete || !schoolToDelete._id) return;
    try {
      const response = await fetch(`/api/schools/${schoolToDelete._id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete school');
      }
      toast({ title: "Success", description: "School deleted successfully." });
      setSchoolToDelete(null); // Close dialog
      fetchSchools(); // Refresh list
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Could not delete school.", variant: "destructive" });
    }
  };

  const totalPages = Math.ceil(filteredSchools.length / ITEMS_PER_PAGE);
  const paginatedSchools = filteredSchools.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (loading) return <div className="flex min-h-screen bg-muted/40"><AdminSidebar /><main className="flex-1 p-6 text-center">Loading schools...</main></div>;
  if (error) return <div className="flex min-h-screen bg-muted/40"><AdminSidebar /><main className="flex-1 p-6 text-red-500">Error: {error}</main></div>;

  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-primary">School Database Management</h1>
          <Button asChild>
            <Link href="/admin/schools/add"><PlusCircle className="mr-2 h-4 w-4" /> Add New School</Link>
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <Input placeholder="Country" value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} />
            <Input placeholder="City" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} />
            <Input placeholder="School Name" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />
            <Select value={boardingFilter} onValueChange={setBoardingFilter}>
              <SelectTrigger><SelectValue placeholder="Boarding" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Boarding: Any</SelectItem>
                <SelectItem value="yes">Boarding: Yes</SelectItem>
                <SelectItem value="no">Boarding: No</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex space-x-2 lg:col-span-4 justify-end">
              <Button onClick={applyFilters}><Search className="mr-2 h-4 w-4" /> Filter</Button>
              <Button variant="outline" onClick={handleClearFilters}><FilterX className="mr-2 h-4 w-4" /> Clear</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>School List</CardTitle>
            <CardDescription>{filteredSchools.length} school(s) found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Boarding</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSchools.map((school) => (
                  <TableRow key={school._id}>
                    <TableCell className="font-medium">{school.name}</TableCell>
                    <TableCell>{school.city}</TableCell>
                    <TableCell>{school.country}</TableCell>
                    <TableCell>{school.boardingOption ? 'Yes' : 'No'}</TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/schools/edit/${school._id}`}><Edit className="h-4 w-4" /></Link>
                      </Button>
                       <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" onClick={() => setSchoolToDelete(school)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {paginatedSchools.length === 0 && <p className="text-center text-muted-foreground py-4">No schools match your current filters.</p>}
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            <Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}><ChevronsRight className="h-4 w-4" /></Button>
          </div>
        )}
        
        <AlertDialog open={!!schoolToDelete} onOpenChange={(open) => !open && setSchoolToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm School Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to delete the school: <strong>{schoolToDelete?.name}</strong> ({schoolToDelete?.city}, {schoolToDelete?.country}). This action cannot be undone. Are you sure?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSchoolToDelete(null)}>NO, CANCEL</AlertDialogCancel>
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
