import ProductCard from '@/components/product/ProductCard';
import { products } from '@/data/mockData';

const AllProductsSection = () => {
  const activeProducts = products.filter(p => p.isActive);

  return (
    <section className="py-12 bg-background">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground uppercase tracking-wide">
            ALL PRODUCT
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mt-3"></div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {activeProducts.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllProductsSection;
