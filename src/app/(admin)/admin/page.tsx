import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LayoutDashboard, School, Users, LogOut } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-primary text-primary-foreground p-4 space-y-2">
        <h2 className="text-xl font-semibold mb-6">Admin Panel</h2>
        <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:bg-primary/80" asChild>
          <Link href="/admin"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:bg-primary/80" asChild>
          <Link href="/admin/schools"><School className="mr-2 h-4 w-4" /> School DB Mgt</Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:bg-primary/80" asChild>
          <Link href="/admin/users"><Users className="mr-2 h-4 w-4" /> User Mgt</Link>
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
          <span className="text-sm text-muted-foreground">Welcome, Admin</span>
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
      </main>
    </div>
  );
}
