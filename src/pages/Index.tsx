import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import AllProductsSection from '@/components/home/AllProductsSection';
import BottomNav from '@/components/layout/BottomNav';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pb-16 md:pb-0">
        <HeroSection />
        <AllProductsSection />
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default Index;
