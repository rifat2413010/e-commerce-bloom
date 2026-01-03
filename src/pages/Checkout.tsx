import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, Phone, User, FileText } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { siteSettings } from '@/data/mockData';
import { CustomerInfo } from '@/types';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCart();
  const { toast } = useToast();
  const total = getTotal();
  const deliveryCharge = total >= siteSettings.freeDeliveryMin ? 0 : siteSettings.deliveryCharge;
  const grandTotal = total + deliveryCharge;

  const [formData, setFormData] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address || !formData.city) {
      toast({
        title: "অসম্পূর্ণ তথ্য",
        description: "অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
    
    clearCart();
    
    toast({
      title: "অর্ডার সফল হয়েছে!",
      description: `অর্ডার নম্বর: ${orderNumber}`,
    });

    navigate('/order-success', { state: { orderNumber, customer: formData } });
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">চেকআউট</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Customer Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact */}
                <div className="bg-card rounded-xl shadow-card p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    যোগাযোগের তথ্য
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">নাম *</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="আপনার নাম লিখুন"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">ফোন নম্বর *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="০১XXXXXXXXX"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email">ইমেইল (ঐচ্ছিক)</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="example@email.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-card rounded-xl shadow-card p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    ডেলিভারি ঠিকানা
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">সম্পূর্ণ ঠিকানা *</Label>
                      <Textarea
                        id="address"
                        name="address"
                        placeholder="বাড়ি নম্বর, রোড, এলাকা"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        rows={3}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">শহর *</Label>
                        <Input
                          id="city"
                          name="city"
                          placeholder="যেমন: ঢাকা"
                          value={formData.city}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="district">জেলা (ঐচ্ছিক)</Label>
                        <Input
                          id="district"
                          name="district"
                          placeholder="যেমন: ঢাকা"
                          value={formData.district}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-card rounded-xl shadow-card p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    অতিরিক্ত নোট
                  </h2>
                  
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="ডেলিভারি সম্পর্কে কোনো বিশেষ নির্দেশনা থাকলে লিখুন..."
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                {/* Payment Method */}
                <div className="bg-card rounded-xl shadow-card p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    পেমেন্ট পদ্ধতি
                  </h2>
                  
                  <div className="border-2 border-primary rounded-xl p-4 bg-primary-light">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full border-2 border-primary flex items-center justify-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">ক্যাশ অন ডেলিভারি (COD)</p>
                        <p className="text-sm text-muted-foreground">
                          পণ্য হাতে পেয়ে পেমেন্ট করুন
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl shadow-card p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-foreground mb-4">অর্ডার সামারি</h2>
                  
                  {/* Items */}
                  <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                    {items.map((item, index) => (
                      <div key={`${item.product.id}-${item.selectedSize}-${index}`} className="flex gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground line-clamp-1">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.selectedSize && <span className="text-primary">{item.selectedSize} • </span>}
                            {item.quantity} x ৳{item.product.price}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          ৳{item.product.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 space-y-3 text-sm">
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
                    <div className="border-t border-border pt-3 flex justify-between text-lg">
                      <span className="font-semibold text-foreground">মোট</span>
                      <span className="font-bold text-primary">৳{grandTotal}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    className="w-full mt-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'প্রসেস হচ্ছে...' : 'অর্ডার কনফার্ম করুন'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
