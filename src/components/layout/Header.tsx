import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useState, useRef, useEffect } from 'react';
import { categories, siteSettings, products } from '@/data/mockData';
import logo from '@/assets/logo.png';

const Header = () => {
  const { getItemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const itemCount = getItemCount();

  // Filter products based on search query
  const searchResults = searchQuery.trim().length > 0
    ? products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current && !searchRef.current.contains(event.target as Node) &&
        mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProductClick = (productId: string) => {
    setSearchQuery('');
    setShowResults(false);
    navigate(`/product/${productId}`);
  };

  const SearchResults = () => (
    <>
      {showResults && searchQuery.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          {searchResults.length > 0 ? (
            <ul className="py-2">
              {searchResults.map(product => (
                <li key={product.id}>
                  <button
                    onClick={() => handleProductClick(product.id)}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors text-left"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-contain rounded bg-muted/50"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.category}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-primary shrink-0">
                      ৳{product.price}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-muted-foreground">
              <p className="text-sm">কোনো পণ্য পাওয়া যায়নি</p>
              <p className="text-xs mt-1">অন্য কিছু খুঁজুন</p>
            </div>
          )}
        </div>
      )}
    </>
  );

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
            <div className="hidden md:flex flex-1 max-w-xl" ref={searchRef}>
              <div className="relative w-full">
                <Input
                  type="search"
                  placeholder="পণ্য খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowResults(true);
                  }}
                  onFocus={() => setShowResults(true)}
                  className="pr-12 h-11 rounded-full border-2 border-primary/20 focus:border-primary bg-muted/50"
                />
                <Button 
                  size="icon" 
                  className="absolute right-1 top-1 h-9 w-9 rounded-full"
                >
                  <Search className="h-4 w-4" />
                </Button>
                <SearchResults />
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
          <div className="md:hidden mt-3" ref={mobileSearchRef}>
            <div className="relative">
              <Input
                type="search"
                placeholder="পণ্য খুঁজুন..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                className="pr-12 h-10 rounded-full border-2 border-primary/20 bg-muted/50"
              />
              <Button 
                size="icon" 
                className="absolute right-1 top-1 h-8 w-8 rounded-full"
              >
                <Search className="h-4 w-4" />
              </Button>
              <SearchResults />
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
