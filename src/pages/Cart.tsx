import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { siteSettings } from '@/data/mockData';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getTotal } = useCart();
  const total = getTotal();
  const deliveryCharge = total >= siteSettings.freeDeliveryMin ? 0 : siteSettings.deliveryCharge;
  const grandTotal = total + deliveryCharge;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">আপনার কার্ট</h1>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="h-24 w-24 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                আপনার কার্ট খালি
              </h2>
              <p className="text-muted-foreground mb-6">
                আপনার পছন্দের পণ্য কার্টে যোগ করুন
              </p>
              <Button variant="gradient" asChild>
                <Link to="/">শপিং শুরু করুন</Link>
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map(item => (
                  <div
                    key={item.product.id}
                    className="bg-card rounded-xl shadow-card p-4 flex gap-4"
                  >
                    {/* Image */}
                    <Link to={`/product/${item.product.id}`} className="shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.product.id}`}>
                        <h3 className="font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {item.selectedSize ? item.selectedSize : item.product.unit}
                      </p>
                      <p className="text-lg font-bold text-primary mt-1">
                        ৳{item.product.price}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center border border-border rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedSize)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedSize)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right shrink-0">
                      <p className="font-bold text-foreground">
                        ৳{item.product.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl shadow-card p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-foreground mb-4">অর্ডার সামারি</h2>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">সাবটোটাল</span>
                      <span className="font-medium text-foreground">৳{total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ডেলিভারি চার্জ</span>
                      <span className="font-medium text-foreground">
                        {deliveryCharge === 0 ? 'ফ্রি' : `৳${deliveryCharge}`}
                      </span>
                    </div>
                    {deliveryCharge > 0 && (
                      <p className="text-xs text-primary">
                        ৳{siteSettings.freeDeliveryMin - total} টাকা আরো অর্ডার করলে ফ্রি ডেলিভারি
                      </p>
                    )}
                    <div className="border-t border-border pt-3 flex justify-between text-lg">
                      <span className="font-semibold text-foreground">মোট</span>
                      <span className="font-bold text-primary">৳{grandTotal}</span>
                    </div>
                  </div>

                  <Button variant="gradient" size="lg" className="w-full mt-6" asChild>
                    <Link to="/checkout">
                      চেকআউট করুন
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>

                  <Button variant="ghost" className="w-full mt-2" asChild>
                    <Link to="/">শপিং চালিয়ে যান</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
