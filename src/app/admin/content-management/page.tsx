// Placeholder for Admin Content Management
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, School, Users, FileEdit, LogOut, Pencil } from "lucide-react";

export default function AdminContentManagementPage() {
  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Admin Sidebar Placeholder */}
      <aside className="w-64 bg-primary text-primary-foreground p-4 space-y-2 hidden md:flex md:flex-col">
        <h2 className="text-xl font-semibold mb-6">Admin Panel</h2>
        <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:bg-primary/80" asChild>
          <Link href="/admin/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:bg-primary/80" asChild>
          <Link href="/admin/school-management"><School className="mr-2 h-4 w-4" /> School DB Mgt</Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:bg-primary/80" asChild>
          <Link href="/admin/user-management"><Users className="mr-2 h-4 w-4" /> User Mgt</Link>
        </Button>
        <Button variant="secondary" className="w-full justify-start" asChild>
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
            <h1 className="text-3xl font-bold text-primary">Content Management</h1>
            <span className="text-sm text-muted-foreground">Welcome, AdminName</span>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Announcements</CardTitle>
              <CardDescription>Manage site-wide announcements.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Last updated: 2024-07-20</p>
              <Button variant="outline"><Pencil className="mr-2 h-4 w-4" /> Edit Announcements</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
              <CardDescription>Manage program resources and fact sheets.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Total resources: 5 (mock)</p>
              <Button variant="outline"><Pencil className="mr-2 h-4 w-4" /> Edit Resources</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Static Page Content</CardTitle>
              <CardDescription>Edit content for pages like Privacy Policy, Accessibility.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Manage text and information on static pages.</p>
              <Button variant="outline"><Pencil className="mr-2 h-4 w-4" /> Edit Page Content</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Homepage Content</CardTitle>
              <CardDescription>Manage hero section, quick links etc.</CardDescription>
            </CardHeader>
            <CardContent>
               <Button variant="outline"><Pencil className="mr-2 h-4 w-4" /> Edit Homepage</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
