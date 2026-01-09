import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Loader2, Save, Facebook, BarChart3, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const pixelSchema = z.object({
  facebook_pixel: z.string().max(100).optional(),
  google_analytics: z.string().max(100).optional(),
  tiktok_pixel: z.string().max(100).optional(),
});

type PixelFormData = z.infer<typeof pixelSchema>;

const AdminPixel: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const form = useForm<PixelFormData>({
    resolver: zodResolver(pixelSchema),
    defaultValues: {
      facebook_pixel: '',
      google_analytics: '',
      tiktok_pixel: '',
    },
  });

  const watchedValues = form.watch();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['facebook_pixel', 'google_analytics', 'tiktok_pixel']);

      if (error) throw error;

      const settings: Record<string, string> = {};
      (data || []).forEach(item => {
        settings[item.key] = item.value || '';
      });

      form.reset({
        facebook_pixel: settings.facebook_pixel || '',
        google_analytics: settings.google_analytics || '',
        tiktok_pixel: settings.tiktok_pixel || '',
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tracking settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
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
        .insert({ key, value, type: 'text', category: 'tracking' });
    }
  };

  const onSubmit = async (data: PixelFormData) => {
    setIsSaving(true);

    try {
      await Promise.all([
        saveSetting('facebook_pixel', data.facebook_pixel || ''),
        saveSetting('google_analytics', data.google_analytics || ''),
        saveSetting('tiktok_pixel', data.tiktok_pixel || ''),
      ]);

      toast({ title: 'Success', description: 'Tracking pixels saved successfully' });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save tracking settings',
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
        <h1 className="text-2xl font-bold">Facebook Pixel & Tracking</h1>
        <p className="text-muted-foreground">Configure your marketing and analytics tracking pixels</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Facebook Pixel */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center">
                    <Facebook className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Facebook Pixel</CardTitle>
                    <CardDescription>Track conversions and build audiences for Facebook ads</CardDescription>
                  </div>
                </div>
                {watchedValues.facebook_pixel && (
                  <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
                    <CheckCircle className="h-3 w-3" />
                    Active
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="facebook_pixel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pixel ID</FormLabel>
                    <FormControl>
                      <Input placeholder="123456789012345" {...field} />
                    </FormControl>
                    <FormDescription>
                      Find your Pixel ID in Facebook Events Manager → Data Sources → Your Pixel
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
                <p className="font-medium">Events automatically tracked:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>PageView - When visitors view any page</li>
                  <li>AddToCart - When products are added to cart</li>
                  <li>InitiateCheckout - When checkout begins</li>
                  <li>Purchase - When order is completed</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Google Analytics */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-orange-500 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Google Analytics</CardTitle>
                    <CardDescription>Analyze website traffic and user behavior</CardDescription>
                  </div>
                </div>
                {watchedValues.google_analytics && (
                  <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
                    <CheckCircle className="h-3 w-3" />
                    Active
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="google_analytics"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Measurement ID</FormLabel>
                    <FormControl>
                      <Input placeholder="G-XXXXXXXXXX" {...field} />
                    </FormControl>
                    <FormDescription>
                      Find your Measurement ID in Google Analytics → Admin → Data Streams → Your Stream
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* TikTok Pixel */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-black flex items-center justify-center">
                    <span className="text-white font-bold text-sm">TT</span>
                  </div>
                  <div>
                    <CardTitle>TikTok Pixel</CardTitle>
                    <CardDescription>Track conversions for TikTok ads</CardDescription>
                  </div>
                </div>
                {watchedValues.tiktok_pixel && (
                  <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
                    <CheckCircle className="h-3 w-3" />
                    Active
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="tiktok_pixel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pixel ID</FormLabel>
                    <FormControl>
                      <Input placeholder="CXXXXXXXXXXXXXXXXX" {...field} />
                    </FormControl>
                    <FormDescription>
                      Find your Pixel ID in TikTok Ads Manager → Events → Web Events
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Tracking Settings
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AdminPixel;
