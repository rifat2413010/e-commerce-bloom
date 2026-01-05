import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Loader2, Save, Store, Truck, BarChart3, Upload, X } from 'lucide-react';

const settingsSchema = z.object({
  site_name: z.string().min(1, 'Site name is required').max(100),
  phone: z.string().max(20),
  whatsapp: z.string().max(20),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().max(500),
  delivery_charge: z.coerce.number().min(0),
  free_delivery_min: z.coerce.number().min(0),
  facebook_pixel: z.string().max(100).optional(),
  google_analytics: z.string().max(100).optional(),
  footer_text: z.string().max(500).optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface Settings {
  [key: string]: string;
}

const AdminSettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const { toast } = useToast();

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      site_name: '',
      phone: '',
      whatsapp: '',
      email: '',
      address: '',
      delivery_charge: 0,
      free_delivery_min: 0,
      facebook_pixel: '',
      google_analytics: '',
      footer_text: '',
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');

      if (error) throw error;

      const settings: Settings = {};
      (data || []).forEach(item => {
        settings[item.key] = item.value || '';
      });

      form.reset({
        site_name: settings.site_name || '',
        phone: settings.phone || '',
        whatsapp: settings.whatsapp || '',
        email: settings.email || '',
        address: settings.address || '',
        delivery_charge: parseFloat(settings.delivery_charge) || 0,
        free_delivery_min: parseFloat(settings.free_delivery_min) || 0,
        facebook_pixel: settings.facebook_pixel || '',
        google_analytics: settings.google_analytics || '',
        footer_text: settings.footer_text || '',
      });

      if (settings.logo) {
        setLogoPreview(settings.logo);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return logoPreview;

    try {
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(fileName, logoFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      return null;
    }
  };

  const saveSetting = async (key: string, value: string) => {
    const { data: existing } = await supabase
      .from('site_settings')
      .select('id')
      .eq('key', key)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('site_settings')
        .update({ value })
        .eq('key', key);
    } else {
      await supabase
        .from('site_settings')
        .insert({ key, value, type: 'text', category: 'general' });
    }
  };

  const onSubmit = async (data: SettingsFormData) => {
    setIsSaving(true);

    try {
      // Upload logo if changed
      const logoUrl = await uploadLogo();

      // Save all settings
      const settingsToSave = {
        site_name: data.site_name,
        phone: data.phone,
        whatsapp: data.whatsapp,
        email: data.email || '',
        address: data.address,
        delivery_charge: data.delivery_charge.toString(),
        free_delivery_min: data.free_delivery_min.toString(),
        facebook_pixel: data.facebook_pixel || '',
        google_analytics: data.google_analytics || '',
        footer_text: data.footer_text || '',
        ...(logoUrl && { logo: logoUrl }),
      };

      await Promise.all(
        Object.entries(settingsToSave).map(([key, value]) => saveSetting(key, value))
      );

      toast({ title: 'Success', description: 'Settings saved successfully' });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your store settings</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList>
              <TabsTrigger value="general" className="gap-2">
                <Store className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="delivery" className="gap-2">
                <Truck className="h-4 w-4" />
                Delivery
              </TabsTrigger>
              <TabsTrigger value="tracking" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Tracking
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Store Information</CardTitle>
                  <CardDescription>Basic information about your store</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="site_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Store Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <FormLabel>Logo</FormLabel>
                      <div className="mt-2 flex items-center gap-4">
                        {logoPreview ? (
                          <div className="relative">
                            <img 
                              src={logoPreview} 
                              alt="Logo" 
                              className="h-16 w-16 object-contain rounded border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6"
                              onClick={() => {
                                setLogoFile(null);
                                setLogoPreview(null);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center h-16 w-16 border-2 border-dashed border-border rounded cursor-pointer hover:bg-muted/50">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleLogoChange}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+880..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="whatsapp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp</FormLabel>
                          <FormControl>
                            <Input placeholder="+880..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="contact@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Store address" rows={2} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="footer_text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Footer Text</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Copyright text or tagline" rows={2} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="delivery" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Settings</CardTitle>
                  <CardDescription>Configure delivery charges and thresholds</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="delivery_charge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Charge (৳)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormDescription>Standard delivery fee</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="free_delivery_min"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Free Delivery Minimum (৳)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormDescription>0 = No free delivery</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tracking" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Marketing & Tracking</CardTitle>
                  <CardDescription>Analytics and tracking IDs (optional)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="facebook_pixel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook Pixel ID</FormLabel>
                        <FormControl>
                          <Input placeholder="123456789..." {...field} />
                        </FormControl>
                        <FormDescription>For Facebook ads tracking</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="google_analytics"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Google Analytics ID</FormLabel>
                        <FormControl>
                          <Input placeholder="G-XXXXXXXXXX" {...field} />
                        </FormControl>
                        <FormDescription>For Google Analytics tracking</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AdminSettings;
