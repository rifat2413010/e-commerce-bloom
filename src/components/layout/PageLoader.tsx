import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PageLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    setFadeOut(false);

    const timeout = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setIsLoading(false);
        setFadeOut(false);
      }, 200);
    }, 300);

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  if (!isLoading) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-200 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Small fast spinner */}
      <div 
        className="w-8 h-8 border-2 border-gray-200 border-t-gray-400 rounded-full"
        style={{ animation: 'spin 0.6s linear infinite' }}
      ></div>
    </div>
  );
};

export default PageLoader;
