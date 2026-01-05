import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Plus, Search, Edit, Trash2, Eye, EyeOff, FileText } from 'lucide-react';

interface ContentBlock {
  id: string;
  name: string;
  slug: string;
  type: string;
  location: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

const AdminContent: React.FC = () => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      const { data, error } = await supabase
        .from('content_blocks')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setBlocks(data || []);
    } catch (error) {
      console.error('Error fetching content blocks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load content blocks',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVisibility = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('content_blocks')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      setBlocks(blocks.map(b => 
        b.id === id ? { ...b, is_active: !currentStatus } : b
      ));

      toast({
        title: 'Success',
        description: `Block ${!currentStatus ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      console.error('Error updating block:', error);
      toast({
        title: 'Error',
        description: 'Failed to update block',
        variant: 'destructive',
      });
    }
  };

  const deleteBlock = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('content_blocks')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setBlocks(blocks.filter(b => b.id !== deleteId));
      toast({
        title: 'Success',
        description: 'Content block deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting block:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete block',
        variant: 'destructive',
      });
    } finally {
      setDeleteId(null);
    }
  };

  const filteredBlocks = blocks.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Content Blocks</h1>
          <p className="text-muted-foreground">Manage website content sections</p>
        </div>
        <Link to="/admin2413/content/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Block
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search content blocks..."
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
          ) : filteredBlocks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No content blocks yet</p>
              <p className="text-sm">Create blocks for banners, custom sections, and more</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBlocks.map((block) => (
                    <TableRow key={block.id}>
                      <TableCell className="font-medium">{block.name}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {block.slug}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {block.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{block.location || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={block.is_active ? 'default' : 'secondary'}>
                          {block.is_active ? 'Active' : 'Disabled'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleVisibility(block.id, block.is_active)}
                          >
                            {block.is_active ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Link to={`/admin2413/content/${block.id}`}>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(block.id)}
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
            <AlertDialogTitle>Delete Content Block?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The content will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteBlock} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminContent;
