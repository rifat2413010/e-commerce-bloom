import { Link } from 'react-router-dom';
import heroBanner from '@/assets/hero-banner.jpg';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <Link to="/" className="block">
        <img
          src={heroBanner}
          alt="Vai Best Bazar - সকল প্রোডাক্ট"
          className="w-full h-auto object-cover"
        />
      </Link>
    </section>
  );
};

export default HeroSection;
