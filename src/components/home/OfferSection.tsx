import { Link } from 'react-router-dom';
import { ArrowRight, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';
import { products } from '@/data/mockData';

const OfferSection = () => {
  const offerProducts = products.filter(p => p.isOffer && p.isActive);

  if (offerProducts.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container">
        {/* Header with gradient background */}
        <div className="bg-gradient-hero rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-primary-foreground">
              <div className="h-12 w-12 rounded-xl bg-background/20 flex items-center justify-center">
                <Percent className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">
                  অফার জোন
                </h2>
                <p className="opacity-90">
                  বিশেষ ছাড়ে পণ্য কিনুন
                </p>
              </div>
            </div>
            <Button 
              variant="secondary" 
              asChild 
              className="hidden md:flex"
            >
              <Link to="/products?filter=offer" className="group">
                সব দেখুন
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {offerProducts.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
            />
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-6 text-center md:hidden">
          <Button variant="gradient" asChild>
            <Link to="/products?filter=offer" className="group">
              সব অফার দেখুন
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default OfferSection;
