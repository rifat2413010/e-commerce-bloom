import { Link } from 'react-router-dom';
import { ArrowRight, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';
import { products } from '@/data/mockData';

const BestSellersSection = () => {
  const bestSellers = products.filter(p => p.isBestSeller && p.isActive);

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
              <Flame className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                বেস্ট সেলার
              </h2>
              <p className="text-muted-foreground">
                সবচেয়ে জনপ্রিয় পণ্য সমূহ
              </p>
            </div>
          </div>
          <Button variant="ghost" asChild className="hidden md:flex">
            <Link to="/products?filter=bestseller" className="group">
              সব দেখুন
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {bestSellers.map((product, index) => (
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
          <Button variant="outline" asChild>
            <Link to="/products?filter=bestseller" className="group">
              সব বেস্ট সেলার দেখুন
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BestSellersSection;
