import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loadingTasks, setLoadingTasks] = useState(0);
  const isLoading = loadingTasks > 0;
  const location = useLocation();

  const startLoading = useCallback(() => setLoadingTasks(prev => prev + 1), []);
  const stopLoading = useCallback(() => setLoadingTasks(prev => Math.max(0, prev - 1)), []);

  // Removed the forced route-change loading effect.
  // The app will now rely on Suspense for chunk loading and manual task tracking.

  // Failsafe: Ensure loading state doesn't get stuck indefinitely if a manual task fails
  useEffect(() => {
    if (isLoading) {
      const failsafe = setTimeout(() => {
        setLoadingTasks(0);
      }, 2000); 
      return () => clearTimeout(failsafe);
    }
  }, [isLoading]);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
