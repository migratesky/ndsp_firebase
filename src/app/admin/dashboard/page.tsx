// Placeholder for Admin Dashboard (Screen 14)
// This page would be protected and have its own layout.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LayoutDashboard, School, Users, FileEdit, LogOut } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Admin Sidebar Placeholder */}
      <aside className="w-64 bg-primary text-primary-foreground p-4 space-y-2 hidden md:block">
        <h2 className="text-xl font-semibold mb-6">Admin Panel</h2>
        <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:bg-primary/80" asChild>
          <Link href="/admin/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:bg-primary/80">
          <School className="mr-2 h-4 w-4" /> School DB Mgt
        </Button>
        <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:bg-primary/80">
          <Users className="mr-2 h-4 w-4" /> User Mgt
        </Button>
        <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:bg-primary/80">
          <FileEdit className="mr-2 h-4 w-4" /> Content Mgt
        </Button>
        <div className="pt-auto !mt-auto">
             <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:bg-primary/80 !mt-auto" asChild>
                <Link href="/"><LogOut className="mr-2 h-4 w-4" /> Logout</Link>
            </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-primary">NDSP Administration Dashboard</h1>
            <span className="text-sm text-muted-foreground">Welcome, AdminName</span>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Schools</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">125</p>
              <p className="text-sm text-muted-foreground">Schools in database</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">5</p>
              <p className="text-sm text-muted-foreground">Technical assistance</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">Operational</p>
              <p className="text-sm text-muted-foreground">All systems normal</p>
            </CardContent>
          </Card>
        </div>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Common Tasks</h2>
          <div className="space-x-4">
            <Button variant="outline">Add New School</Button>
            <Button variant="outline">Manage Users</Button>
            <Button variant="outline">View Analytics</Button>
          </div>
        </section>
      </main>
    </div>
  );
}
