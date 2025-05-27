
'use client';

import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';


export default function ContentManagementPage() {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar />
      <main className="flex-1 p-6">
         <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-primary">Content Management (Review)</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-accent" /> Site Content Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              This section will allow authorized users to review and approve/reject content updates, manage static page content, and oversee resource documents.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                    <h3 className="font-semibold text-lg mb-2">Pending Reviews</h3>
                    <p>No content items currently pending review. (Placeholder)</p>
                    <Button variant="link" className="mt-2 p-0">View Review Queue</Button>
                </Card>
                 <Card className="p-4">
                    <h3 className="font-semibold text-lg mb-2">Manage Resources</h3>
                    <p>Update or add new PDFs, guides, and fact sheets.</p>
                    <Button variant="link" className="mt-2 p-0">Go to Resource Management</Button>
                </Card>
                 <Card className="p-4">
                    <h3 className="font-semibold text-lg mb-2">Static Page Editor</h3>
                    <p>Edit content for pages like 'About Us', 'Privacy Policy'. (Placeholder)</p>
                     <Button variant="link" className="mt-2 p-0">Open Page Editor</Button>
                </Card>
            </div>
          </CardContent>
        </Card>
         <footer className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>[Internal DoDEA Links] | [Admin Support]</p>
        </footer>
      </main>
    </div>
  );
}
