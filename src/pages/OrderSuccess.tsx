import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Package, Phone, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { siteSettings } from '@/data/mockData';

const OrderSuccess = () => {
  const location = useLocation();
  const { orderNumber, customer } = location.state || {};

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container py-16">
          <div className="max-w-lg mx-auto text-center">
            {/* Success Icon */}
            <div className="h-24 w-24 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-6 animate-scale-in">
              <CheckCircle className="h-12 w-12 text-success" />
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-2">
              অর্ডার সফল হয়েছে!
            </h1>
            <p className="text-muted-foreground mb-8">
              আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে। শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব।
            </p>

            {/* Order Info */}
            {orderNumber && (
              <div className="bg-card rounded-xl shadow-card p-6 mb-8 text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">অর্ডার নম্বর</p>
                    <p className="font-bold text-foreground">{orderNumber}</p>
                  </div>
                </div>

                {customer && (
                  <div className="border-t border-border pt-4 space-y-2">
                    <p className="text-sm">
                      <span className="text-muted-foreground">নাম:</span>{' '}
                      <span className="text-foreground">{customer.name}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">ফোন:</span>{' '}
                      <span className="text-foreground">{customer.phone}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">ঠিকানা:</span>{' '}
                      <span className="text-foreground">{customer.address}, {customer.city}</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* What's Next */}
            <div className="bg-secondary rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-foreground mb-3">এরপর কী হবে?</h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs shrink-0">১</span>
                  <span>আমরা আপনার অর্ডার কনফার্ম করতে ফোন করব</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs shrink-0">২</span>
                  <span>পণ্য প্যাকেজিং ও শিপমেন্ট করা হবে</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs shrink-0">৩</span>
                  <span>ডেলিভারি ম্যান আপনার ঠিকানায় পৌঁছে যাবে</span>
                </li>
              </ol>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gradient" asChild>
                <Link to="/">
                  আরো শপিং করুন
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <a href={`tel:${siteSettings.phone}`}>
                  <Phone className="h-4 w-4" />
                  কল করুন
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
