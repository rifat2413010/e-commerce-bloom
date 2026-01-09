import { useEffect, useState } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { Loader2 } from 'lucide-react';

const AllProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
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
          .order('created_at', { ascending: false });

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

        setProducts(formattedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <section className="py-12 bg-background">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground uppercase tracking-wide">
              ALL PRODUCT
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mt-3"></div>
          </div>
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-12 bg-background">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground uppercase tracking-wide">
              ALL PRODUCT
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mt-3"></div>
          </div>
          <div className="text-center py-12 text-muted-foreground">
            কোন পণ্য পাওয়া যায়নি
          </div>
        </div>
      </section>
    );
  }

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
          {products.map((product, index) => (
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
