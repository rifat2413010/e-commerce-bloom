import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';

const contentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  content: z.string().max(50000).optional(),
  type: z.string().min(1, 'Type is required'),
  location: z.string().max(100).optional(),
  sort_order: z.coerce.number().int().min(0),
  is_active: z.boolean().default(true),
});

type ContentFormData = z.infer<typeof contentSchema>;

const ContentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = id && id !== 'new';
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditing);

  const form = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      name: '',
      slug: '',
      content: '',
      type: 'html',
      location: '',
      sort_order: 0,
      is_active: true,
    },
  });

  useEffect(() => {
    if (isEditing) {
      fetchContent();
    }
  }, [id]);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        form.reset({
          name: data.name,
          slug: data.slug,
          content: data.content || '',
          type: data.type,
          location: data.location || '',
          sort_order: data.sort_order,
          is_active: data.is_active,
        });
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: 'Error',
        description: 'Failed to load content block',
        variant: 'destructive',
      });
      navigate('/admin2413/content');
    } finally {
      setIsFetching(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const onSubmit = async (data: ContentFormData) => {
    setIsLoading(true);

    try {
      const contentData = {
        name: data.name,
        slug: data.slug,
        content: data.content || null,
        type: data.type,
        location: data.location || null,
        sort_order: data.sort_order,
        is_active: data.is_active,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('content_blocks')
          .update(contentData)
          .eq('id', id);

        if (error) throw error;
        toast({ title: 'Success', description: 'Content block updated successfully' });
      } else {
        const { error } = await supabase
          .from('content_blocks')
          .insert([contentData]);

        if (error) {
          if (error.code === '23505') {
            toast({
              title: 'Error',
              description: 'A block with this slug already exists',
              variant: 'destructive',
            });
            return;
          }
          throw error;
        }
        toast({ title: 'Success', description: 'Content block created successfully' });
      }

      navigate('/admin2413/content');
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: 'Error',
        description: 'Failed to save content block',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin2413/content')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Edit Content Block' : 'Add Content Block'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update content block details' : 'Create a new content block'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Block Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Block name" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                if (!isEditing) {
                                  form.setValue('slug', generateSlug(e.target.value));
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug *</FormLabel>
                          <FormControl>
                            <Input placeholder="block-slug" {...field} />
                          </FormControl>
                          <FormDescription>Unique identifier</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="html">HTML</SelectItem>
                              <SelectItem value="text">Plain Text</SelectItem>
                              <SelectItem value="banner">Banner</SelectItem>
                              <SelectItem value="announcement">Announcement</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <Select value={field.value || ''} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select location" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">None</SelectItem>
                              <SelectItem value="header">Header</SelectItem>
                              <SelectItem value="homepage-top">Homepage Top</SelectItem>
                              <SelectItem value="homepage-middle">Homepage Middle</SelectItem>
                              <SelectItem value="homepage-bottom">Homepage Bottom</SelectItem>
                              <SelectItem value="footer">Footer</SelectItem>
                              <SelectItem value="sidebar">Sidebar</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>Where this block appears</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter content here... (HTML or plain text)" 
                            rows={12} 
                            className="font-mono text-sm"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          {form.watch('type') === 'html' 
                            ? 'You can use HTML tags for formatting' 
                            : 'Plain text content'}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>Active</FormLabel>
                          <FormDescription>Show on site</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sort_order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sort Order</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormDescription>Lower numbers appear first</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  isEditing ? 'Update Block' : 'Create Block'
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ContentForm;
