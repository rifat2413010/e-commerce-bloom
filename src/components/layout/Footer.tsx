import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { categories, siteSettings } from '@/data/mockData';
import logo from '@/assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Logo" className="h-12 w-12" />
              <span className="text-2xl font-bold text-primary">
                {siteSettings.siteName}
              </span>
            </Link>
            <p className="text-background/70 leading-relaxed">
              {siteSettings.footerText}
            </p>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">ক্যাটেগরি</h3>
            <ul className="space-y-2">
              {categories.filter(c => c.isActive).map(category => (
                <li key={category.id}>
                  <Link 
                    to={`/category/${category.id}`}
                    className="text-background/70 hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">গুরুত্বপূর্ণ লিংক</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-background/70 hover:text-primary transition-colors">
                  হোম
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-background/70 hover:text-primary transition-colors">
                  কার্ট
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="text-background/70 hover:text-primary transition-colors">
                  চেকআউট
                </Link>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-primary transition-colors">
                  প্রাইভেসি পলিসি
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-primary transition-colors">
                  রিফান্ড পলিসি
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">যোগাযোগ</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-background/70">ফোন</p>
                  <a 
                    href={`tel:${siteSettings.phone}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {siteSettings.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-background/70">ইমেইল</p>
                  <a 
                    href={`mailto:${siteSettings.email}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {siteSettings.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-background/70">ঠিকানা</p>
                  <p className="font-medium">{siteSettings.address}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/10">
        <div className="container py-4 text-center text-background/50 text-sm">
          <p>© {new Date().getFullYear()} {siteSettings.siteName}। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
