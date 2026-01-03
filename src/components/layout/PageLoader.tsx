import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '@/assets/logo.png';

const PageLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Start loading
    setIsLoading(true);
    setFadeOut(false);
    setProgress(0);

    // Animate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 15;
      });
    }, 40);

    // Complete loading
    const timeout = setTimeout(() => {
      setProgress(100);
      setFadeOut(true);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
        setFadeOut(false);
      }, 300);
    }, 400);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timeout);
    };
  }, [location.pathname]);

  if (!isLoading) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-300 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Spinning loader container */}
      <div className="relative mb-6">
        {/* Spinning ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 border-4 border-muted rounded-full"></div>
          <div className="absolute w-24 h-24 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
        </div>
        
        {/* Logo in center */}
        <div className="w-24 h-24 flex items-center justify-center">
          <img src={logo} alt="Loading..." className="h-12 w-auto" />
        </div>
      </div>
      
      {/* Loading bar */}
      <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Loading text */}
      <p className="mt-4 text-sm text-muted-foreground">
        লোড হচ্ছে...
      </p>
    </div>
  );
};

export default PageLoader;
