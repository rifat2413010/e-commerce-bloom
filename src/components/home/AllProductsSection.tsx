import { Link } from 'react-router-dom';
import { ArrowRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';
import { products } from '@/data/mockData';

const AllProductsSection = () => {
  const activeProducts = products.filter(p => p.isActive);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                সকল পণ্য
              </h2>
              <p className="text-muted-foreground">
                আমাদের সকল প্রোডাক্ট দেখুন
              </p>
            </div>
          </div>
          <Button variant="ghost" asChild className="hidden md:flex">
            <Link to="/products" className="group">
              সব দেখুন
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {activeProducts.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
            />
          ))}
        </div>

        {/* View all */}
        <div className="mt-8 text-center">
          <Button variant="gradient" size="lg" asChild>
            <Link to="/products" className="group">
              সকল পণ্য দেখুন
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AllProductsSection;
