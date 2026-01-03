import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteSettings } from '@/data/mockData';
import heroBanner from '@/assets/hero-banner.jpg';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Hero Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-16 md:py-24 lg:py-32">
        <div className="max-w-xl space-y-6 animate-slide-up">
          <div className="inline-block">
            <span className="bg-primary/20 text-primary-foreground border border-primary-foreground/20 px-4 py-1.5 rounded-full text-sm font-medium">
              ১০০% খাঁটি ও প্রাকৃতিক
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-background leading-tight">
            শুরু হোক আপনার
            <span className="block text-primary">হেলদি জার্নি</span>
          </h1>

          <p className="text-lg text-background/80 leading-relaxed">
            সরাসরি কৃষক থেকে আপনার ঘরে — খাঁটি মধু, ঘি, চাল ও আরও অনেক কিছু। 
            কোনো মিশ্রণ নেই, কোনো প্রিজার্ভেটিভ নেই।
          </p>

          <div className="flex flex-wrap gap-4">
            <Button variant="gradient" size="xl" className="group">
              অর্ডার করুন
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="xl" 
              className="bg-background/10 text-background border-background/30 hover:bg-background/20"
              asChild
            >
              <a href={`tel:${siteSettings.phone}`}>
                {siteSettings.phone}
              </a>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-6 pt-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">৫০০০+</div>
              <div className="text-sm text-background/70">সন্তুষ্ট গ্রাহক</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">১০০+</div>
              <div className="text-sm text-background/70">প্রিমিয়াম পণ্য</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">২৪/৭</div>
              <div className="text-sm text-background/70">সাপোর্ট</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
