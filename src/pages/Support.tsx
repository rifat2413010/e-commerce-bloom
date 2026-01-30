import { Phone, Mail, MessageCircle, Clock, MapPin } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import { Button } from '@/components/ui/button';
import { siteSettings } from '@/data/mockData';

const Support = () => {
  const whatsappLink = `https://wa.me/${siteSettings.whatsapp}?text=আমার সাহায্য দরকার`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pb-16 md:pb-0">
        <div className="container py-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">সাপোর্ট</h1>
          <p className="text-muted-foreground mb-8">আমরা আপনাকে সাহায্য করতে এখানে আছি</p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Phone */}
            <div className="bg-card rounded-xl shadow-card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">ফোনে কল করুন</h3>
                  <p className="text-sm text-muted-foreground">সরাসরি কথা বলুন</p>
                </div>
              </div>
              <a href={`tel:${siteSettings.phone}`}>
                <Button className="w-full">
                  {siteSettings.phone}
                </Button>
              </a>
            </div>

            {/* WhatsApp */}
            <div className="bg-card rounded-xl shadow-card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">WhatsApp</h3>
                  <p className="text-sm text-muted-foreground">মেসেজ করুন</p>
                </div>
              </div>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-green-500 hover:bg-green-600">
                  WhatsApp এ মেসেজ করুন
                </Button>
              </a>
            </div>

            {/* Email */}
            <div className="bg-card rounded-xl shadow-card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">ইমেইল</h3>
                  <p className="text-sm text-muted-foreground">ইমেইল পাঠান</p>
                </div>
              </div>
              <a href={`mailto:${siteSettings.email}`}>
                <Button variant="outline" className="w-full">
                  {siteSettings.email}
                </Button>
              </a>
            </div>

            {/* Hours */}
            <div className="bg-card rounded-xl shadow-card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">কার্যকালীন সময়</h3>
                  <p className="text-sm text-muted-foreground">সকাল ৯টা - রাত ১০টা</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                শনিবার - বৃহস্পতিবার (শুক্রবার বন্ধ)
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="mt-6 bg-card rounded-xl shadow-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">ঠিকানা</h3>
                <p className="text-sm text-muted-foreground">{siteSettings.address}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default Support;
