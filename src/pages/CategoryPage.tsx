import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';
import { products, categories } from '@/data/mockData';

const CategoryPage = () => {
  const { id } = useParams();
  const category = categories.find(c => c.id === id);
  const categoryProducts = products.filter(p => p.categoryId === id && p.isActive);

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">ক্যাটেগরি পাওয়া যায়নি</h1>
            <Button asChild>
              <Link to="/">হোমে ফিরে যান</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link to="/" className="text-muted-foreground hover:text-primary">হোম</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{category.name}</span>
          </nav>

          {/* Back button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              পিছনে যান
            </Link>
          </Button>

          {/* Category Header */}
          <div className="bg-gradient-hero rounded-2xl p-8 mb-8 text-primary-foreground">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.name}</h1>
            <p className="text-lg opacity-90">{category.nameEn}</p>
            <p className="mt-2 opacity-80">{categoryProducts.length}টি পণ্য পাওয়া গেছে</p>
          </div>

          {/* Products Grid */}
          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categoryProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                এই ক্যাটেগরিতে কোনো পণ্য নেই
              </h2>
              <p className="text-muted-foreground mb-6">
                অনুগ্রহ করে অন্য ক্যাটেগরি দেখুন
              </p>
              <Button variant="gradient" asChild>
                <Link to="/">হোমে ফিরে যান</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
