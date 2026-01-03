import { Link } from 'react-router-dom';
import { Facebook } from 'lucide-react';
import { siteSettings } from '@/data/mockData';
import logo from '@/assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-background mt-16">
      {/* Main Footer Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Logo" className="h-12 w-auto" />
            </Link>
            <h3 className="font-bold text-foreground">
              Vai Best Bazar: Your Trusted Source for Safe & Organic Food
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Vai Best Bazar is a leading e-commerce platform committed to delivering safe, healthy, and organic 
              food products across Bangladesh. Renowned for its dedication to quality, Vai Best Bazar offers a 
              diverse range of health-focused items, including premium mustard oil, pure ghee, organic honey, 
              dates, chia seeds, and an assortment of nuts. Each product is carefully sourced and crafted to ensure 
              maximum health benefits, meeting the highest standards of purity and freshness.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              With a focus on convenience, Vai Best Bazar operates primarily online, bringing the goodness of 
              nature straight to your doorstep. Whether you&apos;re seeking to elevate your wellness journey or simply 
              enjoy natural, wholesome foods, Vai Best Bazar is your go-to destination for authentic, trustworthy 
              products.
            </p>
          </div>

          {/* Company Links */}
          <div className="lg:pl-12">
            <h3 className="text-primary font-semibold mb-4">COMPANY</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="text-foreground hover:text-primary transition-colors">
                  রিটার্ন পলিসি
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-foreground hover:text-primary transition-colors">
                  রিফান্ড পলিসি
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Help */}
          <div>
            <h3 className="text-primary font-semibold mb-4">QUICK HELP</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/support" className="text-foreground hover:text-primary transition-colors">
                  গ্রাহক সেবা
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop ID */}
          <div>
            <p className="text-foreground">
              <span className="font-medium">DBID ID : </span>
              <span>{siteSettings.phone}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Orange Bar */}
      <div className="bg-primary py-3">
        <div className="container flex items-center justify-between">
          <a 
            href="#" 
            className="text-primary-foreground hover:opacity-80 transition-opacity"
          >
            <Facebook className="h-5 w-5" />
          </a>
          <p className="text-primary-foreground text-sm">
            © ভাই বাজার {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
