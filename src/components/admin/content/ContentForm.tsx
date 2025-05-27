import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { contentSchema } from '@/app/api/content/route';

type ContentFormProps = {
  onSubmit: (values: z.infer<typeof contentSchema>) => void;
  schema?: typeof contentSchema;
};

export function ContentForm({ onSubmit, schema = contentSchema }: ContentFormProps) {
  const form = useForm<z.infer<typeof contentSchema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      type: 'article',
      content: '',
      published: false,
      description: '',
      tags: [],
      thumbnailUrl: '',
      videoUrl: ''
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Content title" {...field} data-testid="title-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Input placeholder="Content type" {...field} data-testid="type-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Content body"
                  className="min-h-[100px]"
                  {...field}
                  data-testid="content-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Content description"
                  className="min-h-[100px]"
                  {...field}
                  data-testid="description-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="Content tags" {...field} data-testid="tags-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thumbnailUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail URL</FormLabel>
              <FormControl>
                <Input placeholder="Content thumbnail URL" {...field} data-testid="thumbnail-url-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video URL</FormLabel>
              <FormControl>
                <Input placeholder="Content video URL" {...field} data-testid="video-url-input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" data-testid="submit-button">
          Submit
        </Button>
      </form>
    </Form>
  );
}
