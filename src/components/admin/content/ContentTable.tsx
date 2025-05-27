'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ContentForm } from '@/components/admin/content/ContentForm';
import { useToast } from '@/lib/toast';
import { z } from 'zod';
import { contentSchema } from '@/app/api/content/route';

type ContentItem = z.infer<typeof contentSchema> & { _id: string };

export function ContentTable() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const response = await fetch('/api/content');
        if (!response.ok) throw new Error('Failed to fetch content');
        const data = await response.json();
        setContents(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load content',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, []);

  const handleAddContent = async (values: z.infer<typeof contentSchema>) => {
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to create content');
      }
      
      const newContent = await response.json();
      setContents([...contents, newContent]);
      toast({ title: 'Success', description: 'Content created successfully' });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create content',
        variant: 'destructive'
      });
    }
  };

  const handleTogglePublish = async (id: string, published: boolean) => {
    try {
      const response = await fetch(`/api/content/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, published })
      });

      if (!response.ok) throw new Error('Failed to update content');
      
      const updatedContent = await response.json();
      setContents(contents.map(content => content._id === id ? updatedContent : content));
      toast({ 
        title: 'Success', 
        description: `Content ${published ? 'published' : 'unpublished'} successfully` 
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update content status',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch('/api/content', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (!response.ok) throw new Error('Failed to delete content');
      
      setContents(contents.filter(content => content._id !== id));
      toast({ title: 'Success', description: 'Content deleted successfully' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete content',
        variant: 'destructive'
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline"
            data-testid="add-content-button"
          >
            Add Content
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Content</DialogTitle>
            <DialogDescription>
              Fill out the form to create new content
            </DialogDescription>
          </DialogHeader>
          <ContentForm 
            onSubmit={handleAddContent} 
            schema={contentSchema}
          />
        </DialogContent>
      </Dialog>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contents.map(content => (
              <TableRow key={content._id}>
                <TableCell>{content.title}</TableCell>
                <TableCell>{content.type}</TableCell>
                <TableCell>
                  {content.published ? 'Published' : 'Draft'}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    data-testid={`toggle-publish-${content._id}`}
                  >
                    {content.published ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    data-testid={`delete-button-${content._id}`}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
