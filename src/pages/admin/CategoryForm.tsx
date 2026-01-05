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
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  name_en: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  parent_id: z.string().optional().nullable(),
  sort_order: z.coerce.number().int().min(0),
  is_active: z.boolean().default(true),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface Category {
  id: string;
  name: string;
}

const CategoryForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = id && id !== 'new';
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditing);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      name_en: '',
      description: '',
      parent_id: null,
      sort_order: 0,
      is_active: true,
    },
  });

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

      if (error) throw error;
      // Filter out current category if editing
      setCategories((data || []).filter(c => c.id !== id));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCategory = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        form.reset({
          name: data.name,
          name_en: data.name_en || '',
          description: data.description || '',
          parent_id: data.parent_id,
          sort_order: data.sort_order,
          is_active: data.is_active,
        });
        if (data.image) {
          setImagePreview(data.image);
        }
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      toast({
        title: 'Error',
        description: 'Failed to load category',
        variant: 'destructive',
      });
      navigate('/admin2413/categories');
    } finally {
      setIsFetching(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return imagePreview;

    setIsUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `categories/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('category-images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('category-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    setIsLoading(true);

    try {
      const imageUrl = await uploadImage();

      const categoryData = {
        name: data.name,
        name_en: data.name_en || null,
        description: data.description || null,
        image: imageUrl,
        parent_id: data.parent_id || null,
        sort_order: data.sort_order,
        is_active: data.is_active,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', id);

        if (error) throw error;
        toast({ title: 'Success', description: 'Category updated successfully' });
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([categoryData]);

        if (error) throw error;
        toast({ title: 'Success', description: 'Category created successfully' });
      }

      navigate('/admin2413/categories');
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: 'Error',
        description: 'Failed to save category',
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
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin2413/categories')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Edit Category' : 'Add Category'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update category details' : 'Create a new category'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name (Bangla) *</FormLabel>
                          <FormControl>
                            <Input placeholder="ক্যাটাগরির নাম" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name_en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name (English)</FormLabel>
                          <FormControl>
                            <Input placeholder="Category name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Category description" rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="parent_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent Category</FormLabel>
                          <Select 
                            value={field.value || ''} 
                            onValueChange={(val) => field.onChange(val || null)}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="None (Top level)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">None (Top level)</SelectItem>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>For sub-categories</FormDescription>
                          <FormMessage />
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
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {imagePreview ? (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Click to upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>Active</FormLabel>
                          <FormDescription>Show on store</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" disabled={isLoading || isUploading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  isEditing ? 'Update Category' : 'Create Category'
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CategoryForm;
