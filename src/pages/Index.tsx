import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/layout/FloatingButtons';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import OfferSection from '@/components/home/OfferSection';
import BestSellersSection from '@/components/home/BestSellersSection';
import AllProductsSection from '@/components/home/AllProductsSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <OfferSection />
        <BestSellersSection />
        <AllProductsSection />
      </main>

      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Index;
