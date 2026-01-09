import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface TrackingSettings {
  facebook_pixel: string | null;
  google_analytics: string | null;
}

export const useTracking = () => {
  const [settings, setSettings] = useState<TrackingSettings>({
    facebook_pixel: null,
    google_analytics: null,
  });
  const location = useLocation();

  useEffect(() => {
    const fetchTrackingSettings = async () => {
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
        setSettings(settingsMap);
      }
    };

    fetchTrackingSettings();
  }, []);

  // Initialize Facebook Pixel
  useEffect(() => {
    if (!settings.facebook_pixel) return;

    const pixelId = settings.facebook_pixel;
    
    // Check if already initialized
    if ((window as any).fbq) return;

    // Initialize Facebook Pixel
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
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);

    // Add noscript fallback
    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
    noscript.appendChild(img);
    document.body.appendChild(noscript);

    return () => {
      script.remove();
      noscript.remove();
    };
  }, [settings.facebook_pixel]);

  // Initialize Google Analytics
  useEffect(() => {
    if (!settings.google_analytics) return;

    const gaId = settings.google_analytics;

    // Check if already initialized
    if ((window as any).gtag) return;

    // Add gtag.js
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(gtagScript);

    // Initialize gtag
    const initScript = document.createElement('script');
    initScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    `;
    document.head.appendChild(initScript);

    return () => {
      gtagScript.remove();
      initScript.remove();
    };
  }, [settings.google_analytics]);

  // Track page views on route change
  useEffect(() => {
    if (settings.facebook_pixel && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }
    if (settings.google_analytics && (window as any).gtag) {
      (window as any).gtag('config', settings.google_analytics, {
        page_path: location.pathname,
      });
    }
  }, [location.pathname, settings]);

  // Helper functions for custom events
  const trackEvent = (eventName: string, params?: Record<string, any>) => {
    // Facebook Pixel
    if (settings.facebook_pixel && (window as any).fbq) {
      (window as any).fbq('track', eventName, params);
    }
    // Google Analytics
    if (settings.google_analytics && (window as any).gtag) {
      (window as any).gtag('event', eventName, params);
    }
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
