import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

const BestSellersSection = () => {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            categories (
              name
            )
          `)
          .eq('is_active', true)
          .eq('is_best_seller', true)
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) throw error;

        const formattedProducts: Product[] = (data || []).map(item => ({
          id: item.id,
          name: item.name,
          nameEn: item.name_en || '',
          description: item.description || '',
          descriptionEn: item.description_en || '',
          price: Number(item.price),
          originalPrice: item.original_price ? Number(item.original_price) : undefined,
          image: item.image || '/placeholder.svg',
          images: item.images || [],
          category: item.categories?.name || '',
          categoryId: item.category_id || '',
          unit: item.unit || 'piece',
          stock: item.stock || 0,
          isActive: item.is_active,
          isBestSeller: item.is_best_seller,
          isOffer: item.is_offer,
          offerPercent: item.offer_percent,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));

        setBestSellers(formattedProducts);
      } catch (error) {
        console.error('Error fetching best sellers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  // Don't show section if no best sellers
  if (!isLoading && bestSellers.length === 0) {
    return null;
  }

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
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
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
        )}

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
