import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { ShoppingCart, Minus, Plus, ArrowLeft, Package, Truck, Shield } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/layout/FloatingButtons';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { products } from '@/data/mockData';
import ProductCard from '@/components/product/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">পণ্য পাওয়া যায়নি</h1>
            <Button asChild>
              <Link to="/">হোমে ফিরে যান</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedProducts = products.filter(
    p => p.categoryId === product.categoryId && p.id !== product.id && p.isActive
  ).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link to="/" className="text-muted-foreground hover:text-primary">হোম</Link>
            <span className="text-muted-foreground">/</span>
            <Link to={`/category/${product.categoryId}`} className="text-muted-foreground hover:text-primary">
              {product.category}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          {/* Back button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              পিছনে যান
            </Link>
          </Button>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              {/* Badges */}
              <div className="flex gap-2">
                {product.isOffer && (
                  <span className="bg-offer text-offer-foreground text-sm font-bold px-3 py-1 rounded-lg">
                    {product.offerPercent}% ছাড়
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="bg-success text-success-foreground text-sm font-bold px-3 py-1 rounded-lg">
                    বেস্ট সেলার
                  </span>
                )}
              </div>

              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                  {product.category}
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {product.name}
                </h1>
                <p className="text-muted-foreground mt-1">{product.nameEn}</p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary">৳{product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ৳{product.originalPrice}
                  </span>
                )}
                <span className="text-muted-foreground">/ {product.unit}</span>
              </div>

              {/* Stock */}
              {product.stock <= 0 ? (
                <p className="text-destructive font-medium">স্টকে নেই</p>
              ) : product.stock <= 10 ? (
                <p className="text-warning font-medium">মাত্র {product.stock}টি বাকি আছে</p>
              ) : (
                <p className="text-success font-medium">স্টকে আছে</p>
              )}

              {/* Description */}
              <div>
                <h3 className="font-semibold text-foreground mb-2">বিবরণ</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-border rounded-xl">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  variant="gradient"
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                >
                  <ShoppingCart className="h-5 w-5" />
                  কার্টে যোগ করুন
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <div className="h-10 w-10 mx-auto rounded-full bg-primary-light flex items-center justify-center mb-2">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">১০০% খাঁটি</p>
                </div>
                <div className="text-center">
                  <div className="h-10 w-10 mx-auto rounded-full bg-primary-light flex items-center justify-center mb-2">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">দ্রুত ডেলিভারি</p>
                </div>
                <div className="text-center">
                  <div className="h-10 w-10 mx-auto rounded-full bg-primary-light flex items-center justify-center mb-2">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">নিরাপদ পেমেন্ট</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">সম্পর্কিত পণ্য</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default ProductDetail;
