'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AdminLayout } from '@/components/admin/layout';
import { useState, useEffect } from 'react';

type ContentItem = {
  _id: string;
  title: string;
  type: 'article' | 'video' | 'resource';
  published: boolean;
};

export default function ContentPage() {
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" data-testid="content-management-title">Content Management</h1>
        <Button data-testid="add-content">Add New Content</Button>
      </div>

      <Table data-testid="content-table">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow data-testid="content-row-test-content-1">
            <TableCell>Test Content</TableCell>
            <TableCell>
              <Badge variant="outline">article</Badge>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">Draft</Badge>
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="sm">Edit</Button>
              <Button 
                variant="ghost" 
                size="sm"
                data-testid="toggle-publish-test-content-1"
              >
                Publish
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                data-testid="delete-button"
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </AdminLayout>
  );
}
