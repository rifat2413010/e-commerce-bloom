import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Minus, Plus, Heart, ArrowRightLeft, Search, MessageCircle, Shield, Truck, Leaf } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { products, siteSettings } from '@/data/mockData';
import ProductCard from '@/components/product/ProductCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import logo from '@/assets/logo.png';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('500gm');
  const { addToCart } = useCart();

  const sizeOptions = ['250gm', '500gm'];

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
    p => p.id !== product.id && p.isActive
  ).slice(0, 5);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
    setQuantity(1);
    navigate('/checkout');
  };

  const clearSelection = () => {
    setSelectedSize('');
  };

  const whatsappLink = `https://wa.me/${siteSettings.whatsapp}?text=আমি ${product.name} সম্পর্কে জানতে চাই`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link to="/" className="text-muted-foreground hover:text-primary">Home</Link>
            <span className="text-muted-foreground">/</span>
            <Link to={`/category/${product.categoryId}`} className="text-muted-foreground hover:text-primary">
              {product.category}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Section */}
            <div className="relative">
              {/* Logo icon */}
              <div className="absolute top-4 left-4 z-10">
                <img src={logo} alt="Logo" className="h-10 w-auto" />
              </div>
              
              {/* Zoom button */}
              <button className="absolute top-4 right-4 z-10 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors">
                <Search className="h-4 w-4 text-muted-foreground" />
              </button>
              
              <div className="aspect-square rounded-lg overflow-hidden bg-muted/30 border border-border">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                />
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-4">
              {/* Category tags */}
              <div className="flex gap-2">
                <Link 
                  to={`/category/${product.categoryId}`}
                  className="text-primary hover:underline text-sm"
                >
                  {product.category}
                </Link>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-foreground">{product.price.toFixed(2)}৳</span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {product.originalPrice.toFixed(2)}৳
                  </span>
                )}
              </div>

              {/* Size options */}
              <div className="flex gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-1.5 border rounded text-sm transition-colors ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {/* Clear selection */}
              <button 
                onClick={clearSelection}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Clear
              </button>

              {/* Availability */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Availability:</span>
                {product.stock > 0 ? (
                  <span className="text-sm text-green-600">M{product.stock} in stock</span>
                ) : (
                  <span className="text-sm text-red-600">Out of stock</span>
                )}
              </div>

              {/* Promo text */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                <p className="text-sm text-primary">
                  এখনই অর্ডার করলে, আপনারই "250gm" ফ্রিসহ কয়র্স আনো
                </p>
              </div>

              {/* Quantity and actions */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border rounded">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <button className="h-10 w-10 border border-border rounded flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
                
                <button className="h-10 w-10 border border-border rounded flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                  <ArrowRightLeft className="h-5 w-5" />
                </button>
              </div>

              {/* Order button */}
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                অর্ডার করুন
              </Button>

              {/* Chat buttons */}
              <div className="space-y-2">
                <a 
                  href="#" 
                  className="flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                >
                  <MessageCircle className="h-5 w-5" />
                  Chat with us on messenger
                </a>
                
                <a 
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                >
                  <MessageCircle className="h-5 w-5" />
                  Chat with us on WhatsApp
                </a>
              </div>

              {/* SKU and Categories */}
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">SKU:</span>{' '}
                  <span className="text-foreground">fb-3</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Categories:</span>{' '}
                  <Link to={`/category/${product.categoryId}`} className="text-primary hover:underline">
                    {product.category}
                  </Link>
                </p>
              </div>

              {/* Wishlist and Compare */}
              <div className="flex gap-4">
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Heart className="h-4 w-4" />
                  Wishlist
                </button>
                <button className="flex items-center gap-2 text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded hover:bg-primary/90 transition-colors">
                  <ArrowRightLeft className="h-4 w-4" />
                  Compare
                </button>
              </div>
            </div>
          </div>

          {/* Description Tabs */}
          <div className="mt-12 border-t border-border pt-8">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 gap-6">
                <TabsTrigger 
                  value="description" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger 
                  value="additional" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3"
                >
                  Additional Information
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="pt-6">
                <div className="max-w-2xl">
                  <h3 className="font-bold text-lg mb-4">{product.name} – ঘরে বানান রেস্টুরেন্ট স্টাইল Crispy Chicken!</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p>{product.description}</p>
                    <ul className="list-decimal list-inside space-y-1 mt-4">
                      <li>ভেজানোর <strong>চিকেন ফ্রাই মশলা প্রিমিক্স</strong> হলো চিকেন ভাজার জন্য সবচেয়ে সহজ উপায়, যা ব্যবহারে আপনি পাবেন রেস্টুরেন্টের সেই অসাধারণ স্বাদ ও পারফেক্ট ক্রিস্পি টেক্সচার।</li>
                      <li><strong>প্রাকৃতিক মশলা</strong> – মরিচ গুড়া, ধনেপাতা।</li>
                      <li><strong>প্রোটিন সমৃদ্ধ</strong> ও ক্যালরিতে কম্প – সুস্থ খাবার।</li>
                      <li><strong>প্যাকেট সাইজ</strong> – এক প্যাকেটে প্রায়োজনীয় পরিমাণ মশলা রয়েছে।</li>
                      <li>১০০% <strong>প্রাকৃতিক উপাদান</strong> দিয়ে তৈরি।</li>
                      <li>চিকেন ভাজি, উইংস ও ফ্রাইডরাইস তৈরি উপযোগী।</li>
                    </ul>
                    <p className="mt-4">শুধু প্যাকেটটি বাজার, লেগ ও কাটা চিকেন মাখুন – কিছুক্ষণ পর ভেজেপুনি কড়াই ক্রিস্পি চিকেন</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="additional" className="pt-6">
                <div className="max-w-2xl">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="py-3 font-medium text-muted-foreground w-1/3">Weight</td>
                        <td className="py-3 text-foreground">{product.unit}</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 font-medium text-muted-foreground">Category</td>
                        <td className="py-3 text-foreground">{product.category}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Features Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group text-center p-6 border border-border rounded-lg transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 cursor-pointer">
              <div className="h-12 w-12 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-foreground mb-1">নিরাপদ পেমেন্ট</h4>
              <p className="text-sm text-muted-foreground">ডেলিভার পেমেন্ট বাংলা গড়ে পরিশোধ গাড়ে গিয়ে</p>
            </div>
            
            <div className="group text-center p-6 border border-border rounded-lg transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 cursor-pointer">
              <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-1">দ্রুত ডেলিভারি</h4>
              <p className="text-sm text-muted-foreground">৩-৫ দিনের মধ্যে সারাদেশে হোম ডেলি গলার</p>
            </div>
            
            <div className="group text-center p-6 border border-border rounded-lg transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 cursor-pointer">
              <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-primary mb-1">১০০% ন্যাচারাল</h4>
              <p className="text-sm text-muted-foreground">সম্পূর্ণ প্রাকৃতিক উপাদান দিয়ে তৈরি সকল প্রোডাক্ট আমাদের সব</p>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">Related products</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
                {relatedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
