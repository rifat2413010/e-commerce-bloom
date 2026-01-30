import { useState, useEffect } from 'react';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import { Input } from '@/components/ui/input';
import ProductCard from '@/components/product/ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

const Search = () => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchProducts = async () => {
      if (!query.trim()) {
        setProducts([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`*, categories:category_id (name)`)
          .eq('is_active', true)
          .or(`name.ilike.%${query}%,name_en.ilike.%${query}%,description.ilike.%${query}%`)
          .limit(20);

        if (error) throw error;

        if (data) {
          setProducts(data.map(p => ({
            id: p.id,
            name: p.name,
            nameEn: p.name_en || undefined,
            description: p.description || '',
            descriptionEn: p.description_en || undefined,
            price: Number(p.price),
            originalPrice: p.original_price ? Number(p.original_price) : undefined,
            image: p.image || '/placeholder.svg',
            images: p.images || [],
            category: (p.categories as any)?.name || 'Uncategorized',
            categoryId: p.category_id || '',
            unit: p.unit,
            stock: p.stock,
            isActive: p.is_active,
            isBestSeller: p.is_best_seller,
            isOffer: p.is_offer,
            offerPercent: p.offer_percent || undefined,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
          })));
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pb-16 md:pb-0">
        <div className="container py-8">
          <h1 className="text-3xl font-bold text-foreground mb-6">সার্চ করুন</h1>

          {/* Search Input */}
          <div className="relative mb-8">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="পণ্যের নাম লিখুন..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 h-12 text-base"
              autoFocus
            />
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : query && products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">কোনো পণ্য পাওয়া যায়নি</p>
            </div>
          ) : products.length > 0 ? (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                {products.length}টি পণ্য পাওয়া গেছে
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">পণ্য খুঁজতে উপরে টাইপ করুন</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default Search;
