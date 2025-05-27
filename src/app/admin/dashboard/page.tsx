
// Screen Admin-1: Administrative Dashboard (Revised for CRUD Focus)
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LayoutDashboard, School, Users, FileEdit, LogOut, Bell, PlusCircle, SearchIcon, History } from "lucide-react";
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-primary">NDSP Administration Dashboard</h1>
          <span className="text-sm text-muted-foreground">Welcome, AdminName</span>
        </header>

        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center">
                <School className="mr-3 h-6 w-6 text-accent" /> School Database Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-3xl font-bold">125 <span className="text-sm font-normal text-muted-foreground">(Placeholder)</span></p>
                  <p className="text-sm text-muted-foreground">Total Schools in Database</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" asChild>
                    <Link href="/admin/schools">
                      <SearchIcon className="mr-2 h-4 w-4" /> View/Search All Schools
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/admin/schools/add">
                      <PlusCircle className="mr-2 h-4 w-4" /> Add New School
                    </Link>
                  </Button>
                </div>
              </div>
              <div>
                <Button variant="link" className="p-0 text-accent" asChild>
                  <Link href="/admin/schools?filter=recent">
                    <History className="mr-2 h-4 w-4" /> Recently Modified Schools
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center">
                <Users className="mr-3 h-6 w-6 text-accent" /> Manual User Account Management <cite className="text-xs not-italic text-muted-foreground ml-2">[cite: 220]</cite>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-3xl font-bold">15 <span className="text-sm font-normal text-muted-foreground">(Placeholder)</span></p>
                  <p className="text-sm text-muted-foreground">Total Manual Accounts</p>
                </div>
                 <div className="flex space-x-2">
                  <Button variant="outline" asChild>
                    <Link href="/admin/user-management">
                      <SearchIcon className="mr-2 h-4 w-4" /> View/Search Manual Accounts
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/admin/user-management/add">
                      <PlusCircle className="mr-2 h-4 w-4" /> Create New Manual Account
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center">
                <Bell className="mr-3 h-6 w-6 text-accent" /> System Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">Scheduled Maintenance on 2024-08-15 from 02:00 to 04:00 UTC.</p>
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-700">3 new technical assistance requests pending review.</p>
              </div>
            </CardContent>
          </Card>
        </section>
        
        <footer className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>[Internal DoDEA Links] | [Admin Support]</p>
        </footer>
      </main>
    </div>
  );
}
