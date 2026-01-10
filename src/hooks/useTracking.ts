import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface TrackingPixel {
  id: string;
  name: string;
  pixel_type: string;
  pixel_id: string;
  pages: string[];
  is_active: boolean;
}

interface TrackingSettings {
  facebook_pixel: string | null;
  google_analytics: string | null;
}

export const useTracking = () => {
  const [legacySettings, setLegacySettings] = useState<TrackingSettings>({
    facebook_pixel: null,
    google_analytics: null,
  });
  const [pixels, setPixels] = useState<TrackingPixel[]>([]);
  const [initializedPixels, setInitializedPixels] = useState<Set<string>>(new Set());
  const location = useLocation();

  // Fetch legacy settings from site_settings
  useEffect(() => {
    const fetchLegacySettings = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['facebook_pixel', 'google_analytics']);

      if (data) {
        const settingsMap: TrackingSettings = {
          facebook_pixel: null,
          google_analytics: null,
        };
        data.forEach(item => {
          if (item.key === 'facebook_pixel' && item.value) {
            settingsMap.facebook_pixel = item.value;
          }
          if (item.key === 'google_analytics' && item.value) {
            settingsMap.google_analytics = item.value;
          }
        });
        setLegacySettings(settingsMap);
      }
    };

    fetchLegacySettings();
  }, []);

  // Fetch multiple tracking pixels
  useEffect(() => {
    const fetchPixels = async () => {
      const { data } = await supabase
        .from('tracking_pixels')
        .select('*')
        .eq('is_active', true);

      if (data) {
        setPixels(data);
      }
    };

    fetchPixels();
  }, []);

  // Check if a pixel should be active on the current page
  const shouldPixelBeActive = useCallback((pixel: TrackingPixel, pathname: string): boolean => {
    if (pixel.pages.includes('all')) return true;
    
    return pixel.pages.some(page => {
      if (page === '/') return pathname === '/';
      return pathname.startsWith(page);
    });
  }, []);

  // Get active pixels for current page
  const getActivePixels = useCallback((pathname: string) => {
    return pixels.filter(pixel => shouldPixelBeActive(pixel, pathname));
  }, [pixels, shouldPixelBeActive]);

  // Initialize Facebook Pixel
  const initFacebookPixel = useCallback((pixelId: string) => {
    if (initializedPixels.has(`fb_${pixelId}`)) return;

    // Check if fbq exists
    if (!(window as any).fbq) {
      // Initialize Facebook Pixel base code
      const script = document.createElement('script');
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
      `;
      document.head.appendChild(script);
    }

    // Initialize this specific pixel
    (window as any).fbq('init', pixelId);
    (window as any).fbq('track', 'PageView');

    // Add noscript fallback
    const noscript = document.createElement('noscript');
    noscript.id = `fb-noscript-${pixelId}`;
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
    noscript.appendChild(img);
    document.body.appendChild(noscript);

    setInitializedPixels(prev => new Set([...prev, `fb_${pixelId}`]));
  }, [initializedPixels]);

  // Initialize Google Analytics
  const initGoogleAnalytics = useCallback((gaId: string) => {
    if (initializedPixels.has(`ga_${gaId}`)) return;

    // Add gtag.js if not already added
    if (!(window as any).gtag) {
      const gtagScript = document.createElement('script');
      gtagScript.async = true;
      gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(gtagScript);

      const initScript = document.createElement('script');
      initScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
      `;
      document.head.appendChild(initScript);
    }

    // Configure this specific GA property
    (window as any).gtag('config', gaId);

    setInitializedPixels(prev => new Set([...prev, `ga_${gaId}`]));
  }, [initializedPixels]);

  // Initialize TikTok Pixel
  const initTikTokPixel = useCallback((pixelId: string) => {
    if (initializedPixels.has(`tt_${pixelId}`)) return;

    if (!(window as any).ttq) {
      const script = document.createElement('script');
      script.innerHTML = `
        !function (w, d, t) {
          w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
        }(window, document, 'ttq');
      `;
      document.head.appendChild(script);
    }

    (window as any).ttq.load(pixelId);
    (window as any).ttq.page();

    setInitializedPixels(prev => new Set([...prev, `tt_${pixelId}`]));
  }, [initializedPixels]);

  // Initialize legacy Facebook Pixel
  useEffect(() => {
    if (!legacySettings.facebook_pixel) return;
    initFacebookPixel(legacySettings.facebook_pixel);
  }, [legacySettings.facebook_pixel, initFacebookPixel]);

  // Initialize legacy Google Analytics
  useEffect(() => {
    if (!legacySettings.google_analytics) return;
    initGoogleAnalytics(legacySettings.google_analytics);
  }, [legacySettings.google_analytics, initGoogleAnalytics]);

  // Initialize page-specific pixels based on current route
  useEffect(() => {
    const activePixels = getActivePixels(location.pathname);
    
    activePixels.forEach(pixel => {
      switch (pixel.pixel_type) {
        case 'facebook':
          initFacebookPixel(pixel.pixel_id);
          break;
        case 'google':
          initGoogleAnalytics(pixel.pixel_id);
          break;
        case 'tiktok':
          initTikTokPixel(pixel.pixel_id);
          break;
      }
    });
  }, [location.pathname, getActivePixels, initFacebookPixel, initGoogleAnalytics, initTikTokPixel]);

  // Track page views on route change
  useEffect(() => {
    const activePixels = getActivePixels(location.pathname);
    
    // Track for legacy settings
    if (legacySettings.facebook_pixel && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }
    if (legacySettings.google_analytics && (window as any).gtag) {
      (window as any).gtag('config', legacySettings.google_analytics, {
        page_path: location.pathname,
      });
    }

    // Track for page-specific pixels
    activePixels.forEach(pixel => {
      if (pixel.pixel_type === 'facebook' && (window as any).fbq) {
        (window as any).fbq('trackSingle', pixel.pixel_id, 'PageView');
      }
      if (pixel.pixel_type === 'google' && (window as any).gtag) {
        (window as any).gtag('config', pixel.pixel_id, {
          page_path: location.pathname,
        });
      }
      if (pixel.pixel_type === 'tiktok' && (window as any).ttq) {
        (window as any).ttq.page();
      }
    });
  }, [location.pathname, legacySettings, getActivePixels]);

  // Helper functions for custom events
  const trackEvent = (eventName: string, params?: Record<string, any>) => {
    const activePixels = getActivePixels(location.pathname);
    
    // Legacy tracking
    if (legacySettings.facebook_pixel && (window as any).fbq) {
      (window as any).fbq('track', eventName, params);
    }
    if (legacySettings.google_analytics && (window as any).gtag) {
      (window as any).gtag('event', eventName, params);
    }

    // Page-specific tracking
    activePixels.forEach(pixel => {
      if (pixel.pixel_type === 'facebook' && (window as any).fbq) {
        (window as any).fbq('trackSingle', pixel.pixel_id, eventName, params);
      }
      if (pixel.pixel_type === 'google' && (window as any).gtag) {
        (window as any).gtag('event', eventName, params);
      }
      if (pixel.pixel_type === 'tiktok' && (window as any).ttq) {
        (window as any).ttq.track(eventName, params);
      }
    });
  };

  const trackPurchase = (value: number, currency: string = 'BDT') => {
    trackEvent('Purchase', { value, currency });
  };

  const trackAddToCart = (value: number, currency: string = 'BDT') => {
    trackEvent('AddToCart', { value, currency });
  };

  const trackInitiateCheckout = (value: number, currency: string = 'BDT') => {
    trackEvent('InitiateCheckout', { value, currency });
  };

  return {
    trackEvent,
    trackPurchase,
    trackAddToCart,
    trackInitiateCheckout,
  };
};
