import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import { categories, siteSettings } from '@/data/mockData';
import logo from '@/assets/logo.png';

const Header = () => {
  const { getItemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const itemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 bg-card shadow-card">
      {/* Top bar */}
      <div className="bg-gradient-hero">
        <div className="container py-2 flex items-center justify-between text-primary-foreground text-sm">
          <p className="hidden md:block">
            সরাসরি কৃষক থেকে আপনার ঘরে — খাঁটি ও প্রাকৃতিক পণ্য
          </p>
          <div className="flex items-center gap-4 mx-auto md:mx-0">
            <a 
              href={`tel:${siteSettings.phone}`}
              className="flex items-center gap-1 hover:underline"
            >
              <Phone className="h-4 w-4" />
              <span>{siteSettings.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={logo} alt="Logo" className="h-10 w-10 md:h-12 md:w-12" />
            <span className="text-xl md:text-2xl font-bold text-primary hidden sm:block">
              {siteSettings.siteName}
            </span>
          </Link>

          {/* Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="পণ্য খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 h-12 rounded-xl border-2 border-border focus:border-primary"
              />
              <Button 
                size="icon" 
                className="absolute right-1 top-1 h-10 w-10 rounded-lg"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link to="/cart">
              <Button variant="outline" size="icon" className="relative h-11 w-11">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-offer text-offer-foreground text-xs flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile menu toggle */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden h-11 w-11"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Search - Mobile */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Input
              type="search"
              placeholder="পণ্য খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-12 h-11 rounded-xl border-2 border-border"
            />
            <Button 
              size="icon" 
              className="absolute right-1 top-1 h-9 w-9 rounded-lg"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Categories nav */}
      <nav className="border-t border-border bg-secondary/50">
        <div className="container">
          <ul className="hidden md:flex items-center gap-1 py-2 overflow-x-auto">
            <li>
              <Link 
                to="/"
                className="px-4 py-2 rounded-lg text-foreground hover:bg-primary hover:text-primary-foreground transition-colors font-medium whitespace-nowrap"
              >
                হোম
              </Link>
            </li>
            {categories.filter(c => c.isActive).map(category => (
              <li key={category.id}>
                <Link 
                  to={`/category/${category.id}`}
                  className="px-4 py-2 rounded-lg text-foreground hover:bg-primary hover:text-primary-foreground transition-colors font-medium whitespace-nowrap"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-t border-border animate-slide-in-up">
          <nav className="container py-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-foreground hover:bg-primary hover:text-primary-foreground transition-colors font-medium"
                >
                  হোম
                </Link>
              </li>
              {categories.filter(c => c.isActive).map(category => (
                <li key={category.id}>
                  <Link 
                    to={`/category/${category.id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-foreground hover:bg-primary hover:text-primary-foreground transition-colors font-medium"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
