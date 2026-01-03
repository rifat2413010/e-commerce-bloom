import { Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteSettings } from '@/data/mockData';

const FloatingButtons = () => {
  const whatsappUrl = `https://wa.me/${siteSettings.whatsapp}?text=${encodeURIComponent('হ্যালো, আমি আপনাদের পণ্য সম্পর্কে জানতে চাই।')}`;
  const phoneUrl = `tel:${siteSettings.phone}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <Button
          variant="whatsapp"
          size="iconLg"
          className="rounded-full animate-float shadow-lg"
          aria-label="WhatsApp এ মেসেজ করুন"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </a>

      {/* Phone Button */}
      <a href={phoneUrl}>
        <Button
          variant="phone"
          size="iconLg"
          className="rounded-full shadow-lg"
          aria-label="কল করুন"
        >
          <Phone className="h-6 w-6" />
        </Button>
      </a>
    </div>
  );
};

export default FloatingButtons;
