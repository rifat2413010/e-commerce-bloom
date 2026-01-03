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
    <header className="z-50">
      {/* Main header */}
      <div className="bg-card shadow-card">
        <div className="container py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="shrink-0">
              <img src={logo} alt="Vai Best Bazar" className="h-12 md:h-14" />
            </Link>

            {/* Search - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <Input
                  type="search"
                  placeholder="পণ্য খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-12 h-11 rounded-full border-2 border-primary/20 focus:border-primary bg-muted/50"
                />
                <Button 
                  size="icon" 
                  className="absolute right-1 top-1 h-9 w-9 rounded-full"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Phone - Desktop */}
              <a 
                href={`tel:${siteSettings.phone}`}
                className="hidden lg:flex items-center gap-2 text-foreground hover:text-primary transition-colors"
              >
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">{siteSettings.phone}</span>
              </a>

              {/* Cart */}
              <Link to="/cart">
                <Button variant="outline" size="icon" className="relative h-10 w-10 rounded-full border-2">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Mobile menu toggle */}
              <Button
                variant="outline"
                size="icon"
                className="md:hidden h-10 w-10 rounded-full border-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Search - Mobile */}
          <div className="md:hidden mt-3">
            <div className="relative">
              <Input
                type="search"
                placeholder="পণ্য খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 h-10 rounded-full border-2 border-primary/20 bg-muted/50"
              />
              <Button 
                size="icon" 
                className="absolute right-1 top-1 h-8 w-8 rounded-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories nav */}
      <nav className="bg-primary">
        <div className="container">
          <ul className="hidden md:flex items-center justify-center gap-1 py-2 overflow-x-auto">
            <li>
              <Link 
                to="/"
                className="px-4 py-2 rounded-lg text-primary-foreground hover:bg-primary-foreground/10 transition-colors font-medium whitespace-nowrap"
              >
                হোম
              </Link>
            </li>
            {categories.filter(c => c.isActive).map(category => (
              <li key={category.id}>
                <Link 
                  to={`/category/${category.id}`}
                  className="px-4 py-2 rounded-lg text-primary-foreground hover:bg-primary-foreground/10 transition-colors font-medium whitespace-nowrap"
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
        <div className="md:hidden bg-card border-t border-border shadow-lg animate-slide-in-up">
          <nav className="container py-4">
            <ul className="space-y-1">
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
