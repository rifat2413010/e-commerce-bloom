import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, CreditCard, Package, Phone } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
interface QuickOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  quantity: number;
  selectedSize?: string;
}

const QuickOrderDialog = ({
  open,
  onOpenChange,
  product,
  quantity,
  selectedSize,
}: QuickOrderDialogProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    deliveryArea: 'inside',
  });

  const productTotal = product.price * quantity;
  const deliveryCharge = formData.deliveryArea === 'inside' ? 50 : 100;
  const grandTotal = productTotal + deliveryCharge;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address) {
      toast({
        title: "ত্রুটি",
        description: "সব তথ্য পূরণ করুন",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if product.id is a valid UUID format, otherwise use null
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(product.id);
      
      // Create order with items using secure server function
      const { data: orderId, error } = await supabase.rpc('create_order_with_items', {
        _customer_name: formData.name,
        _customer_phone: formData.phone,
        _customer_email: null,
        _customer_address: formData.address,
        _customer_city: formData.deliveryArea === 'inside' ? 'ঢাকা' : null,
        _customer_district: null,
        _payment_method: 'cod',
        _notes: null,
        _delivery_charge: deliveryCharge,
        _items: [{
          product_id: isValidUUID ? product.id : null,
          product_name: product.name,
          product_image: product.image,
          unit_price: product.price,
          quantity: quantity,
          selected_size: selectedSize || null
        }]
      });

      if (error) throw error;

      // Fetch the created order to get order_number
      const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('order_number')
        .eq('id', orderId)
        .single();

      if (fetchError) throw fetchError;

      toast({
        title: "অর্ডার সফল!",
        description: `অর্ডার নম্বর: ${order.order_number}`,
      });
      
      onOpenChange(false);
      navigate('/order-success', { 
        state: { 
          orderNumber: order.order_number, 
          customer: { name: formData.name, phone: formData.phone, address: formData.address } 
        } 
      });
    } catch (error: any) {
      console.error('Order creation error:', error);
      toast({
        title: "অর্ডার ব্যর্থ হয়েছে",
        description: error.message || "একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-[#f5f0e8] data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-2xl md:text-3xl font-bold text-foreground">
            সহজ অর্ডার প্রক্রিয়া
          </DialogTitle>
          <p className="text-primary mt-2">
            নিচের ফর্মটি পূরণ করুন। ক্যাশ অন ডেলিভারি সুবিধা রয়েছে — পণ্য হাতে পেয়ে টাকা দিন।
          </p>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Product Info */}
          <div className="space-y-6">
            {/* Product Card */}
            <div className="bg-white rounded-lg p-4 flex gap-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-24 h-24 object-contain rounded-lg"
              />
              <div>
                <h3 className="font-bold text-foreground">{product.name}</h3>
                <p className="text-sm text-primary">
                  {product.category}{selectedSize && `, ${selectedSize}`}
                </p>
                <p className="text-xl font-bold text-amber-700 mt-2">
                  ৳ {product.price}
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <Truck className="h-4 w-4 text-amber-600" />
                </div>
                <span className="text-sm text-foreground">দ্রুত ডেলিভারি — ২-৩ দিনের মধ্যে</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm text-foreground">ক্যাশ অন ডেলিভারি সুবিধা</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Package className="h-4 w-4 text-yellow-600" />
                </div>
                <span className="text-sm text-foreground">সুরক্ষিত প্যাকেজিং</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-red-600" />
                </div>
                <span className="text-sm text-foreground">যেকোনো সমস্যায় সহায়তা</span>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white rounded-lg p-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">নাম</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="আপনার পূর্ণ নাম"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">মোবাইল নাম্বার</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">ঠিকানা</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="সম্পূর্ণ ঠিকানা"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>ডেলিভারি এলাকা</Label>
                <RadioGroup
                  value={formData.deliveryArea}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, deliveryArea: value }))}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="inside" id="inside" />
                    <Label htmlFor="inside" className="font-normal cursor-pointer">
                      ঢাকার ভিতরে (৳৫০)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="outside" id="outside" />
                    <Label htmlFor="outside" className="font-normal cursor-pointer">
                      ঢাকার বাইরে (৳১০০)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Order Summary */}
              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">পণ্য মূল্য</span>
                  <span className="text-foreground">৳ {productTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ডেলিভারি চার্জ</span>
                  <span className="text-foreground">৳ {deliveryCharge}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                  <span className="text-foreground">মোট</span>
                  <span className="text-primary">৳ {grandTotal}</span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-amber-700 hover:bg-amber-800 text-white text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'প্রসেস হচ্ছে...' : 'অর্ডার কনফার্ম করুন'}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                অর্ডার কনফার্ম করলে আমাদের শর্তাবলী মেনে নিয়েছেন বলে ধরে নেওয়া হবে।
              </p>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickOrderDialog;
