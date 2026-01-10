import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2, Loader2, Save, Facebook, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TrackingPixel {
  id: string;
  name: string;
  pixel_type: string;
  pixel_id: string;
  pages: string[];
  is_active: boolean;
}

const PAGE_OPTIONS = [
  { value: 'all', label: 'All Pages' },
  { value: '/', label: 'Home Page' },
  { value: '/product', label: 'Product Pages' },
  { value: '/category', label: 'Category Pages' },
  { value: '/cart', label: 'Cart Page' },
  { value: '/checkout', label: 'Checkout Page' },
  { value: '/order-success', label: 'Order Success Page' },
];

const PIXEL_TYPES = [
  { value: 'facebook', label: 'Facebook Pixel', icon: Facebook },
  { value: 'google', label: 'Google Analytics', icon: BarChart3 },
  { value: 'tiktok', label: 'TikTok Pixel', icon: BarChart3 },
];

const AdminTrackingPixels = () => {
  const navigate = useNavigate();
  const [pixels, setPixels] = useState<TrackingPixel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newPixel, setNewPixel] = useState({
    name: '',
    pixel_type: 'facebook',
    pixel_id: '',
    pages: ['all'] as string[],
    is_active: true,
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchPixels();
  }, []);

  const fetchPixels = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('tracking_pixels')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load tracking pixels');
      console.error(error);
    } else {
      setPixels(data || []);
    }
    setIsLoading(false);
  };

  const handleAddPixel = async () => {
    if (!newPixel.name || !newPixel.pixel_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    const { error } = await supabase
      .from('tracking_pixels')
      .insert([newPixel]);

    if (error) {
      toast.error('Failed to add tracking pixel');
      console.error(error);
    } else {
      toast.success('Tracking pixel added successfully');
      setNewPixel({
        name: '',
        pixel_type: 'facebook',
        pixel_id: '',
        pages: ['all'],
        is_active: true,
      });
      setShowAddForm(false);
      fetchPixels();
    }
    setIsSaving(false);
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from('tracking_pixels')
      .update({ is_active: isActive })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update pixel status');
    } else {
      setPixels(pixels.map(p => p.id === id ? { ...p, is_active: isActive } : p));
      toast.success('Pixel status updated');
    }
  };

  const handleDeletePixel = async (id: string) => {
    const { error } = await supabase
      .from('tracking_pixels')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete pixel');
    } else {
      toast.success('Pixel deleted successfully');
      fetchPixels();
    }
  };

  const togglePage = (page: string) => {
    if (page === 'all') {
      setNewPixel({ ...newPixel, pages: ['all'] });
    } else {
      let newPages = newPixel.pages.filter(p => p !== 'all');
      if (newPages.includes(page)) {
        newPages = newPages.filter(p => p !== page);
      } else {
        newPages.push(page);
      }
      if (newPages.length === 0) {
        newPages = ['all'];
      }
      setNewPixel({ ...newPixel, pages: newPages });
    }
  };

  const getPixelTypeInfo = (type: string) => {
    return PIXEL_TYPES.find(t => t.value === type) || PIXEL_TYPES[0];
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Tracking Pixels</h1>
            <p className="text-muted-foreground">Manage multiple tracking pixels for different pages</p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Pixel
          </Button>
        </div>

        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Tracking Pixel</CardTitle>
              <CardDescription>Configure a new tracking pixel for specific pages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Pixel Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Main Facebook Pixel"
                    value={newPixel.name}
                    onChange={(e) => setNewPixel({ ...newPixel, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Pixel Type *</Label>
                  <Select
                    value={newPixel.pixel_type}
                    onValueChange={(value) => setNewPixel({ ...newPixel, pixel_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PIXEL_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pixel_id">Pixel ID *</Label>
                <Input
                  id="pixel_id"
                  placeholder="Enter your pixel ID"
                  value={newPixel.pixel_id}
                  onChange={(e) => setNewPixel({ ...newPixel, pixel_id: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Active Pages</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Select which pages this pixel should be active on
                </p>
                <div className="flex flex-wrap gap-2">
                  {PAGE_OPTIONS.map((page) => (
                    <Badge
                      key={page.value}
                      variant={newPixel.pages.includes(page.value) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => togglePage(page.value)}
                    >
                      {page.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={newPixel.is_active}
                  onCheckedChange={(checked) => setNewPixel({ ...newPixel, is_active: checked })}
                />
                <Label htmlFor="active">Activate immediately</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddPixel} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Save Pixel
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {pixels.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Tracking Pixels</h3>
                <p className="text-muted-foreground">Add your first tracking pixel to get started</p>
              </CardContent>
            </Card>
          ) : (
            pixels.map((pixel) => {
              const typeInfo = getPixelTypeInfo(pixel.pixel_type);
              const IconComponent = typeInfo.icon;
              return (
                <Card key={pixel.id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{pixel.name}</h3>
                          <Badge variant={pixel.is_active ? 'default' : 'secondary'}>
                            {pixel.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {typeInfo.label} • ID: {pixel.pixel_id}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {pixel.pages.map((page) => (
                            <Badge key={page} variant="outline" className="text-xs">
                              {PAGE_OPTIONS.find(p => p.value === page)?.label || page}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={pixel.is_active}
                        onCheckedChange={(checked) => handleToggleActive(pixel.id, checked)}
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Pixel</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{pixel.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeletePixel(pixel.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTrackingPixels;
