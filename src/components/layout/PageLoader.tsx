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
      }, 300);
    }, 400);

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  if (!isLoading) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-300 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Light gray thin spinner */}
      <div className="w-12 h-12 border-[3px] border-gray-200 border-t-gray-400 rounded-full animate-spin"></div>
    </div>
  );
};

export default PageLoader;
