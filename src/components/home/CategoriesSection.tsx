import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategoryCard from '@/components/product/CategoryCard';
import { categories } from '@/data/mockData';

const CategoriesSection = () => {
  const activeCategories = categories.filter(c => c.isActive);

  return (
    <section className="py-16">
      <div className="container">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              ক্যাটেগরি সমূহ
            </h2>
            <p className="text-muted-foreground mt-1">
              আপনার পছন্দের ক্যাটেগরি বেছে নিন
            </p>
          </div>
          <Button variant="ghost" asChild className="hidden md:flex">
            <Link to="/categories" className="group">
              সব দেখুন
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {activeCategories.map((category, index) => (
            <CategoryCard 
              key={category.id} 
              category={category}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
            />
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-6 text-center md:hidden">
          <Button variant="outline" asChild>
            <Link to="/categories" className="group">
              সব ক্যাটেগরি দেখুন
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
