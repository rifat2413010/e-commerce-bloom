import React from 'react';
import { useTracking } from '@/hooks/useTracking';

// This component initializes tracking when mounted inside BrowserRouter
const TrackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // This initializes tracking scripts and pageview tracking
  useTracking();
  
  return <>{children}</>;
};

export default TrackingProvider;
