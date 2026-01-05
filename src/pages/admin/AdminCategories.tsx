import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  name_en: string | null;
  description: string | null;
  image: string | null;
  parent_id: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVisibility = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      setCategories(categories.map(c => 
        c.id === id ? { ...c, is_active: !currentStatus } : c
      ));

      toast({
        title: 'Success',
        description: `Category ${!currentStatus ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: 'Error',
        description: 'Failed to update category',
        variant: 'destructive',
      });
    }
  };

  const deleteCategory = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setCategories(categories.filter(c => c.id !== deleteId));
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete category. It may have associated products.',
        variant: 'destructive',
      });
    } finally {
      setDeleteId(null);
    }
  };

  const getParentName = (parentId: string | null) => {
    if (!parentId) return '-';
    const parent = categories.find(c => c.id === parentId);
    return parent?.name || '-';
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.name_en?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage product categories</p>
        </div>
        <Link to="/admin2413/categories/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No categories found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category, index) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      </TableCell>
                      <TableCell>
                        <div className="w-10 h-10 bg-muted rounded-lg overflow-hidden">
                          {category.image ? (
                            <img 
                              src={category.image} 
                              alt={category.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                              -
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{category.name}</p>
                          {category.name_en && (
                            <p className="text-sm text-muted-foreground">{category.name_en}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getParentName(category.parent_id)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{category.sort_order}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={category.is_active ? 'default' : 'secondary'}>
                          {category.is_active ? 'Active' : 'Disabled'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleVisibility(category.id, category.is_active)}
                          >
                            {category.is_active ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Link to={`/admin2413/categories/${category.id}`}>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(category.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Products in this category will be unassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteCategory} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminCategories;
